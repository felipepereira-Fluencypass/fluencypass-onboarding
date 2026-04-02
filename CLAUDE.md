@AGENTS.md

<!-- CYCLE-DESIGN-SYSTEM-START -->
# Cycle Design System

Este projeto usa o **Cycle Design System** (`@fluencypassdevs/cycle`).

> **REGRA PRINCIPAL**: Todos os componentes UI vem do pacote npm `@fluencypassdevs/cycle`.
> NUNCA copiar, clonar ou recriar componentes que ja existem na biblioteca.

## Como importar

```tsx
// Import principal (recomendado)
import { Button, Input, Badge } from "@fluencypassdevs/cycle"

// Import granular (tree-shaking)
import { Button } from "@fluencypassdevs/cycle/ui/button"
import { CycleIcon } from "@fluencypassdevs/cycle/icons"
import { cn } from "@fluencypassdevs/cycle/lib/utils"
```

## Fonte Geist (OBRIGATORIO)

O Cycle usa a fonte **Geist**. Instalar junto com o pacote:

```bash
npm install @fluencypassdevs/cycle geist
```

No `src/app/layout.tsx`:

```tsx
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

> Sem isso, todos os textos usam a fonte do sistema em vez da Geist.

## CSS (globals.css)

O `globals.css` DEVE conter:

```css
@import "tailwindcss";
@import "@fluencypassdevs/cycle/styles.css";
```

> O `@source` do Tailwind v4 ja esta embutido dentro do CSS do pacote — nao precisa adicionar manualmente. Se o projeto tinha `@source "../../node_modules/@fluencypassdevs/cycle/dist"`, pode remover.

### Troubleshooting: Componentes sem estilo

Se componentes Cycle aparecem sem estilo, verifique:
1. A fonte Geist esta configurada no layout.tsx?
2. O `@import "@fluencypassdevs/cycle/styles.css";` esta presente no globals.css?
3. O pacote esta instalado? `npm list @fluencypassdevs/cycle`
4. Versao >= 0.7.2? Fixes criticos de CSS nesta versao.

## Regras para IA (IMPORTANTE)

### Regras de Componentes

1. **SEMPRE importar de `@fluencypassdevs/cycle`** — NUNCA criar componentes em `components/ui/` se ja existem na biblioteca
2. **NUNCA copiar codigo-fonte** de componentes do Design System para dentro do projeto
3. **Se um componente nao existe na biblioteca, sinalize** — nao invente um substituto
4. **Composites do projeto** ficam em `src/components/composites/` e usam primitives da biblioteca
5. **Nunca criar um componente custom se o Cycle ja resolve** — custom so existe se nao ha equivalente

### Regras de Estilo

6. **Sempre usar `cn()` de `@fluencypassdevs/cycle/lib/utils`** para merge de classes CSS
7. **NUNCA usar cores hardcoded** (ex: `bg-blue-500`, `text-[#333]`) — usar semantic tokens: `bg-primary`, `text-muted-foreground`, `border-border`, etc.
8. **NUNCA usar valores de spacing hardcoded fora da escala Tailwind** — usar a escala padrao: `p-4`, `gap-6`, `mt-8`, etc.
9. **Dark mode via classe `.dark`** — tokens light/dark ja estao definidos nos tokens do Cycle
10. **Usar variaveis de radius** — `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`

### Regras de Codigo

11. **Usar TypeScript strict** — tipar todas as props, nunca usar `any`
12. **NUNCA importar de `lucide-react` direto** — icones Lucide SEMPRE de `@fluencypassdevs/cycle/icons/lucide`. O pacote `lucide-react` e uma dependencia interna do Cycle, nao deve ser importado diretamente no projeto.
13. **Imports com alias `@/`** — para codigo do projeto. Componentes do DS sempre de `@fluencypassdevs/cycle`

## Icones (IMPORTANTE)

O Cycle tem duas fontes de icones. **NUNCA importar de `lucide-react` diretamente.**

```tsx
// Icones Lucide — SEMPRE deste path, NUNCA de "lucide-react"
import { CycleIcon } from "@fluencypassdevs/cycle"
import { Home, Search, Settings } from "@fluencypassdevs/cycle/icons/lucide"

<CycleIcon icon={Home} size="sm" decorative />
<CycleIcon icon={Search} size="sm" aria-label="Buscar" />

// Icones custom Cycle (EdTech) — sem wrapper CycleIcon
import { Flashcard, Quiz, Course } from "@fluencypassdevs/cycle"

<Flashcard size="sm" decorative />
```

**ERRADO:**
```tsx
// NUNCA fazer isso:
import { Home } from "lucide-react"  // ❌ PROIBIDO
```

## Componentes Disponiveis

Todos importados de `@fluencypassdevs/cycle`:

| Componente | Descricao |
|------------|-----------|
| Button | 6 variants, 8 sizes, suporte a temas |
| Input | 2 variantes (outline, filled), 3 sizes |
| Textarea | 2 variantes (outline, filled), 3 sizes |
| Label | Rotulo acessivel para campos |
| Badge | 10 variants, 3 sizes |
| Accordion | Secoes colapsaveis |
| Tabs | 2 variants (default, line) |
| Sheet | Overlay lateral/bottom |
| ScrollArea, ScrollBar | Scroll customizado |
| Checkbox | 3 sizes, 2 variants |
| RadioGroup, RadioGroupItem | 3 sizes |
| Switch | 3 sizes |
| Slider | 3 sizes, suporte a range |
| Toggle | 2 variants, 8 sizes |
| Progress | 4 sizes, 4 variants |
| ProgressDot | Progresso compacto com dots (2-10 stages) |
| ProgressStage | Progresso segmentado (2-10 stages) |
| FileCard | Download card, 3 sizes |
| Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup | Sistema de avatar |
| ChatBubble | Bolha de mensagem |
| ChatPanel | Painel de chat completo |
| LikeDislike | Botoes like/dislike |
| LiveWaiting | Tela de espera para lives |
| AudioPlayer | Player de audio (Vidstack) |
| VideoPlayer | Player de video (Vidstack) |
| Toaster, cycleToast | Notificacoes toast |
| Alert, AlertAction, AlertClose | Alertas informativos |
| AlertDialog | Dialog de confirmacao |
| Select | Dropdown de selecao |
| Popover | Conteudo flutuante |
| Tooltip, TooltipProvider | Dica de texto |
| ResizablePanel, ResizableHandle | Paineis redimensionaveis |
| Empty | Estado vazio |
| Skeleton | Placeholder de carregamento |
| Spinner | Indicador de carregamento animado (5 sizes) |
| Drawer | Bottom sheet com gesto de arraste (mobile-first) |
| Fab | Floating Action Button circular/pill (3 sizes, 3 variants) |
| Dialog | Modal dialog |
| FluencypassLogo, FluencypassIcon | Logo e icone da Fluencypass |
| ProductLogo, ClassLogo, PrivateTalkLogo, GroupTalkLogo | Logos dos produtos |
| CycleIcon | Wrapper para icones Lucide |

## MCP Server (Claude Code)

Se o projeto tem `.mcp.json` configurado, o Claude Code tera acesso a tools do Cycle:

- `cycle_search_component` — buscar componente por nome/keyword
- `cycle_get_component` — detalhes completos com props e exemplos
- `cycle_get_icon_usage` — regras de uso de icones
- `cycle_get_setup` — instrucoes de setup
- `cycle_get_tokens` — tokens de design disponiveis
- `cycle_get_rules` — regras obrigatorias

**USE estas tools antes de criar qualquer UI.** Elas sao a fonte de verdade.

Para configurar: `npx cycle init`

## Documentacao

- **Componentes**: https://cycle-design.fluencypass.com/docs/components
- **Tokens**: https://cycle-design.fluencypass.com/docs/tokens

<!-- CYCLE-DESIGN-SYSTEM-END -->
