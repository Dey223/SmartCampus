"use client"

import { StaffNavbar } from "@/components/staff/staff-navbar"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <StaffNavbar />
            <main className="p-6 max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/staff" className="p-2 hover:bg-white rounded-full transition-colors">
                        <ArrowLeft className="h-6 w-6 text-slate-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6 space-y-8">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Profil</h2>
                        <div className="grid gap-4 max-w-md">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nom complet</label>
                                <input disabled defaultValue="Jean Dupont" className="w-full p-2 border rounded-md bg-slate-50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <input disabled defaultValue="staff@campus.com" className="w-full p-2 border rounded-md bg-slate-50" />
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h2 className="text-lg font-semibold mb-4">Préférences</h2>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3">
                                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-slate-700">Recevoir les notifications par email</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-slate-700">Mode Sombre (Bientôt)</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={() => toast.success("Préférences sauvegardées")}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            <Save className="h-4 w-4" />
                            Enregistrer
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
