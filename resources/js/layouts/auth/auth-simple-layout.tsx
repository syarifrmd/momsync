import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-linear-to-br from-pink-50 to-purple-50 p-6 md:p-10 relative overflow-hidden">
             {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl -top-32 -left-32"></div>
                <div className="absolute w-[400px] h-[400px] bg-pink-200/40 rounded-full blur-3xl bottom-0 right-0"></div>
            </div>

            <div className="w-full max-w-sm z-10">
                <div className="flex flex-col gap-6 bg-white p-8 rounded-3xl shadow-xl shadow-purple-100">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-200">
                                <Heart className="h-6 w-6 fill-current" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-600 to-purple-700">MomSync</span>
                        </Link>

                        <div className="space-y-1 text-center">
                            <h1 className="text-xl font-bold text-slate-800">{title}</h1>
                            <p className="text-center text-sm text-slate-500">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
