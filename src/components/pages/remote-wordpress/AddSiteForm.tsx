import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function AddSiteForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: any) => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    username: "",
    application_password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Site Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="My WordPress Site"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">Site URL</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Admin Username</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          placeholder="admin"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Application Password</Label>
        <Input
          id="password"
          value={formData.application_password}
          onChange={(e) =>
            setFormData({ ...formData, application_password: e.target.value })
          }
          placeholder="xxxx xxxx xxxx xxxx"
          required
        />
        <p className="text-xs text-muted-foreground">
          Generate an application password in WordPress Admin → Users → Profile
        </p>
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {loading ? "Connecting..." : "Connect Site"}
        </Button>
      </div>
    </form>
  );
}
