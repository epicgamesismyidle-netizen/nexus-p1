import React, { createContext, useContext } from "react";
import { useGetMe, getGetMeQueryKey, type UserProfile } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  logoutCache: () => void;
  invalidateUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useGetMe({
    query: {
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  });

  const logoutCache = () => {
    queryClient.setQueryData(getGetMeQueryKey(), null);
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
  };

  const invalidateUser = () => {
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
  };

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading, logoutCache, invalidateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
