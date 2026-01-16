import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnergyStatsProps {
  title: string
  value: number
  unit: string
  change: number
  icon: LucideIcon
  color: "amber" | "orange" | "blue" | "emerald"
  invertTrend?: boolean
}

const colorClasses = {
  amber: { icon: "text-amber-600", bg: "bg-amber-100" },
  orange: { icon: "text-orange-600", bg: "bg-orange-100" },
  blue: { icon: "text-blue-600", bg: "bg-blue-100" },
  emerald: { icon: "text-emerald-600", bg: "bg-emerald-100" },
}

export function EnergyStats({ title, value, unit, change, icon: Icon, color, invertTrend = false }: EnergyStatsProps) {
  const isPositive = invertTrend ? change > 0 : change < 0
  const isNegative = invertTrend ? change < 0 : change > 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight">{value.toLocaleString()}</span>
              <span className="text-sm font-medium text-muted-foreground">{unit}</span>
            </div>
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                isPositive ? "text-emerald-600" : isNegative ? "text-red-600" : "text-muted-foreground",
              )}
            >
              {change > 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : change < 0 ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
              <span>
                {change > 0 ? "+" : ""}
                {change}% vs. hier
              </span>
            </div>
          </div>
          <div className={cn("rounded-lg p-3", colorClasses[color].bg)}>
            <Icon className={cn("h-6 w-6", colorClasses[color].icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
