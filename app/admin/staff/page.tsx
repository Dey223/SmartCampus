"use client"

import { useEffect, useState } from 'react'
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Plus, Search, Edit, Trash2, Mail, Phone, Building2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface StaffMember {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string | null
    department: string | null
    position: string | null
    hire_date: string | null
    status: 'active' | 'inactive' | 'on_leave'
    created_at: string
}

export default function StaffManagementPage() {
    const [staff, setStaff] = useState<StaffMember[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [staffToDelete, setStaffToDelete] = useState<number | null>(null)

    useEffect(() => {
        fetchStaff()
    }, [])

    const fetchStaff = async () => {
        try {
            const response = await fetch('/api/admin/staff')
            const data = await response.json()
            setStaff(data.staff || [])
        } catch (error) {
            toast.error('Erreur lors du chargement du personnel')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!staffToDelete) return

        try {
            const response = await fetch(`/api/admin/staff?id=${staffToDelete}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                toast.success('Membre du personnel supprimé')
                fetchStaff()
            } else {
                toast.error('Erreur lors de la suppression')
            }
        } catch (error) {
            toast.error('Erreur lors de la suppression')
        } finally {
            setDeleteDialogOpen(false)
            setStaffToDelete(null)
        }
    }

    const filteredStaff = staff.filter(member =>
        `${member.first_name} ${member.last_name} ${member.email} ${member.department || ''}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    )

    const getStatusBadge = (status: string) => {
        const variants = {
            active: 'default',
            inactive: 'secondary',
            on_leave: 'outline'
        } as const

        const labels = {
            active: 'Actif',
            inactive: 'Inactif',
            on_leave: 'En congé'
        }

        return (
            <Badge variant={variants[status as keyof typeof variants]}>
                {labels[status as keyof typeof labels]}
            </Badge>
        )
    }

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header alertCount={0} />
                <main className="flex-1 overflow-auto p-6">
                    <div className="mx-auto max-w-7xl space-y-6">
                        {/* Page Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                                    <Users className="h-8 w-8" />
                                    Gestion du Personnel
                                </h1>
                                <p className="text-muted-foreground">
                                    Gérez les membres du personnel de l'université
                                </p>
                            </div>
                            <Link href="/admin/staff/new">
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Ajouter un membre
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardDescription>Total Personnel</CardDescription>
                                    <CardTitle className="text-3xl">{staff.length}</CardTitle>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardDescription>Actifs</CardDescription>
                                    <CardTitle className="text-3xl text-green-600">
                                        {staff.filter(s => s.status === 'active').length}
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardDescription>En congé</CardDescription>
                                    <CardTitle className="text-3xl text-amber-600">
                                        {staff.filter(s => s.status === 'on_leave').length}
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </div>

                        {/* Staff Table */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Liste du Personnel</CardTitle>
                                    <div className="relative w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Rechercher..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="text-center py-8">Chargement...</div>
                                ) : filteredStaff.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        Aucun membre du personnel trouvé
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nom</TableHead>
                                                <TableHead>Contact</TableHead>
                                                <TableHead>Département</TableHead>
                                                <TableHead>Poste</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredStaff.map((member) => (
                                                <TableRow key={member.id}>
                                                    <TableCell className="font-medium">
                                                        {member.first_name} {member.last_name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1 text-sm">
                                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                                <Mail className="h-3 w-3" />
                                                                {member.email}
                                                            </div>
                                                            {member.phone && (
                                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                                    <Phone className="h-3 w-3" />
                                                                    {member.phone}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {member.department ? (
                                                            <div className="flex items-center gap-1">
                                                                <Building2 className="h-3 w-3 text-muted-foreground" />
                                                                {member.department}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{member.position || '-'}</TableCell>
                                                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="icon">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Dialog open={deleteDialogOpen && staffToDelete === member.id} onOpenChange={(open) => {
                                                                setDeleteDialogOpen(open)
                                                                if (!open) setStaffToDelete(null)
                                                            }}>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => setStaffToDelete(member.id)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Confirmer la suppression</DialogTitle>
                                                                        <DialogDescription>
                                                                            Êtes-vous sûr de vouloir supprimer {member.first_name} {member.last_name} ?
                                                                            Cette action est irréversible.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="flex justify-end gap-2">
                                                                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                                                            Annuler
                                                                        </Button>
                                                                        <Button variant="destructive" onClick={handleDelete}>
                                                                            Supprimer
                                                                        </Button>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
