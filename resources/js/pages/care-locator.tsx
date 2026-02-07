import { Clock, MapPin, Navigation, Phone, Search, Star } from "lucide-react";
import { useState } from "react";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import MobileNav from "../components/MobileNav";

interface HealthFacility {
  id: number;
  name: string;
  type: string;
  address: string;
  distance: string;
  phone: string;
  hours: string;
  rating: number;
  services: string[];
  image?: string;
}

const facilities: HealthFacility[] = [
  {
    id: 1,
    name: "RS Bunda Jakarta",
    type: "Rumah Sakit",
    address: "Jl. Teuku Cik Ditiro No. 28, Menteng, Jakarta Pusat",
    distance: "1.2 km",
    phone: "(021) 3192-2005",
    hours: "24 Jam",
    rating: 4.7,
    services: ["Kandungan", "Anak", "Bersalin", "NICU"],
    image: "https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2ODY1ODU2N3ww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    name: "Klinik Ibu & Anak Sehat",
    type: "Klinik",
    address: "Jl. Sudirman No. 45, Tanah Abang, Jakarta Pusat",
    distance: "2.5 km",
    phone: "(021) 5720-8899",
    hours: "08:00 - 20:00",
    rating: 4.5,
    services: ["Kandungan", "Anak", "Imunisasi"]
  },
  {
    id: 3,
    name: "RS Hermina Kemayoran",
    type: "Rumah Sakit",
    address: "Jl. Angkasa Kav. 1, Kemayoran, Jakarta Pusat",
    distance: "5.0 km",
    phone: "(021) 654-2020",
    hours: "24 Jam",
    rating: 4.6,
    services: ["Kandungan", "Anak", "Bedah", "Poli Mata"],
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxob3NwaXRhbHxlbnwwfHx8fDE3Njg2NTg1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 4,
    name: "Puskesmas Menteng",
    type: "Puskesmas",
    address: "Jl. Pegangsaan Barat No. 14, Menteng, Jakarta Pusat",
    distance: "0.8 km",
    phone: "(021) 3190-2345",
    hours: "07:30 - 16:00",
    rating: 4.2,
    services: ["Umum", "KIA", "Gigi"]
  }
];

export default function CareLocator() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"map" | "list">("list");

  const filteredFacilities = facilities.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20"> {/* Added pb-20 for MobileNav */}
      
      {/* Header */}
      <div className="bg-linear-to-r from-pink-500 to-purple-600 text-white p-4 pb-8 rounded-b-3xl relative shadow-md">
        <h1 className="text-xl font-bold mb-1">Care Locator</h1>
        <p className="text-pink-100 text-sm mb-4">Temukan layanan kesehatan terdekat</p>
        
        {/* Search Bar - Floating */}
        <div className="absolute -bottom-6 left-4 right-4 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-9 h-12 rounded-xl bg-white border-none text-black" 
              placeholder="Cari RS, Klinik, atau Dokter..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 px-4">
        {/* Toggle Tabs */}
        <div className="flex bg-slate-200 p-1 rounded-xl mb-6">
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
            onClick={() => setActiveTab('list')}
          >
            Daftar
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'map' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
            onClick={() => setActiveTab('map')}
          >
            Peta
          </button>
        </div>

        {activeTab === 'list' ? (
          <div className="space-y-4">
            {filteredFacilities.map((facility) => (
              <Card key={facility.id} className="overflow-hidden border-none shadow-sm">
                {facility.image && (
                  <div className="h-32 w-full relative">
                      <ImageWithFallback 
                        src={facility.image} 
                        alt={facility.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-white/90 text-slate-800 hover:bg-white/90">
                        {facility.distance}
                      </Badge>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-800">{facility.name}</h3>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {facility.type}
                      </span>
                    </div>
                    {!facility.image && ( // Show distance here if no image
                         <Badge variant="secondary" className="text-slate-600">
                           {facility.distance}
                         </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-pink-500 shrink-0" />
                      <span className="line-clamp-2">{facility.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{facility.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500" />
                      <span>{facility.rating} / 5.0</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {facility.services.slice(0, 3).map((service, idx) => (
                      <span key={idx} className="text-[10px] bg-pink-50 text-pink-600 px-2 py-1 rounded-md">
                        {service}
                      </span>
                    ))}
                    {facility.services.length > 3 && (
                        <span className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-md">
                            +{facility.services.length - 3} lainnya
                        </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-white border border-pink-200 text-pink-600 hover:bg-pink-50" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Telepon
                    </Button>
                    <Button className="flex-1 bg-pink-600 hover:bg-pink-700 text-white" size="sm">
                      <Navigation className="w-4 h-4 mr-2" />
                      Rute
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="h-125 bg-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden">
             {/* Map Placeholder */}
             <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/OpenStreetMap_Logo_2011.svg/1024px-OpenStreetMap_Logo_2011.svg.png')] bg-cover opacity-20 bg-center"></div>
             <div className="relative z-10 text-center p-6 bg-white/80 rounded-xl backdrop-blur-sm mx-4">
                <MapPin className="w-10 h-10 text-pink-600 mx-auto mb-2 animate-bounce" />
                <h3 className="font-bold text-slate-800">Tampilan Peta Interaktif</h3>
                <p className="text-sm text-slate-600">Integrasi Peta akan segera tersedia di versi selanjutnya.</p>
             </div>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
}
