"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function NewPlanningPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData)

        try {
            const res = await fetch("/api/staff/courses", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" }
            })

            if (!res.ok) throw new Error("Erreur de planification")

            toast.success("Cours planifié avec succès !")
            router.push("/staff")
            router.refresh()
        } catch (error) {
            toast.error("Impossible de planifier le cours.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/staff" className="p-2 hover:bg-white rounded-full transition-colors">
                        <ArrowLeft className="h-6 w-6 text-slate-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Planifier un Cours</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Intitulé du Cours</label>
                            <input required name="title" className="w-full p-2 border rounded-md" placeholder="Introduction à l'IA" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date</label>
                                <input required type="date" name="date" className="w-full p-2 border rounded-md" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Heure Début</label>
                                <input required type="time" name="startTime" className="w-full p-2 border rounded-md" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Durée (heures)</label>
                                <select name="duration" className="w-full p-2 border rounded-md bg-white">
                                    <option value="1">1h</option>
                                    <option value="1.5">1h30</option>
                                    <option value="2">2h</option>
                                    <option value="3">3h</option>
                                    <option value="4">4h</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Salle</label>
                                <select name="roomId" required className="w-full p-2 border rounded-md bg-white">
                                    {/* In a real app, fetch from API. Hardcoded IDs for demo based on seed */}
                                    <option value="1">Amphi A (Bat. Principal)</option>
                                    <option value="2">Amphi B (Bat. Principal)</option>
                                    <option value="3">Salle 101 (Bat. Sciences)</option>
                                    <option value="4">Labo Info 1 (Bat. Sciences)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Professeur</label>
                            <input required name="professor" className="w-full p-2 border rounded-md" placeholder="M. Dupont" />
                        </div>

                        <div className="pt-4">
                            <button
                                disabled={isLoading}
                                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex justify-center items-center"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Planifier le cours
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
