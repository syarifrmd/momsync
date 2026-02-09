import { Head, Link } from "@inertiajs/react";
import MobileNav from "@/components/MobileNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, FileText, LogOut } from "lucide-react";
import { logout } from "@/routes";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Doctor {
    id: number;
    specialization: string;
    hospital_name: string;
}

interface Consultation {
    id: number;
    user: User;
    schedule_date: string;
    status: string;
    notes: string;
}

interface Props {
    user: User;
    doctor: Doctor | null;
    consultations: Consultation[];
}

export default function DoctorDashboard({ user, doctor, consultations }: Props) {
    const formatDate = (dateString: string) => {
        try {
            return new Intl.DateTimeFormat('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(new Date(dateString));
        } catch (e) {
            return dateString;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
            case 'completed': return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'cancelled': return 'bg-red-100 text-red-700 hover:bg-red-100';
            default: return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans">
            <Head title="Doctor Dashboard" />

            {/* Header */}
            <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 pb-12 rounded-b-3xl shadow-lg relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Hello, Dr. {user.name}</h1>
                        <p className="text-pink-100 opacity-90">
                            {doctor?.specialization || 'Dokter Umum'} • {doctor?.hospital_name || 'MomSync Hospital'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/settings/profile" className="bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                            <User className="w-6 h-6 text-white" />
                        </Link>
                        <Link href={logout.url()} method="post" as="button" className="bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                            <LogOut className="w-6 h-6 text-white" />
                        </Link>
                    </div>
                </div>
            </header>

            <div className="px-5 -mt-8 relative z-20 space-y-6">
                <div>
                     <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">Jadwal Konsultasi</h2>
                        <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                            {consultations.length} Pesanan
                        </span>
                    </div>

                    {consultations.length > 0 ? (
                        <div className="space-y-4">
                            {consultations.map((consultation) => (
                                <Card key={consultation.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                                    <div className={`h-1.5 w-full ${
                                        consultation.status === 'completed' ? 'bg-green-500' : 
                                        consultation.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500' 
                                    }`} />
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-slate-100 p-2 rounded-full">
                                                    <User className="w-4 h-4 text-slate-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800 text-sm">{consultation.user.name}</h3>
                                                    <p className="text-xs text-slate-500">Pasien</p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${getStatusColor(consultation.status)}`}>
                                                {consultation.status}
                                            </Badge>
                                        </div>
                                        
                                        <div className="space-y-2 mt-2">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                <span className="text-xs">{formatDate(consultation.schedule_date)}</span>
                                            </div>
                                            {consultation.notes && (
                                                <div className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-md">
                                                    <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                                                    <p className="text-xs line-clamp-2">{consultation.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100">
                            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Calendar className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-slate-800 font-medium">Belum ada jadwal</h3>
                            <p className="text-slate-500 text-sm mt-1">Anda belum memiliki jadwal konsultasi.</p>
                        </div>
                    )}
                </div>
            </div>

            <MobileNav />
        </div>
    );
}
