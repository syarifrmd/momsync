import { Building2, Clock, Filter, Loader2, MapPin, Navigation, Phone, Search, Target } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import MobileNav from "../components/MobileNav";

interface Hospital {
  code: string;
  name: string;
  address: string;
  phone: string | null;
  type: string;
  class: string;
  ownership: string;
  facilities: {
    total_beds: number;
    land_area: string;
    building_area: string;
  };
  services: {
    count: number;
    list: string[];
  };
  province_code: string;
  regency_code: string;
}

interface ApiResponse {
  is_success: boolean;
  message: string;
  data: Hospital[];
  paging?: {
    page: number;
    size: number;
    total_item: number;
    total_page: number;
  };
}

// Province codes mapping for major cities in Indonesia
const PROVINCE_CODES: Record<string, string> = {
  'Jakarta': '31',
  'Jawa Barat': '32',
  'Jawa Tengah': '33',
  'Jawa Timur': '35',
  'Banten': '36',
  'Bali': '51',
  'Sumatera Utara': '12',
  'Sumatera Barat': '13',
  'Sulawesi Selatan': '73',
};

export default function CareLocator() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>("all"); // Default to All
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHospitals();
  }, [page]);

  const fetchHospitals = async (pageOverride?: number) => {
    const queryPage = typeof pageOverride === 'number' ? pageOverride : page;
    setLoading(true);
    try {
      const params: any = {
        page: queryPage,
        size: 20,
      };

      if (searchTerm) params.name = searchTerm;
      if (selectedProvince && selectedProvince !== 'all') params.province_code = selectedProvince;
      if (selectedClass && selectedClass !== 'all') params.class = selectedClass;

      const response = await axios.get<ApiResponse>('/locator/search', { params });
      
      if (response.data.is_success) {
        setHospitals(response.data.data || []);
        if (response.data.paging) {
          setTotalPages(response.data.paging.total_page);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      toast.error('Gagal mengambil data rumah sakit');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (page === 1) {
      fetchHospitals(1);
    } else {
      setPage(1);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          // For MVP, default to Jakarta if location is obtained
          // In production, you'd reverse geocode to get province/regency codes
          setSelectedProvince(PROVINCE_CODES['Jakarta']);
          toast.success("Lokasi berhasil dideteksi");
          setLoading(false);
          fetchHospitals();
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Gagal mendapatkan lokasi Anda');
          setLoading(false);
        }
      );
    } else {
      toast.error('Browser tidak mendukung geolocation');
    }
  };

  const openPhone = (phone: string | null) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    } else {
      toast.error('Nomor telepon tidak tersedia');
    }
  };

  const openMaps = (address: string, name: string) => {
    const query = encodeURIComponent(`${name}, ${address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 pb-8 rounded-b-3xl relative shadow-md">
        <h1 className="text-xl font-bold mb-1">Care Locator</h1>
        <p className="text-pink-100 text-sm mb-4">Temukan rumah sakit terdekat</p>
        
        {/* Search Bar */}
        <div className="absolute -bottom-6 left-4 right-4 shadow-lg">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                className="pl-9 h-12 rounded-xl bg-white border-none text-black" 
                placeholder="Cari nama rumah sakit..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              className="h-12 bg-white text-pink-600 hover:bg-pink-50"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10 px-4 space-y-4">
        {/* Location & Filters */}
        <Card className="p-4 border-none shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter & Lokasi
            </h3>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 text-xs border-emerald-200 text-emerald-600"
              onClick={getUserLocation}
              disabled={loading}
            >
              <Target className="w-3 h-3 mr-1" />
              Lokasi Saya
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 mb-1 block">Provinsi</label>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Provinsi</SelectItem>
                  {Object.entries(PROVINCE_CODES).map(([name, code]) => (
                    <SelectItem key={code} value={code}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs text-slate-600 mb-1 block">Kelas</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  <SelectItem value="A">Kelas A</SelectItem>
                  <SelectItem value="B">Kelas B</SelectItem>
                  <SelectItem value="C">Kelas C</SelectItem>
                  <SelectItem value="D">Kelas D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          </div>
        ) : hospitals.length === 0 ? (
          <Card className="p-8 text-center">
            <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Tidak ada rumah sakit ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba ubah filter pencarian Anda</p>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {hospitals.map((hospital) => (
                <Card key={hospital.code} className="overflow-hidden border-none shadow-sm">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 line-clamp-2">{hospital.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-[10px]">
                            {hospital.type}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px]">
                            Kelas {hospital.class}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-600 mb-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-pink-500 shrink-0" />
                        <span className="line-clamp-2">{hospital.address}</span>
                      </div>
                      {hospital.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{hospital.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{hospital.facilities?.total_beds || '-'} Tempat Tidur</span>
                      </div>
                    </div>

                    {hospital.services?.list?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {hospital.services.list.slice(0, 3).map((service, idx) => (
                          <span key={idx} className="text-[10px] bg-pink-50 text-pink-600 px-2 py-1 rounded-md">
                            {service}
                          </span>
                        ))}
                        {hospital.services.list.length > 3 && (
                          <span className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-md">
                            +{hospital.services.list.length - 3} layanan
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-white border border-pink-200 text-pink-600 hover:bg-pink-50" 
                        size="sm"
                        onClick={() => openPhone(hospital.phone)}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Telepon
                      </Button>
                      <Button 
                        className="flex-1 bg-pink-600 hover:bg-pink-700 text-white" 
                        size="sm"
                        onClick={() => openMaps(hospital.address, hospital.name)}
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        Rute
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled={page === 1 || loading}
                  onClick={() => {
                    setPage(page - 1);
                    fetchHospitals();
                  }}
                >
                  Sebelumnya
                </Button>
                <span className="text-sm text-slate-600">
                  Halaman {page} dari {totalPages}
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled={page === totalPages || loading}
                  onClick={() => {
                    setPage(page + 1);
                    fetchHospitals();
                  }}
                >
                  Berikutnya
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <MobileNav />
    </div>
  );
}
