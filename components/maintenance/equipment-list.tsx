"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, AlertTriangle, CheckCircle2, Wrench, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Equipment {
  id: number
  name: string
  equipmentType: string
  serialNumber: string
  purchaseDate: string
  warrantyExpires: string | null
  lastMaintenance: string | null
  nextMaintenance: string | null
  status: string
  buildingName: string
  roomName: string | null
  roomNumber: string | null
}

interface EquipmentListProps {
  equipment: Equipment[]
}

const statusConfig = {
  operational: { label: "Opérationnel", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
  maintenance: { label: "En maintenance", color: "bg-blue-100 text-blue-800", icon: Wrench },
  repair: { label: "En réparation", color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
  decommissioned: { label: "Hors service", color: "bg-gray-100 text-gray-800", icon: XCircle },
}

export function EquipmentList({ equipment }: EquipmentListProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  const isMaintenanceOverdue = (nextMaintenance: string | null) => {
    if (!nextMaintenance) return false
    return new Date(nextMaintenance) < new Date()
  }

  const isMaintenanceSoon = (nextMaintenance: string | null) => {
    if (!nextMaintenance) return false
    const date = new Date(nextMaintenance)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays > 0 && diffDays <= 30
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Équipements</CardTitle>
        <CardDescription>{filteredEquipment.length} équipement(s)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou numéro de série..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="operational">Opérationnel</SelectItem>
              <SelectItem value="maintenance">En maintenance</SelectItem>
              <SelectItem value="repair">En réparation</SelectItem>
              <SelectItem value="decommissioned">Hors service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Équipement</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Emplacement</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Dernière Maintenance</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Prochaine Maintenance</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map((item) => {
                  const status = statusConfig[item.status as keyof typeof statusConfig]
                  const StatusIcon = status?.icon || CheckCircle2
                  const overdue = isMaintenanceOverdue(item.nextMaintenance)
                  const soon = isMaintenanceSoon(item.nextMaintenance)

                  return (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.equipmentType} • {item.serialNumber}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {item.buildingName}
                        {item.roomName && <span className="text-muted-foreground"> - {item.roomName}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn("text-xs", status?.color)}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {status?.label || item.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{formatDate(item.lastMaintenance)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "text-sm",
                            overdue && "text-red-600 font-medium",
                            soon && !overdue && "text-amber-600",
                          )}
                        >
                          {formatDate(item.nextMaintenance)}
                          {overdue && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              En retard
                            </Badge>
                          )}
                          {soon && !overdue && (
                            <Badge variant="outline" className="ml-2 text-xs border-amber-300 text-amber-700">
                              Bientôt
                            </Badge>
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
