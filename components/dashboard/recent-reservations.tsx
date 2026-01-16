import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface Reservation {
  id: number
  title: string
  room: string
  building: string
  startTime: string
  endTime: string
  attendees: number
  status: "pending" | "confirmed" | "cancelled"
}

interface RecentReservationsProps {
  reservations: Reservation[]
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

const statusLabels = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
}

export function RecentReservations({ reservations }: RecentReservationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Réservations Récentes</CardTitle>
        <CardDescription>Dernières réservations de salles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="flex items-start gap-4 rounded-lg border p-4">
              <div className="rounded-full bg-primary/10 p-2">
                <CalendarDays className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{reservation.title}</p>
                  <Badge variant="outline" className={cn("text-xs", statusColors[reservation.status])}>
                    {statusLabels[reservation.status]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {reservation.room} • {reservation.building}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {reservation.startTime} - {reservation.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{reservation.attendees} participants</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
