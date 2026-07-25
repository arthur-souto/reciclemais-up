# Documentação da Stack — Front-end do Sistema de Reciclagem

## 1. Visão Geral

Este documento descreve a stack tecnológica escolhida para o desenvolvimento do front-end do sistema de reciclagem, consumindo um backend REST. O projeto será apresentado em eventos de tecnologia e para representantes de prefeitura, portanto as escolhas priorizam:

- **Robustez funcional** (fluxos sem fricção, tratamento claro de erros e estados de carregamento)
- **Aparência profissional** (consistência visual, sem parecer amador)
- **Velocidade de desenvolvimento** (prazo de evento, iteração rápida)
- **Facilidade de manutenção e extensão** futura do projeto

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Motivo da escolha |
|---|---|---|
| Framework | **React + Vite** | Build rápido, hot reload instantâneo, maior ecossistema de componentes |
| Estilização | **Tailwind CSS** | Consistência visual sem escrever CSS do zero, prototipação ágil |
| Componentes UI | **shadcn/ui** (com Radix) | Componentes copiados para o projeto, totalmente customizáveis, visual profissional |
| Ícones | **Lucide React** | Integração nativa com shadcn/ui, inclui ícones de sustentabilidade |
| Gráficos/Dashboards | **Recharts** | Simples de integrar, ideal para métricas de impacto (kg reciclado, CO2 evitado) |
| Mapas | **Leaflet + react-leaflet** | Gratuito, leve, ideal para pontos de coleta |
| Requisições HTTP | **Axios** | Interceptors, tratamento de erro centralizado, baseURL configurável |
| Gerenciamento de estado de servidor | **TanStack Query (React Query)** | Cache automático, retry, loading/error states prontos |
| Formulários e validação | **React Hook Form + Zod** | Validação declarativa, poucos bugs, boa experiência de uso |
| Deploy | **Vercel ou Netlify** | Deploy instantâneo, HTTPS gratuito, ideal para demonstrações |

---

## 3. Justificativas por Decisão

### 3.1 Funcional vs. Atrativo
A prioridade segue a ordem: **funcionalidade primeiro, estética profissional em seguida**. Fluxos principais (cadastro, coleta, pontos de descarte, relatórios) devem funcionar sem fricção, com feedback claro de loading, erro, sucesso e estado vazio. Depois disso, investe-se em consistência visual.

### 3.2 Uso de bibliotecas de estilização
Optou-se por usar uma lib de estilização (Tailwind) em vez de CSS puro, pois isso garante consistência visual "de graça" e libera tempo para focar nos fluxos funcionais — que pesam mais na avaliação tanto em eventos técnicos quanto para gestores públicos.

### 3.3 Tailwind CSS
Escolhido por acelerar a prototipação e permitir ajustes de última hora antes de apresentações, além de manter consistência entre telas diferentes conforme o projeto cresce.

### 3.4 REST + React Query
Como o backend expõe uma API REST, a combinação **Axios + React Query** foi escolhida por resolver de forma elegante o gerenciamento de chamadas HTTP, cache, e principalmente **cenários de rede instável** (comum em uso de campo, como catadores e pontos de coleta), com retry automático e refetch em background.

---

## 4. Estrutura de Pastas (atual)

```
src/
  api/
    axios.ts               → instância configurada (baseURL, interceptors, getApiErrorMessage)
    auth.api.ts             → funções de chamada (login, etc.)
    delivery.api.ts / evidence.api.ts / material.api.ts / prize.api.ts / user.api.ts
  hooks/
    useAuth.ts              → hooks React Query (useLogin, useLogout)
    useDeliveries.ts / useEvidence.ts / useMaterials.ts / usePrizes.ts / useUsers.ts
  context/
    AuthContext.tsx         → AuthProvider + useAuthContext (estado de sessão)
  components/
    ui/                     → componentes shadcn/ui (button, input, label, skeleton, sonner)
    ErrorBoundary.tsx        → fallback global de erro de render
    ErrorState.tsx           → estado de erro reutilizável (listagens, dashboards)
    EmptyState.tsx           → estado vazio reutilizável
  pages/
    Login.tsx
  types/
    api.ts, auth.ts, delivery.ts, evidence.ts, material.ts, prize.ts, user.ts
  lib/
    utils.ts                → helper `cn` (clsx + tailwind-merge)
  index.css                 → entrada Tailwind, importa token.css
  token.css                 → design tokens do projeto (cores, radius) — ver seção 8.1
  main.tsx                  → composição de providers (QueryClient, AuthProvider, Router, ErrorBoundary, Toaster)
```

---

## 5. Exemplo de Implementação

**Hook de consulta (`hooks/useColetas.js`):**

```javascript
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/axios'

export function useColetas() {
  return useQuery({
    queryKey: ['coletas'],
    queryFn: async () => {
      const { data } = await api.get('/coletas')
      return data
    },
  })
}
```

**Uso no componente:**

```javascript
function ListaColetas() {
  const { data, isLoading, isError } = useColetas()

  if (isLoading) return <Skeleton />
  if (isError) return <ErrorState mensagem="Não foi possível carregar as coletas" />

  return (
    <div>
      {data.map(coleta => <ColetaCard key={coleta.id} coleta={coleta} />)}
    </div>
  )
}
```

---

## 6. Pontos de Atenção para o Contexto do Projeto

- **Acessibilidade básica**: contraste adequado, navegação por teclado, textos alternativos — relevante para apresentação à prefeitura.
- **Responsividade real**: testar em telas pequenas desde o início, já que em eventos o público costuma testar pelo próprio celular.
- **Tratamento de conexão instável**: mensagens claras de erro em vez de tela branca, especialmente para uso em campo.
- **Dados de demonstração (seed/mock)**: preparar dados realistas para as telas de dashboard e gráficos de impacto.
- **Identidade visual temática**: usar paleta de cores e ícones relacionados à sustentabilidade para comunicar o propósito rapidamente.
- **Métricas de impacto em destaque**: kg reciclado, CO2 evitado, pontos de coleta ativos — dados que ajudam a "vender" a ideia para gestores públicos.
- **Onboarding/tour rápido**: facilita que visitantes de evento entendam o app sem necessidade de explicação constante.
- **Performance em redes lentas**: otimizar imagens e bundles, considerando Wi-Fi de eventos costuma ser instável.

---

## 7. Padrões Já Implementados no Código

Esta seção documenta decisões concretas já em uso no projeto, para que novas telas sigam o mesmo padrão em vez de reinventá-lo.

### 7.1 Design tokens (`src/token.css`)

Todas as cores (light/dark), variáveis do sidebar/charts e a escala de `radius` ficam em `src/token.css`; `src/index.css` só importa esse arquivo (`@import "./token.css"`) e mantém o `@layer base`.

- **Bordas**: o padrão do projeto é levemente arredondado, nunca totalmente reto nem muito arredondado. Isso é controlado por uma única variável, `--radius: 0.25rem`, e a escala (`--radius-sm` até `--radius-4xl`) é derivada dela por multiplicadores no `@theme inline`. Para ajustar o arredondamento do projeto inteiro, muda-se só o `--radius` em `token.css` — nunca hardcode `rounded-*` com valores fixos em componentes.
- Cores seguem a paleta neutra do shadcn (`oklch`), com blocos `:root` (light) e `.dark`.

### 7.2 Sessão / autenticação (`src/context/AuthContext.tsx`)

`AuthProvider` centraliza o `accessToken` (sincronizado com `localStorage`) e expõe `isAuthenticated`, `login(token)` e `logout()` via `useAuthContext()`. Hooks de auth (`src/hooks/useAuth.ts`) chamam o contexto em vez de mexer em `localStorage` diretamente — qualquer componente que precise saber se o usuário está logado, ou deslogar, usa `useAuthContext()`, sem duplicar lógica de token.

### 7.3 Estados de loading / erro / vazio

Conforme o princípio da seção 3.1 (funcionalidade > estética, mas com feedback claro), toda tela que busca dados deve tratar os três estados:

- **Loading**: `<Skeleton />` (`src/components/ui/skeleton.tsx`, shadcn).
- **Erro**: `<ErrorState mensagem="..." onRetry={...} />` (`src/components/ErrorState.tsx`).
- **Vazio**: `<EmptyState mensagem="..." icon={...} />` (`src/components/EmptyState.tsx`).

```tsx
function ListaColetas() {
  const { data, isLoading, isError, refetch } = useColetas()

  if (isLoading) return <Skeleton className="h-24 w-full" />
  if (isError) return <ErrorState mensagem="Não foi possível carregar as coletas." onRetry={refetch} />
  if (!data.length) return <EmptyState mensagem="Nenhuma coleta registrada ainda." />

  return <div>{data.map((coleta) => <ColetaCard key={coleta.id} coleta={coleta} />)}</div>
}
```

### 7.4 Erro de render — `ErrorBoundary`

`src/components/ErrorBoundary.tsx` envolve toda a árvore em `main.tsx`. Se um componente quebrar durante o render, o usuário vê uma tela de fallback ("Algo deu errado" + botão Recarregar) em vez de tela branca — atende diretamente o ponto de atenção da seção 6 sobre conexão/uso instável em campo.

### 7.5 Erros de API (`src/api/axios.ts`)

`getApiErrorMessage(error, fallback?)` lê a mensagem real devolvida pelo backend (`ApiErrorResponse.error`) e cai para "sem conexão com o servidor" quando a requisição não teve resposta (rede instável). Use essa função em todo `onError` de mutation/query para mostrar a mensagem verdadeira da API, nunca um texto genérico fixo:

```tsx
onError: (error) => toast.error(getApiErrorMessage(error, 'Mensagem padrão de fallback')),
```

### 7.6 `QueryClient` (`src/main.tsx`)

Configurado pensando em rede instável (seção 3.4/6): `queries` fazem retry (2x, backoff exponencial até 10s) e não refetcham automaticamente ao focar a janela; `mutations` **não** fazem retry automático (evita reenviar login/formulários sem o usuário saber).

### 7.7 Feedback e loading em botões

- Toasts: `sonner` (`src/components/ui/sonner.tsx`), montado uma vez em `main.tsx` (`<Toaster position="top-left" />`). Use `toast.success(...)` / `toast.error(...)` para feedback de ações — não crie estado local de erro/sucesso em cada formulário.
- `Button` (`src/components/ui/button.tsx`) tem uma prop `loading`: passe `loading={mutation.isPending}` para desabilitar o botão e mostrar o spinner (`Loader2Icon` com `animate-spin`) automaticamente, em vez de trocar o texto manualmente (`"Entrando..." `).

---

## 8. Resumo das Bibliotecas (Referência Rápida)

```
react
vite
tailwindcss
shadcn/ui (radix-ui)
lucide-react
recharts
leaflet / react-leaflet
axios
@tanstack/react-query
react-hook-form
zod
sonner
next-themes
```
