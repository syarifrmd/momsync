import { Link, useForm, usePage } from "@inertiajs/react";
import { Activity, BookOpen, Heart, LogOut, MessageCircle, User } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import MobileNav from "../../components/MobileNav";
import { logout } from "@/routes";

interface LikedPost {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  timestamp: string;
  likes: number;
  comments: number;
}

interface HealthProfile {
  dob: string;
  height_cm: number;
  weight_kg_before: number;
  weight_kg_current: number;
  stage: string;
  stage_start_date: string;
  systolic?: number;
  diastolic?: number;
  risk_level?: string;
}

export default function HealthProfile() {
  const { profile } = usePage<{ profile: HealthProfile | null }>().props;
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);
  const [loadingLiked, setLoadingLiked] = useState(false);

  // Form for physical data
  const physicalForm = useForm({
    dob: profile?.dob || "",
    height_cm: profile?.height_cm?.toString() || "",
    weight_kg_before: profile?.weight_kg_before?.toString() || "",
    weight_kg_current: profile?.weight_kg_current?.toString() || "",
  });

  // Form for condition data
  const conditionForm = useForm({
    stage: profile?.stage || "pregnancy",
    stage_start_date: profile?.stage_start_date || "",
    systolic: profile?.systolic?.toString() || "",
    diastolic: profile?.diastolic?.toString() || "",
  });

  useEffect(() => {
    fetchLikedPosts();
  }, []);

  const fetchLikedPosts = async () => {
    setLoadingLiked(true);
    try {
      const response = await axios.get('/forum/my-liked');
      setLikedPosts(response.data);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
    } finally {
      setLoadingLiked(false);
    }
  };

  const handlePhysicalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    physicalForm.post('/profile/update-physical', {
      preserveScroll: true,
      onSuccess: () => toast.success("Data fisik berhasil disimpan!"),
      onError: () => toast.error("Periksa kembali inputan Anda."),
    });
  };

  const handleConditionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    conditionForm.post('/profile/update-condition', {
      preserveScroll: true,
      onSuccess: () => toast.success("Data kondisi berhasil disimpan!"),
      onError: () => toast.error("Periksa kembali inputan Anda."),
    });
  };

  return (
    <div className="h-full overflow-y-auto pb-24 bg-slate-50"> 
      {/* Header */}
      <div className="bg-linear-to-r from-pink-500 to-purple-600 p-6 pb-12 text-white shadow-lg rounded-b-[40px]">
        <div className="flex items-center gap-4">
           <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
             <User className="w-8 h-8 text-white" />
           </div>
           <div>
             <h1 className="text-2xl font-bold">Profil & Kesehatan</h1>
             <p className="text-pink-100">Kelola data kesehatan dan pengaturan akun</p>
           </div>
        </div>
      </div>

      <div className="p-4 -mt-8 space-y-4">
        {/* Panduan & Settings Shortcut */}
        <Card className="p-4 border-none shadow-lg flex items-center justify-between">
           <div className="flex items-center gap-3">
               <div className="bg-purple-100 p-2 rounded-lg">
                   <BookOpen className="w-6 h-6 text-purple-600" />
               </div>
               <div>
                   <h3 className="font-bold text-slate-800">Panduan Aplikasi</h3>
                   <p className="text-xs text-slate-500">Tutorial & Bantuan</p>
               </div>
           </div>
           <Button 
            variant="ghost" 
            size="sm" 
            className="text-purple-600"
            onClick={() => window.open('https://drive.google.com/file/d/1nCLPIssCdAZZ4DMGc0ZDyoDhXgShRUZx/view?usp=sharing', '_blank')}
           >
            Buka
           </Button>
        </Card>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="personal">Data Fisik</TabsTrigger>
            <TabsTrigger value="kehamilan">Kondisi</TabsTrigger>
            <TabsTrigger value="liked">
              <Heart className="w-3 h-3 mr-1" />
              Forum
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <form onSubmit={handlePhysicalSubmit}>
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-800">Data Fisik Ibu</h3>
                  {profile && (
                    <Badge className="bg-green-100 text-green-700 text-xs">Sudah Diisi</Badge>
                  )}
                </div>

                <div>
                  <Label htmlFor="dob">Tanggal Lahir Ibu</Label>
                  <Input 
                    id="dob" 
                    type="date"
                    value={physicalForm.data.dob}
                    onChange={(e) => physicalForm.setData("dob", e.target.value)}
                    required
                  />
                  {physicalForm.errors.dob && <span className="text-red-500 text-sm">{physicalForm.errors.dob}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height_cm">Tinggi (cm)</Label>
                    <Input 
                      id="height_cm" 
                      type="number"
                      value={physicalForm.data.height_cm}
                      onChange={(e) => physicalForm.setData("height_cm", e.target.value)}
                      required
                      placeholder="160"
                    />
                    {physicalForm.errors.height_cm && <span className="text-red-500 text-sm">{physicalForm.errors.height_cm}</span>}
                  </div>
                  <div>
                    <Label htmlFor="weight_kg_before">BB Awal (kg)</Label>
                    <Input 
                       id="weight_kg_before"
                       type="number" 
                       placeholder="55"
                       value={physicalForm.data.weight_kg_before}
                       onChange={(e) => physicalForm.setData("weight_kg_before", e.target.value)}
                       required
                    />
                    {physicalForm.errors.weight_kg_before && <span className="text-red-500 text-sm">{physicalForm.errors.weight_kg_before}</span>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="weight_kg_current">Berat Badan Saat Ini (kg)</Label>
                  <Input 
                     id="weight_kg_current"
                     type="number"
                     placeholder="60"
                     value={physicalForm.data.weight_kg_current}
                     onChange={(e) => physicalForm.setData("weight_kg_current", e.target.value)}
                     required
                  />
                  {physicalForm.errors.weight_kg_current && <span className="text-red-500 text-sm">{physicalForm.errors.weight_kg_current}</span>}
                </div>

                <Button 
                  type="submit" 
                  disabled={physicalForm.processing} 
                  className="w-full mt-4 bg-pink-500 hover:bg-pink-600"
                >
                  {physicalForm.processing ? "Menyimpan..." : (profile ? "Update Data Fisik" : "Simpan Data Fisik")}
                </Button>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="kehamilan">
            <form onSubmit={handleConditionSubmit}>
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-800">Kondisi & Status</h3>
                  {profile && profile.stage && (
                    <Badge className="bg-green-100 text-green-700 text-xs">Sudah Diisi</Badge>
                  )}
                </div>

                <div>
                  <Label>Status Saat Ini</Label>
                  <Select value={conditionForm.data.stage} onValueChange={(val) => conditionForm.setData("stage", val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pregnancy">Sedang Hamil</SelectItem>
                      <SelectItem value="postpartum">Masa Nifas (0-40 Hari)</SelectItem>
                      <SelectItem value="nursing">Menyusui</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="stage_start_date">
                    {conditionForm.data.stage === 'pregnancy' ? 'Hari Pertama Haid Terakhir (HPHT)' : 'Tanggal Melahirkan'}
                  </Label>
                  <Input 
                    id="stage_start_date" 
                    type="date"
                    value={conditionForm.data.stage_start_date}
                    onChange={(e) => conditionForm.setData("stage_start_date", e.target.value)}
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {conditionForm.data.stage === 'pregnancy' 
                      ? 'Digunakan untuk hitung usia kehamilan otomatis.' 
                      : conditionForm.data.stage === 'postpartum'
                      ? 'Digunakan untuk menghitung masa nifas.'
                      : 'Digunakan untuk tracking periode menyusui.'}
                  </p>
                  {conditionForm.errors.stage_start_date && <span className="text-red-500 text-sm">{conditionForm.errors.stage_start_date}</span>}
                </div>

                <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Data Medis (Opsional)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Sistolik (mmHg)</Label>
                            <Input 
                                type="number" 
                                placeholder="120"
                                value={conditionForm.data.systolic}
                                onChange={(e) => conditionForm.setData("systolic", e.target.value)}
                            />
                            {conditionForm.errors.systolic && <span className="text-red-500 text-sm">{conditionForm.errors.systolic}</span>}
                        </div>
                        <div>
                            <Label>Diastolik (mmHg)</Label>
                            <Input 
                                type="number" 
                                placeholder="80"
                                value={conditionForm.data.diastolic}
                                onChange={(e) => conditionForm.setData("diastolic", e.target.value)}
                            />
                            {conditionForm.errors.diastolic && <span className="text-red-500 text-sm">{conditionForm.errors.diastolic}</span>}
                        </div>
                    </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={conditionForm.processing} 
                  className="w-full mt-4 bg-pink-500 hover:bg-pink-600"
                >
                  {conditionForm.processing ? "Menyimpan..." : (profile?.stage ? "Update Data Kondisi" : "Simpan Data Kondisi")}
                </Button>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="liked" className="space-y-4">
            {loadingLiked ? (
              <Card className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                <p className="text-slate-500 mt-3 text-sm">Memuat...</p>
              </Card>
            ) : likedPosts.length === 0 ? (
              <Card className="p-8 text-center border-none shadow-sm">
                <Heart className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">Belum ada postingan yang disukai</p>
                <p className="text-xs text-slate-400 mt-1">Like postingan di forum untuk melihatnya di sini</p>
                <Link href="/forum">
                  <Button className="mt-4 bg-pink-500 hover:bg-pink-600">
                    Jelajahi Forum
                  </Button>
                </Link>
              </Card>
            ) : (
              likedPosts.map((post) => (
                <Card key={post.id} className="p-4 border-none shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {new Date(post.timestamp).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">{post.content}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 pb-3 border-b border-slate-100">
                    <span>Oleh {post.author}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                    <Link href={`/forum#post-${post.id}`}>
                      <Button size="sm" variant="outline" className="h-7 text-xs border-pink-200 text-pink-600 hover:bg-pink-50">
                        Lihat Detail
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        <div className="pt-4">
            <Link href={logout.url()} method="post" as="button" className="w-full">
                <Button variant="outline" className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300">
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar Akun
                </Button>
            </Link>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
