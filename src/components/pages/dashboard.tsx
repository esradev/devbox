import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface DashboardProps {
  services: Array<{
    id: string;
    name: string;
    status: "running" | "stopped" | "error";
    port?: number;
    uptime?: string;
  }>;
}

export function Dashboard({ services }: DashboardProps) {
  const runningCount = services.filter((s) => s.status === "running").length;
  const stoppedCount = services.filter((s) => s.status === "stopped").length;
  const errorCount = services.filter((s) => s.status === "error").length;
  const totalServices = services.length;

  const systemMetrics = {
    cpu: 45,
    memory: 68,
    disk: 32,
    network: 12,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your development environment
        </p>
      </div>

      {/* Service Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Services
            </CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-xs text-muted-foreground">Active services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {runningCount}
            </div>
            <p className="text-xs text-muted-foreground">Services online</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stopped</CardTitle>
            <XCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">
              {stoppedCount}
            </div>
            <p className="text-xs text-muted-foreground">Services offline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{errorCount}</div>
            <p className="text-xs text-muted-foreground">
              Services with issues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>{systemMetrics.cpu}%</span>
              </div>
              <Progress value={systemMetrics.cpu} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span>{systemMetrics.memory}%</span>
              </div>
              <Progress value={systemMetrics.memory} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Disk Usage</span>
                <span>{systemMetrics.disk}%</span>
              </div>
              <Progress value={systemMetrics.disk} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Network I/O</span>
                <span>{systemMetrics.network} MB/s</span>
              </div>
              <Progress value={systemMetrics.network} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.slice(0, 5).map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        service.status === "running"
                          ? "bg-green-500"
                          : service.status === "error"
                          ? "bg-red-500"
                          : "bg-gray-500"
                      }`}
                    />
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                  <Badge
                    variant={
                      service.status === "running"
                        ? "default"
                        : service.status === "error"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {service.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
