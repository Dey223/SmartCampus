"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Room {
  id: number
  name: string
  roomNumber: string
  capacity: number
  roomType: string
  floor: number
  buildingName: string
  buildingCode: string
  currentOccupancy: number
  occupancyRate: number
}

interface PresenceHeatmapProps {
  rooms: Room[]
}

export function PresenceHeatmap({ rooms }: PresenceHeatmapProps) {
  const buildings = [...new Set(rooms.map((r) => r.buildingName))]

  const getHeatColor = (rate: number) => {
    if (rate >= 80) return "bg-red-500"
    if (rate >= 60) return "bg-orange-400"
    if (rate >= 40) return "bg-yellow-400"
    if (rate >= 20) return "bg-emerald-400"
    return "bg-emerald-200"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carte Thermique d'Occupation</CardTitle>
        <CardDescription>Visualisation de l'occupation par salle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {buildings.map((building) => {
            const buildingRooms = rooms.filter((r) => r.buildingName === building)
            const floors = [...new Set(buildingRooms.map((r) => r.floor))].sort((a, b) => b - a)

            return (
              <div key={building} className="space-y-4">
                <h3 className="font-semibold">{building}</h3>
                <div className="space-y-2">
                  {floors.map((floor) => {
                    const floorRooms = buildingRooms.filter((r) => r.floor === floor)
                    return (
                      <div key={floor} className="flex items-center gap-2">
                        <span className="w-20 text-sm text-muted-foreground">Étage {floor}</span>
                        <div className="flex flex-wrap gap-1">
                          {floorRooms.map((room) => (
                            <div
                              key={room.id}
                              className={cn(
                                "h-10 w-16 rounded flex items-center justify-center text-xs font-medium text-white cursor-pointer transition-transform hover:scale-105",
                                getHeatColor(room.occupancyRate),
                              )}
                              title={`${room.name} (${room.roomNumber}): ${room.currentOccupancy}/${room.capacity} - ${room.occupancyRate}%`}
                            >
                              {room.occupancyRate}%
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <span className="text-sm text-muted-foreground">Faible</span>
          <div className="flex gap-1">
            <div className="h-4 w-8 rounded bg-emerald-200" />
            <div className="h-4 w-8 rounded bg-emerald-400" />
            <div className="h-4 w-8 rounded bg-yellow-400" />
            <div className="h-4 w-8 rounded bg-orange-400" />
            <div className="h-4 w-8 rounded bg-red-500" />
          </div>
          <span className="text-sm text-muted-foreground">Élevé</span>
        </div>
      </CardContent>
    </Card>
  )
}
