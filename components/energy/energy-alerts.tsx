import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Zap, Thermometer, CheckCircle2 } from "lucide-react"

const mockAlerts = [
  {
    id: 1,
    type: "consumption",
    title: "Consommation électrique anormale",
    description: "Le Bâtiment Sciences dépasse de 25% la consommation moyenne",
    building: "Bâtiment Sciences",
    severity: "high",
    timestamp: "Il y a 15 min",
    resolved: false,
  },
  {
    id: 2,
    type: "temperature",
    title: "Température élevée détectée",
    description: "La salle serveur atteint 28°C - seuil critique à 30°C",
    building: "Bâtiment Informatique",
    severity: "critical",
    timestamp: "Il y a 30 min",
    resolved: false,
  },
  {
    id: 3,
    type: "consumption",
    title: "Pic de consommation d'eau",
    description: "Augmentation soudaine de 40% dans la Bibliothèque",
    building: "Bibliothèque Centrale",
    severity: "medium",
    timestamp: "Il y a 1h",
    resolved: false,
  },
  {
    id: 4,
    type: "consumption",
    title: "Consommation nocturne",
    description: "Consommation anormale détectée entre 2h et 4h",
    building: "Bâtiment Administration",
    severity: "low",
    timestamp: "Il y a 6h",
    resolved: true,
  },
]

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

export function EnergyAlerts() {
  const activeAlerts = mockAlerts.filter((a) => !a.resolved)
  const resolvedAlerts = mockAlerts.filter((a) => a.resolved)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Alertes Actives
          </CardTitle>
          <CardDescription>{activeAlerts.length} alerte(s) nécessitant attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeAlerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-4 rounded-lg border p-4">
              <div
                className={`rounded-full p-2 ${alert.severity === "critical" ? "bg-red-100" : alert.severity === "high" ? "bg-orange-100" : "bg-yellow-100"}`}
              >
                {alert.type === "temperature" ? (
                  <Thermometer
                    className={`h-4 w-4 ${alert.severity === "critical" ? "text-red-600" : "text-orange-600"}`}
                  />
                ) : (
                  <Zap className={`h-4 w-4 ${alert.severity === "high" ? "text-orange-600" : "text-yellow-600"}`} />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{alert.title}</p>
                  <Badge variant="outline" className={severityColors[alert.severity as keyof typeof severityColors]}>
                    {severityLabels[alert.severity as keyof typeof severityLabels]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {alert.building} • {alert.timestamp}
                  </span>
                  <Button variant="outline" size="sm">
                    Traiter
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Alertes Résolues
          </CardTitle>
          <CardDescription>Historique des alertes traitées</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resolvedAlerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-4 rounded-lg border border-dashed p-4 opacity-60">
              <div className="rounded-full bg-emerald-100 p-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium line-through">{alert.title}</p>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
                <span className="text-xs text-muted-foreground">
                  {alert.building} • Résolu {alert.timestamp}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
