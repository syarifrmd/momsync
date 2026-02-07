import { Link, usePage } from "@inertiajs/react";
import { Heart, User, Video, MessageSquare, Bot, FileText, Calendar } from "lucide-react";

export default function MobileNav() {
  const { url, auth } = usePage<any>().props;
  // Safely access user role, default to guest/user if confusing
  const user = auth?.user;
  const isDoctor = user?.role === 'doctor';

  const userItems = [
    { label: "Care", icon: Heart, href: "/care-mom", activeMatch: "/care-mom" },
    { label: "Forum", icon: MessageSquare, href: "/forum", activeMatch: "/forum" },
    { label: "Konsultasi", icon: Video, href: "/consultation", activeMatch: "/consultation" },
    // { label: "Profil", icon: User, href: "/profile/setup", activeMatch: "/profile" },
  ];
  
  // Make sure to include Profile for users if it was there before
  const finalUserItems = [
      ...userItems,
      { label: "Profil", icon: User, href: "/profile/setup", activeMatch: "/profile" }
  ];

  const doctorItems = [
    { label: "Care", icon: Heart, href: "/care-mom", activeMatch: "/care-mom" },
    { label: "Diskusi", icon: MessageSquare, href: "/forum", activeMatch: "/forum" },
    { label: "Jadwal", icon: Calendar, href: "/doctor/consultations", activeMatch: "/doctor/consultations" },
    { label: "Artikel", icon: FileText, href: "/doctor/articles", activeMatch: "/doctor/articles" },
  ];

  const navItems = isDoctor ? doctorItems : finalUserItems;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="flex items-center justify-between">
          {navItems.map((item) => {
             const isActive = url?.startsWith(item.activeMatch) || false;
             return (
              <Link 
                key={item.label} 
                href={item.href} 
                className={`flex flex-col items-center justify-center gap-1 min-w-[60px] py-1 rounded-lg transition-colors ${isActive ? "text-pink-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? "fill-current" : "stroke-current"}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      
       {/* Floating AI - Optional to hide for doctors if needed */}
       <div className="fixed bottom-20 right-4 z-50">
            <Link href="/assistant">
                <div className="bg-linear-to-r from-teal-400 to-teal-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 pr-4 animate-bounce-slow">
                    <div className="bg-white/20 p-1.5 rounded-full">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-sm">Tanya AI</span>
                </div>
            </Link>
       </div>
    </>
  );
}
