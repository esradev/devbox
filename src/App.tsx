import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Dashboard } from "@/components/pages/dashboard";
import { Services } from "@/components/pages/services";
import { Containers } from "@/components/pages/containers";
import { Logs } from "@/components/pages/logs";
import { Monitoring } from "@/components/pages/monitoring";
import { Settings } from "@/components/pages/settings";
import { WordPress } from "@/components/pages/wordpress";
import { CreateWordPressPage } from "@/components/pages/create-wordpress";
import { ConfigureWordPressPage } from "@/components/pages/configure-wordpress";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { RemoteWordPress } from "./components/pages/remote-wordpress";
import { Toaster } from "@/components/ui/sonner";

// Mock service data for Dashboard
const mockServices = [
  {
    id: "mysql",
    name: "MySQL 8.0",
    status: "running" as const,
    port: 3306,
    uptime: "2h 34m",
  },
  {
    id: "redis",
    name: "Redis 7.0",
    status: "running" as const,
    port: 6379,
    uptime: "1h 12m",
  },
  {
    id: "nodejs",
    name: "Node.js 18.x",
    status: "stopped" as const,
    port: 3000,
  },
  {
    id: "nginx",
    name: "Nginx",
    status: "error" as const,
    port: 80,
  },
];

export default function App() {
  const [selectedService, setSelectedService] = React.useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = React.useState("dashboard");
  // const [wordpressProjects, setWordPressProjects] = React.useState([]);
  const [currentWordPressPage, setCurrentWordPressPage] = React.useState<
    "list" | "create" | "configure"
  >("list");
  const [selectedWordPressProject, setSelectedWordPressProject] =
    React.useState(null);

  // const handleServiceSelect = (serviceId: string) => {
  //   setSelectedService(serviceId);
  // };

  // const handlePageChange = (page: string) => {
  //   setCurrentPage(page);
  //   setSelectedService(null);
  //   // Reset WordPress page state when navigating away
  //   if (page !== "wordpress") {
  //     setCurrentWordPressPage("list");
  //     setSelectedWordPressProject(null);
  //   }
  // };

  const handleWordPressNavigate = (page: string, data?: any) => {
    if (page === "create-wordpress") {
      setCurrentWordPressPage("create");
    } else if (page === "configure-wordpress") {
      setCurrentWordPressPage("configure");
      setSelectedWordPressProject(data);
    } else {
      setCurrentWordPressPage("list");
    }
  };

  const handleCreateWordPressProject = (project: any) => {
    console.log("Creating new WordPress project:", project);
    // setWordPressProjects((prev) => [...prev, project]);
    setCurrentWordPressPage("list");
  };

  const handleCancelCreateWordPress = () => {
    setCurrentWordPressPage("list");
  };

  const handleSaveWordPressProject = (projectId: string, updates: any) => {
    console.log("Saving project updates:", projectId, updates);
    // setWordPressProjects((prev) =>
    //   prev.map((project) =>
    //     project.id === projectId ? { ...project, ...updates } : project
    //   )
    // );
    setCurrentWordPressPage("list");
  };

  const handleDeleteWordPressProject = (projectId: string) => {
    console.log("Deleting WordPress project:", projectId);
    // setWordPressProjects((prev) =>
    //   prev.filter((project) => project.id !== projectId)
    // );
    setCurrentWordPressPage("list");
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard services={mockServices} />;
      case "services":
        return <Services selectedService={selectedService} />;
      case "wordpress":
        if (currentWordPressPage === "create") {
          return (
            <CreateWordPressPage
              onCreateProject={handleCreateWordPressProject}
              onCancel={handleCancelCreateWordPress}
            />
          );
        } else if (
          currentWordPressPage === "configure" &&
          selectedWordPressProject
        ) {
          return (
            <ConfigureWordPressPage
              project={selectedWordPressProject}
              onSave={handleSaveWordPressProject}
              onCancel={handleCancelCreateWordPress}
              onDelete={handleDeleteWordPressProject}
            />
          );
        } else {
          return <WordPress onNavigate={handleWordPressNavigate} />;
        }
      case "remote-wordpress":
        return <RemoteWordPress />;
      case "containers":
        return <Containers />;
      case "logs":
        return <Logs />;
      case "monitoring":
        return <Monitoring />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard services={mockServices} />;
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="devbox-ui-theme">
          <SidebarProvider>
            <AppSidebar
              selectedService={selectedService}
              onServiceSelect={setSelectedService}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="flex items-center gap-2 flex-1">
                  <h1 className="font-semibold capitalize">{currentPage}</h1>
                </div>
                <ModeToggle />
              </header>
              <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
                {renderPageContent()}
              </div>
            </SidebarInset>
          </SidebarProvider>
          <Toaster
            position="top-right"
            richColors
            closeButton={false}
            toastOptions={{
              className: "bg-background",
              duration: 3000,
              style: {
                fontSize: "14px",
                padding: "8px 12px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
