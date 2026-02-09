import axios from "axios";
import { Heart, MessageSquare, Plus, Search, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MobileNav from "../components/MobileNav";
import RichTextEditor from "@/components/RichTextEditor";

interface Comment {
  id: number;
  author: string;
  authorInitial: string;
  content: string;
  timestamp: Date | string;
}

interface Post {
  id: number;
  author: string;
  authorInitial: string;
  title: string;
  content: string;
  category: string;
  timestamp: Date | string;
  likes: number;
  comments: number;
  liked?: boolean;
  commentsList?: Comment[];
}

interface PageProps {
  initialPosts: Post[];
}

export default function MaternalForum({ initialPosts = [] }: PageProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [detailPostOpen, setDetailPostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "Kehamilan" });
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await axios.post("/forum/posts", newPost);
      
      setPosts([response.data.post, ...posts]);
      setNewPostOpen(false);
      setNewPost({ title: "", content: "", category: "Kehamilan" });
      toast.success("Diskusi berhasil dibuat!");
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast.error(error.response?.data?.message || "Gagal membuat diskusi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id: number) => {
    try {
      const response = await axios.post(`/forum/posts/${id}/like`);
      
      setPosts(posts.map(post => 
        post.id === id
          ? { ...post, liked: response.data.liked, likes: response.data.likes_count }
          : post
      ));

      if (selectedPost && selectedPost.id === id) {
        setSelectedPost({
          ...selectedPost,
          liked: response.data.liked,
          likes: response.data.likes_count
        });
      }
    } catch (error: any) {
      console.error("Error liking post:", error);
      toast.error("Gagal menyukai postingan");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(`/forum/posts/${selectedPost.id}/comment`, {
        content: newComment
      });

      const updatedPost = {
        ...selectedPost,
        commentsList: [response.data.comment, ...(selectedPost.commentsList || [])],
        comments: response.data.comments_count
      };
      setSelectedPost(updatedPost);

      setPosts(posts.map(post => 
        post.id === selectedPost.id
          ? { ...post, comments: response.data.comments_count }
          : post
      ));

      setNewComment("");
      toast.success("Komentar berhasil ditambahkan!");
    } catch (error: any) {
      console.error("Error adding comment:", error);
      toast.error("Gagal menambahkan komentar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPostDetail = async (post: Post) => {
    try {
      const response = await axios.get(`/forum/posts/${post.id}`);
      setSelectedPost(response.data);
      setDetailPostOpen(true);
    } catch (error) {
      console.error("Error fetching post details:", error);
      toast.error("Gagal memuat detail postingan");
    }
  };

  const categories = ["Semua", "Kehamilan", "Janin", "Nutrisi", "Rekomendasi", "Curhat"];

  const filteredPosts = posts.filter(post => 
    (searchQuery === "" || post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     post.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
       <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 pb-8 rounded-b-3xl relative shadow-md">
        <h1 className="text-xl font-bold mb-1">Forum Bunda</h1>
        <p className="text-pink-100 text-sm mb-4">Berbagi pengalaman dengan sesama ibu</p>
        
        <div className="absolute -bottom-6 left-4 right-4 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-9 h-12 rounded-xl bg-white border-none text-black" 
              placeholder="Cari topik diskusi..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 px-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 noscrollbar">
           {categories.map((cat) => (
             <Badge key={cat} variant="outline" className="bg-white hover:bg-pink-50 cursor-pointer border-slate-200 px-3 py-1.5 whitespace-nowrap">
               {cat}
             </Badge>
           ))}
        </div>

        <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
            <DialogTrigger asChild>
                <Button className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-xl bg-pink-600 hover:bg-pink-700 z-10 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Buat Diskusi Baru</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Judul</Label>
                        <Input 
                            placeholder="Contoh: Cara mengatasi sakit punggung" 
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Kategori</Label>
                        <select 
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={newPost.category}
                            onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                        >
                            {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Isi Diskusi</Label>
                        <RichTextEditor 
                            placeholder="Ceritakan pengalaman atau pertanyaan Bunda disini..." 
                            className="min-h-[200px]"
                            value={newPost.content}
                            onChange={(content) => setNewPost({ ...newPost, content: content })}
                        />
                    </div>
                    <Button 
                      onClick={handleCreatePost} 
                      className="w-full bg-pink-600"
                      disabled={isSubmitting || !newPost.title || !newPost.content}
                    >
                      {isSubmitting ? "Memposting..." : "Posting"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        <Dialog open={detailPostOpen} onOpenChange={setDetailPostOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                {selectedPost && (
                    <div className="space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-lg">{selectedPost.title}</DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-pink-100 text-pink-600 text-xs">
                                        {selectedPost.authorInitial}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold">{selectedPost.author}</p>
                                    <p className="text-xs text-slate-400">
                                        {new Date(selectedPost.timestamp).toLocaleDateString()} • {selectedPost.category}
                                    </p>
                                </div>
                            </div>
                            
                            <div 
                                className="text-sm text-slate-700 prose prose-sm max-w-none [&_p]:mb-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-4 [&_ol]:pl-4"
                                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                            />

                            <div className="flex items-center gap-4 pt-2 border-t">
                                <button 
                                    onClick={() => handleLike(selectedPost.id)}
                                    className={`flex items-center gap-1.5 text-sm font-medium ${selectedPost.liked ? 'text-pink-600' : 'text-slate-500'}`}
                                >
                                    <Heart className={`w-5 h-5 ${selectedPost.liked ? 'fill-pink-600' : ''}`} />
                                    {selectedPost.likes}
                                </button>
                                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                                    <MessageSquare className="w-5 h-5" />
                                    {selectedPost.comments}
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-4">
                            <h3 className="font-semibold text-slate-800">Komentar ({selectedPost.comments})</h3>
                            
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="Tulis komentar..." 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                    disabled={isSubmitting}
                                />
                                <Button 
                                    size="icon"
                                    onClick={handleAddComment}
                                    className="bg-pink-600 hover:bg-pink-700"
                                    disabled={isSubmitting || !newComment.trim()}
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                {selectedPost.commentsList && selectedPost.commentsList.length > 0 ? (
                                    selectedPost.commentsList.map((comment) => (
                                        <div key={comment.id} className="flex gap-2 p-3 bg-slate-50 rounded-lg">
                                            <Avatar className="h-7 w-7 mt-0.5">
                                                <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                                                    {comment.authorInitial}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-semibold text-slate-800">{comment.author}</p>
                                                    <p className="text-xs text-slate-400">
                                                        {new Date(comment.timestamp).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-slate-600">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-sm text-slate-400 py-4">Belum ada komentar</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card 
              key={post.id} 
              className="p-4 border-none shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => openPostDetail(post)}
            >
                <div className="flex items-start justify-between">
                    <div className="flex gap-2 items-center">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-pink-100 text-pink-600 text-xs">
                                {post.authorInitial}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">{post.author}</p>
                            <p className="text-[10px] text-slate-400">
                                {new Date(post.timestamp).toLocaleDateString()} • {post.category}
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-slate-800 text-base mb-1">{post.title}</h3>
                    <div 
                        className="text-sm text-slate-600 leading-relaxed line-clamp-3 prose prose-pink prose-sm max-w-none [&_p]:mb-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-4 [&_ol]:pl-4"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>

                <div className="flex items-center gap-4 border-t pt-3 mt-1">
                    <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post.id);
                        }}
                        className={`flex items-center gap-1.5 text-xs font-medium ${post.liked ? 'text-pink-600' : 'text-slate-500'}`}
                    >
                        <Heart className={`w-4 h-4 ${post.liked ? 'fill-pink-600' : ''}`} />
                        {post.likes}
                    </button>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments}
                    </div>
                </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-400">Belum ada postingan</p>
          </div>
        )}
      </div>
      
      <MobileNav />
    </div>
  );
}
