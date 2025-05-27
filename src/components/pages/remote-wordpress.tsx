import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Globe,
  Plus,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  ExternalLink,
  FileText,
  Calendar,
  User,
  Tag,
  Search,
} from "lucide-react";

import { useRemoteWordPress } from "./remote-wordpress/useRemoteWordPress";
import { getStatusColor, getPostStatusColor } from "./remote-wordpress/utils";
import { AddSiteForm } from "./remote-wordpress/AddSiteForm";
import { PostForm } from "./remote-wordpress/PostForm";
import { SiteSettings } from "./remote-wordpress/SiteSettings";

export function RemoteWordPress() {
  const {
    sites,
    selectedSite,
    setSelectedSite,
    loading,
    searchQuery,
    setSearchQuery,
    showAddSiteDialog,
    setShowAddSiteDialog,
    showPostDialog,
    setShowPostDialog,
    editingPost,
    setEditingPost,
    postFormData,
    setPostFormData,
    filteredPosts,
    handleAddSite,
    handleDeleteSite,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    handleEditPost,
    resetPostForm,
  } = useRemoteWordPress();

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
