"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, ExternalLink, Info } from "lucide-react"
import Link from "next/link"
import { SupabaseFallback } from "@/components/supabase-fallback"

export default function Home() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [warning, setWarning] = useState("")
  const [result, setResult] = useState<any>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [supabaseStatus, setSupabaseStatus] = useState<"checking" | "connected" | "error">("checking")

  // Verificar status do Supabase ao carregar a página
  useEffect(() => {
    async function checkSupabaseStatus() {
      try {
        const response = await fetch("/api/check-connection")
        if (response.ok) {
          const data = await response.json()
          setSupabaseStatus(data.success ? "connected" : "error")
        } else {
          setSupabaseStatus("error")
        }
      } catch (error) {
        console.error("Erro ao verificar status do Supabase:", error)
        setSupabaseStatus("error")
      }
    }

    checkSupabaseStatus()
  }, [])

  const analyzeUrl = async () => {
    if (!url) {
      setError("Por favor, insira uma URL")
      return
    }

    try {
      setLoading(true)
      setError("")
      setWarning("")

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ${response.status}: Falha ao analisar URL`)
      }

      const data = await response.json()

      if (data.warning) {
        setWarning(data.warning)
        console.warn("Aviso:", data.warning)
      }

      setResult(data)
      setShowQuiz(!!data.tagCounts)
    } catch (err) {
      console.error("Erro na análise:", err)
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-6 md:py-10 px-4">
      <div className="max-w-3xl mx-auto mb-6 md:mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Analisador de Acessibilidade Web</h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Analise websites e avalie sua acessibilidade com base nos princípios do TR-Model
        </p>
        <div className="mt-3 md:mt-4">
          <Link href="/sobre" className="inline-flex items-center text-blue-600 hover:underline text-sm md:text-base">
            <Info className="h-4 w-4 mr-1" />
            Saiba mais sobre o TR-Model
          </Link>
        </div>
      </div>

      {supabaseStatus === "error" && <SupabaseFallback />}

      <Card className="mb-6 md:mb-8">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-xl md:text-2xl">Analisar Website</CardTitle>
          <CardDescription>Digite uma URL para analisar as tags HTML e avaliar a acessibilidade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="exemplo.com ou https://exemplo.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={analyzeUrl}
              disabled={loading}
              className="whitespace-nowrap mt-2 sm:mt-0"
              size="sm"
              aria-label="Analisar website"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="sm:inline">Analisando</span>
                </>
              ) : (
                "Analisar"
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {warning && (
            <Alert className="mt-4 bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertTitle className="text-yellow-700">Aviso</AlertTitle>
              <AlertDescription className="text-yellow-600 text-sm">
                {warning}
                <p className="mt-2 text-xs sm:text-sm">
                  O sistema continuará funcionando normalmente, mas os dados não serão salvos no banco de dados.
                </p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result?.tagCounts && (
        <Card className="mb-6 md:mb-8">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-xl md:text-2xl">Resultados da Análise</CardTitle>
            <CardDescription className="flex items-center gap-2 flex-wrap">
              <span>Contagem de tags para:</span>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                <span className="truncate max-w-[200px] sm:max-w-none">{result.url.replace(/^https?:\/\//, "")}</span>
                <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
              {Object.entries(result.tagCounts).map(([tag, count]) => (
                <div key={tag} className="p-3 md:p-4 border rounded-md">
                  <div className="text-xs md:text-sm text-muted-foreground">&lt;{tag}&gt; tags</div>
                  <div className="text-xl md:text-2xl font-bold">{count as number}</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setShowQuiz(true)} size="sm" className="w-full sm:w-auto">
              Fazer Quiz de Acessibilidade
            </Button>
          </CardFooter>
        </Card>
      )}

      {showQuiz && result?.tagCounts && <AccessibilityQuiz url={result.url || ""} tagCounts={result.tagCounts} />}
    </main>
  )
}

function AccessibilityQuiz({ url = "", tagCounts }: { url?: string; tagCounts: Record<string, number> }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [score, setScore] = useState<number | null>(null)

  // Perguntas baseadas nos princípios do TR-Model
  const questions = [
    {
      question: `O site tem ${tagCounts?.a || 0} links. Todos eles possuem texto descritivo adequado?`,
      options: [
        "Sim, todos os links têm texto descritivo",
        "Não, alguns links usam texto genérico como 'clique aqui'",
        "Não tenho certeza",
      ],
      correctAnswer: 1,
      principle: "Perceptível",
      explanation:
        "Links devem ter texto descritivo que indique claramente seu propósito, mesmo quando lidos fora de contexto.",
    },
    {
      question: `Existem ${tagCounts?.img || 0} imagens no site. Todas elas possuem texto alternativo (alt) apropriado?`,
      options: [
        "Sim, todas as imagens têm texto alternativo",
        "Não, algumas imagens estão sem texto alternativo",
        "Não consegui determinar",
      ],
      correctAnswer: 1,
      principle: "Perceptível",
      explanation:
        "Imagens devem ter texto alternativo que descreva seu conteúdo e função para usuários que não podem vê-las.",
    },
    {
      question: `O site tem ${tagCounts?.button || 0} botões. Eles são acessíveis por teclado?`,
      options: [
        "Sim, todos os botões podem ser acessados via teclado",
        "Não, alguns botões requerem interação com mouse",
        "Não testei isso",
      ],
      correctAnswer: 0,
      principle: "Operável",
      explanation:
        "Todos os elementos interativos devem ser acessíveis por teclado para usuários que não podem usar um mouse.",
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

  // Garantir que url não seja undefined antes de usar replace
  const displayUrl = url ? url.replace(/^https?:\/\//, "") : "site analisado"

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 md:pb-6 px-4 md:px-6">
        <CardTitle className="text-xl md:text-2xl">Quiz de Acessibilidade</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          <span className="truncate block">Responda perguntas sobre a acessibilidade de {displayUrl}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        {score !== null ? (
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Quiz Completo!</h3>
            <p className="text-lg md:text-xl">Sua pontuação: {score.toFixed(0)}%</p>
            <p className="mt-3 md:mt-4 text-sm text-muted-foreground">
              Com base nas suas respostas, pode haver algumas melhorias de acessibilidade necessárias para este site.
            </p>
            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-lg text-left">
              <h4 className="font-semibold mb-2 text-sm md:text-base">Recomendações de Acessibilidade:</h4>
              <ul className="list-disc pl-5 space-y-1 md:space-y-2 text-xs md:text-sm">
                <li>Certifique-se de que todos os links tenham texto descritivo significativo</li>
                <li>Adicione texto alternativo (alt) a todas as imagens informativas</li>
                <li>Verifique se todos os elementos interativos são acessíveis por teclado</li>
                <li>Mantenha um contraste de cores adequado para melhor legibilidade</li>
                <li>Utilize estrutura semântica adequada com cabeçalhos (h1-h6) organizados hierarquicamente</li>
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-3 md:mb-4 p-2 bg-blue-50 rounded-lg">
              <p className="text-xs md:text-sm text-blue-700">
                <span className="font-semibold">Princípio TR-Model: </span>
                {questions[currentQuestion].principle}
              </p>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Pergunta {currentQuestion + 1} de {questions.length}
            </h3>
            <p className="mb-4 md:mb-6 text-sm md:text-base">{questions[currentQuestion].question}</p>
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-3 md:px-4 text-xs md:text-sm"
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <div className="mt-3 md:mt-4 p-2 md:p-3 bg-gray-50 rounded-md text-xs md:text-sm text-gray-600">
              <p>
                <span className="font-medium">Dica:</span> {questions[currentQuestion].explanation}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      {score !== null && (
        <CardFooter className="px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-t">
          <Button onClick={() => window.location.reload()} size="sm" className="w-full">
            Analisar Outro Website
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
