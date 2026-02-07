import { Head, Link, router } from "@inertiajs/react";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MobileNav from "@/components/MobileNav";

interface Article {
    id: number;
    title: string;
    category: string;
    thumbnail: string;
    created_at: string;
}

export default function ArticleIndex({ articles }: { articles: Article[] }) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
            router.delete(route('doctor.articles.destroy', id));
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 pb-20">
            <Head title="Manajemen Artikel" />
            
            <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <Link href="/care-mom">
                         <ArrowLeft className="h-6 w-6 text-slate-600" />
                    </Link>
                    <h1 className="text-lg font-bold text-slate-800">Manajemen Artikel</h1>
                </div>
                <Link href={route('doctor.articles.create')}>
                    <Button className="bg-pink-600 hover:bg-pink-700 flex gap-2">
                        <Plus className="h-4 w-4" /> Tambah
                    </Button>
                </Link>
            </div>

            <div className="p-4 space-y-4">
                {articles.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                        Belum ada artikel.
                    </div>
                ) : (
                    articles.map((article) => (
                        <Card key={article.id} className="p-4 flex gap-4 items-start">
                            <div className="h-20 w-20 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                                {article.thumbnail ? (
                                    <img src={article.thumbnail} alt={article.title} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">No Img</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-800 truncate">{article.title}</h3>
                                <Badge variant="secondary" className="mt-1">{article.category}</Badge>
                                <p className="text-xs text-slate-500 mt-2">
                                    {new Date(article.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Link href={route('doctor.articles.edit', article.id)}>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-8 w-8 text-red-600"
                                    onClick={() => handleDelete(article.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <MobileNav />
        </div>
    );
}
