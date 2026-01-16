"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Building {
  id: number
  name: string
  code: string
  currentOccupancy: number
  totalCapacity: number
  occupancyRate: number
}

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
  sensorType: string
  occupancyRate: number
}

interface BuildingOccupancyProps {
  buildings: Building[]
  rooms: Room[]
}

export function BuildingOccupancy({ buildings, rooms }: BuildingOccupancyProps) {
  const [expandedBuilding, setExpandedBuilding] = useState<number | null>(null)

  const getOccupancyColor = (rate: number) => {
    if (rate >= 80) return "text-red-600"
    if (rate >= 50) return "text-amber-600"
    return "text-emerald-600"
  }

  const getOccupancyBg = (rate: number) => {
    if (rate >= 80) return "bg-red-100"
    if (rate >= 50) return "bg-amber-100"
    return "bg-emerald-100"
  }

  return (
    <div className="space-y-4">
      {buildings.map((building) => {
        const buildingRooms = rooms.filter((r) => r.buildingCode === building.code)
        const isExpanded = expandedBuilding === building.id

        return (
          <Card key={building.id}>
            <CardHeader className="cursor-pointer" onClick={() => setExpandedBuilding(isExpanded ? null : building.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{building.name}</CardTitle>
                    <CardDescription>{building.code}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={cn("text-2xl font-bold", getOccupancyColor(building.occupancyRate))}>
                      {building.occupancyRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {building.currentOccupancy} / {building.totalCapacity}
                    </p>
                  </div>
                  <div className={cn("rounded-full p-2", getOccupancyBg(building.occupancyRate))}>
                    <Users className={cn("h-5 w-5", getOccupancyColor(building.occupancyRate))} />
                  </div>
                </div>
              </div>
              <Progress value={building.occupancyRate} className="mt-3 h-2" />
            </CardHeader>

            {isExpanded && (
              <CardContent className="border-t pt-4">
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {buildingRooms.map((room) => (
                    <div key={room.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {room.roomNumber} • Étage {room.floor}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={cn(getOccupancyBg(room.occupancyRate), "border-0")}>
                          {room.currentOccupancy}/{room.capacity}
                        </Badge>
                        <p className="mt-1 text-xs text-muted-foreground">{room.occupancyRate}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
