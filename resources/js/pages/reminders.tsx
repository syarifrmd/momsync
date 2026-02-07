import { Bell, Calendar, CheckCircle2, Clock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

export default function MedicalReminder() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      title: "Kontrol Kandungan",
      date: "2026-01-25",
      time: "10:00",
      type: "checkup",
      notes: "Pemeriksaan rutin bulan ke-6"
    },
    {
      id: 2,
      title: "USG",
      date: "2026-02-05",
      time: "14:00",
      type: "usg",
      notes: "USG 4D untuk melihat perkembangan janin"
    },
    {
      id: 3,
      title: "Vaksinasi Tetanus",
      date: "2026-01-30",
      time: "09:00",
      type: "vaccination",
      notes: "Suntik TT kedua"
    }
  ]);

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
        
        {/* Next Schedule Card - Floating */}
        {reminders.length > 0 && (
            <div className="absolute -bottom-16 left-4 right-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center justify-between">
                <div>
                     <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Jadwal Berikutnya</p>
                     <h3 className="font-bold text-slate-800 text-lg">{reminders[0].title}</h3>
                     <div className="flex items-center gap-2 text-sm text-pink-600 font-medium mt-1">
                        <Clock className="w-4 h-4" />
                        {new Date(reminders[0].date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })} • {reminders[0].time}
                     </div>
                </div>
                <div className="h-12 w-1 bg-pink-500 rounded-full"></div>
            </div>
        )}
      </div>

      <div className="mt-20 px-4 space-y-4">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800">Daftar Pengingat</h3>
            
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
            <Card key={reminder.id} className={`p-4 border-none shadow-sm flex items-center gap-4 transition-all ${reminder.completed ? 'opacity-60 bg-slate-50' : 'bg-white'}`}>
                <button 
                  onClick={() => handleToggleComplete(reminder.id)}
                  className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${reminder.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}
                >
                    {reminder.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                </button>
                
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-bold text-slate-800 ${reminder.completed ? 'line-through text-slate-500' : ''}`}>{reminder.title}</h4>
                        <Badge variant="secondary" className={`text-[10px] ${getBadgeColor(reminder.type)}`}>
                            {translateType(reminder.type)}
                        </Badge>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mb-1">
                        <Calendar className="w-3 h-3" />
                        {reminder.date} • {reminder.time}
                    </p>
                    {reminder.notes && (
                         <p className="text-xs text-slate-400 italic line-clamp-1">{reminder.notes}</p>
                    )}
                </div>

                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="shrink-0 h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(reminder.id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </Card>
        ))}
        
        {reminders.length === 0 && (
             <div className="text-center py-10 text-slate-400">
                 <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                 <p>Belum ada jadwal pengingat.</p>
             </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
}
