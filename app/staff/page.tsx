"use client"

import { Users, Calendar, BookOpen, Bell, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { StaffNavbar } from "@/components/staff/staff-navbar"

export default function StaffPage() {
    const stats = [
        { label: "Étudiants Présents", value: "1,234", icon: Users, color: "blue" },
        { label: "Salles Occupées", value: "45/60", icon: BookOpen, color: "emerald" },
        { label: "Cours en cours", value: "12", icon: Calendar, color: "purple" },
        { label: "Alertes", value: "3", icon: Bell, color: "rose" },
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            <StaffNavbar />

            <main className="p-6 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
                    <p className="text-slate-500">Bienvenue, Jean. Voici un aperçu de l'activité aujourd'hui.</p>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-slate-500 text-sm font-medium">{stat.label}</span>
                                <div className={`p - 2 rounded - lg bg - ${stat.color} -50`}>
                                    <stat.icon className={`h - 5 w - 5 text - ${stat.color} -500`} />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Actions */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-lg font-semibold text-slate-800">Gestion Rapide</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/staff/students/new" className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left group">
                                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Nouvelle Inscription</h3>
                                    <p className="text-xs text-slate-500">Ajouter un étudiant au registre</p>
                                </div>
                                <ArrowUpRight className="ml-auto h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                            </Link>

                            <Link href="/staff/planning/new" className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:border-purple-300 hover:shadow-md transition-all text-left group">
                                <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Planifier un Cours</h3>
                                    <p className="text-xs text-slate-500">Réserver une salle et un créneau</p>
                                </div>
                                <ArrowUpRight className="ml-auto h-4 w-4 text-slate-300 group-hover:text-purple-500" />
                            </Link>

                            <Link href="/staff/incidents/new" className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:border-amber-300 hover:shadow-md transition-all text-left group">
                                <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Signaler Incident</h3>
                                    <p className="text-xs text-slate-500">Créer un ticket de maintenance</p>
                                </div>
                                <ArrowUpRight className="ml-auto h-4 w-4 text-slate-300 group-hover:text-amber-500" />
                            </Link>

                            <Link href="/staff/announcements/new" className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:border-emerald-300 hover:shadow-md transition-all text-left group">
                                <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Envoyer Annonce</h3>
                                    <p className="text-xs text-slate-500">Message groupé aux étudiants</p>
                                </div>
                                <ArrowUpRight className="ml-auto h-4 w-4 text-slate-300 group-hover:text-emerald-500" />
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">Cours en cours</h2>
                            <div className="space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border-l-4 border-blue-500 bg-white shadow-sm">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-slate-900">Introduction à l'IA</h4>
                                            <p className="text-sm text-slate-500">Salle 304 • Prof. Martin</p>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                            En cours
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Notifications / Side */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border shadow-sm p-6 mobile-hidden">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">Notifications</h2>
                            <div className="space-y-4">
                                <div className="flex gap-3 items-start p-3 bg-red-50 rounded-lg">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-red-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-slate-800 font-medium">Alerte Sécurité</p>
                                        <p className="text-xs text-slate-500 mt-1">Porte arrière Bat. B restée ouverte.</p>
                                        <span className="text-[10px] text-slate-400 mt-2 block">Il y a 10 min</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start p-3 bg-blue-50 rounded-lg">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-slate-800 font-medium">Nouvelle Inscription</p>
                                        <p className="text-xs text-slate-500 mt-1">Thomas Anderson (M1 Info)</p>
                                        <span className="text-[10px] text-slate-400 mt-2 block">Il y a 2h</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
