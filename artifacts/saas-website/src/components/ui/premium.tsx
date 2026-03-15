import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

export const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
    
    const variants = {
      default: "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0",
      outline: "border-2 border-primary/50 text-primary hover:border-primary hover:bg-primary/10",
      ghost: "text-muted-foreground hover:text-foreground hover:bg-white/5",
      glass: "bg-white/5 border border-white/10 backdrop-blur-md text-foreground hover:bg-white/10 hover:border-white/20 shadow-xl",
    };

    const sizes = {
      default: "h-11 px-6 py-2",
      sm: "h-9 px-4 text-sm",
      lg: "h-14 px-8 text-lg font-semibold",
      icon: "h-11 w-11 flex justify-center",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
        {children}
      </button>
    );
  }
);
PremiumButton.displayName = "PremiumButton";

export const PremiumCard = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div"> & { glowing?: boolean }>(
  ({ className, glowing = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-2xl glass-panel p-6 overflow-hidden",
          className
        )}
        {...props}
      >
        {glowing && (
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
        )}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);
PremiumCard.displayName = "PremiumCard";

export const PremiumInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
PremiumInput.displayName = "PremiumInput";
