"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Icon from "@/components/Icon"

interface ErrorComponentProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function ErrorComponent({ error, reset }: ErrorComponentProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <Icon name='AlertCircle' className="h-6 w-6 text-red-500" />
                        <CardTitle className="text-xl font-semibold text-red-500">Error</CardTitle>
                    </div>
                    <CardDescription>Ha ocurrido un error inesperado.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 mt-2">
                        {error.message || "Something went wrong. Please try again later."}
                    </p>
                    {error.digest && (
                        <p className="text-xs text-gray-500 mt-2">
                            Error ID: {error.digest}
                        </p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Recargar p&aacute;gina
                    </Button>
                    <Button onClick={reset} className="flex items-center space-x-2">
                        <Icon name='RefreshCcw' className="h-4 w-4" />
                        <span>Intentar de nuevo</span>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}