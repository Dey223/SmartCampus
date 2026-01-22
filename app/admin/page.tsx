import { sql } from "@/lib/db"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { KPICard } from "@/components/dashboard/kpi-card"
import { EnergyChart } from "@/components/dashboard/energy-chart"
import { OccupancyChart } from "@/components/dashboard/occupancy-chart"
import { AlertsList } from "@/components/dashboard/alerts-list"
import { RecentReservations } from "@/components/dashboard/recent-reservations"
import { MaintenanceSummary } from "@/components/dashboard/maintenance-summary"
import { EnergyPredictionCard } from "@/components/dashboard/energy-prediction-card"
import { Zap, CalendarDays, Wrench, Building2 } from "lucide-react"

async function getDashboardData() {
  // Get KPI data
  const [buildingsCount] = await sql`SELECT COUNT(*) as count FROM buildings`
  const [roomsCount] = await sql`SELECT COUNT(*) as count FROM rooms`

  // Get today's energy consumption
  const energyToday = await sql`
    SELECT 
      COALESCE(SUM(CASE WHEN reading_type = 'electricity' THEN value ELSE 0 END), 0) as total_electricity,
      COALESCE(SUM(CASE WHEN reading_type = 'solar' THEN value ELSE 0 END), 0) as total_solar
    FROM energy_readings 
    WHERE recorded_at >= CURRENT_DATE
  `

  // Get current occupancy
  const occupancyData = await sql`
    SELECT 
      b.name as building,
      COALESCE(SUM(p.occupancy_count), 0) as occupancy,
      COALESCE(SUM(r.capacity), 0) as capacity
    FROM buildings b
    LEFT JOIN rooms r ON r.building_id = b.id
    LEFT JOIN (
      SELECT DISTINCT ON (room_id) room_id, occupancy_count
      FROM presence_readings
      ORDER BY room_id, recorded_at DESC
    ) p ON p.room_id = r.id
    GROUP BY b.id, b.name
    ORDER BY b.name
  `

  // Get maintenance stats
  const maintenanceStats = await sql`
    SELECT 
      COUNT(*) FILTER (WHERE status = 'open') as open,
      COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
      COUNT(*) FILTER (WHERE status = 'pending_parts') as pending_parts,
      COUNT(*) FILTER (WHERE status IN ('resolved', 'closed')) as resolved,
      COUNT(*) as total
    FROM maintenance_tickets
  `

  // Get recent maintenance tickets
  const recentTickets = await sql`
    SELECT 
      mt.id,
      mt.title,
      mt.priority,
      mt.status,
      b.name as building
    FROM maintenance_tickets mt
    JOIN buildings b ON b.id = mt.building_id
    ORDER BY mt.created_at DESC
    LIMIT 5
  `

  // Get today's reservations count
  const [reservationsToday] = await sql`
    SELECT COUNT(*) as count 
    FROM reservations 
    WHERE DATE(start_time) = CURRENT_DATE
    AND status != 'cancelled'
  `

  // Get recent reservations
  const recentReservations = await sql`
    SELECT 
      res.id,
      res.title,
      r.name as room,
      b.name as building,
      TO_CHAR(res.start_time, 'HH24:MI') as start_time,
      TO_CHAR(res.end_time, 'HH24:MI') as end_time,
      res.attendees_count as attendees,
      res.status
    FROM reservations res
    JOIN rooms r ON r.id = res.room_id
    JOIN buildings b ON b.id = r.building_id
    ORDER BY res.created_at DESC
    LIMIT 5
  `

  // Generate mock energy chart data (hourly for last 24h)
  const energyChartData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, "0")}:00`,
    electricity: Math.floor(Math.random() * 500) + 200,
    solar: i >= 6 && i <= 18 ? Math.floor(Math.random() * 300) + 50 : 0,
  }))

  // Calculate occupancy percentages
  const occupancyChartData = occupancyData.map((row: { building: string; occupancy: number; capacity: number }) => ({
    building: row.building,
    occupancy: row.capacity > 0 ? Math.round((Number(row.occupancy) / Number(row.capacity)) * 100) : 0,
    capacity: 100,
  }))

  // Generate mock alerts
  const alerts = [
    {
      id: 1,
      type: "energy" as const,
      title: "Consommation électrique élevée",
      description: "Le Bâtiment Sciences dépasse le seuil de 1000 kWh/h",
      severity: "high" as const,
      timestamp: "Il y a 15 min",
      building: "Bâtiment Sciences",
    },
    {
      id: 2,
      type: "temperature" as const,
      title: "Température anormale",
      description: "Salle 101 - température de 28°C détectée",
      severity: "medium" as const,
      timestamp: "Il y a 45 min",
      building: "Bâtiment Principal",
    },
    {
      id: 3,
      type: "maintenance" as const,
      title: "Maintenance préventive requise",
      description: "Climatisation Lab 201 - échéance dépassée",
      severity: "critical" as const,
      timestamp: "Il y a 2h",
      building: "Bâtiment Sciences",
    },
  ]

  return {
    kpis: {
      buildings: Number(buildingsCount.count),
      rooms: Number(roomsCount.count),
      energyToday: Math.round(Number(energyToday[0]?.total_electricity || 0)),
      solarToday: Math.round(Number(energyToday[0]?.total_solar || 0)),
      reservationsToday: Number(reservationsToday.count),
      openTickets: Number(maintenanceStats[0]?.open || 0),
    },
    energyChartData,
    occupancyChartData,
    alerts,
    maintenanceStats: {
      open: Number(maintenanceStats[0]?.open || 0),
      inProgress: Number(maintenanceStats[0]?.in_progress || 0),
      pendingParts: Number(maintenanceStats[0]?.pending_parts || 0),
      resolved: Number(maintenanceStats[0]?.resolved || 0),
      total: Number(maintenanceStats[0]?.total || 0),
    },
    recentTickets: recentTickets.map(
      (t: { id: number; title: string; priority: string; status: string; building: string }) => ({
        id: t.id,
        title: t.title,
        priority: t.priority as "low" | "medium" | "high" | "critical",
        status: t.status,
        building: t.building,
      }),
    ),
    recentReservations: recentReservations.map(
      (r: {
        id: number
        title: string
        room: string
        building: string
        start_time: string
        end_time: string
        attendees: number
        status: string
      }) => ({
        id: r.id,
        title: r.title,
        room: r.room,
        building: r.building,
        startTime: r.start_time,
        endTime: r.end_time,
        attendees: r.attendees,
        status: r.status as "pending" | "confirmed" | "cancelled",
      }),
    ),
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header alertCount={data.alerts.length} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-balance">Tableau de Bord</h1>
              <p className="text-muted-foreground">Vue d'ensemble du campus en temps réel</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Bâtiments"
                value={data.kpis.buildings}
                icon={Building2}
                iconColor="text-blue-600"
                iconBgColor="bg-blue-100"
              />
              <KPICard
                title="Consommation Aujourd'hui"
                value={data.kpis.energyToday.toLocaleString()}
                unit="kWh"
                change={-5.2}
                changeLabel="vs. hier"
                icon={Zap}
                iconColor="text-amber-600"
                iconBgColor="bg-amber-100"
              />
              <KPICard
                title="Réservations Aujourd'hui"
                value={data.kpis.reservationsToday}
                change={12}
                changeLabel="vs. hier"
                icon={CalendarDays}
                iconColor="text-emerald-600"
                iconBgColor="bg-emerald-100"
              />
              <KPICard
                title="Tickets Ouverts"
                value={data.kpis.openTickets}
                change={-8}
                changeLabel="vs. semaine dernière"
                icon={Wrench}
                iconColor="text-red-600"
                iconBgColor="bg-red-100"
              />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              <EnergyChart data={data.energyChartData} />
              <OccupancyChart data={data.occupancyChartData} />
            </div>

            {/* Python AI Prediction */}
            <EnergyPredictionCard />

            {/* Bottom Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              <AlertsList alerts={data.alerts} />
              <RecentReservations reservations={data.recentReservations} />
              <MaintenanceSummary stats={data.maintenanceStats} recentTickets={data.recentTickets} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
