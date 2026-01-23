"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { User, Mail, Building2, Shield, Save } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

export default function ProfilePage() {
    const [saving, setSaving] = useState(false)

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1000))

        toast.success("Profil mis à jour avec succès")
        setSaving(false)
    }

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header alertCount={0} />
                <main className="flex-1 overflow-auto p-6">
                    <div className="mx-auto max-w-4xl space-y-6">
                        {/* Page Header */}
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
                            <p className="text-muted-foreground">Gérez vos informations personnelles</p>
                        </div>

                        {/* Profile Form */}
                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Personal Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Informations Personnelles
                                    </CardTitle>
                                    <CardDescription>
                                        Vos informations de base
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">Prénom</Label>
                                            <Input
                                                id="firstName"
                                                defaultValue="Admin"
                                                placeholder="Votre prénom"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Nom</Label>
                                            <Input
                                                id="lastName"
                                                defaultValue="Campus"
                                                placeholder="Votre nom"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                defaultValue="admin@smartcampus.com"
                                                className="pl-10"
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Téléphone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            defaultValue="+212 6 12 34 56 78"
                                            placeholder="+212 ..."
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Professional Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="h-5 w-5" />
                                        Informations Professionnelles
                                    </CardTitle>
                                    <CardDescription>
                                        Votre rôle et département
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="role">Rôle</Label>
                                            <div className="relative">
                                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="role"
                                                    defaultValue="Administrateur"
                                                    className="pl-10"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Département</Label>
                                            <Input
                                                id="department"
                                                defaultValue="Direction Générale"
                                                placeholder="Votre département"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="matricule">Matricule</Label>
                                        <Input
                                            id="matricule"
                                            defaultValue="ADM-2024-001"
                                            disabled
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Security */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sécurité</CardTitle>
                                    <CardDescription>
                                        Gérez votre mot de passe
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline">
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={saving} className="gap-2">
                                    {saving ? (
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
                        </form>
                    </div>
                </main>
            </div>
        </div>
    )
}
