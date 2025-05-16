"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Code, Info, Menu, X } from "lucide-react"
import { SupabaseStatus } from "@/components/supabase-status"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container mx-auto py-3 px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-lg md:text-xl font-bold">Analisador de Acessibilidade</h1>
          <div className="hidden md:block">
            <SupabaseStatus />
          </div>
        </div>

        {/* Navegação para desktop */}
        <nav className="hidden md:flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Início
            </Link>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/fallback">
              <Code className="h-4 w-4 mr-2" />
              Modo Offline
            </Link>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/sobre">
              <Info className="h-4 w-4 mr-2" />
              Sobre
            </Link>
          </Button>
        </nav>

        {/* Menu para dispositivos móveis */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Fechar menu</span>
                  </Button>
                </div>
                <div className="mb-4">
                  <SupabaseStatus />
                </div>
                <nav className="flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/">
                      <Home className="h-4 w-4 mr-2" />
                      Início
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/fallback">
                      <Code className="h-4 w-4 mr-2" />
                      Modo Offline
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/sobre">
                      <Info className="h-4 w-4 mr-2" />
                      Sobre
                    </Link>
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
