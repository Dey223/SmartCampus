"use client"

import { useState } from 'react'
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UserPlus, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function NewStaffPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            department: formData.get('department'),
            position: formData.get('position'),
            hire_date: formData.get('hire_date'),
        }

        try {
            const response = await fetch('/api/admin/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                toast.success('Membre du personnel ajouté avec succès')
                router.push('/admin/staff')
            } else {
                const error = await response.json()
                toast.error(error.error || 'Erreur lors de l\'ajout')
            }
        } catch (error) {
            toast.error('Erreur lors de l\'ajout du membre')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header alertCount={0} />
                <main className="flex-1 overflow-auto p-6">
                    <div className="mx-auto max-w-3xl space-y-6">
                        {/* Page Header */}
                        <div>
                            <Link href="/admin/staff">
                                <Button variant="ghost" className="gap-2 mb-4">
                                    <ArrowLeft className="h-4 w-4" />
                                    Retour
                                </Button>
                            </Link>
                            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                                <UserPlus className="h-8 w-8" />
                                Ajouter un Membre du Personnel
                            </h1>
                            <p className="text-muted-foreground">
                                Enregistrez un nouveau membre du personnel
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informations du Personnel</CardTitle>
                                    <CardDescription>
                                        Remplissez les informations du nouveau membre
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Personal Info */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">
                                                Prénom <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="first_name"
                                                name="first_name"
                                                placeholder="Jean"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">
                                                Nom <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="last_name"
                                                name="last_name"
                                                placeholder="Dupont"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Email <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="jean.dupont@campus.com"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Téléphone</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="+212 6 12 34 56 78"
                                            />
                                        </div>
                                    </div>

                                    {/* Professional Info */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Département</Label>
                                            <Select name="department">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Direction Générale">Direction Générale</SelectItem>
                                                    <SelectItem value="Informatique">Informatique</SelectItem>
                                                    <SelectItem value="Sciences">Sciences</SelectItem>
                                                    <SelectItem value="Lettres">Lettres</SelectItem>
                                                    <SelectItem value="Administration">Administration</SelectItem>
                                                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                                                    <SelectItem value="Bibliothèque">Bibliothèque</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="position">Poste</Label>
                                            <Input
                                                id="position"
                                                name="position"
                                                placeholder="Professeur, Technicien, etc."
                                            />
                                        </div>
                                    </div>

                                    {/* Hire Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="hire_date">Date d'embauche</Label>
                                        <Input
                                            id="hire_date"
                                            name="hire_date"
                                            type="date"
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-4 pt-4 border-t">
                                        <Link href="/admin/staff">
                                            <Button type="button" variant="outline">
                                                Annuler
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={loading} className="gap-2">
                                            {loading ? (
                                                <>
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    Enregistrement...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4" />
                                                    Enregistrer
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    )
}
