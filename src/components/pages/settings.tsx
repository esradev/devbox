"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "../mode-toggle";
import { SettingsIcon, Save, RefreshCw } from "lucide-react";

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Configure your DevBox environment
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred theme
                </p>
              </div>
              <ModeToggle />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-start services</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically start services on DevBox launch
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about service status changes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Docker Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="docker-host">Docker Host</Label>
              <Input
                id="docker-host"
                placeholder="unix:///var/run/docker.sock"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-network">Default Network</Label>
              <Input id="default-network" placeholder="devbox-network" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Docker BuildKit</Label>
                <p className="text-sm text-muted-foreground">
                  Use BuildKit for improved build performance
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-memory">Max Memory per Service (MB)</Label>
              <Input id="max-memory" type="number" placeholder="1024" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-cpu">Max CPU per Service (%)</Label>
              <Input id="max-cpu" type="number" placeholder="50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="log-retention">Log Retention (days)</Label>
              <Input id="log-retention" type="number" placeholder="7" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}
