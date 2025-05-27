import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Globe,
  Database,
  Code,
  ExternalLink,
  Settings,
  Trash2,
  MoreHorizontal,
  Folder,
  Shield,
} from "lucide-react";

interface WordPressProjectCardProps {
  project: {
    id: string;
    name: string;
    domain: string;
    status: "running" | "stopped" | "error";
    wordpressVersion: string;
    phpVersion: string;
    database: string;
    sslEnabled: boolean;
    lastAccessed: string;
    plugins: number;
    themes: number;
  };
  onToggle: () => void;
  onDelete: () => void;
  onConfigure: () => void;
  onOpenAdmin: () => void;
  onOpenSite: () => void;
  onOpenFiles: () => void;
}

export function WordPressProjectCard({
  project,
  onToggle,
  onDelete,
  onConfigure,
  onOpenAdmin,
  onOpenSite,
  onOpenFiles,
}: WordPressProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500";
      case "stopped":
        return "bg-gray-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "running":
        return "default";
      case "stopped":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="w-full h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold truncate flex items-center gap-2">
            <Globe className="h-5 w-5 flex-shrink-0" />
            {project.name}
          </CardTitle>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className={`w-2 h-2 rounded-full ${getStatusColor(
                project.status
              )}`}
            />
            <Badge
              variant={getStatusVariant(project.status)}
              className="capitalize"
            >
              {project.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="truncate">{project.domain}</span>
            <span className="text-xs">
              Last accessed: {project.lastAccessed}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs">
              {project.status === "running" ? "Online" : "Offline"}
            </span>
            <Switch
              checked={project.status === "running"}
              onCheckedChange={onToggle}
              disabled={project.status === "error"}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Project Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <span>WordPress {project.wordpressVersion}</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span>{project.database}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <span>PHP {project.phpVersion}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>{project.sslEnabled ? "SSL Enabled" : "No SSL"}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-sm text-muted-foreground border-t pt-3">
          <span>{project.plugins} Plugins</span>
          <span>{project.themes} Themes</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={onOpenSite}
            disabled={project.status !== "running"}
            className="flex-1"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View Site
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAdmin}
            disabled={project.status !== "running"}
            className="flex-1"
          >
            <Settings className="w-4 h-4 mr-1" />
            WP Admin
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onOpenFiles}>
                <Folder className="w-4 h-4 mr-2" />
                File Manager
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  onConfigure();
                }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
