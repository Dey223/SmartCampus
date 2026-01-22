"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin, Users, Zap } from "lucide-react"
import dynamic from 'next/dynamic'

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
)
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
)
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
)
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
)

interface Building {
    id: number
    name: string
    position: [number, number]
    occupancy: number
    capacity: number
    energyConsumption: number
    status: 'normal' | 'warning' | 'critical'
}

// Simulated campus buildings (Casablanca coordinates)
const CAMPUS_CENTER: [number, number] = [33.5731, -7.5898]

const BUILDINGS: Building[] = [
    {
        id: 1,
        name: "Bâtiment Sciences",
        position: [33.5735, -7.5895],
        occupancy: 450,
        capacity: 600,
        energyConsumption: 850,
        status: 'normal'
    },
    {
        id: 2,
        name: "Bâtiment Principal",
        position: [33.5728, -7.5900],
        occupancy: 320,
        capacity: 400,
        energyConsumption: 620,
        status: 'normal'
    },
    {
        id: 3,
        name: "Bibliothèque",
        position: [33.5732, -7.5905],
        occupancy: 180,
        capacity: 200,
        energyConsumption: 380,
        status: 'warning'
    },
    {
        id: 4,
        name: "Amphithéâtre A",
        position: [33.5738, -7.5890],
        occupancy: 550,
        capacity: 800,
        energyConsumption: 1200,
        status: 'critical'
    },
    {
        id: 5,
        name: "Laboratoires",
        position: [33.5725, -7.5895],
        occupancy: 95,
        capacity: 150,
        energyConsumption: 420,
        status: 'normal'
    }
]

export function CampusMap() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Cartographie Campus
                    </CardTitle>
                    <CardDescription>Chargement de la carte...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-96 bg-slate-100 rounded-lg animate-pulse" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            Cartographie Campus - Université Technologique de Casablanca
                        </CardTitle>
                        <CardDescription>
                            Plans interactifs des bâtiments avec occupation et consommation en temps réel
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Legend */}
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500" />
                        <span>Normal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-amber-500" />
                        <span>Attention</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-500" />
                        <span>Critique</span>
                    </div>
                </div>

                {/* Map */}
                <div className="h-96 rounded-lg overflow-hidden border">
                    <MapContainer
                        center={CAMPUS_CENTER}
                        zoom={16}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {BUILDINGS.map((building) => {
                            const occupancyRate = Math.round((building.occupancy / building.capacity) * 100)

                            return (
                                <Marker key={building.id} position={building.position}>
                                    <Popup>
                                        <div className="p-2 min-w-[200px]">
                                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                                <Building2 className="h-4 w-4" />
                                                {building.name}
                                            </h3>

                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center gap-1 text-slate-600">
                                                        <Users className="h-3 w-3" />
                                                        Occupation
                                                    </span>
                                                    <span className="font-semibold">
                                                        {building.occupancy}/{building.capacity}
                                                        <span className={`ml-1 ${occupancyRate > 80 ? 'text-red-600' :
                                                                occupancyRate > 60 ? 'text-amber-600' :
                                                                    'text-green-600'
                                                            }`}>
                                                            ({occupancyRate}%)
                                                        </span>
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center gap-1 text-slate-600">
                                                        <Zap className="h-3 w-3" />
                                                        Énergie
                                                    </span>
                                                    <span className="font-semibold">
                                                        {building.energyConsumption} kWh
                                                    </span>
                                                </div>

                                                <div className="pt-2 border-t">
                                                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${building.status === 'critical' ? 'bg-red-100 text-red-700' :
                                                            building.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-green-100 text-green-700'
                                                        }`}>
                                                        <div className={`w-2 h-2 rounded-full ${building.status === 'critical' ? 'bg-red-500' :
                                                                building.status === 'warning' ? 'bg-amber-500' :
                                                                    'bg-green-500'
                                                            }`} />
                                                        {building.status === 'critical' ? 'Critique' :
                                                            building.status === 'warning' ? 'Attention' :
                                                                'Normal'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        })}
                    </MapContainer>
                </div>

                {/* Building Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {BUILDINGS.map((building) => {
                        const occupancyRate = Math.round((building.occupancy / building.capacity) * 100)

                        return (
                            <div key={building.id} className="p-3 bg-slate-50 rounded-lg border">
                                <div className="text-xs font-medium text-slate-600 mb-1 truncate">
                                    {building.name}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${building.status === 'critical' ? 'bg-red-500' :
                                            building.status === 'warning' ? 'bg-amber-500' :
                                                'bg-green-500'
                                        }`} />
                                    <span className="text-lg font-bold">{occupancyRate}%</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                    {building.energyConsumption} kWh
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
