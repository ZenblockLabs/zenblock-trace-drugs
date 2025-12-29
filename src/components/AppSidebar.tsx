
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
  Pill,
  ScanLine,
  Bell,
  Eye,
  Heart,
  Thermometer,
  Layers,
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

// Pharma Operations section
const pharmaOperations = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Operations Hub",
    url: "/pharma-traceability",
    icon: Pill,
  },
  {
    title: "Drug Registry",
    url: "/drugs",
    icon: Package,
  },
  {
    title: "Shipments",
    url: "/shipments",
    icon: Truck,
  },
  {
    title: "Cold Chain",
    url: "/cold-chain",
    icon: Thermometer,
  },
  {
    title: "Aggregation",
    url: "/aggregation",
    icon: Layers,
  },
]

// Supply Chain section (role-specific)
const supplyChain = [
  {
    title: "Register Drug",
    url: "/register-drug",
    icon: Plus,
  },
  {
    title: "Batch Processing", 
    url: "/batch-processing",
    icon: Package2,
  },
  {
    title: "ERP Integration",
    url: "/erp-integration",
    icon: Database,
  },
]

// Compliance & Security section
const complianceSecurity = [
  {
    title: "Compliance Hub",
    url: "/compliance",
    icon: ShieldCheck,
  },
  {
    title: "Network Explorer",
    url: "/explorer",
    icon: Globe,
  },
]

// System section
const system = [
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
]

// Brand Engagement section
const brandEngagement = [
  {
    title: "Kadha Capsules",
    url: "/kadha-capsules",
    icon: Heart,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>PHARMA OPERATIONS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pharmaOperations.map((item) => (
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
          <SidebarGroupLabel>SUPPLY CHAIN</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supplyChain.map((item) => (
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
          <SidebarGroupLabel>COMPLIANCE & SECURITY</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {complianceSecurity.map((item) => (
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
          <SidebarGroupLabel>SYSTEM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {system.map((item) => (
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
          <SidebarGroupLabel>BRAND ENGAGEMENT</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {brandEngagement.map((item) => (
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
