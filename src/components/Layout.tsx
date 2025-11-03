
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { ReactNode } from "react";
import { LayoutHeader } from "./layout/LayoutHeader";
import { Menu } from "lucide-react";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      {/* Mobile navigation header - always visible */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b bg-background flex items-center px-4 lg:hidden">
        <SidebarTrigger className="mr-2">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        <span className="font-semibold">Zenblock Pharma</span>
      </header>

      <div className="min-h-screen flex w-full pt-14 lg:pt-0">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <LayoutHeader />
          {children || <Outlet />}
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};

export default Layout;
