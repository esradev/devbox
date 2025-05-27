import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Download, RefreshCw } from "lucide-react";
import { useState } from "react";

const mockLogs = [
  {
    id: 1,
    timestamp: "2024-01-15 14:30:15",
    service: "MySQL",
    level: "INFO",
    message: "Connection established from 127.0.0.1:54321",
  },
  {
    id: 2,
    timestamp: "2024-01-15 14:29:45",
    service: "Redis",
    level: "INFO",
    message: "Background saving started by user request",
  },
  {
    id: 3,
    timestamp: "2024-01-15 14:29:12",
    service: "Nginx",
    level: "ERROR",
    message: "bind() to 0.0.0.0:80 failed (98: Address already in use)",
  },
  {
    id: 4,
    timestamp: "2024-01-15 14:28:33",
    service: "Node.js",
    level: "WARN",
    message: "Deprecated API usage detected in application",
  },
  {
    id: 5,
    timestamp: "2024-01-15 14:27:55",
    service: "MySQL",
    level: "INFO",
    message: "Query executed successfully in 0.023s",
  },
];

export function Logs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !selectedLevel || log.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return "destructive";
      case "WARN":
        return "secondary";
      case "INFO":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Logs</h2>
          <p className="text-muted-foreground">
            View and search application logs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Logs
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <div className="flex gap-1">
                {["INFO", "WARN", "ERROR"].map((level) => (
                  <Button
                    key={level}
                    variant={selectedLevel === level ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setSelectedLevel(selectedLevel === level ? null : level)
                    }
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full rounded border">
            <div className="p-4 space-y-2">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-2 rounded hover:bg-muted/50"
                >
                  <Badge
                    variant={getLevelColor(log.level)}
                    className="mt-0.5 text-xs"
                  >
                    {log.level}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-mono text-muted-foreground">
                        {log.timestamp}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {log.service}
                      </Badge>
                    </div>
                    <p className="text-sm mt-1 break-all">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
