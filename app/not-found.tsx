import Link from "next/link"
import { Button } from "@/components/ui/button"
import Icon from "@/components/Icon"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-500">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-400">P&aacute;gina No Encontrada</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Oops! La p&aacute;gina que estas buscando no existe o ha sido removida
        </p>
        <div className="w-full max-w-xs mx-auto h-1 bg-gradient-to-r from-green-400 via-green-500 to-red-500 rounded-full" />
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Icon name="ArrowLeft" className="w-4 h-4" />
              Volver
            </Link>
          </Button>
          <Button asChild>
            <Link href="/" className="flex items-center gap-2">
              <Icon name="Home" className="w-4 h-4" />
              Panel De Control
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}