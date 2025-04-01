"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"

export default function FallbackPage() {
  const [html, setHtml] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<any>(null)
  const [showQuiz, setShowQuiz] = useState(false)

  const analyzeHtml = () => {
    if (!html) {
      setError("Por favor, insira o código HTML")
      return
    }

    try {
      setLoading(true)
      setError("")

      // Importar cheerio dinamicamente
      import("cheerio")
        .then((cheerio) => {
          const $ = cheerio.load(html)

          // Contar tags usando querySelectorAll (via cheerio)
          // Método simplificado conforme sugerido
          const tagCounts = {
            a: $("a").length,
            button: $("button").length,
            select: $("select").length,
            input: $("input").length,
            img: $("img").length,
            video: $("video").length,
          }

          setResult({ tagCounts })
          setShowQuiz(true)
          setLoading(false)
        })
        .catch((err) => {
          setError("Erro ao analisar HTML: " + (err instanceof Error ? err.message : "Erro desconhecido"))
          setLoading(false)
        })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro")
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Analisador de HTML (Modo Offline)</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Analisar Código HTML</CardTitle>
          <CardDescription>Cole o código HTML para analisar as tags e avaliar a acessibilidade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <textarea
              placeholder="Cole o código HTML aqui"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="w-full h-40 p-2 border rounded-md"
            />
          </div>
          <Button onClick={analyzeHtml} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analisando
              </>
            ) : (
              "Analisar HTML"
            )}
          </Button>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result?.tagCounts && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resultados da Análise</CardTitle>
            <CardDescription>Contagem de tags no HTML fornecido</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(result.tagCounts).map(([tag, count]) => (
                <div key={tag} className="p-4 border rounded-md">
                  <div className="text-sm text-muted-foreground">&lt;{tag}&gt; tags</div>
                  <div className="text-2xl font-bold">{count as number}</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setShowQuiz(true)}>Fazer Quiz de Acessibilidade</Button>
          </CardFooter>
        </Card>
      )}

      {showQuiz && result?.tagCounts && <AccessibilityQuiz tagCounts={result.tagCounts} />}
    </main>
  )
}

function AccessibilityQuiz({ tagCounts }: { tagCounts: Record<string, number> }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [score, setScore] = useState<number | null>(null)

  // Perguntas baseadas nos princípios do TR-Model
  const questions = [
    {
      question: `O código HTML tem ${tagCounts?.a || 0} links. Todos eles possuem texto descritivo adequado?`,
      options: [
        "Sim, todos os links têm texto descritivo",
        "Não, alguns links usam texto genérico como 'clique aqui'",
        "Não tenho certeza",
      ],
      correctAnswer: 1,
      principle: "Perceptível",
    },
    {
      question: `Existem ${tagCounts?.img || 0} imagens no código. Todas elas possuem texto alternativo (alt) apropriado?`,
      options: [
        "Sim, todas as imagens têm texto alternativo",
        "Não, algumas imagens estão sem texto alternativo",
        "Não consegui determinar",
      ],
      correctAnswer: 1,
      principle: "Perceptível",
    },
    {
      question: `O código tem ${tagCounts?.button || 0} botões. Eles são acessíveis por teclado?`,
      options: [
        "Sim, todos os botões podem ser acessados via teclado",
        "Não, alguns botões requerem interação com mouse",
        "Não testei isso",
      ],
      correctAnswer: 0,
      principle: "Operável",
    },
  ]

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex.toString()
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calcular pontuação
      let correctCount = 0
      questions.forEach((q, index) => {
        if (Number.parseInt(newAnswers[index]) === q.correctAnswer) {
          correctCount++
        }
      })
      setScore((correctCount / questions.length) * 100)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz de Acessibilidade</CardTitle>
        <CardDescription>Responda perguntas sobre a acessibilidade do código HTML</CardDescription>
      </CardHeader>
      <CardContent>
        {score !== null ? (
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Quiz Completo!</h3>
            <p className="text-xl">Sua pontuação: {score.toFixed(0)}%</p>
            <p className="mt-4 text-muted-foreground">
              Com base nas suas respostas, pode haver algumas melhorias de acessibilidade necessárias para este código
              HTML.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4 p-2 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Princípio TR-Model: </span>
                {questions[currentQuestion].principle}
              </p>
            </div>
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
        )}
      </CardContent>
    </Card>
  )
}

