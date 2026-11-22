"use client"

import * as React from "react"
import { Lock, ArrowRight, Settings2, Eye, EyeOff } from "lucide-react"
import { Toaster } from "sonner"
import { LifeProvider, useLife } from "./store"
import { LifeThemeProvider } from "./theme"
import { Shell, viewFromHash, type ViewId } from "./shell"
import { ErrorState, Skeleton, haptic } from "./ui"
import { HomeView } from "./views/home"
import { TasksView } from "./views/tasks"
import { GoalsView } from "./views/goals"
import { HabitsView } from "./views/habits"
import { FinanceView } from "./views/finance"
import { WishlistView } from "./views/wishlist"
import { ProjectsView } from "./views/projects"
import { CalendarView } from "./views/calendar"
import { WellbeingView } from "./views/wellbeing"
import { MomentsView } from "./views/moments"
import { PeopleView } from "./views/people"
import { TripsView } from "./views/trips"
import { HomeCareView } from "./views/home-care"
import { GroceriesView } from "./views/groceries"

const VIEW_COMPONENTS: Record<ViewId, React.ComponentType> = {
  hoje: HomeView,
  tarefas: TasksView,
  metas: GoalsView,
  habitos: HabitsView,
  financas: FinanceView,
  desejos: WishlistView,
  projetos: ProjectsView,
  calendario: CalendarView,
  bemestar: WellbeingView,
  momentos: MomentsView,
  pessoas: PeopleView,
  viagens: TripsView,
  lar: HomeCareView,
  mercado: GroceriesView,
}

function LoginScreen() {
  const { login, errorMessage } = useLife()
  const [passcode, setPasscode] = React.useState("")
  const [show, setShow] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passcode || busy) return
    setBusy(true)
    setError(null)
    const err = await login(passcode)
    setBusy(false)
    if (err) {
      haptic([20, 40, 20])
      setError(err)
      setPasscode("")
    }
  }

  return (
    <div className="life-root l-mural flex min-h-dvh items-center justify-center px-5 py-10">
      <div className="l-rise w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-[var(--l-plum)] text-white shadow-[var(--l-shadow-lg)]">
            <Lock className="h-7 w-7" aria-hidden />
          </div>
          <p className="l-eyebrow">Área privada</p>
          <h1 className="l-display mt-2 text-[34px] leading-tight">Lari&rsquo;s life</h1>
          <p className="l-ink-2 mt-2 text-[15px]">Entre com sua senha para abrir o painel.</p>
        </div>
        <form onSubmit={submit} className="l-card space-y-4 p-6" noValidate>
          <div>
            <label htmlFor="life-passcode" className="l-label">Senha</label>
            <div className="relative">
              <input
                id="life-passcode"
                className="l-input pr-12"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? "login-error" : undefined}
              />
              <button
                type="button"
                className="l-btn-icon l-focus absolute right-0 top-0"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              >
                {show ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
              </button>
            </div>
          </div>
          {(error || errorMessage) && (
            <p id="login-error" role="alert" className="text-sm" style={{ color: "var(--l-danger)" }}>
              {error || errorMessage}
            </p>
          )}
          <button type="submit" className="l-btn l-btn-plum l-focus h-12 w-full" disabled={busy || !passcode}>
            {busy ? "Entrando…" : "Entrar"} {!busy && <ArrowRight className="h-4 w-4" aria-hidden />}
          </button>
        </form>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="life-root l-mural min-h-dvh px-4 pt-10 md:pl-[296px] md:pr-10 md:pt-12" aria-busy="true" aria-label="Carregando">
      <div className="mx-auto max-w-[1280px] space-y-6">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-5 w-80 max-w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-56 md:col-span-2" />
          <Skeleton className="h-56" />
        </div>
      </div>
    </div>
  )
}

function Gate() {
  const { status, errorMessage, retry } = useLife()
  const [view, setView] = React.useState<ViewId>("hoje")

  React.useEffect(() => {
    setView(viewFromHash(window.location.hash))
    const onHash = () => setView(viewFromHash(window.location.hash))
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  const navigate = React.useCallback((id: ViewId) => {
    setView(id)
    if (window.location.hash !== `#${id}`) window.history.replaceState(null, "", `#${id}`)
  }, [])

  if (status === "loading") return <LoadingScreen />

  if (status === "locked") return <LoginScreen />

  if (status === "unconfigured") {
    return (
      <div className="life-root l-mural flex min-h-dvh items-center justify-center px-5">
        <div className="l-card max-w-lg space-y-4 p-6">
          <div className="flex items-center gap-3">
            <Settings2 className="h-6 w-6" aria-hidden />
            <h1 className="l-display text-[24px]">Falta configurar o servidor</h1>
          </div>
          <p className="l-ink-2 text-sm leading-relaxed">{errorMessage}</p>
          <ul className="l-muted list-disc space-y-1 pl-5 text-sm">
            <li><code>LIFE_PASSCODE</code>: a senha de acesso.</li>
            <li><code>UPSTASH_REDIS_REST_URL</code> e <code>UPSTASH_REDIS_REST_TOKEN</code> (ou <code>KV_REST_API_URL</code> / <code>KV_REST_API_TOKEN</code>): onde seus dados ficam salvos.</li>
          </ul>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={retry}>Verificar de novo</button>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="life-root l-mural min-h-dvh px-5 pt-16">
        <div className="mx-auto max-w-xl">
          <ErrorState message={errorMessage ?? "Não foi possível abrir o painel."} onRetry={retry} />
        </div>
      </div>
    )
  }

  const Component = VIEW_COMPONENTS[view]
  return (
    <Shell view={view} onNavigate={navigate}>
      <Component />
    </Shell>
  )
}

export function LifeApp() {
  return (
    <LifeThemeProvider>
      <LifeProvider>
        <Gate />
        <Toaster position="top-center" richColors={false} toastOptions={{ className: "life-root" }} />
      </LifeProvider>
    </LifeThemeProvider>
  )
}
