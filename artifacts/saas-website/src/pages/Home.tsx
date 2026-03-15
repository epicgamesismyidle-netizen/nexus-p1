import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Zap, Shield, Star, ChevronDown, Phone } from "lucide-react";
import { PremiumButton, PremiumCard } from "@/components/ui/premium";

const pricingPlans = [
  { name: "Daily",    price: 65,   duration: "day",     key: "daily",    popular: false, badge: null },
  { name: "Weekly",   price: 455,  duration: "week",    key: "weekly",   popular: false, badge: "Save 30%" },
  { name: "Monthly",  price: 1300, duration: "month",   key: "monthly",  popular: true,  badge: "Most Popular" },
  { name: "Lifetime", price: 2400, duration: "forever", key: "lifetime", popular: false, badge: "Best Value" },
];

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
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden">

      {/* Hero */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <div className="absolute inset-0 opacity-30 mix-blend-screen">
            <img
              src={`${import.meta.env.BASE_URL}images/hero-glow.png`}
              alt=""
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-[120px]" />
        </motion.div>

        <div className="container relative z-10 px-4 md:px-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-10"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Live & fully operational
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl max-w-4xl tracking-tight mb-8 leading-[1.05]"
          >
            Nexus <span className="text-gradient-primary">P1</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
          >
            100+ concurrent calls. Scripts for Coinbase, Google, Apple, Gemini, Crypto.com and more.
            Caller ID spoofing, high uptime, and dedicated support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link href="/signup">
              <PremiumButton size="lg" className="w-full sm:w-auto group">
                Get Access
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </PremiumButton>
            </Link>
            <a href="#pricing">
              <PremiumButton variant="glass" size="lg" className="w-full sm:w-auto">
                View Plans
              </PremiumButton>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col items-center gap-2 text-muted-foreground/50"
          >
            <span className="text-xs">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What's included */}
      <section className="w-full py-28 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              What's included
            </motion.h2>
            <motion.p variants={itemVariants} className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every plan comes with the full Nexus P1 feature set.
            </motion.p>
          </AnimatedSection>

          <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {planFeatures.map((section, i) => (
              <motion.div
                key={section.section}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <PremiumCard glowing={i === 2} className="h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <section.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-semibold">{section.section}</h3>
                  </div>
                  <ul className="space-y-3">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </PremiumCard>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="w-full py-32 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <AnimatedSection className="text-center mb-20">
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Pricing
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-xl mx-auto">
              Pay with crypto via NOWPayments. Instant activation.
            </motion.p>
          </AnimatedSection>

          <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                whileHover={{ y: plan.popular ? -6 : -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={plan.popular ? "xl:-translate-y-4" : ""}
              >
                <PremiumCard
                  glowing={plan.popular}
                  className={`h-full flex flex-col ${plan.popular ? "border-primary/50 shadow-xl shadow-primary/10" : ""}`}
                >
                  {plan.badge && (
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 text-xs font-bold rounded-full whitespace-nowrap ${plan.popular ? "bg-primary text-primary-foreground" : "bg-white/10 text-foreground border border-white/20"}`}>
                      {plan.badge}
                    </div>
                  )}

                  <div className="mb-6 pt-2">
                    <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">${plan.price.toLocaleString()}</span>
                      <span className="text-muted-foreground text-sm">/{plan.duration}</span>
                    </div>
                  </div>

                  <div className="flex-grow space-y-5 mb-8">
                    {planFeatures.map((section) => (
                      <div key={section.section}>
                        <div className="flex items-center gap-2 mb-2.5">
                          <section.icon className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-primary">{section.section}</span>
                        </div>
                        <ul className="space-y-1.5 pl-1">
                          {section.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="w-3.5 h-3.5 text-primary/70 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <Link href="/signup">
                    <PremiumButton variant={plan.popular ? "default" : "glass"} className="w-full">
                      Get Access
                    </PremiumButton>
                  </Link>
                </PremiumCard>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Contact */}
      <section className="w-full py-28 border-t border-white/5 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <AnimatedSection>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Questions?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
              Reach out on Telegram for support or to get started.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <PremiumButton size="lg" className="group">
                  Get Access
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </PremiumButton>
              </Link>
              <a href="https://t.me/naylou" target="_blank" rel="noreferrer">
                <PremiumButton size="lg" variant="glass">
                  @naylou on Telegram
                </PremiumButton>
              </a>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
