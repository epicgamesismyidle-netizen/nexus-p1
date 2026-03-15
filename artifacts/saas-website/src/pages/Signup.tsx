import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useSignup } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { PremiumButton, PremiumCard, PremiumInput } from "@/components/ui/premium";
import { useToast } from "@/hooks/use-toast";
import { Lock, User } from "lucide-react";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [, setLocation] = useLocation();
  const { invalidateUser } = useAuth();
  const { toast } = useToast();
  const [errorMsg, setErrorMsg] = useState("");
  
  const { mutate: signup, isPending } = useSignup();
  
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupForm) => {
    setErrorMsg("");
    signup({ data }, {
      onSuccess: () => {
        invalidateUser();
        toast({ title: "Account created!", description: "Welcome to Nexus." });
        setLocation("/dashboard");
      },
      onError: (error: any) => {
        setErrorMsg(error.response?.data?.error || error.message || "Failed to create account");
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <PremiumCard glowing>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create an account</h1>
            <p className="text-muted-foreground">Join the next-generation platform today</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-destructive/20 text-destructive text-sm text-center border border-destructive/30">
                {errorMsg}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <PremiumInput 
                  {...register("username")} 
                  placeholder="johndoe" 
                  className="pl-11"
                />
              </div>
              {errors.username && <p className="text-destructive text-sm mt-1">{errors.username.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <PremiumInput 
                  type="password"
                  {...register("password")} 
                  placeholder="••••••••" 
                  className="pl-11"
                />
              </div>
              {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
            </div>
            
            <PremiumButton type="submit" className="w-full mt-4" size="lg" isLoading={isPending}>
              Create Account
            </PremiumButton>
          </form>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </div>
        </PremiumCard>
      </motion.div>
    </div>
  );
}
