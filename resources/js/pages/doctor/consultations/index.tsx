import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MobileNav from "@/components/MobileNav";

interface Consultation {
    id: number;
    user: {
        name: string;
        email: string;
    };
    schedule_date: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes: string;
    created_at: string;
}

export default function ConsultationIndex({ consultations }: { consultations: Consultation[] }) {
    
    const updateStatus = (id: number, status: string) => {
        router.patch(route('doctor.consultations.update', id), { status }, {
            preserveScroll: true
        });
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'pending': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Menunggu</Badge>;
            case 'confirmed': return <Badge className="bg-blue-100 text-blue-800">Dikonfirmasi</Badge>;
            case 'completed': return <Badge className="bg-green-100 text-green-800">Selesai</Badge>;
            case 'cancelled': return <Badge variant="destructive">Dibatalkan</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 pb-20">
            <Head title="Jadwal Konsultasi" />
            
            <div className="bg-white p-4 shadow-sm flex items-center gap-2 sticky top-0 z-10">
                <Link href="/care-mom">
                     <ArrowLeft className="h-6 w-6 text-slate-600" />
                </Link>
                <h1 className="text-lg font-bold text-slate-800">Jadwal Konsultasi</h1>
            </div>

            <div className="p-4 space-y-4">
                {consultations.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                        Belum ada pesanan konsultasi.
                    </div>
                ) : (
                    consultations.map((consultation) => (
                        <Card key={consultation.id} className="p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>{consultation.user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{consultation.user.name}</h3>
                                        <p className="text-xs text-slate-500">
                                            {new Date(consultation.created_at).toLocaleString('id-ID', {
                                                dateStyle: 'medium', timeStyle: 'short'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                {getStatusBadge(consultation.status)}
                            </div>
                            
                            <div className="flex gap-2 justify-end pt-2 border-t">
                                {consultation.status === 'pending' && (
                                    <>
                                        <button 
                                            onClick={() => updateStatus(consultation.id, 'confirmed')}
                                            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full font-medium"
                                        >
                                            Konfirmasi
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(consultation.id, 'cancelled')}
                                            className="text-xs bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full font-medium"
                                        >
                                            Tolak
                                        </button>
                                    </>
                                )}
                                {consultation.status === 'confirmed' && (
                                     <button 
                                        onClick={() => updateStatus(consultation.id, 'completed')}
                                        className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-full font-medium flex items-center gap-1"
                                    >
                                        <CheckCircle className="w-3 h-3" /> Tandai Selesai
                                    </button>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <MobileNav />
        </div>
    );
}
