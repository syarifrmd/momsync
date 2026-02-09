import { Head, router } from "@inertiajs/react";
import { Calendar, CheckCircle, Clock, User, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import MobileNav from "@/components/MobileNav";

interface Consultation {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  schedule_date: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export default function DoctorConsultations({ consultations }: { consultations: Consultation[] }) {
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'confirm' | 'cancel' | null>(null);
  const [responseNotes, setResponseNotes] = useState("");

  const openDialog = (consultation: Consultation, action: 'confirm' | 'cancel') => {
    setSelectedConsultation(consultation);
    setActionType(action);
    setResponseNotes("");
    setDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (!selectedConsultation || !actionType) return;

    const newStatus = actionType === 'confirm' ? 'confirmed' : 'cancelled';

    router.patch(
      `/doctor/consultations/${selectedConsultation.id}`,
      {
        status: newStatus,
        notes: responseNotes || null,
      },
      {
        onSuccess: () => {
          toast.success(`Konsultasi berhasil ${actionType === 'confirm' ? 'dikonfirmasi' : 'dibatalkan'}!`);
          setDialogOpen(false);
        },
        onError: () => {
          toast.error("Gagal memperbarui status konsultasi");
        },
      }
    );
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

  const pendingConsultations = consultations.filter(c => c.status === 'pending');
  const otherConsultations = consultations.filter(c => c.status !== 'pending');

  return (
    <>
      <Head title="Konsultasi Pasien" />
      
      <div className="min-h-screen bg-slate-50 p-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Konsultasi Pasien</h1>
            <p className="text-slate-600 text-sm">Kelola permintaan konsultasi dari pasien Anda</p>
          </div>

          {/* Pending Consultations */}
          {pendingConsultations.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                Menunggu Konfirmasi ({pendingConsultations.length})
              </h2>
              <div className="space-y-3">
                {pendingConsultations.map((consultation) => (
                  <Card key={consultation.id} className="border-yellow-200 bg-yellow-50/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800">{consultation.user.name}</h3>
                            <p className="text-xs text-slate-500">{consultation.user.email}</p>
                          </div>
                        </div>
                        {getStatusBadge(consultation.status)}
                      </div>

                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="font-medium">
                            {new Date(consultation.schedule_date).toLocaleDateString('id-ID', { 
                              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="font-medium">
                            {new Date(consultation.schedule_date).toLocaleTimeString('id-ID', { 
                              hour: '2-digit', minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        {consultation.notes && (
                          <div className="bg-white p-3 rounded-lg mt-2">
                            <p className="text-xs font-semibold text-slate-700 mb-1">Keluhan Pasien:</p>
                            <p className="text-sm text-slate-600">{consultation.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => openDialog(consultation, 'confirm')}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Konfirmasi
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => openDialog(consultation, 'cancel')}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Tolak
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Other Consultations */}
          {otherConsultations.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                Riwayat Konsultasi
              </h2>
              <div className="space-y-3">
                {otherConsultations.map((consultation) => (
                  <Card key={consultation.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800">{consultation.user.name}</h3>
                            <p className="text-xs text-slate-500">{consultation.user.email}</p>
                          </div>
                        </div>
                        {getStatusBadge(consultation.status)}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>
                            {new Date(consultation.schedule_date).toLocaleDateString('id-ID', { 
                              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>
                            {new Date(consultation.schedule_date).toLocaleTimeString('id-ID', { 
                              hour: '2-digit', minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {consultations.length === 0 && (
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Belum Ada Konsultasi</h3>
              <p className="text-sm text-slate-500">Konsultasi dari pasien akan muncul di sini</p>
            </Card>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'confirm' ? 'Konfirmasi Konsultasi' : 'Tolak Konsultasi'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'confirm' 
                ? `Konfirmasi konsultasi dengan ${selectedConsultation?.user.name}?` 
                : `Yakin ingin menolak konsultasi dengan ${selectedConsultation?.user.name}?`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedConsultation && (
              <div className="bg-slate-50 p-3 rounded-lg space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">
                    {new Date(selectedConsultation.schedule_date).toLocaleDateString('id-ID', { 
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">
                    {new Date(selectedConsultation.schedule_date).toLocaleTimeString('id-ID', { 
                      hour: '2-digit', minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Catatan untuk Pasien (Opsional)
              </label>
              <Textarea 
                placeholder={actionType === 'confirm' 
                  ? "Misal: Silakan hubungi saya via WhatsApp 30 menit sebelum jadwal..." 
                  : "Misal: Mohon maaf, jadwal tidak tersedia..."
                }
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
            >
              Batal
            </Button>
            <Button 
              className={actionType === 'confirm' 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-red-600 hover:bg-red-700"
              }
              onClick={handleUpdateStatus}
            >
              {actionType === 'confirm' ? 'Konfirmasi' : 'Tolak'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MobileNav />
    </>
  );
}
