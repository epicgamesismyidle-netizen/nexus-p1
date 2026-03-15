import { Router, type IRouter } from "express";
import axios from "axios";
import { db, paymentsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const PLAN_PRICES: Record<string, number> = {
  daily: 65,
  weekly: 455,
  monthly: 1300,
  lifetime: 2400,
};

const PLAN_DURATIONS_DAYS: Record<string, number | null> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  lifetime: null,
};

router.post("/create", async (req, res) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { plan } = req.body;
  if (!plan || !PLAN_PRICES[plan]) {
    res.status(400).json({ error: "Invalid plan. Must be one of: daily, weekly, monthly, lifetime" });
    return;
  }

  const price = PLAN_PRICES[plan];
  const apiKey = process.env.NOWPAYMENTS_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: "Payment service not configured" });
    return;
  }

  const orderId = `${userId}-${plan}-${Date.now()}`;

  const nowpaymentsResponse = await axios.post(
    "https://api.nowpayments.io/v1/invoice",
    {
      price_amount: price,
      price_currency: "usd",
      order_id: orderId,
      order_description: `SaaS ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
      ipn_callback_url: `${process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : ""}/api/payments/callback`,
      success_url: `${process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : ""}/dashboard`,
      cancel_url: `${process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : ""}/dashboard`,
    },
    {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    }
  );

  const invoice = nowpaymentsResponse.data;
  const paymentId = String(invoice.id);

  await db.insert(paymentsTable).values({
    userId,
    plan,
    paymentId,
    status: "pending",
    amount: String(price),
  });

  res.json({
    invoiceUrl: invoice.invoice_url,
    paymentId,
  });
});

router.post("/callback", async (req, res) => {
  const { payment_id, payment_status, order_id } = req.body;

  if (payment_status === "finished" || payment_status === "confirmed") {
    const [payment] = await db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.paymentId, String(payment_id)))
      .limit(1);

    if (payment) {
      await db
        .update(paymentsTable)
        .set({ status: payment_status, updatedAt: new Date() })
        .where(eq(paymentsTable.paymentId, String(payment_id)));

      const durationDays = PLAN_DURATIONS_DAYS[payment.plan];
      let planExpiresAt: Date | null = null;
      if (durationDays !== null) {
        planExpiresAt = new Date();
        planExpiresAt.setDate(planExpiresAt.getDate() + durationDays);
      }

      await db
        .update(usersTable)
        .set({ plan: payment.plan, planExpiresAt })
        .where(eq(usersTable.id, payment.userId));
    }
  }

  res.json({ message: "OK" });
});

export default router;
