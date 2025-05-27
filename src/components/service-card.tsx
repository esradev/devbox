import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, Trash2, Settings } from "lucide-react";

interface ServiceCardProps {
  name: string;
  status: "running" | "stopped" | "error";
  port?: number;
  uptime?: string;
  logs: string[];
  onToggle: () => void;
  onRestart: () => void;
  onDelete: () => void;
  onConfigure: () => void;
}

export function ServiceCard({
  name,
  status,
  port,
  uptime,
  logs,
  onToggle,
  onRestart,
  onDelete,
  onConfigure,
}: ServiceCardProps) {
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
          <CardTitle className="text-lg font-semibold truncate">
            {name}
          </CardTitle>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
            <Badge variant={getStatusVariant(status)} className="capitalize">
              {status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex gap-4 min-w-0">
            {port && <span className="truncate">Port: {port}</span>}
            {uptime && status === "running" && (
              <span className="truncate">Uptime: {uptime}</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs">
              {status === "running" ? "Running" : "Stopped"}
            </span>
            <Switch
              checked={status === "running"}
              onCheckedChange={onToggle}
              disabled={status === "error"}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRestart}
            disabled={status === "stopped"}
            className="flex-1 min-w-0"
          >
            <RotateCcw className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">Restart</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onConfigure}
            className="flex-1 min-w-0"
          >
            <Settings className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">Configure</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="flex-1 min-w-0"
          >
            <Trash2 className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">Remove</span>
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Logs</h4>
          <ScrollArea className="h-32 w-full rounded border bg-muted/50 p-2">
            <div className="space-y-1">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className="text-xs font-mono text-muted-foreground break-all"
                  >
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground">
                  No logs available
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
