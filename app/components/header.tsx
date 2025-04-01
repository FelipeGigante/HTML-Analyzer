import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Code } from "lucide-react"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Analisador de Acessibilidade</h1>

        <nav className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Início
            </Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link href="/fallback">
              <Code className="h-4 w-4 mr-2" />
              HTML Code
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

