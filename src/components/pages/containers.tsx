import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container, Play, Square, RotateCcw, Trash2 } from "lucide-react";

const mockContainers = [
  {
    id: "mysql-container",
    name: "mysql-8.0",
    image: "mysql:8.0",
    status: "running",
    ports: ["3306:3306"],
    created: "2 hours ago",
    size: "512 MB",
  },
  {
    id: "redis-container",
    name: "redis-cache",
    image: "redis:7.0-alpine",
    status: "running",
    ports: ["6379:6379"],
    created: "1 hour ago",
    size: "32 MB",
  },
  {
    id: "nginx-container",
    name: "nginx-proxy",
    image: "nginx:alpine",
    status: "stopped",
    ports: ["80:80", "443:443"],
    created: "3 hours ago",
    size: "24 MB",
  },
];

export function Containers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Containers</h2>
          <p className="text-muted-foreground">Manage your Docker containers</p>
        </div>
        <Button>
          <Container className="h-4 w-4 mr-2" />
          New Container
        </Button>
      </div>

      <div className="grid gap-4">
        {mockContainers.map((container) => (
          <Card key={container.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Container className="h-5 w-5" />
                  {container.name}
                </CardTitle>
                <Badge
                  variant={
                    container.status === "running" ? "default" : "secondary"
                  }
                >
                  {container.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm font-medium">Image</p>
                  <p className="text-sm text-muted-foreground">
                    {container.image}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Ports</p>
                  <p className="text-sm text-muted-foreground">
                    {container.ports.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {container.created}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Size</p>
                  <p className="text-sm text-muted-foreground">
                    {container.size}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  {container.status === "running" ? (
                    <Square className="h-4 w-4 mr-1" />
                  ) : (
                    <Play className="h-4 w-4 mr-1" />
                  )}
                  {container.status === "running" ? "Stop" : "Start"}
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Restart
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
