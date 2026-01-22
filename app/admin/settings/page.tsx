import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Bell, Lock, Palette, Database, User } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Settings className="w-8 h-8" />
              Paramètres
            </h1>
            <p className="text-gray-600 mt-2">Gérez les paramètres de votre plateforme Smart Campus</p>
          </div>

          <Tabs defaultValue="general" className="w-full max-w-4xl">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Général</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Apparence</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Sécurité</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span className="hidden sm:inline">API</span>
              </TabsTrigger>
            </TabsList>

            {/* Général */}
            <TabsContent value="general" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du Campus</CardTitle>
                  <CardDescription>Gérez les informations générales de votre campus</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="campus-name">Nom du Campus</Label>
                      <Input id="campus-name" defaultValue="UTC Université" className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="campus-code">Code Campus</Label>
                      <Input id="campus-code" defaultValue="UTC-001" className="mt-2" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="campus-address">Adresse</Label>
                    <Input id="campus-address" defaultValue="Campus Principal, Zone A" className="mt-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="campus-contact">Contact</Label>
                      <Input id="campus-contact" type="email" defaultValue="admin@campus.edu" className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="campus-phone">Téléphone</Label>
                      <Input id="campus-phone" defaultValue="+212 5 35 30 00 00" className="mt-2" />
                    </div>
                  </div>
                  <Button>Enregistrer les modifications</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de Notifications</CardTitle>
                  <CardDescription>Contrôlez comment et quand vous recevez les notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Alertes Énergie</Label>
                        <p className="text-sm text-gray-600">Notifications de consommation énergétique élevée</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Maintenance</Label>
                        <p className="text-sm text-gray-600">Notifications de tickets et interventions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Réservations</Label>
                        <p className="text-sm text-gray-600">Confirmations et rappels de réservations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Occupancy</Label>
                        <p className="text-sm text-gray-600">Alertes de suroccupation</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Notifications Email</Label>
                        <p className="text-sm text-gray-600">Recevoir les notifications par email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <Button>Enregistrer les préférences</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Apparence */}
            <TabsContent value="appearance" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Apparence et Thème</CardTitle>
                  <CardDescription>Personnalisez l'apparence de votre interface</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Thème</Label>
                      <div className="flex gap-4 mt-3">
                        <Button variant="outline" className="w-24">
                          Clair
                        </Button>
                        <Button variant="outline" className="w-24">
                          Sombre
                        </Button>
                        <Button className="w-24" defaultValue="true">
                          Système
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-base font-medium">Langue</Label>
                      <select className="w-full mt-2 p-2 border rounded-md">
                        <option>Français</option>
                        <option>English</option>
                        <option>Español</option>
                        <option>العربية</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Format 24h</Label>
                        <p className="text-sm text-gray-600">Afficher l'heure au format 24 heures</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Animations</Label>
                        <p className="text-sm text-gray-600">Activer les animations et transitions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <Button>Appliquer les modifications</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sécurité */}
            <TabsContent value="security" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité et Confidentialité</CardTitle>
                  <CardDescription>Gérez les paramètres de sécurité de votre compte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900">Mot de passe</h4>
                      <p className="text-sm text-blue-800 mt-1">Dernier changement : Il y a 30 jours</p>
                      <Button variant="outline" className="mt-3">
                        Changer le mot de passe
                      </Button>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900">Authentification à deux facteurs</h4>
                      <p className="text-sm text-green-800 mt-1">Activée ✓</p>
                      <Button variant="outline" className="mt-3">
                        Gérer 2FA
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900">Sessions actives</h4>
                      <p className="text-sm text-gray-600 mt-1">1 session active</p>
                      <Button variant="outline" className="mt-3">
                        Déconnexion de toutes les sessions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Intégrations API */}
            <TabsContent value="integrations" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Clés API</CardTitle>
                  <CardDescription>Gérez les clés d'accès API pour les intégrations externes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Production API Key</p>
                          <p className="text-sm text-gray-600 font-mono">sk_live_••••••••••••••••</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Copier
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Development API Key</p>
                          <p className="text-sm text-gray-600 font-mono">sk_test_••••••••••••••••</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Copier
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button>Générer une nouvelle clé</Button>
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      ⚠️ <strong>Attention:</strong> Ne partagez jamais vos clés API. Gardez-les confidentielles.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
