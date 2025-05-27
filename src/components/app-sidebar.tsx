"use client";
import {
  Database,
  Server,
  Zap,
  Code,
  Globe,
  HardDrive,
  Settings,
  Plus,
  LayoutDashboard,
  Container,
  FileText,
  Activity,
  Cloud,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";

// Navigation items
const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { name: "Services", icon: Server, id: "services" },
  { name: "WordPress", icon: Globe, id: "wordpress" },
  { name: "Remote WordPress", icon: Cloud, id: "remote-wordpress" },
  { name: "Containers", icon: Container, id: "containers" },
  { name: "Logs", icon: FileText, id: "logs" },
  { name: "Monitoring", icon: Activity, id: "monitoring" },
];

// Service data with icons and categories
const services = {
  databases: [
    { name: "MySQL", icon: Database, id: "mysql" },
    { name: "Redis", icon: Database, id: "redis" },
    { name: "PostgreSQL", icon: Database, id: "postgresql" },
    { name: "MongoDB", icon: Database, id: "mongodb" },
  ],
  runtimes: [
    { name: "Node.js", icon: Server, id: "nodejs" },
    { name: "PHP", icon: Code, id: "php" },
    { name: "Python", icon: Code, id: "python" },
    { name: "Go", icon: Code, id: "go" },
  ],
  services: [
    { name: "Nginx", icon: Globe, id: "nginx" },
    { name: "Apache", icon: Globe, id: "apache" },
    { name: "Docker", icon: HardDrive, id: "docker" },
    { name: "Elasticsearch", icon: Zap, id: "elasticsearch" },
  ],
};

interface AppSidebarProps {
  selectedService: string | null;
  onServiceSelect: (serviceId: string) => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function AppSidebar({
  selectedService,
  onServiceSelect,
  currentPage,
  onPageChange,
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <HardDrive className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">DevBox</span>
                <span className="text-xs text-muted-foreground">
                  Development Environment
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    onClick={() => onPageChange(item.id)}
                  >
                    <item.icon className="size-4" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {currentPage === "services" && (
          <>
            {Object.entries(services).map(([category, items]) => (
              <SidebarGroup key={category}>
                <SidebarGroupLabel className="capitalize">
                  {category}
                </SidebarGroupLabel>
                <SidebarGroupAction>
                  <Plus className="size-4" />
                  <span className="sr-only">Add {category}</span>
                </SidebarGroupAction>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((service) => (
                      <SidebarMenuItem key={service.id}>
                        <SidebarMenuButton
                          isActive={selectedService === service.id}
                          onClick={() => onServiceSelect(service.id)}
                        >
                          <service.icon className="size-4" />
                          <span>{service.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={currentPage === "settings"}
              onClick={() => onPageChange("settings")}
            >
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
