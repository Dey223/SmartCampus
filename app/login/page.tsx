"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(event.currentTarget)

        // Call the server action directly via API route for simplicity in this step
        // Or we can implement a server action in a separate file. 
        // For now, let's assume we post to a clean API route for login

        const response = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(Object.fromEntries(formData)),
        })

        if (response.ok) {
            const data = await response.json()
            if (data.role === 'admin') router.push('/admin')
            else if (data.role === 'staff') router.push('/staff')
            else router.push('/') // Default
        } else {
            setError("Identifiants invalides")
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="w-full max-w-sm space-y-6 rounded-lg border bg-white p-6 shadow-md">
                <div className="flex flex-col space-y-2 text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        SC
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
                    <p className="text-sm text-gray-500">
                        Entrez vos identifiants pour accéder au portail
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100 text-center">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                            id="email"
                            placeholder="admin@smartcampus.com"
                            name="email"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="password">
                            Mot de passe
                        </label>
                        <input
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <button
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-blue-600 text-white hover:bg-blue-700 h-10 w-full"
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Se connecter
                    </button>
                </form>

                <div className="text-center text-xs text-gray-500">
                    <p>Comptes de test :</p>
                    <p>Admin: admin@smartcampus.com / admin</p>
                    <p>Staff: staff@smartcampus.com / staff</p>
                </div>
            </div>
        </div>
    )
}
