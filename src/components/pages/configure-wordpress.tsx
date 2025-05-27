"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Globe,
  Database,
  Shield,
  Code,
  Trash2,
} from "lucide-react";

interface ConfigureWordPressPageProps {
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
    adminUser: string;
    adminEmail: string;
  };
  onSave: (projectId: string, updates: any) => void;
  onCancel: () => void;
  onDelete: (projectId: string) => void;
}

export function ConfigureWordPressPage({
  project,
  onSave,
  onCancel,
  onDelete,
}: ConfigureWordPressPageProps) {
  const [formData, setFormData] = useState({
    name: project.name,
    domain: project.domain,
    phpVersion: project.phpVersion,
    sslEnabled: project.sslEnabled,
    adminUser: project.adminUser,
    adminEmail: project.adminEmail,
    debugMode: false,
    cacheEnabled: true,
    autoUpdates: true,
    backupEnabled: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save process
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSave(project.id, formData);
    setIsSaving(false);
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete "${project.name}"? This action cannot be undone.`
      )
    ) {
      onDelete(project.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to WordPress
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Configure WordPress Site
            </h2>
            <p className="text-muted-foreground">
              Manage settings for {project.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={project.status === "running" ? "default" : "secondary"}
          >
            {project.status}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Site Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Site Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Local Domain</Label>
                  <Input
                    id="domain"
                    value={formData.domain}
                    onChange={(e) =>
                      setFormData({ ...formData, domain: e.target.value })
                    }
                  />
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="adminUser">Admin Username</Label>
                  <Input
                    id="adminUser"
                    value={formData.adminUser}
                    onChange={(e) =>
                      setFormData({ ...formData, adminUser: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, adminEmail: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Site Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{project.plugins}</p>
                  <p className="text-sm text-muted-foreground">Plugins</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{project.themes}</p>
                  <p className="text-sm text-muted-foreground">Themes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {project.wordpressVersion}
                  </p>
                  <p className="text-sm text-muted-foreground">WordPress</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{project.database}</p>
                  <p className="text-sm text-muted-foreground">Database</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Runtime Environment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>PHP Version</Label>
                <Select
                  value={formData.phpVersion}
                  onValueChange={(value) =>
                    setFormData({ ...formData, phpVersion: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8.3">8.3</SelectItem>
                    <SelectItem value="8.2">8.2 (Recommended)</SelectItem>
                    <SelectItem value="8.1">8.1</SelectItem>
                    <SelectItem value="8.0">8.0</SelectItem>
                    <SelectItem value="7.4">7.4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable WP_DEBUG for development
                  </p>
                </div>
                <Switch
                  checked={formData.debugMode}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, debugMode: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cache Enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable object caching for better performance
                  </p>
                </div>
                <Switch
                  checked={formData.cacheEnabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, cacheEnabled: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SSL Enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Use HTTPS with self-signed certificate
                  </p>
                </div>
                <Switch
                  checked={formData.sslEnabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, sslEnabled: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically update WordPress core
                  </p>
                </div>
                <Switch
                  checked={formData.autoUpdates}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, autoUpdates: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Backup Enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatic daily backups
                  </p>
                </div>
                <Switch
                  checked={formData.backupEnabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, backupEnabled: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Export Database
                </Button>
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Import Database
                </Button>
              </div>
              <Button variant="outline" className="w-full">
                Open phpMyAdmin
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Permanently delete this WordPress site and all its data. This
                  action cannot be undone.
                </p>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete WordPress Site
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
