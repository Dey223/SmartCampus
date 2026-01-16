"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Monitor, Users, Accessibility, Video, Search } from "lucide-react"

interface Room {
  id: number
  name: string
  roomNumber: string
  floor: number
  capacity: number
  roomType: string
  hasProjector: boolean
  hasWhiteboard: boolean
  hasVideoConferencing: boolean
  isAccessible: boolean
  buildingName: string
  buildingCode: string
}

interface RoomSelectorProps {
  rooms: Room[]
}

const roomTypeLabels: Record<string, string> = {
  lecture_hall: "Amphithéâtre",
  lab: "Laboratoire",
  office: "Bureau",
  conference: "Salle de conférence",
  common_area: "Espace commun",
}

export function RoomSelector({ rooms }: RoomSelectorProps) {
  const [search, setSearch] = useState("")
  const [buildingFilter, setBuildingFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const buildings = [...new Set(rooms.map((r) => r.buildingName))]
  const roomTypes = [...new Set(rooms.map((r) => r.roomType))]

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(search.toLowerCase()) ||
      room.roomNumber.toLowerCase().includes(search.toLowerCase())
    const matchesBuilding = buildingFilter === "all" || room.buildingName === buildingFilter
    const matchesType = typeFilter === "all" || room.roomType === typeFilter
    return matchesSearch && matchesBuilding && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher une salle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={buildingFilter} onValueChange={setBuildingFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Bâtiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les bâtiments</SelectItem>
                {buildings.map((building) => (
                  <SelectItem key={building} value={building}>
                    {building}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {roomTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {roomTypeLabels[type] || type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => (
          <Card key={room.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{room.name}</CardTitle>
                  <CardDescription>
                    {room.roomNumber} • Étage {room.floor}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{roomTypeLabels[room.roomType] || room.roomType}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{room.buildingName}</p>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{room.capacity} places</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {room.hasProjector && (
                  <Badge variant="outline" className="text-xs">
                    <Monitor className="mr-1 h-3 w-3" />
                    Projecteur
                  </Badge>
                )}
                {room.hasVideoConferencing && (
                  <Badge variant="outline" className="text-xs">
                    <Video className="mr-1 h-3 w-3" />
                    Visio
                  </Badge>
                )}
                {room.isAccessible && (
                  <Badge variant="outline" className="text-xs">
                    <Accessibility className="mr-1 h-3 w-3" />
                    PMR
                  </Badge>
                )}
              </div>

              <Button className="w-full bg-transparent" variant="outline">
                Réserver
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
