import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Check, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import welcomeImage from '../../images/welcome.svg';
import { careMom, login } from '@/routes';

export default function Landing() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { auth } = usePage<any>().props;
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowInstallButton(false);
        }

        setDeferredPrompt(null);
    };

    const features = [
        "Informasi & edukasi kesehatan",
        "Konsultasi dengan dokter",
        "Pengingat jadwal kesehatan",
        "Komunitas ibu yang mendukung"
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
            <Head title="Welcome to MomSync" />
            
            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Desktop Left Image Section (Hidden on Mobile) */}
                <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-pink-50 to-purple-50 items-center justify-center p-12 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-30">
                         <div className="absolute w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-3xl -top-32 -left-32"></div>
                         <div className="absolute w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-3xl bottom-0 right-0"></div>
                    </div>

                    <img 
                        src={welcomeImage} 
                        alt="MomSync Illustration" 
                        className="w-full max-w-2xl h-auto object-contain drop-shadow-2xl relative z-10 animate-fade-in-up" 
                    />
                </div>

                {/* Right Content Section (Mobile: Full View) */}
                <div className="flex-1 w-full lg:w-1/2 bg-slate-50 lg:bg-white flex flex-col relative">
                     {/* Mobile Background Elements */}
                     <div className="absolute inset-0 overflow-hidden lg:hidden pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-linear-to-b from-purple-50/50 to-transparent"></div>
                     </div>

                    <div className="flex-1 flex flex-col h-full lg:justify-center px-6 py-8 lg:px-24 sm:max-w-md sm:mx-auto lg:max-w-full lg:mx-0">
                        {/* Header Section */}
                        <div className="text-center lg:text-left pt-4 sm:pt-0 z-10">
                            <div className="flex justify-center lg:justify-start mb-6">
                                <div className="w-12 h-12 bg-linear-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200/50 transform rotate-3">
                                    <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </div>
                            </div>
                            
                            <h1 className="text-3xl lg:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-600 to-purple-700 mb-2 lg:mb-4">
                                MomSync
                            </h1>
                            
                            <p className="text-xs lg:text-sm font-bold tracking-widest text-slate-400 uppercase mb-4 lg:mb-6">
                                Aplikasi M-Health untuk Ibu
                            </p>

                            <p className="text-sm lg:text-lg text-slate-600 leading-relaxed px-4 lg:px-0 mb-8 lg:mb-12">
                                Pendampingan komprehensif sejak kehamilan, persalinan, nifas, hingga menyusui dengan bantuan AI.
                            </p>
                        </div>

                        {/* Mobile Image (Hidden on Desktop) */}
                        <div className="lg:hidden flex-1 flex items-center justify-center -my-4 relative z-0 overflow-hidden">
                             <div className="absolute inset-0 bg-radial-gradient from-purple-100/40 to-transparent opacity-70 scale-150"></div>
                             <img 
                                src={welcomeImage} 
                                alt="Mother and Baby" 
                                className="w-full max-w-[300px] h-auto object-contain drop-shadow-xl z-10" 
                             />
                        </div>

                        {/* Features & CTA */}
                        <div className="mt-auto lg:mt-0 bg-white lg:bg-transparent rounded-t-[40px] lg:rounded-none p-8 lg:p-0 -mx-6 lg:mx-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] lg:shadow-none z-10 relative">
                            <div className="space-y-5 mb-8">
                                {features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group">
                                        <div className="shrink-0 w-5 h-5 lg:w-8 lg:h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-200 group-hover:scale-110 transition-transform">
                                            <Check className="w-3 h-3 lg:w-5 lg:h-5" strokeWidth={3} />
                                        </div>
                                        <span className="text-sm lg:text-base font-medium text-slate-600 lg:text-slate-700 group-hover:text-slate-900 transition-colors">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* PWA Install Button */}
                            {showInstallButton && (
                                <div className="mb-4">
                                    <Button 
                                        onClick={handleInstallClick}
                                        variant="outline"
                                        className="w-full h-12 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 rounded-full font-semibold flex items-center justify-center gap-2 group"
                                    >
                                        <div className="w-6 h-6 bg-linear-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                                            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                            </svg>
                                        </div>
                                        Install Aplikasi
                                        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                                    </Button>
                                </div>
                            )}

                            <Link href={auth.user ? careMom() : login()} className="block">
                                <Button className="w-full h-14 lg:h-16 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full text-lg lg:text-xl font-bold shadow-xl shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-2 group">
                                    {auth.user ? "Dashboard" : "Mulai Sekarang"}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                             <p className="mt-6 text-[10px] lg:text-xs text-center lg:text-left text-slate-400">
                                Kesehatan Anda adalah prioritas kami
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

