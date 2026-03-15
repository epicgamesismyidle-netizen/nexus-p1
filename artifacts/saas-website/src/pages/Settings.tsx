import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateSettings } from "@workspace/api-client-react";
import { PremiumButton, PremiumCard, PremiumInput } from "@/components/ui/premium";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, User, Lock, Loader2 } from "lucide-react";

const updateProfileSchema = z.object({
  newUsername: z.string().min(3, "Username must be at least 3 characters").max(50),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

type ProfileForm = z.infer<typeof updateProfileSchema>;
type PasswordForm = z.infer<typeof updatePasswordSchema>;

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user, isLoading, invalidateUser } = useAuth();
  const { toast } = useToast();
  
  const { mutate: updateSettings, isPending } = useUpdateSettings();
  
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(updateProfileSchema),
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(updatePasswordSchema),
  });

  // Pre-fill username when user data is available
  useEffect(() => {
    if (user) {
      profileForm.reset({ newUsername: user.username });
    }
  }, [user, profileForm]);

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user) {
    return (
      <div className="h-[calc(100vh-160px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const onProfileSubmit = (data: ProfileForm) => {
    if (data.newUsername === user.username) {
      toast({ title: "No changes made" });
      return;
    }
    
    setProfileError("");
    updateSettings({ data: { newUsername: data.newUsername } }, {
      onSuccess: () => {
        invalidateUser();
        toast({ title: "Profile updated successfully" });
      },
      onError: (error: any) => {
        setProfileError(error.response?.data?.error || error.message);
      }
    });
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    setPasswordError("");
    updateSettings({ data: { currentPassword: data.currentPassword, newPassword: data.newPassword } }, {
      onSuccess: () => {
        passwordForm.reset();
        toast({ title: "Password updated successfully" });
      },
      onError: (error: any) => {
        setPasswordError(error.response?.data?.error || error.message);
      }
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your account preferences and security</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <PremiumCard>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <User className="w-5 h-5 text-primary" />
              Profile Details
            </h3>
            
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
              {profileError && (
                <div className="p-3 rounded-lg bg-destructive/20 text-destructive text-sm border border-destructive/30">
                  {profileError}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Username</label>
                <PremiumInput 
                  {...profileForm.register("newUsername")} 
                  placeholder="Username" 
                />
                {profileForm.formState.errors.newUsername && (
                  <p className="text-destructive text-sm mt-1">{profileForm.formState.errors.newUsername.message}</p>
                )}
              </div>
              
              <PremiumButton 
                type="submit" 
                className="w-full mt-4" 
                isLoading={isPending && !!profileForm.formState.isDirty}
                disabled={!profileForm.formState.isDirty}
              >
                Save Changes
              </PremiumButton>
            </form>
          </PremiumCard>
        </motion.div>

        {/* Security Settings */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <PremiumCard>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <Lock className="w-5 h-5 text-primary" />
              Security
            </h3>
            
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
              {passwordError && (
                <div className="p-3 rounded-lg bg-destructive/20 text-destructive text-sm border border-destructive/30">
                  {passwordError}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Current Password</label>
                <PremiumInput 
                  type="password"
                  {...passwordForm.register("currentPassword")} 
                  placeholder="••••••••" 
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-destructive text-sm mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">New Password</label>
                <PremiumInput 
                  type="password"
                  {...passwordForm.register("newPassword")} 
                  placeholder="••••••••" 
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-destructive text-sm mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              
              <PremiumButton 
                type="submit" 
                variant="outline"
                className="w-full mt-4" 
                isLoading={isPending && !!passwordForm.formState.isDirty}
              >
                Update Password
              </PremiumButton>
            </form>
          </PremiumCard>
        </motion.div>
      </div>
    </div>
  );
}
