"use client"

import { useState } from "react"
import { Scan, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

export default function StudentPage() {
    const [scanning, setScanning] = useState(false)
    const [scanned, setScanned] = useState(false)

    const handleScan = () => {
        setScanning(true)
        // Simulate API call / hardware delay
        setTimeout(() => {
            setScanning(false)
            setScanned(true)
            toast.success("Présence enregistrée avec succès !", {
                description: `Arrivée marquée à ${new Date().toLocaleTimeString()}`
            })

            // Reset after a few seconds
            setTimeout(() => setScanned(false), 3000)
        }, 2000)
    }

    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="text-center w-full max-w-md px-4">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Portail Étudiant</h1>
                <p className="text-slate-600 mb-8">Marquez votre présence en un geste.</p>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden p-8 transition-all duration-300">
                    <div className="flex justify-center mb-8 relative">
                        <div className={`
              w-32 h-32 rounded-full flex items-center justify-center
              ${scanning ? 'bg-blue-50 animate-pulse' : scanned ? 'bg-green-50' : 'bg-slate-50'}
              transition-colors duration-500
            `}>
                            {scanning ? (
                                <Scan className="w-12 h-12 text-blue-500 animate-spin-slow" />
                            ) : scanned ? (
                                <CheckCircle2 className="w-16 h-16 text-green-500 scale-110 transition-transform" />
                            ) : (
                                <div className="relative group cursor-pointer" onClick={handleScan}>
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        className="w-16 h-16 text-slate-400 group-hover:text-blue-500 transition-colors"
                                    >
                                        <path d="M12 12c0-3 2.5-5.5 5.5-5.5S23 9 23 12M12 12c0 3-2.5 5.5-5.5 5.5S1 15 1 12M12 12V2m0 20v-2" />
                                        <path d="M2.05 15.65a10 10 0 0 1 19.9 0" />
                                        <path d="M5.5 9.5a6.5 6.5 0 0 1 13 0" />
                                    </svg>
                                    <span className="sr-only">Fingerprint</span>
                                </div>
                            )}
                        </div>

                        {/* Scanning Ring Effect */}
                        {scanning && (
                            <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping opacity-20" />
                        )}
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-slate-800">
                            {scanning ? "Lecture de l'empreinte..." : scanned ? "Identité confirmée" : "Prêt à scanner"}
                        </h2>
                        <p className="text-slate-500 text-sm">
                            {scanning
                                ? "Veuillez ne pas bouger votre doigt"
                                : scanned
                                    ? "Votre présence a bien été prise en compte."
                                    : "Posez votre doigt sur le capteur ou cliquez sur l'icône ci-dessus"
                            }
                        </p>
                    </div>

                    <button
                        onClick={handleScan}
                        disabled={scanning || scanned}
                        className={`
              mt-8 w-full py-4 rounded-xl font-medium text-lg transition-all
              ${scanning || scanned
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95'
                            }
            `}
                    >
                        {scanning ? "Scan en cours..." : scanned ? "Terminé" : "Scanner ma présence"}
                    </button>
                </div>

                <p className="mt-8 text-xs text-slate-400 uppercase tracking-widest">
                    Smart Campus Access Control
                </p>
            </div>
        </div>
    )
}
