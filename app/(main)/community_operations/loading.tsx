import { Loader2 } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md mx-auto">
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
                    </div>
                    <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-500">Cargando</h1>
                    <p className="text-center text-gray-600 dark:text-gray-500">
                        Por favor espera mientras preparamos tu contenido
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}