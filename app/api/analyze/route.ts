import { NextResponse } from "next/server"
import * as cheerio from "cheerio"
import { supabaseClient, withRetry } from "@/lib/supabase"

// Função para analisar HTML e contar tags de forma simplificada
async function analyzeHtml(url: string) {
  try {
    // Validar e normalizar a URL
    let validatedUrl: string
    try {
      validatedUrl = new URL(url).toString()
    } catch (e) {
      try {
        validatedUrl = new URL(`https://${url}`).toString()
      } catch (e) {
        throw new Error("URL inválida")
      }
    }

    // Configurar headers para simular um navegador real
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    }

    // Fazer a requisição com timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 segundos de timeout

    const response = await fetch(validatedUrl, {
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Falha ao acessar URL: ${response.status} ${response.statusText}`)
    }

    // Obter o HTML e analisá-lo com cheerio
    const html = await response.text()
    const $ = cheerio.load(html)

    // Contar as tags usando querySelectorAll (via cheerio)
    // Método simplificado conforme sugerido
    const tagCounts = {
      a: $("a").length,
      button: $("button").length,
      select: $("select").length,
      input: $("input").length,
      img: $("img").length,
      video: $("video").length,
    }

    // Retornar apenas as contagens e a URL validada
    return {
      url: validatedUrl,
      tagCounts,
    }
  } catch (error) {
    throw error
  }
}

// Função para salvar no Supabase com retry
async function saveToSupabase(url: string, tagCounts: Record<string, number>) {
  try {
    // Usar withRetry para tentar a operação várias vezes se necessário
    const { data, error } = await withRetry(() =>
      supabaseClient
        .from("site_analyses")
        .insert({
          url,
          analyzed_at: new Date().toISOString(),
          a_tags: tagCounts.a,
          button_tags: tagCounts.button,
          select_tags: tagCounts.select,
          input_tags: tagCounts.input,
          img_tags: tagCounts.img,
          video_tags: tagCounts.video,
        })
        .select("id"),
    )

    if (error) {
      console.error("Erro Supabase:", error)
      throw error
    }

    return data?.[0]?.id
  } catch (error) {
    console.error("Erro ao salvar no banco de dados:", error)
    throw error
  }
}

export async function POST(request: Request) {
  try {
    // Extrair a URL da requisição
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 })
    }

    // Etapa 1: Analisar o HTML (sempre executada)
    let analysisResult
    try {
      analysisResult = await analyzeHtml(url)
    } catch (error) {
      return NextResponse.json(
        {
          error: `Erro ao analisar o site: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        },
        { status: 400 },
      )
    }

    // Etapa 2: Tentar salvar no Supabase (opcional - não impede o funcionamento)
    let analysisId = null
    let dbError = null

    try {
      analysisId = await saveToSupabase(analysisResult.url, analysisResult.tagCounts)
    } catch (error) {
      dbError = error instanceof Error ? error.message : "Erro desconhecido ao salvar no banco de dados"
      console.error("Falha ao salvar no Supabase, continuando sem persistência:", dbError)
      // Não retornamos erro aqui, apenas registramos e continuamos
    }

    // Sempre retornamos os resultados da análise, mesmo se o banco de dados falhar
    return NextResponse.json({
      success: true,
      tagCounts: analysisResult.tagCounts,
      url: analysisResult.url,
      analysisId,
      ...(dbError && { warning: `Não foi possível salvar no banco de dados: ${dbError}` }),
    })
  } catch (error) {
    console.error("Erro geral na rota de análise:", error)
    return NextResponse.json(
      {
        error: `Erro no servidor: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      },
      { status: 500 },
    )
  }
}
