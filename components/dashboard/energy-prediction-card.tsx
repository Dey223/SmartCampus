"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Loader2, TrendingUp, Zap, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface Prediction {
    timestamp: string
    value: number
}

interface Peak {
    timestamp: string
    value: number
    severity: 'high' | 'medium'
}

interface Statistics {
    mean: number
    median: number
    std: number
    min: number
    max: number
    total: number
}

interface PredictionData {
    predictions: Prediction[]
    peaks: Peak[]
    statistics: Statistics
}

export function EnergyPredictionCard() {
    const [loading, setLoading] = useState(false)
    const [predictionData, setPredictionData] = useState<PredictionData | null>(null)
    const [error, setError] = useState<string | null>(null)

    const generatePredictions = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/energy/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ days: 7 })
            })

            if (!response.ok) {
                throw new Error('Failed to generate predictions')
            }

            const data = await response.json()
            setPredictionData(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    // Transform data for chart (daily averages)
    const chartData = predictionData?.predictions
        ? Object.values(
            predictionData.predictions.reduce((acc: any, pred) => {
                const date = new Date(pred.timestamp).toLocaleDateString('fr-FR', {
                    month: 'short',
                    day: 'numeric'
                })
                if (!acc[date]) {
                    acc[date] = { date, total: 0, count: 0 }
                }
                acc[date].total += pred.value
                acc[date].count += 1
                return acc
            }, {})
        ).map((item: any) => ({
            date: item.date,
            value: Math.round(item.total / item.count)
        }))
        : []

    return (
        <Card className="col-span-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Prédiction Énergétique (IA)
                        </CardTitle>
                        <CardDescription>
                            Analyse prédictive basée sur Machine Learning (Python + scikit-learn)
                        </CardDescription>
                    </div>
                    <Button
                        onClick={generatePredictions}
                        disabled={loading}
                        className="gap-2"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? 'Analyse en cours...' : 'Générer Prédictions'}
                    </Button>
                </div>
            </CardHeader>

            {error && (
                <CardContent>
                    <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm">
                        ❌ {error}
                    </div>
                </CardContent>
            )}

            {predictionData && (
                <CardContent className="space-y-6">
                    {/* Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="text-sm text-blue-600 font-medium">Moyenne Prédite</div>
                            <div className="text-2xl font-bold text-blue-900">
                                {Math.round(predictionData.statistics.mean)} kWh
                            </div>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-lg">
                            <div className="text-sm text-emerald-600 font-medium">Total 7 Jours</div>
                            <div className="text-2xl font-bold text-emerald-900">
                                {Math.round(predictionData.statistics.total / 1000)} MWh
                            </div>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-lg">
                            <div className="text-sm text-amber-600 font-medium">Pic Maximum</div>
                            <div className="text-2xl font-bold text-amber-900">
                                {Math.round(predictionData.statistics.max)} kWh
                            </div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                            <div className="text-sm text-red-600 font-medium">Alertes Pics</div>
                            <div className="text-2xl font-bold text-red-900">
                                {predictionData.peaks.length}
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    name="Consommation Prédite (kWh)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Peaks Alert */}
                    {predictionData.peaks.length > 0 && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-amber-900">
                                        {predictionData.peaks.length} Pics de Consommation Détectés
                                    </h4>
                                    <p className="text-sm text-amber-700 mt-1">
                                        Périodes de forte consommation prévues. Envisagez d'optimiser l'utilisation pendant ces créneaux.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Powered by */}
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4 border-t">
                        <Zap className="h-3 w-3" />
                        <span>Propulsé par Python + scikit-learn + Linear Regression</span>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
