import { Head, Link } from "@inertiajs/react";
import { Users, UserCheck, FileText, Calendar, TrendingUp, Activity, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MobileNav from "@/components/MobileNav";
import { logout } from "@/routes";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface Consultation {
    id: number;
    user: User;
    doctor: {
        user: User;
    };
    schedule_date: string;
    status: string;
}

interface Stats {
    total_users: number;
    total_doctors: number;
    total_articles: number;
    total_consultations: number;
    recent_consultations: Consultation[];
    recent_users: User[];
}

interface Props {
    stats: Stats;
}

export default function AdminDashboard({ stats }: Props) {
    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
            case 'completed': return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'cancelled': return 'bg-red-100 text-red-700 hover:bg-red-100';
            default: return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
            case 'doctor': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
            case 'user': return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
            default: return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <Head title="Admin Dashboard" />

            {/* Header */}
            <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 pb-12 rounded-b-3xl shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
                        <p className="text-purple-100 opacity-90">MomSync Management Panel</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <Link href={logout.url()} method="post" as="button" className="bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                            <LogOut className="w-6 h-6 text-white" />
                        </Link>
                    </div>
                </div>
            </header>

            <div className="px-5 -mt-8 relative z-20 space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="border-none shadow-md">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Users</p>
                                    <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total_users}</p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-xl">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Doctors</p>
                                    <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total_doctors}</p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-xl">
                                    <UserCheck className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Articles</p>
                                    <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total_articles}</p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-xl">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Consults</p>
                                    <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total_consultations}</p>
                                </div>
                                <div className="bg-pink-100 p-3 rounded-xl">
                                    <Calendar className="w-6 h-6 text-pink-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Users */}
                <Card className="border-none shadow-md">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-bold text-slate-800">Recent Users</CardTitle>
                            <Link href="/admin/users" className="text-xs text-purple-600 font-semibold hover:underline">
                                View All
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {stats.recent_users.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm text-slate-800 truncate">{user.name}</h4>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                                <Badge variant="secondary" className={`text-[10px] ml-2 ${getRoleBadge(user.role)}`}>
                                    {user.role}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Consultations */}
                <Card className="border-none shadow-md">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold text-slate-800">Recent Consultations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {stats.recent_consultations.length > 0 ? (
                            stats.recent_consultations.map((consultation) => (
                                <div key={consultation.id} className="p-3 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm text-slate-800">
                                                {consultation.user.name}
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                Doctor: {consultation.doctor?.user?.name || 'N/A'}
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className={`text-[10px] ${getStatusColor(consultation.status)}`}>
                                            {consultation.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(consultation.schedule_date)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-400 py-4 text-sm">No consultations yet</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <MobileNav />
        </div>
    );
}
