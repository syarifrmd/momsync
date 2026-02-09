import { Head, Link } from "@inertiajs/react";
import { Calendar, CheckCircle, Clock, Heart } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import MobileNav from "../components/MobileNav";

interface Article {
    id: number;
    title: string;
    category: string;
    min_week: number;
    max_week: number;
    content: string;
    thumbnail: string;
}

interface UserProfile {
    stage: string;
    stage_start_date: string;
}

interface ScheduleItem {
    week?: number;
    day?: number;
    title: string;
    description: string;
    date: string;
    status: 'past' | 'upcoming' | 'future' | 'ongoing' | 'completed';
    type: 'medical' | 'daily' | 'milestone';
}

interface Props {
    articles: Article[];
    userProfile: UserProfile | null;
    currentWeek: number;
    schedule: ScheduleItem[];
}

export default function CareMom({ articles, userProfile, currentWeek, schedule }: Props) {
  const [activeTab, setActiveTab] = useState(userProfile?.stage || "pregnancy");

  // Get upcoming schedules
  const upcomingSchedules = schedule.filter(s => s.status === 'upcoming' || s.status === 'ongoing').slice(0, 3);

  // Filter articles client-side for tab switching if needed, 
  // but for now we display what the server sent primarily.
  // We can just show the server articles.

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      <Head title="Care Mom" />
      
      {/* Header Gradient matching UI */}
      <header className="bg-linear-to-r from-pink-500 to-purple-600 text-white p-6 pb-8 rounded-b-4xl shadow-lg relative z-10">
        <div className="flex items-center gap-3 mb-2">
           <Heart className="fill-white text-white w-6 h-6" />
           <h1 className="text-xl font-bold">Care Mom</h1>
        </div>
        <p className="text-pink-100 text-sm">Informasi & edukasi kesehatan untuk Anda</p>
      </header>

      <div className="px-4 -mt-6 relative z-20">
         {/* Week/Stage Info */}
         {userProfile && (
           <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-4 mb-4 text-white">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-xs text-purple-100">
                   {userProfile.stage === 'pregnancy' ? 'Usia Kehamilan' : 
                    userProfile.stage === 'postpartum' ? 'Masa Nifas' : 'Menyusui'}
                 </p>
                 <h2 className="text-2xl font-bold">
                   {userProfile.stage === 'pregnancy' 
                     ? `${currentWeek} Minggu` 
                     : userProfile.stage === 'postpartum'
                     ? `Hari ke-${Math.floor(currentWeek * 7)}`
                     : `${Math.floor(currentWeek / 4)} Bulan`}
                 </h2>
               </div>
               <Calendar className="w-10 h-10 text-white/80" />
             </div>
           </div>
         )}

         {/* Schedule Widget */}
         <div className="bg-white rounded-xl shadow-lg p-4 mb-4 border border-pink-100">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <div className="bg-pink-100 p-1.5 rounded-lg">
                        <Clock className="w-5 h-5 text-pink-600" />
                    </div>
                    <span className="font-bold text-slate-800">Jadwal Mendatang</span>
                </div>
                <Link href="/reminders" className="text-xs text-pink-600 font-semibold hover:underline">
                    Lihat Semua
                </Link>
            </div>
            
            {/* Dynamic Schedule Preview */}
            <div className="space-y-2">
                {upcomingSchedules.length > 0 ? (
                  upcomingSchedules.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className={`h-10 w-1 rounded-full ${
                          item.status === 'upcoming' ? 'bg-pink-500' : 
                          item.status === 'ongoing' ? 'bg-green-500' : 'bg-slate-300'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-slate-800 truncate">{item.title}</p>
                            <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                            <p className="text-xs text-pink-600 mt-1 flex items-center gap-1">
                              {item.type === 'medical' && <Calendar className="w-3 h-3" />}
                              {item.date}
                            </p>
                        </div>
                        {item.type === 'medical' && item.status === 'past' && (
                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        )}
                    </div>
                  ))
                ) : userProfile ? (
                  <div className="text-center py-4 text-slate-500 text-sm">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>Belum ada jadwal mendatang</p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-slate-500 text-sm mb-2">Belum ada profil kesehatan</p>
                    <Link href="/profile/setup">
                      <Badge className="bg-pink-500 hover:bg-pink-600 text-white">
                        Lengkapi Profil
                      </Badge>
                    </Link>
                  </div>
                )}
            </div>
         </div>

         <div className="bg-white rounded-xl shadow-sm p-1.5 flex justify-between overflow-x-auto">
            {['Hamil', 'Persalinan', 'Nifas', 'Menyusui'].map((tab) => (
                <button 
                  key={tab}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      (tab === 'Hamil' && activeTab === 'pregnancy') || 
                      (tab === 'Nifas' && activeTab === 'postpartum') || 
                      (tab === 'Menyusui' && activeTab === 'nursing')
                      ? 'bg-white shadow-sm text-pink-600 border border-slate-100' 
                      : 'text-slate-500 hover:text-pink-400'
                  }`}
                  onClick={() => {
                        if(tab === 'Hamil') setActiveTab('pregnancy');
                        if(tab === 'Persalinan') setActiveTab('labor');
                        if(tab === 'Nifas') setActiveTab('postpartum');
                        if(tab === 'Menyusui') setActiveTab('nursing');
                  }}
                >
                  {tab}
                </button>
            ))}
         </div>
      </div>

      <main className="p-4 space-y-4 mt-2">
         {articles && articles.length > 0 ? (
             articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`}>
                    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl mb-4">
                        <div className="h-48 w-full relative bg-slate-200">
                            {article.thumbnail ? (
                                <img 
                                    src={article.thumbnail} 
                                    alt={article.title} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="bg-pink-50 text-pink-600 hover:bg-pink-100 border-none">
                                    {article.category}
                                </Badge>
                                {(article.min_week && article.max_week) && (
                                    <span className="text-xs text-slate-400">
                                        Minggu {article.min_week}-{article.max_week}
                                    </span>
                                )}
                            </div>
                            <h3 className="font-semibold text-slate-900 text-lg mb-2 leading-tight">
                                {article.title}
                            </h3>
                            <div 
                                className="text-slate-600 text-sm line-clamp-2 mb-4 prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </div>
                    </Card>
                </Link>
             ))
         ) : (
             <div className="text-center py-10">
                 <p className="text-slate-500">Belum ada artikel yang sesuai untuk fase ini.</p>
                 <Link href="/profile/setup" className="text-pink-500 underline text-sm mt-2 block">
                    Cek Profil Kesehatan
                 </Link>
             </div>
         )}
      </main>

      <MobileNav />
    </div>
  );
}
