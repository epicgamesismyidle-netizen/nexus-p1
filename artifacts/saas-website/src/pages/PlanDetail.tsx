import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useCreatePayment, type CreatePaymentRequestPlan } from "@workspace/api-client-react";
import { PremiumButton, PremiumCard } from "@/components/ui/premium";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ArrowLeft, Phone, Star, Shield, ExternalLink, Loader2 } from "lucide-react";

const plansData: Record<string, {
  key: CreatePaymentRequestPlan;
  name: string;
  price: number;
  duration: string;
  badge?: string;
}> = {
  daily:    { key: "daily",    name: "Daily",    price: 65,   duration: "24 hours" },
  weekly:   { key: "weekly",   name: "Weekly",   price: 455,  duration: "7 days",  badge: "Save 30%" },
  monthly:  { key: "monthly",  name: "Monthly",  price: 1300, duration: "30 days", badge: "Most Popular" },
  lifetime: { key: "lifetime", name: "Lifetime", price: 2400, duration: "Forever", badge: "Best Value" },
};

const planFeatures = [
  {
    section: "Delivery",
    icon: Phone,
    items: ["Supports 100+ concurrent calls"],
  },
  {
    section: "Available Scripts",
    icon: Star,
    items: [
      "Coinbase",
      "Google",
      "Apple",
      "Gemini",
      "Crypto.com",
      "And a lot more...",
    ],
  },
  {
    section: "Reliability Features",
    icon: Shield,
    items: [
      "Caller ID spoofing support (1888 & Google & Coinbase formats and more)",
      "High uptime and stable infrastructure",
      "Dedicated support team available for assistance",
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function PlanDetail() {
  const params = useParams<{ plan: string }>();
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const { mutate: createPayment } = useCreatePayment();
  const [isPaying, setIsPaying] = useState(false);

  const plan = plansData[params.plan ?? ""];

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user) {
    return (
      <div className="h-[calc(100vh-160px)] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Loader2 className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center gap-6">
        <p className="text-muted-foreground text-lg">Plan not found.</p>
        <PremiumButton variant="glass" onClick={() => setLocation("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </PremiumButton>
      </div>
    );
  }

  const handlePay = () => {
    setIsPaying(true);
    createPayment({ data: { plan: plan.key } }, {
      onSuccess: (data) => {
        toast({ title: "Invoice created!", description: "Redirecting to payment..." });
        window.location.href = data.invoiceUrl;
      },
      onError: (error: any) => {
        setIsPaying(false);
        toast({
          title: "Payment error",
          description: error?.message || "Could not create invoice. Try again.",
          variant: "destructive",
        });
      },
    });
  };

  const isPopular = plan.key === "monthly";

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 max-w-4xl">
      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => setLocation("/dashboard")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </motion.button>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
      >
        {/* Left — Plan Info */}
        <motion.div variants={itemVariants} className="lg:col-span-3 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-4xl md:text-5xl font-bold">{plan.name} Plan</h1>
              {plan.badge && (
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${isPopular ? "bg-primary text-primary-foreground" : "bg-white/10 border border-white/20 text-foreground"}`}>
                  {plan.badge}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-bold">${plan.price.toLocaleString()}</span>
              <span className="text-muted-foreground text-lg">/ {plan.duration}</span>
            </div>
            <div className="h-px w-full bg-white/5 mb-8" />
          </div>

          {/* Feature sections */}
          <div className="space-y-8">
            {planFeatures.map((section, si) => (
              <motion.div
                key={section.section}
                variants={itemVariants}
                custom={si}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <section.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">{section.section}</h3>
                </div>
                <ul className="space-y-3 pl-2">
                  {section.items.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: si * 0.1 + idx * 0.06, duration: 0.4, ease: "easeOut" }}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — Checkout card */}
        <motion.div variants={itemVariants} className="lg:col-span-2 lg:sticky lg:top-28">
          <PremiumCard glowing={isPopular} className={isPopular ? "border-primary/50 shadow-xl shadow-primary/10" : ""}>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-1">You're purchasing</p>
              <h2 className="text-2xl font-bold">{plan.name} Plan</h2>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold">${plan.price.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm">/ {plan.duration}</span>
              </div>
            </div>

            <div className="h-px w-full bg-white/5 mb-6" />

            <div className="space-y-3 mb-8">
              {planFeatures.map((section) =>
                section.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))
              )}
            </div>

            <PremiumButton
              variant={isPopular ? "default" : "glass"}
              className="w-full text-base"
              size="lg"
              onClick={handlePay}
              isLoading={isPaying}
            >
              {isPaying ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating invoice...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Pay with Crypto
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </span>
              )}
            </PremiumButton>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Powered by NOWPayments · Instant activation
            </p>
          </PremiumCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
