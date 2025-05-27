import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, Trash2 } from "lucide-react";
import { getStatusColor } from "./utils";

interface RemoteWordPressSite {
  id: string;
  name: string;
  url: string;
  username: string;
  application_password: string;
  status: "connected" | "disconnected" | "error";
  lastSync: string;
  postsCount: number;
  version?: string;
}

export function SiteSettings({ site }: { site: RemoteWordPressSite }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Site Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-sm font-medium">Site Name</Label>
            <p className="text-sm text-muted-foreground">{site.name}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">URL</Label>
            <p className="text-sm text-muted-foreground">{site.url}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Username</Label>
            <p className="text-sm text-muted-foreground">{site.username}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">WordPress Version</Label>
            <p className="text-sm text-muted-foreground">{site.version}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Status</Label>
            <Badge className={getStatusColor(site.status)}>{site.status}</Badge>
          </div>
          <div>
            <Label className="text-sm font-medium">Last Sync</Label>
            <p className="text-sm text-muted-foreground">{site.lastSync}</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Update Credentials
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Site
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
