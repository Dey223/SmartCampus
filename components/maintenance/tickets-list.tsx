"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, MapPin, User, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Ticket {
  id: number
  title: string
  description: string
  priority: string
  status: string
  category: string
  reportedBy: string
  assignedTo: string | null
  createdAt: string
  buildingName: string
  roomName: string | null
  roomNumber: string | null
}

interface TicketsListProps {
  tickets: Ticket[]
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

const priorityLabels = {
  low: "Faible",
  medium: "Moyen",
  high: "Élevé",
  critical: "Critique",
}

const statusColors = {
  open: "bg-orange-100 text-orange-800",
  in_progress: "bg-blue-100 text-blue-800",
  pending_parts: "bg-yellow-100 text-yellow-800",
  resolved: "bg-emerald-100 text-emerald-800",
  closed: "bg-gray-100 text-gray-800",
}

const statusLabels = {
  open: "Ouvert",
  in_progress: "En cours",
  pending_parts: "En attente",
  resolved: "Résolu",
  closed: "Fermé",
}

const categoryLabels: Record<string, string> = {
  electrical: "Électricité",
  plumbing: "Plomberie",
  hvac: "CVC",
  structural: "Structure",
  cleaning: "Nettoyage",
  security: "Sécurité",
  it: "Informatique",
}

export function TicketsList({ tickets }: TicketsListProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets de Maintenance</CardTitle>
        <CardDescription>{filteredTickets.length} ticket(s)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="open">Ouverts</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="pending_parts">En attente</SelectItem>
              <SelectItem value="resolved">Résolus</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="critical">Critique</SelectItem>
              <SelectItem value="high">Élevée</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Faible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="flex items-start gap-4 rounded-lg border p-4">
              <div
                className={cn(
                  "mt-1 h-3 w-3 rounded-full shrink-0",
                  ticket.priority === "critical"
                    ? "bg-red-500"
                    : ticket.priority === "high"
                      ? "bg-orange-500"
                      : ticket.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-blue-500",
                )}
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{ticket.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{ticket.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs", priorityColors[ticket.priority as keyof typeof priorityColors])}>
                      {priorityLabels[ticket.priority as keyof typeof priorityLabels]}
                    </Badge>
                    <Badge className={cn("text-xs", statusColors[ticket.status as keyof typeof statusColors])}>
                      {statusLabels[ticket.status as keyof typeof statusLabels]}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir détails</DropdownMenuItem>
                        <DropdownMenuItem>Assigner</DropdownMenuItem>
                        <DropdownMenuItem>Changer statut</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Fermer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {ticket.buildingName}
                      {ticket.roomName && ` - ${ticket.roomName}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{ticket.reportedBy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {categoryLabels[ticket.category] || ticket.category}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
