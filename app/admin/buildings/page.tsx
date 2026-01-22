import { sql } from "@/lib/db"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Layers, Calendar, Ruler } from "lucide-react"

async function getBuildingsData() {
  const buildings = await sql`
    SELECT 
      b.*,
      COUNT(DISTINCT r.id) as room_count,
      COALESCE(SUM(r.capacity), 0) as total_capacity
    FROM buildings b
    LEFT JOIN rooms r ON r.building_id = b.id
    GROUP BY b.id
    ORDER BY b.name
  `

  return buildings.map(
    (b: {
      id: number
      name: string
      code: string
      address: string
      total_area_sqm: number
      floors: number
      year_built: number
      created_at: string
      room_count: number
      total_capacity: number
    }) => ({
      id: b.id,
      name: b.name,
      code: b.code,
      address: b.address,
      totalAreaSqm: b.total_area_sqm,
      floors: b.floors,
      yearBuilt: b.year_built,
      roomCount: Number(b.room_count),
      totalCapacity: Number(b.total_capacity),
    }),
  )
}

export default async function BuildingsPage() {
  const buildings = await getBuildingsData()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-balance">Bâtiments</h1>
              <p className="text-muted-foreground">Gestion des bâtiments du campus</p>
            </div>

            {/* Buildings Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {buildings.map((building) => (
                <Card key={building.id} className="overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-primary/40" />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{building.name}</CardTitle>
                        <CardDescription>{building.code}</CardDescription>
                      </div>
                      <Badge variant="secondary">{building.roomCount} salles</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{building.address}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <span>{building.floors} étages</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{building.yearBuilt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <span>{building.totalAreaSqm.toLocaleString()} m²</span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm">
                        <span className="font-medium">{building.totalCapacity}</span>
                        <span className="text-muted-foreground"> places totales</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
