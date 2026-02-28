import Link from "next/link";
import { ShieldCheck, Store, UserCircle, ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#f4f7fa] flex flex-col items-center justify-center p-6 sm:p-12">
            <div className="max-w-4xl w-full space-y-8 text-center">
                <div className="space-y-3">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                        Welcome to FinFint
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Your unified platform for managing clients, tracking service requests, and handling kiosk commissions. Select a portal to get started.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {/* Admin Card */}
                    <Link href="/dashboard/admin" className="group">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-violet-200 transition-all duration-300 h-full flex flex-col items-start text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldCheck className="w-32 h-32 text-violet-600" />
                            </div>
                            <div className="h-14 w-14 rounded-xl bg-violet-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                                <ShieldCheck className="w-7 h-7 text-violet-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Portal</h2>
                            <p className="text-slate-500 mb-8 grow">Manage all users, kiosks, services, requests, and monitor overall payment history.</p>
                            <div className="flex items-center text-violet-600 font-medium group-hover:translate-x-1 transition-transform">
                                Access Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </div>
                    </Link>

                    {/* Kiosk Card */}
                    <Link href="/dashboard/kiosk" className="group">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 h-full flex flex-col items-start text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Store className="w-32 h-32 text-emerald-600" />
                            </div>
                            <div className="h-14 w-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                                <Store className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Agent Portal</h2>
                            <p className="text-slate-500 mb-8 grow">Manage your clients, submit service requests on their behalf, and track commissions.</p>
                            <div className="flex items-center text-emerald-600 font-medium group-hover:translate-x-1 transition-transform">
                                Access Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </div>
                    </Link>

                    {/* Client Card */}
                    <Link href="/dashboard/client" className="group">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-sky-200 transition-all duration-300 h-full flex flex-col items-start text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <UserCircle className="w-32 h-32 text-sky-600" />
                            </div>
                            <div className="h-14 w-14 rounded-xl bg-sky-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                                <UserCircle className="w-7 h-7 text-sky-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Client Portal</h2>
                            <p className="text-slate-500 mb-8 grow">Track your submitted requests, upload required documents, and view history.</p>
                            <div className="flex items-center text-sky-600 font-medium group-hover:translate-x-1 transition-transform">
                                Access Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
