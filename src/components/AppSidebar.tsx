
import {
  Home,
  Search,
  Package,
  Plus,
  History,
  ShieldCheck,
  AlertTriangle,
  Package2,
  Globe,
  Shield,
  Settings,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Track Product",
    url: "/track",
    icon: Search,
  },
  {
    title: "Drug Registry",
    url: "/drugs",
    icon: Package,
  },
  {
    title: "Register Drug",
    url: "/register-drug",
    icon: Plus,
  },
  {
    title: "History",
    url: "/history",
    icon: History,
  },
  {
    title: "Compliance",
    url: "/compliance",
    icon: ShieldCheck,
  },
  {
    title: "Recall Reports",
    url: "/recall-reports",
    icon: AlertTriangle,
  },
  {
    title: "Batch Processing", 
    url: "/batch-processing",
    icon: Package2,
  },
  {
    title: "Network Explorer",
    url: "/explorer",
    icon: Globe,
  },
  {
    title: "Verify Drug",
    url: "/verify", 
    icon: Shield,
  },
  {
    title: "API Test",
    url: "/api-test",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
