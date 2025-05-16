import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Verificar se as variáveis de ambiente estão definidas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        success: false,
        error: "Variáveis de ambiente do Supabase não configuradas",
      })
    }

    // Criar um cliente temporário para o teste
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    // Tenta fazer uma consulta simples para verificar a conexão
    // Usamos um timeout para evitar que a requisição fique pendente por muito tempo
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout ao conectar com Supabase")), 5000),
    )

    const queryPromise = supabase.from("site_analyses").select("count").limit(1)

    // Usar Promise.race para implementar um timeout
    const { error } = (await Promise.race([queryPromise, timeoutPromise])) as any

    if (error) {
      console.error("Erro na consulta ao Supabase:", error)
      return NextResponse.json({
        success: false,
        error: error.message || "Erro ao consultar Supabase",
      })
    }

    return NextResponse.json({
      success: true,
      message: "Conexão com Supabase estabelecida com sucesso",
    })
  } catch (error) {
    console.error("Erro ao verificar conexão:", error)
    // Garantir que sempre retornamos um JSON válido
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido ao verificar conexão",
    })
  }
}
