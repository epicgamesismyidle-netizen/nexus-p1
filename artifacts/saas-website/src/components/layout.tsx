import React from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useLogout } from "@workspace/api-client-react";
import { LogOut, Settings, LayoutDashboard, CreditCard, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumButton } from "./ui/premium";
import { useToast } from "@/hooks/use-toast";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logoutCache } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        logoutCache();
        toast({ title: "Logged out" });
        setLocation("/");
      },
      onError: () => {
        toast({ title: "Failed to logout", variant: "destructive" });
      }
    });
  };

  const navLinks = user
    ? [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Settings", href: "/settings", icon: Settings },
      ]
    : [
        { name: "Pricing", href: "/#pricing", icon: CreditCard },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary transition-colors">
              <img
                src={`${import.meta.env.BASE_URL}images/logo.png`}
                alt="Nexus P1"
                className="w-full h-full object-cover mix-blend-screen"
              />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-gradient">Nexus P1</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">{user.username}</span>
                </span>
                <PremiumButton
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </PremiumButton>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Log in
                </Link>
                <PremiumButton onClick={() => setLocation("/signup")} size="sm">
                  Get Access
                </PremiumButton>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-white/10 py-4 px-4 flex flex-col gap-4 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </div>
              </Link>
            ))}
            <div className="h-px w-full bg-white/10 my-2" />
            {user ? (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="text-base font-medium text-destructive px-4 py-2 rounded-lg hover:bg-destructive/10 text-left flex items-center gap-3"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-3 px-4">
                <PremiumButton variant="outline" className="w-full" onClick={() => { setLocation("/login"); setMobileMenuOpen(false); }}>
                  Log in
                </PremiumButton>
                <PremiumButton className="w-full" onClick={() => { setLocation("/signup"); setMobileMenuOpen(false); }}>
                  Get Access
                </PremiumButton>
              </div>
            )}
          </motion.div>
        )}
      </header>

      <main className="flex-1 w-full relative">
        {children}
      </main>

      <footer className="border-t border-white/5 py-12 bg-background/40">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-primary/20 flex items-center justify-center border border-primary/30">
              <img
                src={`${import.meta.env.BASE_URL}images/logo.png`}
                alt="Nexus P1"
                className="w-full h-full object-cover mix-blend-screen opacity-70"
              />
            </div>
            <span className="font-display font-semibold text-muted-foreground">Nexus P1</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} Nexus P1. All rights reserved.</span>
            <a href="https://t.me/naylou" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              Contact @naylou
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
