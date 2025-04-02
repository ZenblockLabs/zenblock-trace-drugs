
import { useAuth } from "@/context/AuthContext";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Package, 
  ListOrdered, 
  Truck, 
  History, 
  BarChart3, 
  Users, 
  LogOut, 
  Pill 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Items shared across all roles
  const sharedItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Drug Catalog",
      url: "/drugs",
      icon: Pill,
    },
    {
      title: "Transaction History",
      url: "/history",
      icon: History,
    },
  ];

  // Role-specific items
  const roleItems = {
    manufacturer: [
      {
        title: "Register Drug",
        url: "/register-drug",
        icon: Package,
      },
      {
        title: "Ship Products",
        url: "/ship",
        icon: Truck,
      },
    ],
    distributor: [
      {
        title: "Receive Shipments",
        url: "/receive",
        icon: ListOrdered,
      },
      {
        title: "Ship Products",
        url: "/ship",
        icon: Truck,
      },
    ],
    dispenser: [
      {
        title: "Receive Shipments",
        url: "/receive",
        icon: ListOrdered,
      },
      {
        title: "Dispense Medication",
        url: "/dispense",
        icon: Pill,
      },
    ],
    regulator: [
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
      },
      {
        title: "Supply Chain Partners",
        url: "/partners",
        icon: Users,
      },
    ],
  };

  // Get role-specific items
  const items = user?.role ? [...sharedItems, ...roleItems[user.role]] : sharedItems;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center">
            <span className="text-white font-bold">ZL</span>
          </div>
          <span className="font-bold text-lg">ZenBlock Labs</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton active={isActive(item.url)} asChild>
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-sidebar-foreground/70">{user.organization}</div>
                <div className="mt-1">
                  <span className="inline-flex items-center rounded-full bg-sidebar-accent px-2 py-1 text-xs font-medium capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground" 
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
