"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Megaphone } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function NewAnnouncementPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData)

        try {
            const res = await fetch("/api/staff/announcements", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" }
            })

            if (!res.ok) throw new Error("Erreur d'envoi")

            toast.success("Annonce envoyée avec succès !")
            router.push("/staff")
            router.refresh()
        } catch (error) {
            toast.error("Impossible d'envoyer l'annonce.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-emerald-50/30 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/staff" className="p-2 hover:bg-white rounded-full transition-colors">
                        <ArrowLeft className="h-6 w-6 text-slate-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Nouvelle Annonce</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6">
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-800 rounded-lg mb-6 text-sm">
                        <Megaphone className="h-5 w-5 flex-shrink-0" />
                        <p>Cette annonce sera visible par tous les étudiants ou le personnel ciblé.</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Titre de l'annonce</label>
                            <input required name="title" className="w-full p-2 border rounded-md" placeholder="Fermeture exceptionnelle..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cible</label>
                                <select name="targetAudience" className="w-full p-2 border rounded-md bg-white">
                                    <option value="all">Tout le campus</option>
                                    <option value="students">Étudiants uniquement</option>
                                    <option value="staff">Personnel uniquement</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Catégorie</label>
                                <select name="category" className="w-full p-2 border rounded-md bg-white">
                                    <option value="general">Général</option>
                                    <option value="event">Événement</option>
                                    <option value="academic">Académique</option>
                                    <option value="emergency">Urgence</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <textarea required name="content" className="w-full p-2 border rounded-md min-h-[150px]" placeholder="Votre message ici..." />
                        </div>

                        <div className="pt-4">
                            <button
                                disabled={isLoading}
                                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex justify-center items-center"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Publier l'annonce
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
