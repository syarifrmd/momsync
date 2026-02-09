import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { send } from '@/routes/verification';
import type { SharedData } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Profile({
    mustVerifyEmail,
    status,
    doctor,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    doctor?: { hospital_name: string; specialization: string } | null;
}) {
    const { auth } = usePage<SharedData>().props;
    const isDoctor = auth.user.role === 'doctor';

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Head title="Edit Profile" />

            {/* Header with gradient and back button */}
            <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 pb-24 shadow-lg sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                     <Link href={isDoctor ? "/care-mom" : "/dashboard"} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-white" />
                     </Link>
                     <h1 className="text-xl font-bold">Edit Profil</h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 -mt-16 pb-12 relative z-20">
                <Card className="shadow-lg border-none">
                    <CardHeader className="pb-4 border-b border-slate-100">
                        <CardTitle className="text-xl text-slate-800">Informasi Pribadi</CardTitle>
                        <CardDescription>Perbarui nama, email, dan informasi profesional Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Form
                            {...ProfileController.update.form({
                                name: auth.user.name,
                                email: auth.user.email,
                                hospital_name: doctor?.hospital_name || '',
                                specialization: doctor?.specialization || '',
                            })}
                            options={{
                                preserveScroll: true,
                            }}
                            className="space-y-6"
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <div className="grid gap-3">
                                        <Label htmlFor="name" className="text-slate-700">Nama Lengkap</Label>
                                        <Input
                                            id="name"
                                            className="block w-full border-slate-200 focus:ring-pink-500"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="Nama lengkap Anda"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-3">
                                        <Label htmlFor="email" className="text-slate-700">Alamat Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="block w-full border-slate-200 focus:ring-pink-500"
                                            defaultValue={auth.user.email}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="email@contoh.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    
                                    {isDoctor && (
                                        <>
                                            <div className="grid gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                <h3 className="font-semibold text-slate-700 mb-2">Informasi Praktik</h3>
                                                <div className="grid gap-3">
                                                    <Label htmlFor="hospital_name" className="text-slate-700">Rumah Sakit / Klinik</Label>
                                                    <Input
                                                        id="hospital_name"
                                                        className="block w-full border-slate-200 focus:ring-pink-500"
                                                        defaultValue={doctor?.hospital_name || ''}
                                                        name="hospital_name"
                                                        placeholder="Contoh: RSIA Bunda"
                                                    />
                                                </div>

                                                <div className="grid gap-3 mt-2">
                                                    <Label htmlFor="specialization" className="text-slate-700">Spesialisasi / Jabatan</Label>
                                                    <Input
                                                        id="specialization"
                                                        className="block w-full border-slate-200 focus:ring-pink-500"
                                                        defaultValue={doctor?.specialization || ''}
                                                        name="specialization"
                                                        placeholder="Contoh: Dokter Kandungan"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                                        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                                            <p className="text-sm text-yellow-800">
                                                Email Anda belum terverifikasi.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="font-bold underline hover:text-yellow-900"
                                                >
                                                    Kirim ulang link verifikasi
                                                </Link>
                                            </p>

                                            {status === 'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    Link verifikasi baru telah dikirim ke email Anda.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                                        <Button 
                                            disabled={processing} 
                                            className="bg-pink-600 hover:bg-pink-700 text-white min-w-[120px]"
                                        >
                                            {processing ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                                    Menyimpan...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Save className="w-4 h-4" />
                                                    Simpan
                                                </span>
                                            )}
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                                                Tersimpan!
                                            </p>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                <div className="mt-8">
                     <DeleteUser className="max-w-full" />
                </div>
            </main>
        </div>
    );
}

