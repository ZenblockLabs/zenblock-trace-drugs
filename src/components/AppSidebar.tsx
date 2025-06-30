
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
  Database,
  Truck,
  Activity,
  Cog,
  Network,
  Pills,
  ScanLine,
  Bell,
  Eye,
} from "lucide-react"
import { Link } from "react-router-dom"

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
    title: "Shipments",
    url: "/shipments",
    icon: Truck,
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
    title: "Compliance Integration",
    url: "/compliance-integration",
    icon: Globe,
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
    title: "ERP Integration",
    url: "/erp-integration",
    icon: Database,
  },
  {
    title: "Blockchain Status",
    url: "/blockchain-status",
    icon: Activity,
  },
  {
    title: "Configuration",
    url: "/configuration",
    icon: Cog,
  },
  {
    title: "Network Admin",
    url: "/network-admin",
    icon: Network,
  },
  {
    title: "API Test",
    url: "/api-test",
    icon: Settings,
  },
]

// Pharma Traceability section items
const pharmaItems = [
  {
    title: "Pharma Traceability",
    url: "/pharma-traceability",
    icon: Pills,
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pharma Traceability</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pharmaItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
