import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface MaintenanceSummaryProps {
  stats: {
    open: number
    inProgress: number
    pendingParts: number
    resolved: number
    total: number
  }
  recentTickets: {
    id: number
    title: string
    priority: "low" | "medium" | "high" | "critical"
    status: string
    building: string
  }[]
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

const priorityLabels = {
  low: "Faible",
  medium: "Moyen",
  high: "Élevé",
  critical: "Critique",
}

export function MaintenanceSummary({ stats, recentTickets }: MaintenanceSummaryProps) {
  const completionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance</CardTitle>
        <CardDescription>État des tickets de maintenance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taux de résolution</span>
            <span className="font-medium">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.open}</p>
            <p className="text-xs text-muted-foreground">Ouverts</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-xs text-muted-foreground">En cours</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingParts}</p>
            <p className="text-xs text-muted-foreground">En attente</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{stats.resolved}</p>
            <p className="text-xs text-muted-foreground">Résolus</p>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Tickets récents</p>
          {recentTickets.slice(0, 3).map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">{ticket.title}</p>
                <p className="text-xs text-muted-foreground">{ticket.building}</p>
              </div>
              <Badge variant="secondary" className={cn("text-xs", priorityColors[ticket.priority])}>
                {priorityLabels[ticket.priority]}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
