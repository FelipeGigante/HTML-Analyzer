import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export function SupabaseFallback() {
  return (
    <Alert className="mb-4 md:mb-6 bg-yellow-50 border-yellow-200">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-700 text-sm md:text-base">Banco de dados indisponível</AlertTitle>
      <AlertDescription className="text-yellow-600 text-xs md:text-sm">
        <p>Não foi possível conectar ao banco de dados Supabase.</p>
        <p className="mt-1 md:mt-2">O sistema continuará funcionando no modo offline, mas os dados não serão salvos.</p>
        <p className="mt-1 md:mt-2">
          Você pode usar o{" "}
          <Link href="/fallback" className="text-blue-600 underline">
            modo offline
          </Link>{" "}
          para analisar código HTML diretamente.
        </p>
      </AlertDescription>
    </Alert>
  )
}
