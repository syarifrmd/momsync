import { Heart, MessageSquare, Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePage } from "@inertiajs/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MobileNav from "../components/MobileNav";
import RichTextEditor from "@/components/RichTextEditor";

interface Post {
  id: number;
  author: string;
  authorInitial: string;
  title: string;
  content: string;
  category: string;
  timestamp: Date;
  likes: number;
  comments: number;
  liked?: boolean;
}

export default function MaternalForum() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Sarah Amelia",
      authorInitial: "SA",
      title: "Tips mengatasi morning sickness yang ampuh",
      content: "Hai moms! Mau share pengalaman aku mengatasi mual di trimester 1. Aku makan crackers sebelum bangun tidur dan minum air jahe hangat. Alhamdulillah membantu banget! Ada yang punya tips lain?",
      category: "Kehamilan",
      timestamp: new Date(2026, 0, 17, 10, 30),
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      author: "Linda Kusuma",
      authorInitial: "LK",
      title: "Rekomendasi bidan yang bagus di Jakarta Selatan",
      content: "Moms ada yang punya rekomendasi bidan praktek mandiri yang bagus di area Jaksel? Prefer yang ramah dan sabar, karena ini kehamilan pertama aku. Terima kasih!",
      category: "Rekomendasi",
      timestamp: new Date(2026, 0, 17, 9, 15),
      likes: 15,
      comments: 12
    },
    {
      id: 3,
      author: "Bunda Azka",
      authorInitial: "BA",
      title: "Perkembangan janin 20 minggu",
      content: "Hari ini habis USG 4D dan seneng banget liat dedek bayi udah aktif nendang-nendang. Dokter bilang beratnya normal. Moms yg lain di 20 weeks sharing dong BBJ nya brp?",
      category: "Janin",
      timestamp: new Date(2026, 0, 16, 15, 45),
      likes: 32,
      comments: 20
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "Umum" });

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) return;
    
    // Simulate current user
    const { auth } = usePage<any>().props;
    const authorName = auth.user ? auth.user.name : "Pengguna";
    const authorInitials = authorName.split(' ').map((n:any) => n[0]).join('').substring(0, 2).toUpperCase();

    setPosts([
      {
        id: Date.now(),
        author: authorName,
        authorInitial: authorInitials,
        ...newPost,
        timestamp: new Date(),
        likes: 0,
        comments: 0
      },
      ...posts
    ]);
    setNewPostOpen(false);
    setNewPost({ title: "", content: "", category: "Umum" });
    toast.success("Diskusi berhasil dibuat!");
  };

  const handleLike = (id: number) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
  };

  const categories = ["Semua", "Kehamilan", "Janin", "Nutrisi", "Rekomendasi", "Curhat"];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
       {/* Header */}
       <div className="bg-linear-to-r from-pink-500 to-purple-600 text-white p-4 pb-8 rounded-b-3xl relative shadow-md">
        <h1 className="text-xl font-bold mb-1">Forum Bunda</h1>
        <p className="text-pink-100 text-sm mb-4">Berbagi pengalaman dengan sesama ibu</p>
        
        {/* Search Bar */}
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
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 noscrollbar">
           {categories.map((cat) => (
             <Badge key={cat} variant="outline" className="bg-white hover:bg-pink-50 cursor-pointer border-slate-200 px-3 py-1.5 whitespace-nowrap">
               {cat}
             </Badge>
           ))}
        </div>

        {/* FAB for New Post */}
        <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
            <DialogTrigger asChild>
                <Button className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-xl bg-pink-600 hover:bg-pink-700 z-10 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md top-[20%] translate-y-0">
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
                    <Button onClick={handleCreatePost} className="w-full bg-pink-600">Posting</Button>
                </div>
            </DialogContent>
        </Dialog>

        {/* Posts List */}
        {posts.map((post) => (
            <Card key={post.id} className="p-4 border-none shadow-sm space-y-3">
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
                                {post.timestamp.toLocaleDateString([], { day: 'numeric', month: 'short' })} • {post.category}
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
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-medium ${post.liked ? 'text-pink-600' : 'text-slate-500'}`}
                    >
                        <Heart className={`w-4 h-4 ${post.liked ? 'fill-pink-600' : ''}`} />
                        {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments}
                    </button>
                </div>
            </Card>
        ))}
      </div>
      
      <MobileNav />
    </div>
  );
}
