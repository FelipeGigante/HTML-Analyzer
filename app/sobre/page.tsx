import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SobrePage() {
  return (
    <main className="container mx-auto py-6 md:py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Sobre o Analisador de Acessibilidade</h1>

      <Card className="mb-6 md:mb-8">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-xl md:text-2xl">O que é o TR-Model?</CardTitle>
          <CardDescription>Modelo de Acessibilidade Web</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4 text-sm md:text-base">
          <p>
            O TR-Model (Transformação e Representação) é um modelo de acessibilidade web que se baseia nos princípios do
            WCAG (Web Content Accessibility Guidelines), mas organizado de forma mais intuitiva e prática.
          </p>

          <h3 className="text-base md:text-lg font-semibold mt-3 md:mt-4">Os quatro princípios do TR-Model são:</h3>

          <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mt-2">
            <div className="p-3 md:p-4 border rounded-md bg-blue-50">
              <h4 className="font-semibold text-blue-700 text-sm md:text-base">Perceptível</h4>
              <p className="text-xs md:text-sm mt-1">
                As informações e componentes da interface devem ser apresentados de forma que possam ser percebidos por
                todos os usuários, independentemente de suas capacidades sensoriais.
              </p>
              <p className="text-xs mt-2 text-blue-600">
                Exemplos: texto alternativo para imagens, legendas para vídeos, contraste adequado.
              </p>
            </div>

            <div className="p-3 md:p-4 border rounded-md bg-green-50">
              <h4 className="font-semibold text-green-700 text-sm md:text-base">Operável</h4>
              <p className="text-xs md:text-sm mt-1">
                Os componentes da interface e a navegação devem ser operáveis por todos os usuários, independentemente
                de suas capacidades motoras ou dispositivos de entrada.
              </p>
              <p className="text-xs mt-2 text-green-600">
                Exemplos: navegação por teclado, tempo suficiente para interações, prevenção de convulsões.
              </p>
            </div>

            <div className="p-3 md:p-4 border rounded-md bg-amber-50">
              <h4 className="font-semibold text-amber-700 text-sm md:text-base">Compreensível</h4>
              <p className="text-xs md:text-sm mt-1">
                As informações e operações da interface devem ser compreensíveis para todos os usuários,
                independentemente de suas capacidades cognitivas.
              </p>
              <p className="text-xs mt-2 text-amber-600">
                Exemplos: texto legível, previsibilidade, assistência na entrada de dados.
              </p>
            </div>

            <div className="p-3 md:p-4 border rounded-md bg-purple-50">
              <h4 className="font-semibold text-purple-700 text-sm md:text-base">Robusto</h4>
              <p className="text-xs md:text-sm mt-1">
                O conteúdo deve ser robusto o suficiente para ser interpretado de forma confiável por uma ampla
                variedade de agentes de usuário, incluindo tecnologias assistivas.
              </p>
              <p className="text-xs mt-2 text-purple-600">
                Exemplos: HTML válido, compatibilidade com diferentes navegadores e leitores de tela.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-xl md:text-2xl">Sobre este Sistema</CardTitle>
          <CardDescription>Analisador de Acessibilidade Web</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4 text-sm md:text-base">
          <p>
            Este sistema foi desenvolvido para analisar websites e avaliar sua acessibilidade com base nos princípios do
            TR-Model. O sistema conta as tags HTML relevantes para acessibilidade e fornece um quiz interativo para
            avaliar a conformidade do site com as diretrizes de acessibilidade.
          </p>

          <h3 className="text-base md:text-lg font-semibold mt-3 md:mt-4">Funcionalidades:</h3>
          <ul className="list-disc pl-5 space-y-1 md:space-y-2 text-sm md:text-base">
            <li>Análise de URLs para contagem de tags HTML relevantes para acessibilidade</li>
            <li>Quiz interativo baseado nos princípios do TR-Model</li>
            <li>Modo offline para análise de código HTML sem necessidade de conexão</li>
            <li>Armazenamento de resultados para análises futuras</li>
            <li>Recomendações de acessibilidade baseadas nos resultados</li>
          </ul>

          <p className="mt-3 md:mt-4 text-xs md:text-sm text-muted-foreground">
            Este sistema é uma ferramenta educacional e não substitui uma auditoria completa de acessibilidade. Para uma
            avaliação mais abrangente, recomendamos o uso de ferramentas especializadas e testes com usuários reais.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
