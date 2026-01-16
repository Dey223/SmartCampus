import { sql } from "@/lib/db"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnergyOverviewChart } from "@/components/energy/energy-overview-chart"
import { BuildingEnergyCard } from "@/components/energy/building-energy-card"
import { EnergyAlerts } from "@/components/energy/energy-alerts"
import { EnergyStats } from "@/components/energy/energy-stats"
import { Zap, Droplets, Flame, Sun } from "lucide-react"

async function getEnergyData() {
  // Get all buildings with their latest energy readings
  const buildingsEnergy = await sql`
    SELECT 
      b.id,
      b.name,
      b.code,
      b.total_area_sqm,
      COALESCE(e.electricity_kwh, 0) as electricity_kwh,
      COALESCE(e.gas_m3, 0) as gas_m3,
      COALESCE(e.water_liters, 0) as water_liters,
      COALESCE(e.solar_generation_kwh, 0) as solar_generation_kwh,
      COALESCE(e.temperature_celsius, 20) as temperature_celsius
    FROM buildings b
    LEFT JOIN LATERAL (
      SELECT * FROM energy_readings er
      WHERE er.building_id = b.id
      ORDER BY er.reading_timestamp DESC
      LIMIT 1
    ) e ON true
    ORDER BY b.name
  `

  // Get hourly energy data for the chart (last 24 hours)
  const hourlyData = await sql`
    SELECT 
      DATE_TRUNC('hour', reading_timestamp) as hour,
      SUM(electricity_kwh) as electricity,
      SUM(gas_m3) as gas,
      SUM(water_liters) as water,
      SUM(solar_generation_kwh) as solar
    FROM energy_readings
    WHERE reading_timestamp >= NOW() - INTERVAL '24 hours'
    GROUP BY DATE_TRUNC('hour', reading_timestamp)
    ORDER BY hour
  `

  // Get daily totals for comparison
  const dailyTotals = await sql`
    SELECT 
      SUM(electricity_kwh) as total_electricity,
      SUM(gas_m3) as total_gas,
      SUM(water_liters) as total_water,
      SUM(solar_generation_kwh) as total_solar
    FROM energy_readings
    WHERE reading_timestamp >= CURRENT_DATE
  `

  // Get yesterday's totals for comparison
  const yesterdayTotals = await sql`
    SELECT 
      SUM(electricity_kwh) as total_electricity,
      SUM(gas_m3) as total_gas,
      SUM(water_liters) as total_water,
      SUM(solar_generation_kwh) as total_solar
    FROM energy_readings
    WHERE reading_timestamp >= CURRENT_DATE - INTERVAL '1 day'
    AND reading_timestamp < CURRENT_DATE
  `

  return {
    buildings: buildingsEnergy,
    hourlyData: hourlyData.map(
      (row: { hour: string; electricity: number; gas: number; water: number; solar: number }) => ({
        time: new Date(row.hour).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        electricity: Math.round(Number(row.electricity)),
        gas: Math.round(Number(row.gas)),
        water: Math.round(Number(row.water)),
        solar: Math.round(Number(row.solar)),
      }),
    ),
    todayTotals: {
      electricity: Math.round(Number(dailyTotals[0]?.total_electricity || 0)),
      gas: Math.round(Number(dailyTotals[0]?.total_gas || 0)),
      water: Math.round(Number(dailyTotals[0]?.total_water || 0)),
      solar: Math.round(Number(dailyTotals[0]?.total_solar || 0)),
    },
    yesterdayTotals: {
      electricity: Math.round(Number(yesterdayTotals[0]?.total_electricity || 0)),
      gas: Math.round(Number(yesterdayTotals[0]?.total_gas || 0)),
      water: Math.round(Number(yesterdayTotals[0]?.total_water || 0)),
      solar: Math.round(Number(yesterdayTotals[0]?.total_solar || 0)),
    },
  }
}

export default async function EnergyPage() {
  const data = await getEnergyData()

  const calculateChange = (today: number, yesterday: number) => {
    if (yesterday === 0) return 0
    return Math.round(((today - yesterday) / yesterday) * 100)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-balance">Module Énergie</h1>
                <p className="text-muted-foreground">Suivi de la consommation énergétique du campus</p>
              </div>
              <Badge variant="outline" className="text-sm">
                Mise à jour en temps réel
              </Badge>
            </div>

            {/* Energy Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <EnergyStats
                title="Électricité"
                value={data.todayTotals.electricity}
                unit="kWh"
                change={calculateChange(data.todayTotals.electricity, data.yesterdayTotals.electricity)}
                icon={Zap}
                color="amber"
              />
              <EnergyStats
                title="Gaz"
                value={data.todayTotals.gas}
                unit="m³"
                change={calculateChange(data.todayTotals.gas, data.yesterdayTotals.gas)}
                icon={Flame}
                color="orange"
              />
              <EnergyStats
                title="Eau"
                value={data.todayTotals.water}
                unit="L"
                change={calculateChange(data.todayTotals.water, data.yesterdayTotals.water)}
                icon={Droplets}
                color="blue"
              />
              <EnergyStats
                title="Production Solaire"
                value={data.todayTotals.solar}
                unit="kWh"
                change={calculateChange(data.todayTotals.solar, data.yesterdayTotals.solar)}
                icon={Sun}
                color="emerald"
                invertTrend
              />
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="buildings">Par Bâtiment</TabsTrigger>
                <TabsTrigger value="alerts">Alertes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <EnergyOverviewChart data={data.hourlyData} />
              </TabsContent>

              <TabsContent value="buildings" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.buildings.map(
                    (building: {
                      id: number
                      name: string
                      code: string
                      total_area_sqm: number
                      electricity_kwh: number
                      gas_m3: number
                      water_liters: number
                      solar_generation_kwh: number
                      temperature_celsius: number
                    }) => (
                      <BuildingEnergyCard key={building.id} building={building} />
                    ),
                  )}
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-6">
                <EnergyAlerts />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
