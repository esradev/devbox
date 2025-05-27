import { invoke } from "@tauri-apps/api/core";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import {
  Globe,
  Plus,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  Settings,
  ExternalLink,
  FileText,
  Calendar,
  User,
  Tag,
  Search,
  Loader2,
} from "lucide-react";

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

interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  status: string;
  date: string;
  modified: string;
  author: number;
  categories: number[];
  tags: number[];
  slug: string;
  link: string;
}

interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  status: "publish" | "draft" | "private";
  categories: number[];
  tags: number[];
}

export function RemoteWordPress() {
  const [sites, setSites] = useState<RemoteWordPressSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<RemoteWordPressSite | null>(
    null
  );
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddSiteDialog, setShowAddSiteDialog] = useState(false);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<WordPressPost | null>(null);
  const [postFormData, setPostFormData] = useState<PostFormData>({
    title: "",
    content: "",
    excerpt: "",
    status: "draft",
    categories: [],
    tags: [],
  });

  // Load sites from backend
  const loadSites = async () => {
    setLoading(true);
    try {
      const loadedSites = await invoke<RemoteWordPressSite[]>("load_sites");
      console.log("Loaded sites:", loadedSites);
      setSites(loadedSites);
      if (loadedSites.length > 0) {
        setSelectedSite((prev) => {
          // Try to keep the same selected site if possible
          if (prev) {
            const found = loadedSites.find((s) => s.id === prev.id);
            return found || loadedSites[0];
          }
          return loadedSites[0];
        });
      } else {
        setSelectedSite(null);
      }
    } catch (error) {
      console.error("Failed to load sites:", error);
      setSites([]);
      setSelectedSite(null);
    } finally {
      setLoading(false);
    }
  };

  // Load sites on mount
  useEffect(() => {
    loadSites();
  }, []);

  // Mock posts data (keep as is for now)
  useEffect(() => {
    if (selectedSite) {
      const mockPosts: WordPressPost[] = [
        {
          id: 1,
          title: { rendered: "Getting Started with WordPress REST API" },
          content: {
            rendered:
              "<p>This is a comprehensive guide to using the WordPress REST API...</p>",
          },
          excerpt: {
            rendered:
              "<p>Learn how to use the WordPress REST API effectively...</p>",
          },
          status: "publish",
          date: "2024-01-15T10:30:00",
          modified: "2024-01-15T11:00:00",
          author: 1,
          categories: [1, 3],
          tags: [5, 8, 12],
          slug: "getting-started-wordpress-rest-api",
          link: "https://myblog.com/getting-started-wordpress-rest-api",
        },
        {
          id: 2,
          title: { rendered: "Advanced WordPress Development Tips" },
          content: {
            rendered:
              "<p>Here are some advanced tips for WordPress development...</p>",
          },
          excerpt: {
            rendered:
              "<p>Discover advanced techniques for WordPress development...</p>",
          },
          status: "draft",
          date: "2024-01-14T15:20:00",
          modified: "2024-01-14T16:45:00",
          author: 1,
          categories: [2],
          tags: [3, 7, 9],
          slug: "advanced-wordpress-development-tips",
          link: "https://myblog.com/advanced-wordpress-development-tips",
        },
      ];
      setPosts(mockPosts);
    }
  }, [selectedSite]);

  const handleAddSite = async (formData: any) => {
    setLoading(true);
    try {
      // Always send id: ""
      await invoke("save_site", { site: { ...formData, id: "" } });
      setShowAddSiteDialog(false);
      toast.success("Site added successfully!");
      await loadSites();
    } catch (error) {
      console.error("Failed to save site:", error);
      toast.error("Failed to save site. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSite = async (siteId: string) => {
    setLoading(true);
    try {
      await invoke("delete_site", { siteId });
      await loadSites();
    } catch (error) {
      console.error("Failed to delete site:", error);
      toast.error("Failed to delete site. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!selectedSite) return;

    setLoading(true);
    try {
      // Simulate API call to create post
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newPost: WordPressPost = {
        id: Date.now(),
        title: { rendered: postFormData.title },
        content: { rendered: `<p>${postFormData.content}</p>` },
        excerpt: { rendered: `<p>${postFormData.excerpt}</p>` },
        status: postFormData.status,
        date: new Date().toISOString(),
        modified: new Date().toISOString(),
        author: 1,
        categories: postFormData.categories,
        tags: postFormData.tags,
        slug: postFormData.title.toLowerCase().replace(/\s+/g, "-"),
        link: `${selectedSite.url}/${postFormData.title
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      };

      setPosts((prev) => [newPost, ...prev]);
      setShowPostDialog(false);
      resetPostForm();
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async () => {
    if (!selectedSite || !editingPost) return;

    setLoading(true);
    try {
      // Simulate API call to update post
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updatedPost: WordPressPost = {
        ...editingPost,
        title: { rendered: postFormData.title },
        content: { rendered: `<p>${postFormData.content}</p>` },
        excerpt: { rendered: `<p>${postFormData.excerpt}</p>` },
        status: postFormData.status,
        modified: new Date().toISOString(),
        categories: postFormData.categories,
        tags: postFormData.tags,
      };

      setPosts((prev) =>
        prev.map((post) => (post.id === editingPost.id ? updatedPost : post))
      );
      setShowPostDialog(false);
      setEditingPost(null);
      resetPostForm();
    } catch (error) {
      console.error("Failed to update post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!selectedSite) return;

    setLoading(true);
    try {
      // Simulate API call to delete post
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post: WordPressPost) => {
    setEditingPost(post);
    setPostFormData({
      title: post.title.rendered,
      content: post.content.rendered.replace(/<[^>]*>/g, ""), // Strip HTML for editing
      excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, ""),
      status: post.status as "publish" | "draft" | "private",
      categories: post.categories,
      tags: post.tags,
    });
    setShowPostDialog(true);
  };

  const resetPostForm = () => {
    setPostFormData({
      title: "",
      content: "",
      excerpt: "",
      status: "draft",
      categories: [],
      tags: [],
    });
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.rendered.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.rendered.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "disconnected":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      case "error":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getPostStatusColor = (status: string) => {
    switch (status) {
      case "publish":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "draft":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "private":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Remote WordPress Sites
          </h2>
          <p className="text-muted-foreground">
            Manage posts on remote WordPress sites via REST API
          </p>
        </div>
        <Dialog open={showAddSiteDialog} onOpenChange={setShowAddSiteDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Remote Site
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Remote WordPress Site</DialogTitle>
            </DialogHeader>
            <AddSiteForm onSubmit={handleAddSite} loading={loading} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sites Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Connected Sites</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedSite?.id === site.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedSite(site)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium truncate">{site.name}</h4>
                    <Badge className={getStatusColor(site.status)}>
                      {site.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {site.url}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{site.postsCount} posts</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSite(site.id);
                      }}
                      className="h-6 w-6 p-0 hover:bg-red-500/10 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedSite ? (
            <Tabs defaultValue="posts" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="posts">Posts</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync
                  </Button>
                  <Dialog
                    open={showPostDialog}
                    onOpenChange={setShowPostDialog}
                  >
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setEditingPost(null);
                          resetPostForm();
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>
                          {editingPost ? "Edit Post" : "Create New Post"}
                        </DialogTitle>
                      </DialogHeader>
                      <PostForm
                        formData={postFormData}
                        setFormData={setPostFormData}
                        onSubmit={
                          editingPost ? handleUpdatePost : handleCreatePost
                        }
                        loading={loading}
                        isEditing={!!editingPost}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <TabsContent value="posts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Posts from {selectedSite.name}
                      </CardTitle>
                      <Badge variant="outline">
                        {filteredPosts.length} posts
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredPosts.map((post) => (
                        <div
                          key={post.id}
                          className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold truncate">
                                  {post.title.rendered}
                                </h3>
                                <Badge
                                  className={getPostStatusColor(post.status)}
                                >
                                  {post.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {post.excerpt.rendered.replace(/<[^>]*>/g, "")}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(post.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  Author {post.author}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {post.categories.length} categories
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(post.link, "_blank")}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(post.link, "_blank")}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditPost(post)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePost(post.id)}
                                className="hover:bg-red-500/10 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <SiteSettings site={selectedSite} />
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No site selected</h3>
                <p className="text-muted-foreground">
                  Select a site from the sidebar to manage posts
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function AddSiteForm({
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

function PostForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  isEditing,
}: {
  formData: PostFormData;
  setFormData: (data: PostFormData) => void;
  onSubmit: () => void;
  loading: boolean;
  isEditing: boolean;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <ScrollArea className="max-h-[60vh]">
      <form onSubmit={handleSubmit} className="space-y-4 pr-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Post title"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Write your post content here..."
            rows={8}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
            placeholder="Brief description of the post..."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: "publish" | "draft" | "private") =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="publish">Published</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {loading
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update Post"
              : "Create Post"}
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
}

function SiteSettings({ site }: { site: RemoteWordPressSite }) {
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

function getStatusColor(status: string) {
  switch (status) {
    case "connected":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "disconnected":
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    case "error":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
  }
}
