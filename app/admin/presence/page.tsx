import { sql } from "@/lib/db"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PresenceHeatmap } from "@/components/presence/presence-heatmap"
import { BuildingOccupancy } from "@/components/presence/building-occupancy"
import { OccupancyTrends } from "@/components/presence/occupancy-trends"
import { Users, TrendingUp, Building2, Activity } from "lucide-react"

async function getPresenceData() {
  // Get current occupancy by building
  const buildingOccupancy = await sql`
    SELECT 
      b.id,
      b.name,
      b.code,
      COALESCE(SUM(p.occupancy_count), 0) as current_occupancy,
      COALESCE(SUM(r.capacity), 0) as total_capacity
    FROM buildings b
    LEFT JOIN rooms r ON r.building_id = b.id
    LEFT JOIN (
      SELECT DISTINCT ON (room_id) room_id, occupancy_count
      FROM presence_readings
      ORDER BY room_id, recorded_at DESC
    ) p ON p.room_id = r.id
    GROUP BY b.id, b.name, b.code
    ORDER BY b.name
  `

  // Get room-level occupancy
  const roomOccupancy = await sql`
    SELECT 
      r.id,
      r.name,
      r.code as room_number,
      r.capacity,
      r.room_type,
      r.floor,
      b.name as building_name,
      b.code as building_code,
      COALESCE(p.occupancy_count, 0) as current_occupancy
    FROM rooms r
    JOIN buildings b ON b.id = r.building_id
    LEFT JOIN (
      SELECT DISTINCT ON (room_id) room_id, occupancy_count
      FROM presence_readings
      ORDER BY room_id, recorded_at DESC
    ) p ON p.room_id = r.id
    ORDER BY b.name, r.name
  `

  // Get hourly occupancy trends
  const hourlyTrends = await sql`
    SELECT 
      DATE_TRUNC('hour', recorded_at) as hour,
      SUM(occupancy_count) as total_occupancy
    FROM presence_readings
    WHERE recorded_at >= NOW() - INTERVAL '24 hours'
    GROUP BY DATE_TRUNC('hour', recorded_at)
    ORDER BY hour
  `

  // Calculate totals
  const totalOccupancy = buildingOccupancy.reduce(
    (sum: number, b: { current_occupancy: number }) => sum + Number(b.current_occupancy),
    0,
  )
  const totalCapacity = buildingOccupancy.reduce(
    (sum: number, b: { total_capacity: number }) => sum + Number(b.total_capacity),
    0,
  )

  return {
    buildings: buildingOccupancy.map(
      (b: {
        id: number
        name: string
        code: string
        current_occupancy: number
        total_capacity: number
      }) => ({
        id: b.id,
        name: b.name,
        code: b.code,
        currentOccupancy: Number(b.current_occupancy),
        totalCapacity: Number(b.total_capacity),
        occupancyRate:
          b.total_capacity > 0 ? Math.round((Number(b.current_occupancy) / Number(b.total_capacity)) * 100) : 0,
      }),
    ),
    rooms: roomOccupancy.map(
      (r: {
        id: number
        name: string
        room_number: string
        capacity: number
        room_type: string
        floor: number
        building_name: string
        building_code: string
        current_occupancy: number
      }) => ({
        id: r.id,
        name: r.name,
        roomNumber: r.room_number,
        capacity: r.capacity,
        roomType: r.room_type,
        floor: r.floor,
        buildingName: r.building_name,
        buildingCode: r.building_code,
        currentOccupancy: Number(r.current_occupancy),
        occupancyRate: r.capacity > 0 ? Math.round((Number(r.current_occupancy) / r.capacity) * 100) : 0,
      }),
    ),
    hourlyTrends: hourlyTrends.map((h: { hour: string; total_occupancy: number }) => ({
      time: new Date(h.hour).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      occupancy: Number(h.total_occupancy),
    })),
    totals: {
      currentOccupancy: totalOccupancy,
      totalCapacity: totalCapacity,
      occupancyRate: totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0,
    },
  }
}

export default async function PresencePage() {
  const data = await getPresenceData()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-balance">Module Présence</h1>
              <p className="text-muted-foreground">Suivi de l'occupation des espaces en temps réel</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Occupation Totale</p>
                      <p className="text-3xl font-bold">{data.totals.currentOccupancy}</p>
                      <p className="text-xs text-muted-foreground">personnes sur le campus</p>
                    </div>
                    <div className="rounded-lg bg-blue-100 p-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taux d'Occupation</p>
                      <p className="text-3xl font-bold">{data.totals.occupancyRate}%</p>
                      <p className="text-xs text-muted-foreground">de la capacité</p>
                    </div>
                    <div className="rounded-lg bg-emerald-100 p-3">
                      <TrendingUp className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bâtiments Actifs</p>
                      <p className="text-3xl font-bold">
                        {data.buildings.filter((b: { currentOccupancy: number }) => b.currentOccupancy > 0).length}
                      </p>
                      <p className="text-xs text-muted-foreground">sur {data.buildings.length}</p>
                    </div>
                    <div className="rounded-lg bg-amber-100 p-3">
                      <Building2 className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Capacité Totale</p>
                      <p className="text-3xl font-bold">{data.totals.totalCapacity}</p>
                      <p className="text-xs text-muted-foreground">places disponibles</p>
                    </div>
                    <div className="rounded-lg bg-purple-100 p-3">
                      <Activity className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="buildings">Par Bâtiment</TabsTrigger>
                <TabsTrigger value="heatmap">Carte thermique</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <OccupancyTrends data={data.hourlyTrends} />
              </TabsContent>

              <TabsContent value="buildings" className="space-y-6">
                <BuildingOccupancy buildings={data.buildings} rooms={data.rooms} />
              </TabsContent>

              <TabsContent value="heatmap" className="space-y-6">
                <PresenceHeatmap rooms={data.rooms} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
