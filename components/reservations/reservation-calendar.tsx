"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Reservation {
  id: number
  title: string
  startTime: string
  endTime: string
  status: string
  roomName: string
  buildingName: string
}

interface ReservationCalendarProps {
  reservations: Reservation[]
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
}

export function ReservationCalendar({ reservations }: ReservationCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

  const getReservationsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return reservations.filter((r) => {
      const resDate = new Date(r.startTime)
      return (
        resDate.getDate() === date.getDate() &&
        resDate.getMonth() === date.getMonth() &&
        resDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-32 border border-border bg-muted/30" />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayReservations = getReservationsForDay(day)
    const isToday =
      day === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear()

    days.push(
      <div key={day} className={cn("h-32 border border-border p-1 overflow-hidden", isToday && "bg-primary/5")}>
        <div className={cn("text-sm font-medium mb-1", isToday && "text-primary")}>{day}</div>
        <div className="space-y-1">
          {dayReservations.slice(0, 2).map((res) => (
            <div
              key={res.id}
              className={cn(
                "text-xs p-1 rounded truncate border",
                statusColors[res.status as keyof typeof statusColors],
              )}
            >
              {res.title}
            </div>
          ))}
          {dayReservations.length > 2 && (
            <div className="text-xs text-muted-foreground">+{dayReservations.length - 2} autres</div>
          )}
        </div>
      </div>,
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-0">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground border-b">
              {day}
            </div>
          ))}
          {days}
        </div>
        <div className="mt-4 flex gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={statusColors.confirmed}>
              Confirmée
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={statusColors.pending}>
              En attente
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={statusColors.cancelled}>
              Annulée
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
