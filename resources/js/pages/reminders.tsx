import { Bell, Calendar, CheckCircle2, Clock, Plus, Trash2, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Head } from "@inertiajs/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import MobileNav from "../components/MobileNav";

interface Reminder {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  notes: string;
  completed?: boolean;
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

interface UserProfile {
    stage: string;
    stage_start_date: string;
}

interface Props {
    schedule: ScheduleItem[];
    userProfile: UserProfile | null;
    currentWeek: number;
}

export default function MedicalReminder({ schedule = [], userProfile, currentWeek }: Props) {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const [newReminderOpen, setNewReminderOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    date: "",
    time: "",
    type: "checkup",
    notes: ""
  });

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.date) {
        toast.error("Mohon lengkapi judul dan tanggal");
        return;
    }

    setReminders([...reminders, {
        id: Date.now(),
        ...newReminder
    }]);
    setNewReminderOpen(false);
    setNewReminder({ title: "", date: "", time: "", type: "checkup", notes: "" });
    toast.success("Pengingat berhasil ditambahkan");
  };

  const handleDelete = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
    toast.success("Pengingat dihapus");
  };
  
  const handleToggleComplete = (id: number) => {
      setReminders(reminders.map(r => r.id === id ? {...r, completed: !r.completed} : r));
  };

  const getBadgeColor = (type: string) => {
      switch(type) {
          case 'checkup': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
          case 'usg': return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
          case 'vaccination': return 'bg-green-100 text-green-700 hover:bg-green-100';
          case 'vitamin': return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
          default: return 'bg-slate-100 text-slate-700';
      }
  };

  const translateType = (type: string) => {
      const map: Record<string, string> = {
          'checkup': 'Kontrol',
          'usg': 'USG',
          'vaccination': 'Vaksin',
          'vitamin': 'Vitamin'
      };
      return map[type] || type;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Head title="Jadwal Medis" />
      
       {/* Header */}
       <div className="bg-linear-to-r from-pink-500 to-purple-600 text-white p-6 pb-12 rounded-b-[40px] relative shadow-lg">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold mb-1">Jadwal Medis</h1>
                <p className="text-pink-100 text-sm opacity-90">Jangan lewatkan jadwal penting Bunda</p>
            </div>
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Bell className="w-6 h-6 text-white" />
            </div>
        </div>
      </div>

      <div className="mt-6 px-4 space-y-6">
        {/* Jadwal Medis Otomatis (dari Sistem) */}
        {schedule.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <h3 className="font-bold text-slate-800">Jadwal Medis (Otomatis)</h3>
            </div>
            <p className="text-xs text-slate-500 -mt-1">Jadwal ini dibuat otomatis berdasarkan profil kesehatan Anda</p>
            
            <div className="space-y-2">
              {schedule.map((item, idx) => (
                <Card key={idx} className={`p-4 border-none shadow-sm ${
                  item.status === 'past' ? 'bg-slate-50 opacity-60' : 
                  item.status === 'upcoming' || item.status === 'ongoing' ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-500' : 
                  'bg-white'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-1 rounded-full ${
                      item.status === 'upcoming' || item.status === 'ongoing' ? 'bg-pink-500' : 
                      item.status === 'past' ? 'bg-green-500' : 'bg-slate-300'
                    }`}></div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`font-bold text-slate-800 text-sm ${item.status === 'past' ? 'line-through text-slate-500' : ''}`}>
                          {item.title}
                        </h4>
                        <Badge variant="secondary" className={`text-[10px] shrink-0 ${
                          item.status === 'upcoming' || item.status === 'ongoing' ? 'bg-pink-100 text-pink-700' :
                          item.status === 'past' || item.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {item.status === 'upcoming' ? 'Segera' : 
                           item.status === 'ongoing' ? 'Berlangsung' :
                           item.status === 'past' || item.status === 'completed' ? 'Selesai' : 
                           'Mendatang'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mb-1">{item.description}</p>
                      <p className="text-xs text-pink-600 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </p>
                    </div>

                    {(item.status === 'past' || item.status === 'completed') && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Pengingat Manual (Bisa Ditambah/Hapus User) */}
        {/* Pengingat Manual (Bisa Ditambah/Hapus User) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800">Pengingat Saya</h3>
                <p className="text-xs text-slate-500">Tambahkan pengingat pribadi Anda sendiri</p>
              </div>
              
              <Dialog open={newReminderOpen} onOpenChange={setNewReminderOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 text-xs font-semibold">
                        <Plus className="w-4 h-4 mr-1" /> Tambah Baru
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Buat Pengingat Baru</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Judul Kegiatan</Label>
                            <Input 
                                value={newReminder.title}
                                onChange={(e) => setNewReminder({...newReminder, title: e.target.value})} 
                                placeholder="Contoh: Minum Vitamin"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tanggal</Label>
                                <Input 
                                    type="date" 
                                    value={newReminder.date}
                                    onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Jam</Label>
                                <Input 
                                    type="time"
                                    value={newReminder.time}
                                    onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Jenis</Label>
                            <select 
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={newReminder.type}
                                onChange={(e) => setNewReminder({...newReminder, type: e.target.value})}
                            >
                                <option value="checkup">Kontrol Dokter</option>
                                <option value="usg">USG</option>
                                <option value="vaccination">Vaksinasi</option>
                                <option value="vitamin">Vitamin/Obat</option>
                                <option value="other">Lainnya</option>
                            </select>
                        </div>
                        <Button className="w-full bg-pink-600 mt-2" onClick={handleAddReminder}>Simpan Jadwal</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>

        {reminders.map((reminder) => (
            <Card key={reminder.id} className={`p-4 border-none shadow-sm transition-all ${reminder.completed ? 'opacity-60 bg-slate-50' : 'bg-white'}`}>
                <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className={`font-bold text-slate-800 text-sm ${reminder.completed ? 'line-through text-slate-500' : ''}`}>{reminder.title}</h4>
                            <Badge variant="secondary" className={`text-[10px] shrink-0 ${getBadgeColor(reminder.type)}`}>
                                {translateType(reminder.type)}
                            </Badge>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3" />
                            {reminder.date} • {reminder.time}
                        </p>
                        {reminder.notes && (
                             <p className="text-xs text-slate-400 italic line-clamp-1">{reminder.notes}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => handleToggleComplete(reminder.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${reminder.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}
                        >
                            {reminder.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </button>

                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDelete(reminder.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        ))}
        
        {reminders.length === 0 && (
             <div className="text-center py-8 text-slate-400 bg-white rounded-xl border-2 border-dashed">
                 <Plus className="w-10 h-10 mx-auto mb-2 opacity-30" />
                 <p className="text-sm font-medium">Belum ada pengingat pribadi</p>
                 <p className="text-xs mt-1">Klik "Tambah Baru" untuk membuat pengingat</p>
             </div>
        )}
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
