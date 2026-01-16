import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Zap, Thermometer, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"

interface Alert {
  id: number
  type: "energy" | "temperature" | "maintenance" | "security"
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  timestamp: string
  building: string
}

interface AlertsListProps {
  alerts: Alert[]
}

const alertIcons = {
  energy: Zap,
  temperature: Thermometer,
  maintenance: Wrench,
  security: AlertTriangle,
}

const severityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200",
}

const severityLabels = {
  low: "Faible",
  medium: "Moyen",
  high: "Élevé",
  critical: "Critique",
}

export function AlertsList({ alerts }: AlertsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertes Actives</CardTitle>
        <CardDescription>
          {alerts.length} alerte{alerts.length !== 1 ? "s" : ""} nécessitant attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucune alerte active</p>
          ) : (
            alerts.map((alert) => {
              const Icon = alertIcons[alert.type]
              return (
                <div key={alert.id} className="flex items-start gap-4 rounded-lg border p-4">
                  <div
                    className={cn(
                      "rounded-full p-2",
                      alert.severity === "critical"
                        ? "bg-red-100"
                        : alert.severity === "high"
                          ? "bg-orange-100"
                          : "bg-muted",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        alert.severity === "critical"
                          ? "text-red-600"
                          : alert.severity === "high"
                            ? "text-orange-600"
                            : "text-muted-foreground",
                      )}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{alert.title}</p>
                      <Badge variant="outline" className={cn("text-xs", severityColors[alert.severity])}>
                        {severityLabels[alert.severity]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{alert.building}</span>
                      <span>•</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
