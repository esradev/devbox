import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Cpu, HardDrive, Wifi, MemoryStick } from "lucide-react";

const mockMetrics = {
  system: {
    cpu: 45,
    memory: 68,
    disk: 32,
    network: 12,
  },
  services: [
    {
      name: "MySQL",
      cpu: 15,
      memory: 512,
      status: "healthy",
      responseTime: "2.3ms",
    },
    {
      name: "Redis",
      cpu: 5,
      memory: 128,
      status: "healthy",
      responseTime: "0.8ms",
    },
    {
      name: "Node.js",
      cpu: 0,
      memory: 0,
      status: "stopped",
      responseTime: "N/A",
    },
    {
      name: "Nginx",
      cpu: 8,
      memory: 64,
      status: "warning",
      responseTime: "15.2ms",
    },
  ],
};

export function Monitoring() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "default";
      case "warning":
        return "secondary";
      case "stopped":
        return "outline";
      default:
        return "destructive";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Monitoring</h2>
        <p className="text-muted-foreground">
          Real-time system and service metrics
        </p>
      </div>

      {/* System Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.system.cpu}%</div>
            <Progress value={mockMetrics.system.cpu} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMetrics.system.memory}%
            </div>
            <Progress value={mockMetrics.system.memory} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.system.disk}%</div>
            <Progress value={mockMetrics.system.disk} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network I/O</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMetrics.system.network} MB/s
            </div>
            <Progress value={mockMetrics.system.network} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Service Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Service Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMetrics.services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Response: {service.responseTime}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{service.cpu}%</p>
                    <p className="text-muted-foreground">CPU</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{service.memory} MB</p>
                    <p className="text-muted-foreground">Memory</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
