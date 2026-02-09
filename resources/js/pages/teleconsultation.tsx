import { Link, useForm } from "@inertiajs/react";
import { Calendar, Clipboard, Clock, MapPin, MessageCircle, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MobileNav from "../components/MobileNav";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  hospital_name: string;
  bio: string;
  photo: string | null;
  consultation_fee: number;
  is_online: boolean;
}

interface Consultation {
  id: number;
  doctor_name: string;
  doctor_specialization: string;
  doctor_whatsapp: string | null;
  schedule_date: string;
  status: string;
  notes: string | null;
  whatsapp_link: string | null;
}

export default function Teleconsultation({ doctors }: { doctors: Doctor[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [myConsultations, setMyConsultations] = useState<Consultation[]>([]);

  const { data, setData, post, processing, reset } = useForm({
    doctor_id: 0,
    schedule_date: "",
    notes: "",
  });

  useEffect(() => {
    fetchMyConsultations();
  }, []);

  const fetchMyConsultations = async () => {
    try {
      const response = await axios.get('/consultation/my');
      setMyConsultations(response.data);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    }
  };

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookConsultation = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setData('doctor_id', doctor.id);
    setBookingOpen(true);
  };

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    post('/consultation/book', {
      onSuccess: () => {
        toast.success("Booking berhasil! Tunggu konfirmasi dokter.");
        setBookingOpen(false);
        reset();
        fetchMyConsultations();
      },
      onError: () => {
        toast.error("Booking gagal. Periksa kembali data Anda.");
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: "Menunggu", className: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      confirmed: { label: "Dikonfirmasi", className: "bg-green-100 text-green-700 border-green-300" },
      completed: { label: "Selesai", className: "bg-blue-100 text-blue-700 border-blue-300" },
      cancelled: { label: "Dibatalkan", className: "bg-red-100 text-red-700 border-red-300" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={`${config.className} border`}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-linear-to-r from-pink-500 to-purple-600 text-white p-4 pb-8 rounded-b-3xl relative shadow-md">
        <h1 className="text-xl font-bold mb-1">Telekonsultasi</h1>
        <p className="text-pink-100 text-sm mb-4">Konsultasi dengan ahli kesehatan dari rumah</p>
        
        {/* Search Bar */}
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

      <div className="mt-10 px-4">
        <Tabs defaultValue="doctors" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="doctors">Dokter Tersedia</TabsTrigger>
            <TabsTrigger value="consultations">Konsultasi Saya</TabsTrigger>
          </TabsList>

          <TabsContent value="doctors" className="space-y-4">
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

            {/* Doctors List */}
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="p-4 border-none shadow-sm flex flex-col gap-3">
                <div className="flex gap-3">
                  <Avatar className="h-16 w-16 rounded-xl border border-slate-100">
                    {doctor.photo ? (
                      <ImageWithFallback 
                        src={doctor.photo} 
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
                        <p className="text-xs text-pink-600 font-medium">{doctor.specialization}</p>
                      </div>
                      {doctor.is_online && (
                        <Badge className="bg-green-100 text-green-700 border-green-300 text-[10px]">
                          Online
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mt-2 text-xs text-slate-500 space-y-1">
                      <p className="line-clamp-2">{doctor.bio}</p>
                      <p className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3" />
                        {doctor.hospital_name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
                  <div>
                    <p className="text-[10px] text-slate-400">Biaya Konsultasi</p>
                    <p className="font-bold text-slate-800">
                      Rp {doctor.consultation_fee.toLocaleString('id-ID')}
                    </p>
                  </div>
                  {doctor.is_online ? (
                    <Button 
                      size="sm" 
                      className="h-8 bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4 text-xs"
                      onClick={() => handleBookConsultation(doctor)}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Booking
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" className="h-8 rounded-full px-4 text-xs" disabled>
                      Tidak Tersedia
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="consultations" className="space-y-4">
            {myConsultations.length === 0 ? (
              <Card className="p-8 text-center">
                <Clipboard className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Belum ada konsultasi</p>
              </Card>
            ) : (
              myConsultations.map((consultation) => (
                <Card key={consultation.id} className="p-4 border-none shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 rounded-xl border border-slate-100">
                        <AvatarFallback className="rounded-xl bg-purple-100 text-purple-600 font-semibold">
                          {consultation.doctor_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{consultation.doctor_name}</h3>
                        <p className="text-xs text-pink-600">{consultation.doctor_specialization}</p>
                      </div>
                    </div>
                    {getStatusBadge(consultation.status)}
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{new Date(consultation.schedule_date).toLocaleDateString('id-ID', { 
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{new Date(consultation.schedule_date).toLocaleTimeString('id-ID', { 
                        hour: '2-digit', minute: '2-digit' 
                      })}</span>
                    </div>
                    {consultation.notes && (
                      <div className="bg-slate-50 p-2 rounded text-xs mt-2">
                        <strong>Catatan:</strong> {consultation.notes}
                      </div>
                    )}
                  </div>

                  {consultation.whatsapp_link && (
                    <Button 
                      size="sm" 
                      className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => window.open(consultation.whatsapp_link!, '_blank')}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Hubungi via WhatsApp
                    </Button>
                  )}
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Konsultasi</DialogTitle>
            <DialogDescription>
              Isi jadwal konsultasi dengan {selectedDoctor?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitBooking} className="space-y-4">
            <div>
              <Label>Tanggal & Waktu Konsultasi</Label>
              <Input 
                type="datetime-local"
                value={data.schedule_date}
                onChange={(e) => setData('schedule_date', e.target.value)}
                required
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div>
              <Label>Catatan (Opsional)</Label>
              <Textarea 
                placeholder="Keluhan atau pertanyaan Anda..."
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                rows={3}
              />
            </div>
            <div className="bg-pink-50 p-3 rounded-lg text-sm">
              <p className="font-medium text-slate-800">Biaya Konsultasi</p>
              <p className="text-xl font-bold text-pink-600">
                Rp {selectedDoctor?.consultation_fee.toLocaleString('id-ID')}
              </p>
            </div>
            <Button 
              type="submit" 
              disabled={processing}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              {processing ? "Memproses..." : "Konfirmasi Booking"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <MobileNav />
    </div>
  );
}
