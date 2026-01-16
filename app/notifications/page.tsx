import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react"

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "Consommation électrique élevée",
      description: "Le bâtiment Sciences dépasse le seuil de 150 kWh",
      time: "Il y a 5 minutes",
      read: false,
    },
    {
      id: 2,
      type: "maintenance",
      title: "Ticket de maintenance créé",
      description: "Problème climatisation salle L01 - Priorité haute",
      time: "Il y a 2 heures",
      read: false,
    },
    {
      id: 3,
      type: "info",
      title: "Réservation confirmée",
      description: "Amphithéâtre Curie réservé pour demain 9h-11h",
      time: "Il y a 1 jour",
      read: true,
    },
    {
      id: 4,
      type: "success",
      title: "Maintenance complétée",
      description: "Réparation climatisation salle S101 terminée",
      time: "Il y a 2 jours",
      read: true,
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "maintenance":
        return <Bell className="w-5 h-5 text-orange-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-red-100 text-red-800"
      case "maintenance":
        return "bg-orange-100 text-orange-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      case "success":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-2">
              Vous avez {unreadCount} notification{unreadCount > 1 ? "s" : ""} non lue{unreadCount > 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Centre de notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList>
                    <TabsTrigger value="all">Tous ({notifications.length})</TabsTrigger>
                    <TabsTrigger value="unread">Non lus ({unreadCount})</TabsTrigger>
                    <TabsTrigger value="alerts">Alertes (2)</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-3 mt-4">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-lg border flex items-start gap-4 ${
                          notif.read ? "bg-white border-gray-200" : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">{getIcon(notif.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                            {!notif.read && <Badge className={`${getBadgeColor(notif.type)}`}>Nouveau</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notif.description}</p>
                          <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <Button variant="ghost" size="sm">
                            ✕
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="unread" className="space-y-3 mt-4">
                    {notifications
                      .filter((n) => !n.read)
                      .map((notif) => (
                        <div
                          key={notif.id}
                          className="p-4 rounded-lg border bg-blue-50 border-blue-200 flex items-start gap-4"
                        >
                          <div className="flex-shrink-0 mt-1">{getIcon(notif.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                              <Badge className={`${getBadgeColor(notif.type)}`}>Nouveau</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notif.description}</p>
                            <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <Button variant="ghost" size="sm">
                              ✕
                            </Button>
                          </div>
                        </div>
                      ))}
                  </TabsContent>

                  <TabsContent value="alerts" className="space-y-3 mt-4">
                    {notifications
                      .filter((n) => n.type === "alert" || n.type === "maintenance")
                      .map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 rounded-lg border flex items-start gap-4 ${
                            notif.read ? "bg-white border-gray-200" : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="flex-shrink-0 mt-1">{getIcon(notif.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                              {!notif.read && <Badge className={`${getBadgeColor(notif.type)}`}>Nouveau</Badge>}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notif.description}</p>
                            <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <Button variant="ghost" size="sm">
                              ✕
                            </Button>
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button className="flex-1">Marquer tout comme lu</Button>
              <Button variant="outline" className="flex-1">
                Effacer tout
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
