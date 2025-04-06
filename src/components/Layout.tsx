
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { NetworkStatusIndicator } from "@/components/NetworkStatusIndicator";

export const Layout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex justify-end mb-2">
            <NetworkStatusIndicator />
          </div>
          <Outlet />
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};
