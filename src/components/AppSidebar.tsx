
import { useAuth } from "@/context/AuthContext";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent,
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuSub
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  LayoutDashboard, 
  Package, 
  History, 
  LogOut, 
  Users, 
  Settings,
  FileText,
  Database,
  Package2,
  Link,
  ShieldCheck
} from "lucide-react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Define sidebar items based on user role
  const getRoleBasedItems = () => {
    if (!user) return [];
    
    const commonItems = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Drugs",
        url: "/drugs",
        icon: Package,
      },
      {
        title: "History",
        url: "/history",
        icon: History,
      },
      {
        title: "Explorer",
        url: "/explorer",
        icon: Link,
      },
      {
        title: "Compliance",
        url: "/compliance",
        icon: ShieldCheck,
      }
    ];
    
    // Role-specific items
    switch (user.role) {
      case "manufacturer":
        return [
          ...commonItems,
          {
            title: "Register Drug",
            url: "/register-drug",
            icon: Package2,
          }
        ];
      case "distributor":
        return commonItems;
      case "dispenser":
        return commonItems;
      case "regulator":
        return [
          ...commonItems,
          {
            title: "Reports",
            url: "/reports",
            icon: FileText,
          }
        ];
      default:
        return commonItems;
    }
  };
  
  const items = getRoleBasedItems();

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Role badge color
  const getRoleBadgeColor = () => {
    if (!user) return "bg-gray-200";
    
    switch (user.role) {
      case "manufacturer":
        return "bg-blue-100 text-blue-800";
      case "distributor":
        return "bg-green-100 text-green-800";
      case "dispenser":
        return "bg-purple-100 text-purple-800";
      case "regulator":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <RouterLink to="/dashboard" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/45b0e393-a331-4b63-9f6b-e590813b266e.png" 
            alt="Zenblock Labs Logo" 
            className="h-8 w-8" 
          />
          <span className="font-bold text-xl">Zenblock</span>
        </RouterLink>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton isActive={isActive(item.url)} asChild>
                <RouterLink to={item.url}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        {user && (
          <div className="px-3 py-2">
            <div className="flex items-center gap-3 rounded-md border p-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium leading-none truncate">
                  {user.name}
                </span>
                <span className={`mt-1 text-xs px-1.5 py-0.5 rounded-sm inline-block ${getRoleBadgeColor()}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-auto h-8 w-8"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Log out</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Log out</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
