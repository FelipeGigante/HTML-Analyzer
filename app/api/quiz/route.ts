import { NextResponse } from "next/server"
import { supabaseClient, withRetry } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const analysisId = searchParams.get("analysisId")

    if (!analysisId) {
      return NextResponse.json({ error: "ID da análise é obrigatório" }, { status: 400 })
    }

    // Get the analysis data with retry
    const { data: analysis, error: analysisError } = await withRetry(() =>
      supabaseClient.from("site_analyses").select("*").eq("id", analysisId).single(),
    )

    if (analysisError) {
      console.error("Erro ao buscar análise:", analysisError)
      return NextResponse.json({ error: "Falha ao buscar análise" }, { status: 500 })
    }

    // Get quiz questions from Supabase with retry
    const { data: questions, error: questionsError } = await withRetry(() =>
      supabaseClient.from("quiz_questions").select("*").order("id"),
    )

    if (questionsError) {
      console.error("Erro ao buscar perguntas:", questionsError)
      return NextResponse.json({ error: "Falha ao buscar perguntas" }, { status: 500 })
    }

    // Process questions to include tag counts from the analysis
    const processedQuestions = questions.map((q) => {
      // Replace placeholders in questions with actual tag counts
      let processedQuestion = q.question

      if (processedQuestion.includes("{a_tags}")) {
        processedQuestion = processedQuestion.replace("{a_tags}", analysis.a_tags.toString())
      }
      if (processedQuestion.includes("{img_tags}")) {
        processedQuestion = processedQuestion.replace("{img_tags}", analysis.img_tags.toString())
      }
      if (processedQuestion.includes("{button_tags}")) {
        processedQuestion = processedQuestion.replace("{button_tags}", analysis.button_tags.toString())
      }
      if (processedQuestion.includes("{input_tags}")) {
        processedQuestion = processedQuestion.replace("{input_tags}", analysis.input_tags.toString())
      }
      if (processedQuestion.includes("{video_tags}")) {
        processedQuestion = processedQuestion.replace("{video_tags}", analysis.video_tags.toString())
      }
      if (processedQuestion.includes("{select_tags}")) {
        processedQuestion = processedQuestion.replace("{select_tags}", analysis.select_tags.toString())
      }

      return {
        ...q,
        question: processedQuestion,
      }
    })

    return NextResponse.json({
      success: true,
      questions: processedQuestions,
    })
  } catch (error) {
    console.error("Erro ao buscar quiz:", error)
    return NextResponse.json(
      {
        error: `Erro ao buscar quiz: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const { analysisId, answers } = await request.json()

    if (!analysisId || !answers) {
      return NextResponse.json({ error: "ID da análise e respostas são obrigatórios" }, { status: 400 })
    }

    // Get the correct answers from the database with retry
    const { data: questions, error: questionsError } = await withRetry(() =>
      supabaseClient.from("quiz_questions").select("id, correct_answer").order("id"),
    )

    if (questionsError) {
      console.error("Erro ao buscar perguntas:", questionsError)
      return NextResponse.json({ error: "Falha ao buscar perguntas" }, { status: 500 })
    }

    // Calculate score
    let score = 0
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        score++
      }
    })

    const scorePercentage = (score / questions.length) * 100

    // Save quiz results with retry
    const { data, error } = await withRetry(() =>
      supabaseClient
        .from("quiz_results")
        .insert({
          analysis_id: analysisId,
          score: scorePercentage,
          answers: answers,
          completed_at: new Date().toISOString(),
        })
        .select(),
    )

    if (error) {
      console.error("Erro ao salvar resultados do quiz:", error)
      return NextResponse.json({ error: "Falha ao salvar resultados do quiz" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      score: scorePercentage,
      resultId: data[0]?.id,
    })
  } catch (error) {
    console.error("Erro ao enviar quiz:", error)
    return NextResponse.json(
      {
        error: `Erro ao enviar quiz: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      },
      { status: 500 },
    )
  }
}
