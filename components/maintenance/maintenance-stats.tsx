import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Clock, CheckCircle2, Wrench, AlertOctagon } from "lucide-react"

interface MaintenanceStatsProps {
  stats: {
    open: number
    inProgress: number
    pendingParts: number
    resolved: number
    critical: number
    total: number
  }
}

export function MaintenanceStats({ stats }: MaintenanceStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ouverts</p>
              <p className="text-3xl font-bold text-orange-600">{stats.open}</p>
            </div>
            <div className="rounded-lg bg-orange-100 p-3">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">En Cours</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">En Attente</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingParts}</p>
            </div>
            <div className="rounded-lg bg-yellow-100 p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Résolus</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.resolved}</p>
            </div>
            <div className="rounded-lg bg-emerald-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Critiques</p>
              <p className="text-3xl font-bold text-red-600">{stats.critical}</p>
            </div>
            <div className="rounded-lg bg-red-100 p-3">
              <AlertOctagon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
