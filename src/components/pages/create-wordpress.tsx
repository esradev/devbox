"use client";

import type React from "react";
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
import { ArrowLeft, Globe, Save, X } from "lucide-react";

interface CreateWordPressPageProps {
  onCreateProject: (project: any) => void;
  onCancel: () => void;
}

export function CreateWordPressPage({
  onCreateProject,
  onCancel,
}: CreateWordPressPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    wordpressVersion: "6.4",
    phpVersion: "8.2",
    database: "MySQL 8.0",
    adminUser: "admin",
    adminEmail: "",
    adminPassword: "",
    sslEnabled: false,
    installSampleData: false,
    multisite: false,
    debugMode: false,
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    // Simulate creation process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newProject = {
      id: `wp-${Date.now()}`,
      name: formData.name,
      domain:
        formData.domain ||
        `${formData.name.toLowerCase().replace(/\s+/g, "-")}.local`,
      status: "stopped" as const,
      wordpressVersion: formData.wordpressVersion,
      phpVersion: formData.phpVersion,
      database: formData.database,
      sslEnabled: formData.sslEnabled,
      lastAccessed: "Never",
      plugins: formData.installSampleData ? 3 : 0,
      themes: formData.installSampleData ? 3 : 1,
      adminUser: formData.adminUser,
      adminEmail: formData.adminEmail,
      multisite: formData.multisite,
      debugMode: formData.debugMode,
    };

    onCreateProject(newProject);
    setIsCreating(false);
  };

  const generateDomain = (name: string) => {
    return (
      name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") + ".local"
    );
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      domain: prev.domain === "" ? generateDomain(value) : prev.domain,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to WordPress
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Create New WordPress Site
          </h2>
          <p className="text-muted-foreground">
            Set up a new local WordPress development environment
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Site Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="My WordPress Site"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Local Domain *</Label>
                <Input
                  id="domain"
                  value={formData.domain}
                  onChange={(e) =>
                    setFormData({ ...formData, domain: e.target.value })
                  }
                  placeholder="mysite.local"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will be your local development URL (e.g.,
                  http://mysite.local)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Technical Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>WordPress Version</Label>
                  <Select
                    value={formData.wordpressVersion}
                    onValueChange={(value) =>
                      setFormData({ ...formData, wordpressVersion: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6.4">6.4 (Latest)</SelectItem>
                      <SelectItem value="6.3">6.3</SelectItem>
                      <SelectItem value="6.2">6.2</SelectItem>
                      <SelectItem value="6.1">6.1</SelectItem>
                      <SelectItem value="6.0">6.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              </div>
              <div className="space-y-2">
                <Label>Database</Label>
                <Select
                  value={formData.database}
                  onValueChange={(value) =>
                    setFormData({ ...formData, database: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MySQL 8.0">
                      MySQL 8.0 (Recommended)
                    </SelectItem>
                    <SelectItem value="MySQL 5.7">MySQL 5.7</SelectItem>
                    <SelectItem value="MariaDB 10.6">MariaDB 10.6</SelectItem>
                    <SelectItem value="MariaDB 10.5">MariaDB 10.5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Admin Account */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminUser">Admin Username *</Label>
                <Input
                  id="adminUser"
                  value={formData.adminUser}
                  onChange={(e) =>
                    setFormData({ ...formData, adminUser: e.target.value })
                  }
                  placeholder="admin"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email *</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, adminEmail: e.target.value })
                  }
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Admin Password</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={formData.adminPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, adminPassword: e.target.value })
                  }
                  placeholder="Leave empty for auto-generated"
                />
                <p className="text-xs text-muted-foreground">
                  If empty, a secure password will be generated automatically
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Options */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable SSL</Label>
                  <p className="text-sm text-muted-foreground">
                    Generate self-signed certificate for HTTPS
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
                  <Label>Install Sample Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Include demo content, themes, and plugins
                  </p>
                </div>
                <Switch
                  checked={formData.installSampleData}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, installSampleData: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Multisite</Label>
                  <p className="text-sm text-muted-foreground">
                    Set up WordPress multisite network
                  </p>
                </div>
                <Switch
                  checked={formData.multisite}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, multisite: checked })
                  }
                />
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
            </CardContent>
          </Card>
        </div>

        {/* Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Site Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium">Site URL</p>
                <p className="text-sm text-muted-foreground">
                  {formData.sslEnabled ? "https" : "http"}://
                  {formData.domain || "yoursite.local"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Admin URL</p>
                <p className="text-sm text-muted-foreground">
                  {formData.sslEnabled ? "https" : "http"}://
                  {formData.domain || "yoursite.local"}/wp-admin
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Environment</p>
                <p className="text-sm text-muted-foreground">
                  WordPress {formData.wordpressVersion} + PHP{" "}
                  {formData.phpVersion}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isCreating}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {isCreating ? "Creating Site..." : "Create WordPress Site"}
          </Button>
        </div>
      </form>
    </div>
  );
}
