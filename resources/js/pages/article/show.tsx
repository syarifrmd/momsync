import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    thumbnail: string | null;
    created_at: string;
    min_week: number | null;
    max_week: number | null;
    doctor?: {
        name: string;
        specialization?: string;
    };
}

interface Props {
    article: Article;
}

export default function ArticleShow({ article }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-white pb-20 font-sans">
            <Head title={article.title} />

            {/* Sticky Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 px-4 py-3 flex items-center justify-between">
                <Link href="/care-mom">
                    <Button variant="ghost" size="icon" className="-ml-2 hover:bg-slate-100 rounded-full">
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </Button>
                </Link>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-slate-500">
                        <Share2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-4">
                {/* Hero Image */}
                {article.thumbnail && (
                    <div className="rounded-2xl overflow-hidden mb-6 shadow-sm aspect-video bg-slate-100">
                        <img 
                            src={article.thumbnail} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Meta Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-pink-50 text-pink-600 hover:bg-pink-100 border-none px-3 py-1">
                        {article.category}
                    </Badge>
                    {(article.min_week && article.max_week) && (
                        <Badge variant="outline" className="text-slate-500 border-slate-200">
                            Minggu {article.min_week}-{article.max_week}
                        </Badge>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-6">
                    {article.title}
                </h1>

                {/* Author Info */}
                <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                    <Avatar className="h-10 w-10 border border-slate-100">
                        <AvatarImage src="/placeholder-doctor.jpg" />
                        <AvatarFallback className="bg-pink-100 text-pink-600">
                            Dr
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">
                            {article.doctor?.name || "Dr. MomSync"}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(article.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                5 menit baca
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <article 
                    className="prose prose-pink prose-slate max-w-none 
                    prose-p:text-slate-600 prose-p:leading-relaxed 
                    prose-headings:text-slate-900 prose-headings:font-bold
                    prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-xl prose-img:shadow-sm"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </main>
        </div>
    );
}
