import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

export interface RemoteWordPressSite {
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

export interface WordPressPost {
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

export interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  status: "publish" | "draft" | "private";
  categories: number[];
  tags: number[];
}

export function useRemoteWordPress() {
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
      setSites(loadedSites);
      if (loadedSites.length > 0) {
        setSelectedSite((prev) => {
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
      setSites([]);
      setSelectedSite(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  // Fetch posts for the selected site
  const fetchPostsForSite = async (site: RemoteWordPressSite) => {
    setLoading(true);
    try {
      const url = `${site.url.replace(
        /\/$/,
        ""
      )}/wp-json/wp/v2/posts?per_page=20&_embed`;
      const auth = btoa(`${site.username}:${site.application_password}`);
      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const posts = await response.json();
      setPosts(posts);
    } catch (error) {
      setPosts([]);
      toast.error("Failed to fetch posts from WordPress site.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSite) {
      fetchPostsForSite(selectedSite);
    } else {
      setPosts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSite]);

  const handleAddSite = async (formData: any) => {
    setLoading(true);
    try {
      await invoke("save_site", { site: { ...formData, id: "" } });
      setShowAddSiteDialog(false);
      toast.success("Site added successfully!");
      await loadSites();
    } catch (error) {
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
      toast.error("Failed to delete site. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!selectedSite) return;
    setLoading(true);
    try {
      const url = `${selectedSite.url.replace(/\/$/, "")}/wp-json/wp/v2/posts`;
      const auth = btoa(
        `${selectedSite.username}:${selectedSite.application_password}`
      );
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: postFormData.title,
          content: postFormData.content,
          excerpt: postFormData.excerpt,
          status: postFormData.status,
          categories: postFormData.categories,
          tags: postFormData.tags,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.statusText}`);
      }
      toast.success("Post created!");
      setShowPostDialog(false);
      resetPostForm();
      await fetchPostsForSite(selectedSite);
    } catch (error) {
      toast.error("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async () => {
    if (!selectedSite || !editingPost) return;
    setLoading(true);
    try {
      const url = `${selectedSite.url.replace(/\/$/, "")}/wp-json/wp/v2/posts/${
        editingPost.id
      }`;
      const auth = btoa(
        `${selectedSite.username}:${selectedSite.application_password}`
      );
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: postFormData.title,
          content: postFormData.content,
          excerpt: postFormData.excerpt,
          status: postFormData.status,
          categories: postFormData.categories,
          tags: postFormData.tags,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update post: ${response.statusText}`);
      }
      toast.success("Post updated!");
      setShowPostDialog(false);
      setEditingPost(null);
      resetPostForm();
      await fetchPostsForSite(selectedSite);
    } catch (error) {
      toast.error("Failed to update post.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!selectedSite) return;
    setLoading(true);
    try {
      const url = `${selectedSite.url.replace(
        /\/$/,
        ""
      )}/wp-json/wp/v2/posts/${postId}?force=true`;
      const auth = btoa(
        `${selectedSite.username}:${selectedSite.application_password}`
      );
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.statusText}`);
      }
      toast.success("Post deleted!");
      await fetchPostsForSite(selectedSite);
    } catch (error) {
      toast.error("Failed to delete post.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post: WordPressPost) => {
    setEditingPost(post);
    setPostFormData({
      title: post.title.rendered,
      content: post.content.rendered.replace(/<[^>]*>/g, ""),
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

  return {
    sites,
    selectedSite,
    setSelectedSite,
    posts,
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
  };
}
