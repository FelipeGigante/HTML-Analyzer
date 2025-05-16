"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

export function SupabaseStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    async function checkConnection() {
      try {
        const response = await fetch("/api/check-connection")

        // Verificar se a resposta é válida antes de tentar parsear o JSON
        if (!response.ok) {
          setStatus("error")
          setErrorMessage(`Erro HTTP: ${response.status} ${response.statusText}`)
          return
        }

        // Usar try/catch para lidar com possíveis erros no parsing do JSON
        try {
          const data = await response.json()

          if (data.success) {
            setStatus("connected")
          } else {
            setStatus("error")
            setErrorMessage(data.error || "Erro desconhecido")
          }
        } catch (parseError) {
          console.error("Erro ao parsear resposta:", parseError)
          setStatus("error")
          setErrorMessage("Erro ao processar resposta do servidor")
        }
      } catch (error) {
        console.error("Erro ao verificar conexão:", error)
        setStatus("error")
        setErrorMessage("Não foi possível verificar a conexão")
      }
    }

    checkConnection()
  }, [])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center">
            <Badge
              variant="outline"
              className={`flex items-center gap-1 text-xs py-0 h-5 ${
                status === "connected"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : status === "error"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}
            >
              {status === "connected" ? (
                <>
                  <CheckCircle2 className="h-3 w-3" /> <span className="hidden sm:inline">Conectado</span>
                </>
              ) : status === "error" ? (
                <>
                  <XCircle className="h-3 w-3" /> <span className="hidden sm:inline">Erro</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" /> <span className="hidden sm:inline">Verificando</span>
                </>
              )}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent className="text-xs md:text-sm">
          {status === "connected"
            ? "Conectado ao Supabase"
            : status === "error"
              ? `Erro de conexão: ${errorMessage}`
              : "Verificando conexão..."}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
