import { useState } from "react";
import { WordPressProjectCard } from "../wordpress-project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  RefreshCw,
  Globe,
  Server,
  Database,
  Code,
  Plus,
} from "lucide-react";

const mockWordPressProjects = [
  {
    id: "wp-1",
    name: "My Blog",
    domain: "myblog.local",
    status: "running" as const,
    wordpressVersion: "6.4",
    phpVersion: "8.2",
    database: "MySQL 8.0",
    sslEnabled: true,
    lastAccessed: "2 hours ago",
    plugins: 12,
    themes: 3,
    adminUser: "admin",
    adminEmail: "admin@myblog.local",
  },
  {
    id: "wp-2",
    name: "E-commerce Store",
    domain: "store.local",
    status: "stopped" as const,
    wordpressVersion: "6.3",
    phpVersion: "8.1",
    database: "MySQL 8.0",
    sslEnabled: false,
    lastAccessed: "1 day ago",
    plugins: 25,
    themes: 5,
    adminUser: "admin",
    adminEmail: "admin@store.local",
  },
  {
    id: "wp-3",
    name: "Portfolio Site",
    domain: "portfolio.local",
    status: "running" as const,
    wordpressVersion: "6.4",
    phpVersion: "8.2",
    database: "MariaDB 10.6",
    sslEnabled: true,
    lastAccessed: "30 minutes ago",
    plugins: 8,
    themes: 2,
    adminUser: "admin",
    adminEmail: "admin@portfolio.local",
  },
];

interface WordPressProps {
  onNavigate: (page: string, data?: any) => void;
}

export function WordPress({ onNavigate }: WordPressProps) {
  const [projects, setProjects] = useState(mockWordPressProjects);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const runningCount = projects.filter((p) => p.status === "running").length;
  const stoppedCount = projects.filter((p) => p.status === "stopped").length;
  const totalProjects = projects.length;

  const handleProjectToggle = (projectId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              status:
                project.status === "running" ? "stopped" : ("running" as const),
              lastAccessed:
                project.status === "stopped"
                  ? "Just now"
                  : project.lastAccessed,
            }
          : project
      )
    );
  };

  const handleProjectDelete = (projectId: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  };

  const handleProjectConfigure = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      onNavigate("configure-wordpress", project);
    }
  };

  const handleOpenAdmin = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project && project.status === "running") {
      window.open(`http://${project.domain}/wp-admin`, "_blank");
    }
  };

  const handleOpenSite = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project && project.status === "running") {
      const protocol = project.sslEnabled ? "https" : "http";
      window.open(`${protocol}://${project.domain}`, "_blank");
    }
  };

  const handleOpenFiles = (projectId: string) => {
    console.log("Open file manager for project:", projectId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">WordPress Sites</h2>
          <p className="text-muted-foreground">
            Create and manage local WordPress development sites
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => onNavigate("create-wordpress")}>
            <Plus className="h-4 w-4 mr-2" />
            New WordPress Site
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              WordPress installations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Server className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {runningCount}
            </div>
            <p className="text-xs text-muted-foreground">Sites online</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stopped</CardTitle>
            <Server className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">
              {stoppedCount}
            </div>
            <p className="text-xs text-muted-foreground">Sites offline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Database className="h-4 w-4 mr-2" />
                phpMyAdmin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WordPress Projects */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <WordPressProjectCard
              key={project.id}
              project={project}
              onToggle={() => handleProjectToggle(project.id)}
              onDelete={() => handleProjectDelete(project.id)}
              onConfigure={() => handleProjectConfigure(project.id)}
              onOpenAdmin={() => handleOpenAdmin(project.id)}
              onOpenSite={() => handleOpenSite(project.id)}
              onOpenFiles={() => handleOpenFiles(project.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No WordPress sites found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search"
                : "Get started by creating your first WordPress site"}
            </p>
            <Button onClick={() => onNavigate("create-wordpress")}>
              <Plus className="h-4 w-4 mr-2" />
              New WordPress Site
            </Button>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Getting Started</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • Create a new site with the "New WordPress Site" button
                </li>
                <li>• Choose your preferred PHP and WordPress versions</li>
                <li>• Access your site admin at domain.local/wp-admin</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Development Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use SSL for testing secure features</li>
                <li>• Install sample data for theme development</li>
                <li>• Access files directly through the file manager</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
