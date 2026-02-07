import { Link, router } from "@inertiajs/react";
import { MapPin, MessageCircle, Search, Star } from "lucide-react";
import { useState } from "react";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import MobileNav from "../components/MobileNav";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  hospital: string;
  available: boolean;
  price: string;
  image?: string;
}

export default function Teleconsultation({ doctors }: { doctors: Doctor[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConsult = (doctor: Doctor) => {
      router.post(route('consultation.store'), { doctor_id: doctor.id }, {
          onSuccess: () => {
              const phone = "6285226402431"; // Default consultation number
              const text = `Halo, saya ingin berkonsultasi dengan ${doctor.name} via Aplikasi MomSync.`;
              window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
          }
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20"> {/* Added pb-20 for MobileNav */}
      
      {/* Header */}
      <div className="bg-linear-to-r from-pink-500 to-purple-600 text-white p-4 pb-8 rounded-b-3xl relative shadow-md">
        <h1 className="text-xl font-bold mb-1">Telekonsultasi</h1>
        <p className="text-pink-100 text-sm mb-4">Konsultasi dengan ahli kesehatan dari rumah</p>
        
        {/* Search Bar - Floating */}
        <div className="absolute -bottom-6 left-4 right-4 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-9 h-12 rounded-xl bg-white border-none text-black" 
              placeholder="Cari Dokter atau Spesialis..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 px-4 space-y-4">
        {/* Location / Care Locator Access */}
        <Link href="/locator">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                        <MapPin className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Cari Faskes Terdekat</h3>
                        <p className="text-xs text-slate-500">Temukan RS, Klinik, dan Bidan di sekitar Anda</p>
                    </div>
                </div>
                <div className="bg-slate-100 p-1 rounded-full">
                    <Search className="w-4 h-4 text-slate-400" />
                </div>
            </div>
        </Link>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 noscrollbar">
           {['Semua', 'Kandungan', 'Anak', 'Gizi', 'Psikolog'].map((cat) => (
             <Badge key={cat} variant="outline" className="bg-white hover:bg-pink-50 cursor-pointer border-slate-200 px-3 py-1.5 whitespace-nowrap">
               {cat}
             </Badge>
           ))}
        </div>

        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="p-4 border-none shadow-sm flex flex-col gap-3">
            <div className="flex gap-3">
              <Avatar className="h-16 w-16 rounded-xl border border-slate-100">
                {doctor.image ? (
                   <ImageWithFallback 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="h-full w-full object-cover"
                   />
                ) : (
                   <AvatarFallback className="rounded-xl bg-pink-100 text-pink-600 text-xl font-semibold">
                      {doctor.name[0]}
                   </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                   <div>
                     <h3 className="font-bold text-slate-800 text-sm">{doctor.name}</h3>
                     <p className="text-xs text-pink-600 font-medium">{doctor.specialty}</p>
                   </div>
                   <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] text-amber-700 font-bold border border-amber-100">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {doctor.rating}
                   </div>
                </div>
                
                <div className="mt-2 text-xs text-slate-500 space-y-1">
                   <p className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
                         {doctor.experience} Tahun Pengalaman
                      </Badge>
                   </p>
                   <p>{doctor.hospital}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
               <div>
                  <p className="text-[10px] text-slate-400">Biaya Konsultasi</p>
                  <p className="font-bold text-slate-800">{doctor.price}</p>
               </div>
               <div className="flex gap-2">
                 <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full border-pink-200 text-pink-600">
                    <MessageCircle className="w-4 h-4" />
                 </Button>
                 {doctor.available ? (
                    <Button 
                        size="sm" 
                        className="h-8 bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4 text-xs"
                        onClick={() => handleConsult(doctor)}
                    >
                        Chat Sekarang
                    </Button>
                 ) : (
                    <Button size="sm" variant="secondary" className="h-8 rounded-full px-4 text-xs" disabled>
                        Tidak Tersedia
                    </Button>
                 )}
               </div>
            </div>
          </Card>
        ))}
      </div>
      
      <MobileNav />
    </div>
  );
}
