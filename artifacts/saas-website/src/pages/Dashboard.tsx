import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { PremiumButton, PremiumCard } from "@/components/ui/premium";
import { CreditCard, Clock, Zap, Users, ExternalLink, Crown, Loader2, ArrowRight, Phone, Star, Shield, CheckCircle } from "lucide-react";

const plans = [
  { key: "daily",    name: "Daily",    price: 65,   duration: "24 hours" },
  { key: "weekly",   name: "Weekly",   price: 455,  duration: "7 days",  badge: "Save 30%" },
  { key: "monthly",  name: "Monthly",  price: 1300, duration: "30 days", badge: "Most Popular", glow: true },
  { key: "lifetime", name: "Lifetime", price: 2400, duration: "Forever", badge: "Best Value" },
];

const planFeatures = [
  { icon: Phone,  label: "100+ concurrent calls" },
  { icon: Star,   label: "Coinbase, Google, Apple, Gemini, Crypto.com & more" },
  { icon: Shield, label: "Caller ID spoofing · High uptime · Dedicated support" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

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

  const isActive = (user.plan && (new Date(user.planExpiresAt || "") > new Date())) || user.plan === "lifetime";

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, <span className="text-foreground font-medium">{user.username}</span></p>
      </motion.div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12"
      >
        <PremiumCard className="relative overflow-hidden">
          <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none transition-opacity duration-500 ${isActive ? "bg-green-500/10" : "bg-yellow-500/5"}`} />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Subscription Status</p>
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className={`w-3 h-3 rounded-full ${isActive ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]" : "bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.5)]"}`}
                />
                <h2 className="text-2xl font-bold capitalize">
                  {isActive ? `${user.plan} Plan — Active` : "No Active Plan"}
                </h2>
              </div>
              {isActive && user.plan !== "lifetime" && user.planExpiresAt && (
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Expires {new Date(user.planExpiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              )}
              {user.plan === "lifetime" && (
                <p className="text-primary text-sm flex items-center gap-2 font-medium">
                  <Crown className="w-4 h-4" />
                  Lifetime access — never expires
                </p>
              )}
              {!isActive && (
                <p className="text-muted-foreground text-sm mt-1">Select a plan below to get started.</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Account ID</p>
                  <p className="font-mono text-foreground font-semibold">#{user.userId.toString().padStart(5, "0")}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Support</p>
                  <a href="https://t.me/naylou" target="_blank" rel="noreferrer" className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline">
                    @naylou <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </PremiumCard>
      </motion.div>

      {/* Plans */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
        className="mb-8"
      >
        <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-primary" />
          Available Plans
        </h3>
        <p className="text-muted-foreground text-sm">Select a plan to view details and checkout.</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.key}
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            className="flex"
          >
            <PremiumCard
              glowing={plan.glow}
              className={`flex flex-col w-full ${plan.glow ? "border-primary/50" : ""}`}
            >
              {plan.badge && (
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-0.5 text-xs font-bold rounded-full whitespace-nowrap ${plan.glow ? "bg-primary text-primary-foreground" : "bg-white/10 border border-white/20 text-foreground"}`}>
                  {plan.badge}
                </div>
              )}

              {/* Price */}
              <div className="mb-5 pt-2">
                <h4 className="text-xl font-bold mb-3">{plan.name}</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">${plan.price.toLocaleString()}</span>
                  <span className="text-muted-foreground text-sm">/ {plan.duration}</span>
                </div>
              </div>

              {/* Summary features */}
              <div className="flex-grow space-y-2.5 mb-6">
                {planFeatures.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="w-3 h-3 text-primary/70 shrink-0 mt-0.5" />
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>

              {/* View Plan button */}
              <Link href={`/plan/${plan.key}`}>
                <PremiumButton
                  variant={plan.glow ? "default" : "glass"}
                  className="w-full group"
                >
                  View Plan
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </PremiumButton>
              </Link>
            </PremiumCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-center"
      >
        <p className="text-muted-foreground text-sm">
          Questions?{" "}
          <a href="https://t.me/naylou" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
            Contact @naylou on Telegram
          </a>
        </p>
      </motion.div>
    </div>
  );
}
