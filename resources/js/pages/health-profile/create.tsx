import { Link, useForm } from "@inertiajs/react";
import { Activity, BookOpen, LogOut, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MobileNav from "../../components/MobileNav";
import { logout } from "@/routes";

export default function HealthProfile() {
  const { data, setData, post, processing, errors } = useForm({
    dob: "",
    height_cm: "",
    weight_kg_before: "",
    weight_kg_current: "",
    stage: "pregnancy",
    last_period_date: "", // Maps to stage_start_date for pregnancy
    // Optional metrics
    systolic: "",
    diastolic: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/profile/store', {
      onSuccess: () => toast.success("Profil berhasil disimpan!"),
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
           <Button variant="ghost" size="sm" className="text-purple-600">Buka</Button>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="personal">Data Fisik</TabsTrigger>
            <TabsTrigger value="kehamilan">Kondisi Saat Ini</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="p-6 space-y-4">
              <div>
                <Label htmlFor="dob">Tanggal Lahir Ibu</Label>
                <Input 
                  id="dob" 
                  type="date"
                  value={data.dob}
                  onChange={(e) => setData("dob", e.target.value)}
                />
                {errors.dob && <span className="text-red-500 text-sm">{errors.dob}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height_cm">Tinggi (cm)</Label>
                  <Input 
                    id="height_cm" 
                    type="number"
                    value={data.height_cm}
                    onChange={(e) => setData("height_cm", e.target.value)}
                  />
                  {errors.height_cm && <span className="text-red-500 text-sm">{errors.height_cm}</span>}
                </div>
                <div>
                  <Label htmlFor="weight_kg_before">BB Awal (kg)</Label>
                  <Input 
                     id="weight_kg_before"
                     type="number" 
                     placeholder="Sebelum hamil"
                     value={data.weight_kg_before}
                     onChange={(e) => setData("weight_kg_before", e.target.value)}
                  />
                  {errors.weight_kg_before && <span className="text-red-500 text-sm">{errors.weight_kg_before}</span>}
                </div>
              </div>

              <div>
                <Label htmlFor="weight_kg_current">Berat Badan Saat Ini (kg)</Label>
                <Input 
                   id="weight_kg_current"
                   type="number"
                   value={data.weight_kg_current}
                   onChange={(e) => setData("weight_kg_current", e.target.value)}
                />
                {errors.weight_kg_current && <span className="text-red-500 text-sm">{errors.weight_kg_current}</span>}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="kehamilan">
             <Card className="p-6 space-y-4">
                <div>
                  <Label>Status Saat Ini</Label>
                  <Select value={data.stage} onValueChange={(val) => setData("stage", val)}>
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

                {data.stage === 'pregnancy' && (
                  <div>
                    <Label htmlFor="hpht">Hari Pertama Haid Terakhir (HPHT)</Label>
                    <Input 
                      id="hpht" 
                      type="date"
                      value={data.last_period_date}
                      onChange={(e) => setData("last_period_date", e.target.value)}
                    />
                    <p className="text-xs text-slate-500 mt-1">Digunakan untuk hitung usia kehamilan otomatis.</p>
                  </div>
                )}

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
                                value={data.systolic}
                                onChange={(e) => setData("systolic", e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Diastolik (mmHg)</Label>
                            <Input 
                                type="number" 
                                placeholder="80"
                                value={data.diastolic}
                                onChange={(e) => setData("diastolic", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <Button type="submit" disabled={processing} className="w-full mt-4 bg-pink-500 hover:bg-pink-600">
                  {processing ? "Menyimpan..." : "Simpan Profil"}
                </Button>
             </Card>
          </TabsContent>
        </Tabs>
      </form>

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
