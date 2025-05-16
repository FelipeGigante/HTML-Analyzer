"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"

export default function OfflineMode() {
  const [url, setUrl] = useState("")
  const [html, setHtml] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<any>(null)
  const [showQuiz, setShowQuiz] = useState(false)

  const analyzeHtml = () => {
    if (!html) {
      setError("Please enter HTML content")
      return
    }

    try {
      setLoading(true)
      setError("")

      // Count tags
      const tagCounts = {
        a: countTags(html, "a"),
        button: countTags(html, "button"),
        select: countTags(html, "select"), // For dropdownlist
        input: countTags(html, "input"),
        img: countTags(html, "img"),
        video: countTags(html, "video"),
      }

      setResult({ tagCounts })
      setShowQuiz(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Helper function to count tags in HTML
  function countTags(html: string, tagName: string): number {
    const regex = new RegExp(`<${tagName}[\\s>]`, "gi")
    const matches = html.match(regex)
    return matches ? matches.length : 0
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">HTML Tag Analyzer (Offline Mode)</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Analyze HTML Content</CardTitle>
          <CardDescription>Paste HTML content to analyze tags and assess accessibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Website URL (for reference only)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mb-4"
            />
            <textarea
              placeholder="Paste HTML content here"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="w-full h-40 p-2 border rounded-md"
            />
          </div>
          <Button onClick={analyzeHtml} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing
              </>
            ) : (
              "Analyze HTML"
            )}
          </Button>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>Tag counts for {url || "pasted HTML"}</CardDescription>
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
            <Button onClick={() => setShowQuiz(true)}>Take Accessibility Quiz</Button>
          </CardFooter>
        </Card>
      )}

      {showQuiz && <AccessibilityQuiz url={url || "pasted HTML"} tagCounts={result?.tagCounts} />}
    </main>
  )
}

function AccessibilityQuiz({ url, tagCounts }: { url: string; tagCounts: Record<string, number> }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [score, setScore] = useState<number | null>(null)

  // Sample questions based on TR-Model principles
  const questions = [
    {
      question: `The website has ${tagCounts?.a || 0} links. Are they all properly labeled with descriptive text?`,
      options: [
        "Yes, all links have descriptive text",
        "No, some links use generic text like 'click here'",
        "I'm not sure",
      ],
      correctAnswer: 1,
    },
    {
      question: `There are ${tagCounts?.img || 0} images on the site. Do they all have appropriate alt text?`,
      options: ["Yes, all images have alt text", "No, some images are missing alt text", "I couldn't determine"],
      correctAnswer: 1,
    },
    {
      question: `The site has ${tagCounts?.button || 0} buttons. Are they keyboard accessible?`,
      options: [
        "Yes, all buttons can be accessed via keyboard",
        "No, some buttons require mouse interaction",
        "I didn't test this",
      ],
      correctAnswer: 0,
    },
  ]

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex.toString()
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate score
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
        <CardTitle>Accessibility Quiz</CardTitle>
        <CardDescription>Answer questions about the accessibility of {url}</CardDescription>
      </CardHeader>
      <CardContent>
        {score !== null ? (
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
            <p className="text-xl">Your score: {score.toFixed(0)}%</p>
            <p className="mt-4 text-muted-foreground">
              Based on your answers, there may be some accessibility improvements needed for this website.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Question {currentQuestion + 1} of {questions.length}
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
