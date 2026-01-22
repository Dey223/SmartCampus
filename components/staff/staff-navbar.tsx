"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import { BookOpen, Search, Settings, Menu, Home, Megaphone, AlertTriangle, Calendar, UserPlus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function StaffNavbar() {
    const [isOpen, setIsOpen] = useState(false)

    const NavContent = () => (
        <div className="flex flex-col gap-4 mt-8">
            <Link href="/staff" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                <Home className="h-5 w-5 text-slate-500" />
                <span className="font-medium text-slate-700">Tableau de bord</span>
            </Link>
            <div className="h-px bg-slate-100 my-2" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">Actions Rapides</p>
            <Link href="/staff/students/new" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                <UserPlus className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-slate-700">Nouvelle Inscription</span>
            </Link>
            <Link href="/staff/planning/new" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                <Calendar className="h-5 w-5 text-purple-500" />
                <span className="font-medium text-slate-700">Planifier Cours</span>
            </Link>
            <Link href="/staff/incidents/new" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="font-medium text-slate-700">Signaler Incident</span>
            </Link>
            <Link href="/staff/announcements/new" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                <Megaphone className="h-5 w-5 text-emerald-500" />
                <span className="font-medium text-slate-700">Envoyer Annonce</span>
            </Link>
            <div className="h-px bg-slate-100 my-2" />
            <Link href="/staff/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                <Settings className="h-5 w-5 text-slate-500" />
                <span className="font-medium text-slate-700">Paramètres</span>
            </Link>
            <button
                onClick={() => {
                    setIsOpen(false)
                    if (confirm("Se déconnecter ?")) {
                        fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/login")
                    }
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-left transition-colors"
            >
                <div className="h-5 w-5 rounded-full border-2 border-red-500" />
                <span className="font-medium text-red-600">Déconnexion</span>
            </button>
        </div>
    )

    return (
        <nav className="h-16 bg-white border-b flex items-center px-4 md:px-6 justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
                {/* Mobile Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden -ml-2">
                            <Menu className="h-6 w-6 text-slate-600" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-2 text-left">
                                <div className="bg-blue-600 p-1.5 rounded-lg">
                                    <BookOpen className="h-4 w-4 text-white" />
                                </div>
                                Smart Campus Staff
                            </SheetTitle>
                        </SheetHeader>
                        <NavContent />
                    </SheetContent>
                </Sheet>

                {/* Logo */}
                <Link href="/staff" className="flex items-center gap-2">
                    <div className="bg-blue-600 p-2 rounded-lg hidden md:block">
                        <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-slate-800 truncate">Staff Portal</span>
                </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        className="w-full bg-slate-100/50 border-none rounded-full h-9 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Rechercher étudiant, salle..."
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">
                <Link href="/staff/settings" className="hidden md:block">
                    <Button variant="ghost" size="icon" className="rounded-full text-slate-600 hover:bg-slate-100">
                        <Settings className="h-5 w-5" />
                    </Button>
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div role="button" className="h-9 w-9 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-blue-700 cursor-pointer hover:shadow-md transition-all">
                            JD
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col">
                                <span>Jean Dupont</span>
                                <span className="text-xs font-normal text-muted-foreground">staff@campus.com</span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href="/staff/settings">
                            <DropdownMenuItem className="cursor-pointer">Paramètres</DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={async () => {
                                if (confirm("Se déconnecter ?")) {
                                    await fetch("/api/auth/logout", { method: "POST" })
                                    window.location.href = "/login"
                                }
                            }}
                        >
                            Déconnexion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}
