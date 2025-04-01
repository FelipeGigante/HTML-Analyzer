import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Verificação das variáveis de ambiente
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL não está definida")
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida")
}

// Configuração do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("Inicializando cliente Supabase com URL:", supabaseUrl)

// Criação de um cliente singleton para uso em operações
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      "x-application-name": "accessibility-analyzer",
    },
  },
})

// Função para criar um cliente Supabase com retry
export async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  let lastError: any

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Tentativa ${attempt + 1}/${maxRetries} de executar operação no Supabase...`)
      const result = await operation()
      console.log("Operação concluída com sucesso:", result)
      return result
    } catch (error: any) {
      lastError = error
      console.error(`Erro na tentativa ${attempt + 1}:`, error)

      // Se for um erro de conexão ou timeout, tente novamente
      if (
        error?.message?.includes("network") ||
        error?.message?.includes("timeout") ||
        error?.message?.includes("connection")
      ) {
        console.warn(`Tentativa ${attempt + 1}/${maxRetries} falhou, tentando novamente em ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        // Aumenta o delay para a próxima tentativa (exponential backoff)
        delay *= 2
        continue
      }

      // Para outros tipos de erro, não tente novamente
      console.error("Erro não recuperável:", error)
      break
    }
  }

  throw lastError
}

