import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Building2, Zap, Droplets, Flame, Thermometer } from "lucide-react"

interface BuildingEnergyCardProps {
  building: {
    id: number
    name: string
    code: string
    total_area_sqm: number
    electricity_kwh: number
    gas_m3: number
    water_liters: number
    solar_generation_kwh: number
    temperature_celsius: number
  }
}

export function BuildingEnergyCard({ building }: BuildingEnergyCardProps) {
  const energyEfficiency = Math.min(
    100,
    Math.round((Number(building.solar_generation_kwh) / Math.max(1, Number(building.electricity_kwh))) * 100),
  )
  const tempStatus =
    Number(building.temperature_celsius) > 25 ? "high" : Number(building.temperature_celsius) < 18 ? "low" : "normal"

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{building.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{building.code}</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={
              tempStatus === "high"
                ? "border-red-200 bg-red-50 text-red-700"
                : tempStatus === "low"
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }
          >
            <Thermometer className="mr-1 h-3 w-3" />
            {Number(building.temperature_celsius).toFixed(1)}°C
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-amber-50 p-2">
            <Zap className="mx-auto h-4 w-4 text-amber-600" />
            <p className="mt-1 text-sm font-semibold">{Number(building.electricity_kwh).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">kWh</p>
          </div>
          <div className="rounded-lg bg-orange-50 p-2">
            <Flame className="mx-auto h-4 w-4 text-orange-600" />
            <p className="mt-1 text-sm font-semibold">{Number(building.gas_m3).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">m³</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-2">
            <Droplets className="mx-auto h-4 w-4 text-blue-600" />
            <p className="mt-1 text-sm font-semibold">{Number(building.water_liters).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">L</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Efficacité solaire</span>
            <span className="font-medium">{energyEfficiency}%</span>
          </div>
          <Progress value={energyEfficiency} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
