import { useState } from "react";
import { ServiceCard } from "../service-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, RefreshCw } from "lucide-react";

// Mock service data
const mockServices = [
  {
    id: "mysql",
    name: "MySQL 8.0",
    status: "running" as const,
    port: 3306,
    uptime: "2h 34m",
    logs: [
      "[2024-01-15 10:30:15] MySQL server started",
      "[2024-01-15 10:30:16] Ready for connections on port 3306",
      "[2024-01-15 12:45:22] Query executed successfully",
      "[2024-01-15 13:02:11] Connection established from 127.0.0.1",
    ],
  },
  {
    id: "redis",
    name: "Redis 7.0",
    status: "running" as const,
    port: 6379,
    uptime: "1h 12m",
    logs: [
      "[2024-01-15 11:18:30] Redis server started",
      "[2024-01-15 11:18:31] Ready to accept connections",
      "[2024-01-15 12:30:45] Background saving started",
      "[2024-01-15 12:30:46] Background saving terminated with success",
    ],
  },
  {
    id: "nodejs",
    name: "Node.js 18.x",
    status: "stopped" as const,
    port: 3000,
    logs: [
      "[2024-01-15 09:15:20] Node.js application stopped",
      "[2024-01-15 09:15:19] Graceful shutdown completed",
    ],
  },
  {
    id: "nginx",
    name: "Nginx",
    status: "error" as const,
    port: 80,
    logs: [
      "[2024-01-15 13:05:12] [error] bind() to 0.0.0.0:80 failed (98: Address already in use)",
      "[2024-01-15 13:05:12] [error] nginx: configuration file test failed",
    ],
  },
];

interface ServicesProps {
  selectedService: string | null;
}

export function Services({ selectedService }: ServicesProps) {
  console.log("Selected service:", selectedService);
  const [services, setServices] = useState(mockServices);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const runningCount = services.filter((s) => s.status === "running").length;
  const stoppedCount = services.filter((s) => s.status === "stopped").length;
  const errorCount = services.filter((s) => s.status === "error").length;

  const handleServiceToggle = (serviceId: string) => {
    console.log("Toggle service:", serviceId);
    // setServices((prev) =>
    //   prev.map((service) =>
    //     service.id === serviceId
    //       ? {
    //           ...service,
    //           status:
    //             service.status === "running" ? "stopped" : ("running" as const),
    //           uptime: service.status === "running" ? undefined : "0m",
    //         }
    //       : service
    //   )
    // );
  };

  const handleServiceRestart = (serviceId: string) => {
    console.log("Restart service:", serviceId);
    // setServices((prev) =>
    //   prev.map((service) =>
    //     service.id === serviceId
    //       ? {
    //           ...service,
    //           uptime: "0m",
    //           logs: [
    //             ...service.logs,
    //             `[${new Date().toLocaleString()}] Service restarted`,
    //           ],
    //         }
    //       : service
    //   )
    // );
  };

  const handleServiceDelete = (serviceId: string) => {
    setServices((prev) => prev.filter((service) => service.id !== serviceId));
  };

  const handleServiceConfigure = (serviceId: string) => {
    console.log("Configure service:", serviceId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              {runningCount} Running
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-500" />
              {stoppedCount} Stopped
            </span>
            {errorCount > 0 && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                {errorCount} Error
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Service
          </Button>
        </div>
      </div>

      {filteredServices.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              name={service.name}
              status={service.status}
              port={service.port}
              uptime={service.uptime}
              logs={service.logs}
              onToggle={() => handleServiceToggle(service.id)}
              onRestart={() => handleServiceRestart(service.id)}
              onDelete={() => handleServiceDelete(service.id)}
              onConfigure={() => handleServiceConfigure(service.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h3 className="text-lg font-medium">No services found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search"
                : "Get started by adding your first service"}
            </p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-1" />
              Add Service
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
