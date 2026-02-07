import { Head, Link } from "@inertiajs/react";
import { Heart } from "lucide-react";
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

interface Props {
    articles: Article[];
    userProfile: UserProfile | null;
    currentWeek: number;
}

export default function CareMom({ articles, userProfile }: Props) {
  const [activeTab, setActiveTab] = useState(userProfile?.stage || "pregnancy");

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
         {/* Reminder Widget */}
         <div className="bg-white rounded-xl shadow-lg p-4 mb-4 border border-pink-100">
            <div className="flex justify-between items-center mb-3">
                <Link href="/reminders" className="flex items-center gap-2">
                    <div className="bg-pink-100 p-1.5 rounded-lg">
                        <Heart className="w-5 h-5 text-pink-600 fill-pink-600" />
                    </div>
                    <span className="font-bold text-slate-800">Jadwal Hari Ini</span>
                </Link>
                <Link href="/reminders" className="text-xs text-pink-600 font-semibold hover:underline">
                    Lihat Semua
                </Link>
            </div>
            
            {/* Simple Reminder Preview */}
            <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="h-10 w-1 bg-pink-500 rounded-full"></div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm text-slate-800">Minum Vitamin</p>
                        <p className="text-xs text-slate-500">10:00 AM • Folamil Genio</p>
                    </div>
                    <input type="checkbox" className="rounded-full w-5 h-5 text-pink-600 border-slate-300 focus:ring-pink-500" />
                </div>
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
                <Card key={article.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl">
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
                            <span className="text-xs text-slate-400">
                                Minggu {article.min_week}-{article.max_week}
                            </span>
                        </div>
                        <h3 className="font-semibold text-slate-900 text-lg mb-2 leading-tight">
                            {article.title}
                        </h3>
                        <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                            {article.content}
                        </p>
                    </div>
                </Card>
             ))
         ) : (
             <div className="text-center py-10">
                 <p className="text-slate-500">Belum ada artikel yang sesuai untuk fase ini.</p>
                 <Link href={route('profile.setup')} className="text-pink-500 underline text-sm mt-2 block">
                    Cek Profil Kesehatan
                 </Link>
             </div>
         )}
      </main>

      <MobileNav />
    </div>
  );
}
