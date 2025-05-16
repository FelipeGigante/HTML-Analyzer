import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Função para criar um cliente Supabase com validação de variáveis de ambiente
export function createSupabaseClient() {
  // Verificação das variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    console.error("NEXT_PUBLIC_SUPABASE_URL não está definida")
    // Retornar um cliente com URL vazia que vai falhar graciosamente
    return createClient("", "")
  }

  if (!supabaseAnonKey) {
    console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida")
    // Retornar um cliente com chave vazia que vai falhar graciosamente
    return createClient(supabaseUrl, "")
  }

  // Criação de um cliente com configurações adequadas
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
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
}

// Criação de um cliente singleton para uso em operações
export const supabaseClient = createSupabaseClient()

// Função para criar um cliente Supabase com retry
export async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  let lastError: any

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error

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
      break
    }
  }

  throw lastError
}
