"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correct_answer: number
  tr_model_principle?: string
}

export default function QuizPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const analysisId = searchParams.get("id")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [score, setScore] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!analysisId) {
      setError("Nenhum ID de análise fornecido")
      setLoading(false)
      return
    }

    async function fetchQuiz() {
      try {
        setLoading(true)
        const response = await fetch(`/api/quiz?analysisId=${analysisId}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Erro ${response.status}: Falha ao buscar quiz`)
        }

        const data = await response.json()

        if (!data.questions || data.questions.length === 0) {
          throw new Error("Nenhuma pergunta encontrada")
        }

        // Converter as opções de JSON para array se necessário
        const processedQuestions = data.questions.map((q: any) => ({
          ...q,
          options: Array.isArray(q.options) ? q.options : JSON.parse(q.options),
        }))

        setQuestions(processedQuestions)
      } catch (err) {
        console.error("Erro ao buscar quiz:", err)
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [analysisId])

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      submitQuiz(newAnswers)
    }
  }

  const submitQuiz = async (finalAnswers: number[]) => {
    try {
      setSubmitting(true)

      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId,
          answers: finalAnswers,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ${response.status}: Falha ao enviar quiz`)
      }

      const data = await response.json()
      setScore(data.score)
    } catch (err) {
      console.error("Erro ao enviar quiz:", err)
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || submitting) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>{submitting ? "Enviando respostas..." : "Carregando quiz..."}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Quiz de Acessibilidade</CardTitle>
          <CardDescription>
            Teste seus conhecimentos sobre acessibilidade web baseado nos princípios do TR-Model
          </CardDescription>
        </CardHeader>
        <CardContent>
          {score !== null ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Quiz Completo!</h3>
              <p className="text-xl">Sua pontuação: {score.toFixed(0)}%</p>
              <p className="mt-4 text-muted-foreground">
                Com base nas suas respostas, aqui estão algumas recomendações de acessibilidade para o site analisado.
              </p>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                <h4 className="font-semibold mb-2">Recomendações de Acessibilidade:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Certifique-se de que todas as imagens tenham texto alternativo descritivo</li>
                  <li>Verifique se todos os elementos interativos são acessíveis por teclado</li>
                  <li>Use uma estrutura adequada de cabeçalhos para melhor navegação por leitores de tela</li>
                  <li>Mantenha um contraste de cores suficiente para melhor legibilidade</li>
                  <li>Forneça legendas e descrições de áudio para conteúdo multimídia</li>
                </ul>
              </div>
            </div>
          ) : questions.length > 0 ? (
            <div>
              {questions[currentQuestion].tr_model_principle && (
                <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Princípio TR-Model: </span>
                    {questions[currentQuestion].tr_model_principle}
                  </p>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-4">
                Pergunta {currentQuestion + 1} de {questions.length}
              </h3>
              <p className="mb-6">{questions[currentQuestion].question}</p>
              <div className="space-y-2">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleAnswer(index)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <p>Nenhuma pergunta disponível</p>
          )}
        </CardContent>
        {score !== null && (
          <CardFooter>
            <Button onClick={() => router.push("/")} className="w-full">
              Analisar Outro Website
            </Button>
          </CardFooter>
        )}
      </Card>
    </main>
  )
}

