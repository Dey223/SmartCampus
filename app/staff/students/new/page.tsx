"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function NewStudentPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData)

        try {
            const res = await fetch("/api/staff/students", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" }
            })

            if (!res.ok) throw new Error("Erreur lors de l'enregistrement")

            toast.success("Étudiant inscrit avec succès !")
            router.push("/staff")
            router.refresh()
        } catch (error) {
            toast.error("Impossible d'inscrire l'étudiant. Vérifiez les données.")
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
                    <h1 className="text-2xl font-bold text-slate-900">Nouvelle Inscription</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Prénom</label>
                                <input required name="firstName" className="w-full p-2 border rounded-md" placeholder="Jean" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nom</label>
                                <input required name="lastName" className="w-full p-2 border rounded-md" placeholder="Dupont" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Étudiant</label>
                            <input required type="email" name="email" className="w-full p-2 border rounded-md" placeholder="jean.dupont@student.campus.com" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Numéro Étudiant (ID)</label>
                            <input required name="studentId" className="w-full p-2 border rounded-md" placeholder="STU-2024-XXX" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Programme / Filière</label>
                            <select name="program" className="w-full p-2 border rounded-md bg-white">
                                <option value="cs">Informatique (CS)</option>
                                <option value="eng">Ingénierie</option>
                                <option value="bus">Business School</option>
                                <option value="art">Arts & Design</option>
                            </select>
                        </div>

                        <div className="pt-4">
                            <button
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirmer l'inscription
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
