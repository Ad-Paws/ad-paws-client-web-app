import { useEffect } from "react";
import { useStatsigClient } from "@statsig/react-bindings";
import { useAuth } from "@/contexts/AuthContext";

interface StatsigWrapperProps {
  children: React.ReactNode;
}

/**
 * StatsigWrapper component
 * 
 * This component updates Statsig user information when the auth state changes.
 * It ensures that analytics and feature flags are properly tracked per user.
 */
export function StatsigWrapper({ children }: StatsigWrapperProps) {
  const { user, activeCompany, isAuthenticated } = useAuth();
  const { client } = useStatsigClient();

  useEffect(() => {
    if (!client) return;

    // Update Statsig user when auth state changes
    const updateStatsigUser = async () => {
      if (isAuthenticated && user) {
        // User is logged in - update with their information
        await client.updateUserAsync({
          userID: user.id || "anonymous",
          email: user.email,
          // `custom` sólo acepta primitivos: un null aquí revienta el SDK.
          custom: {
            name: user.name ?? "",
            companyId: activeCompany?.id ?? "",
            companyName: activeCompany?.name ?? "",
            companySlug: activeCompany?.slug ?? "",
          },
        });
      } else {
        // User is logged out - use anonymous user
        await client.updateUserAsync({
          userID: "anonymous",
        });
      }
    };

    updateStatsigUser();
  }, [user, activeCompany, isAuthenticated, client]);

  return <>{children}</>;
}
