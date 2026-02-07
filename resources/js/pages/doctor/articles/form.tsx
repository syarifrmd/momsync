import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import RichTextEditor from "@/components/RichTextEditor";
import { useState } from "react";
import { toast } from "sonner";

interface Article {
    id?: number;
    title: string;
    category: string;
    content: string;
    thumbnail: string | null;
    min_week: number | null;
    max_week: number | null;
}

interface Props {
    article?: Article;
}

export default function ArticleForm({ article }: Props) {
    const isEditing = !!article;
    
    // Initial values
    const { data, setData, post, processing, errors } = useForm({
        title: article?.title || '',
        category: article?.category || 'Umum',
        content: article?.content || '',
        thumbnail: null as File | null,
        min_week: article?.min_week || '',
        max_week: article?.max_week || '',
        _method: isEditing ? 'PUT' : 'POST',
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(article?.thumbnail || null);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const routeName = isEditing ? 'doctor.articles.update' : 'doctor.articles.store';
        const routeParams = isEditing ? article.id : undefined;

        post(route(routeName, routeParams), {
            forceFormData: true,
            onSuccess: () => {
                toast.success(`Artikel berhasil ${isEditing ? 'diperbarui' : 'dibuat'}`);
            },
            onError: (err) => {
                console.error(err);
                toast.error('Gagal menyimpan artikel. Periksa input Anda.');
            }
        });
    };

    const categories = [
        "Umum",
        "Trimester 1",
        "Trimester 2",
        "Trimester 3",
        "Nutrisi",
        "Olahraga",
        "Mental Health",
        "Persiapan Melahirkan"
    ];

    return (
        <div className="min-h-screen bg-pink-50 pb-20">
            <Head title={isEditing ? "Edit Artikel" : "Tambah Artikel Baru"} />
            
            <div className="bg-white p-4 shadow-sm flex items-center gap-2 sticky top-0 z-10">
                <Link href={route('doctor.articles.index')}>
                     <ArrowLeft className="h-6 w-6 text-slate-600" />
                </Link>
                <h1 className="text-lg font-bold text-slate-800">
                    {isEditing ? "Edit Artikel" : "Tambah Artikel Baru"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-3xl mx-auto">
                
                {/* Image Upload */}
                <div className="space-y-2">
                    <Label>Thumbnail</Label>
                    <Card className="p-4 border-dashed border-2 flex flex-col items-center justify-center gap-2 relative bg-slate-50 overflow-hidden min-h-[150px]">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                        ) : null}
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <Upload className="h-8 w-8 text-slate-400" />
                            <span className="text-xs text-slate-500 mt-1">Upload gambar (Max 2MB)</span>
                            <Input 
                                type="file" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                accept="image/*"
                                onChange={handleThumbnailChange}
                            />
                        </div>
                    </Card>
                    {errors.thumbnail && <p className="text-red-500 text-xs">{errors.thumbnail}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title">Judul Artikel</Label>
                    <Input 
                        id="title" 
                        value={data.title} 
                        onChange={e => setData('title', e.target.value)}
                        placeholder="Masukkan judul artikel..."
                    />
                    {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">Kategori</Label>
                        <select 
                            id="category"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            value={data.category}
                            onChange={e => setData('category', e.target.value)}
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="min_week">Minggu Min (Opsional)</Label>
                        <Input 
                            id="min_week" 
                            type="number"
                            value={data.min_week} 
                            onChange={e => setData('min_week', e.target.value)}
                            placeholder="Contoh: 1"
                        />
                        {errors.min_week && <p className="text-red-500 text-xs">{errors.min_week}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="max_week">Minggu Max (Opsional)</Label>
                        <Input 
                            id="max_week" 
                            type="number"
                            value={data.max_week} 
                            onChange={e => setData('max_week', e.target.value)}
                            placeholder="Contoh: 12"
                        />
                        {errors.max_week && <p className="text-red-500 text-xs">{errors.max_week}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Konten</Label>
                    <div className="border rounded-md">
                        <RichTextEditor 
                            value={data.content}
                            onChange={(content) => setData('content', content)}
                            placeholder="Tulis konten artikel lengkap disini..."
                            className="min-h-[400px]"
                        />
                    </div>
                    {errors.content && <p className="text-red-500 text-xs">{errors.content}</p>}
                </div>

                <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={processing}>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
                </Button>

            </form>
        </div>
    );
}
