"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function NewIncidentPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData)

        try {
            const res = await fetch("/api/staff/incidents", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" }
            })

            if (!res.ok) throw new Error("Erreur de signalement")

            toast.success("Incident signalé avec succès.")
            router.push("/staff")
            router.refresh()
        } catch (error) {
            toast.error("Impossible de signaler l'incident.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-amber-50/30 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/staff" className="p-2 hover:bg-white rounded-full transition-colors">
                        <ArrowLeft className="h-6 w-6 text-slate-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Signaler un Incident</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
                    <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-800 rounded-lg mb-6 text-sm">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                        <p>Ce formulaire génère un ticket de maintenance qui sera traité par l'équipe technique.</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Titre de l'incident</label>
                            <input required name="title" className="w-full p-2 border rounded-md" placeholder="Fuite d'eau, Projecteur cassé..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Lieu (Bâtiment/Salle)</label>
                                <input required name="location" className="w-full p-2 border rounded-md" placeholder="Bat. A, Salle 101" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Catégorie</label>
                                <select name="category" className="w-full p-2 border rounded-md bg-white">
                                    <option value="plumbing">Plomberie</option>
                                    <option value="electrical">Électricité</option>
                                    <option value="hvac">Chauffage / Clim</option>
                                    <option value="furniture">Mobilier</option>
                                    <option value="cleaning">Nettoyage</option>
                                    <option value="security">Sécurité</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Priorité</label>
                            <select name="priority" defaultValue="medium" className="w-full p-2 border rounded-md bg-white">
                                <option value="low">Basse</option>
                                <option value="medium">Moyenne</option>
                                <option value="high">Haute</option>
                                <option value="urgent">Urgente (Sécurité en jeu)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description détaillée</label>
                            <textarea required name="description" className="w-full p-2 border rounded-md min-h-[100px]" placeholder="Décrivez le problème..." />
                        </div>

                        <div className="pt-4">
                            <button
                                disabled={isLoading}
                                className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 flex justify-center items-center"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Soumettre le ticket
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
