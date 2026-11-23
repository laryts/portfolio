"use client"

import * as React from "react"
import { CheckCircle2, ExternalLink, FolderKanban, Link2, Plus, Sparkles, Unlink } from "lucide-react"
import { useLife } from "../store"
import { AREAS, AREA_IDS, PROJECT_STATUS_LABEL, type AreaId, type Project, type ProjectStatus, type Task } from "@/lib/life/types"
import { formatDayShort, todayISO } from "@/lib/life/dates"
import { projectInsight, sortTasks } from "@/lib/life/selectors"
import { AddButton, AreaBadge, Card, Check, Empty, Field, PageHeader, ProgressBar, Segmented, Select, Sheet, TextInput, haptic } from "../ui"
import { RowActions, emptyToUndef, parseIntSafe } from "./shared"
import { cn } from "@/lib/utils"

const STATUS_TONE: Record<ProjectStatus, string> = {
  ideia: "area-lilac",
  andamento: "area-teal",
  pausado: "area-mustard",
  concluido: "area-mint",
}

function ProjectSheet({ open, onOpenChange, project }: { open: boolean; onOpenChange: (o: boolean) => void; project: Project | null }) {
  const { add, patch } = useLife()
  const [name, setName] = React.useState("")
  const [area, setArea] = React.useState<AreaId>("pessoal")
  const [status, setStatus] = React.useState<ProjectStatus>("ideia")
  const [progress, setProgress] = React.useState("0")
  const [link, setLink] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    setName(project?.name ?? "")
    setArea(project?.area ?? "pessoal")
    setStatus(project?.status ?? "ideia")
    setProgress(String(project?.progress ?? 0))
    setLink(project?.link ?? "")
  }, [open, project])

  const save = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!name.trim()) return
    const payload = {
      name: name.trim(),
      area,
      status,
      progress: Math.min(100, Math.max(0, parseIntSafe(progress, 0))),
      link: emptyToUndef(link),
      updatedAt: new Date().toISOString(),
    }
    if (project) patch("projects", project.id, payload)
    else add("projects", payload)
    haptic(8)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={project ? "Editar projeto" : "Novo projeto"}
      description="Ideias, projetos da Niido e da Pixie, coisas pessoais."
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="button" className="l-btn l-btn-plum l-focus" disabled={!name.trim()} onClick={() => save()}>Salvar</button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5 pb-4">
        <Field label="Projeto">
          <TextInput autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Nova versão do site da Niido" maxLength={120} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Área">
            <Select value={area} onChange={(e) => setArea(e.target.value as AreaId)}>
              {AREA_IDS.map((a) => <option key={a} value={a}>{AREAS[a].label}</option>)}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
              {(Object.keys(PROJECT_STATUS_LABEL) as ProjectStatus[]).map((s) => <option key={s} value={s}>{PROJECT_STATUS_LABEL[s]}</option>)}
            </Select>
          </Field>
        </div>
        <Field label={`Progresso manual: ${progress}%`} hint="Só vale enquanto o projeto não tiver tarefas vinculadas. Com tarefas, o progresso é calculado sozinho.">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            className="h-11 w-full accent-[var(--l-plum)]"
            aria-valuetext={`${progress}%`}
          />
        </Field>
        <Field label="Link" hint="Opcional">
          <TextInput inputMode="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" />
        </Field>
      </form>
    </Sheet>
  )
}

/** Detalhe: tarefas do projeto, próxima ação, atividade e sugestões. */
function ProjectDetail({ project, onClose, onEdit }: { project: Project | null; onClose: () => void; onEdit: (p: Project) => void }) {
  const { data, add, patch, update } = useLife()
  const today = todayISO()
  const [newTitle, setNewTitle] = React.useState("")
  const [newDue, setNewDue] = React.useState("")
  const [linkId, setLinkId] = React.useState("")

  const insight = project ? projectInsight(project, data.tasks, today) : null
  const unlinked = React.useMemo(
    () => (project ? sortTasks(data.tasks.filter((t) => !t.done && t.projectId !== project.id)) : []),
    [data.tasks, project]
  )

  React.useEffect(() => {
    setNewTitle("")
    setNewDue("")
    setLinkId("")
  }, [project?.id])

  if (!project || !insight) return null

  const touch = () => ({ updatedAt: new Date().toISOString() })
  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    add("tasks", { title, area: project.area, priority: 2, due: emptyToUndef(newDue), done: false, projectId: project.id })
    patch("projects", project.id, touch())
    setNewTitle("")
    setNewDue("")
    haptic(8)
  }
  const toggleTask = (t: Task, done: boolean) => {
    patch("tasks", t.id, { done, doneAt: done ? new Date().toISOString() : undefined })
    patch("projects", project.id, touch())
    haptic(done ? [10, 30, 10] : 4)
  }
  const unlinkTask = (t: Task) => {
    patch("tasks", t.id, { projectId: undefined })
    patch("projects", project.id, touch())
  }
  const linkTask = () => {
    if (!linkId) return
    patch("tasks", linkId, { projectId: project.id })
    patch("projects", project.id, touch())
    setLinkId("")
    haptic(8)
  }
  const setStatus = (status: ProjectStatus) => {
    patch("projects", project.id, { status, ...touch() })
    haptic(8)
  }

  const progress = insight.progress ?? project.progress
  const linkedSorted = [...insight.linked].sort((a, b) => Number(a.done) - Number(b.done))

  return (
    <Sheet
      open={!!project}
      onOpenChange={(o) => !o && onClose()}
      title={project.name}
      description={`${AREAS[project.area].label} · ${PROJECT_STATUS_LABEL[project.status]}`}
      size="lg"
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onEdit(project)}>Editar dados</button>
          <button type="button" className="l-btn l-btn-plum l-focus" onClick={onClose}>Pronto</button>
        </>
      }
    >
      <div className="space-y-6 pb-4">
        {/* Progresso */}
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="l-eyebrow">Progresso {insight.progress === null ? "(manual)" : "(pelas tarefas)"}</span>
            <span className="l-display text-[22px]">{progress}%</span>
          </div>
          <ProgressBar value={progress} color={AREAS[project.area].color as "teal"} label={`Progresso de ${project.name}`} />
          <p className="l-muted mt-2 text-xs">
            {insight.total > 0 ? `${insight.done} de ${insight.total} tarefas feitas` : "Vincule tarefas para o progresso ser calculado sozinho."}
          </p>
        </div>

        {/* Sugestão inteligente */}
        {insight.suggestion && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4" style={{ background: "var(--l-bg-2)" }}>
            <div className="flex min-w-0 items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--l-plum)" }} aria-hidden />
              <p className="text-sm">{insight.suggestion.text}</p>
            </div>
            <button type="button" className="l-btn l-btn-plum l-focus h-11 px-4" onClick={() => setStatus(insight.suggestion!.status)}>
              {insight.suggestion.actionLabel}
            </button>
          </div>
        )}

        {/* Próxima ação */}
        <div>
          <span className="l-eyebrow">Próxima ação</span>
          {insight.next ? (
            <p className="mt-1 text-[15px] font-semibold">
              {insight.next.title}
              {insight.next.due && <span className="l-muted font-normal"> · até {formatDayShort(insight.next.due)}</span>}
            </p>
          ) : project.nextStep ? (
            <p className="mt-1 text-[15px]">{project.nextStep}</p>
          ) : (
            <p className="l-muted mt-1 text-sm">Nenhuma tarefa aberta. Adicione a primeira abaixo.</p>
          )}
          <p className="l-muted mt-1 text-xs">
            Última atividade {formatDayShort(insight.lastActivity)}
            {insight.staleDays >= 14 ? ` · parado há ${insight.staleDays} dias` : ""}
          </p>
        </div>

        {/* Tarefas */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="l-eyebrow">Tarefas do projeto</span>
            <span className="l-muted text-xs font-semibold">{insight.total}</span>
          </div>
          <form onSubmit={addTask} className="mb-3 flex flex-col gap-2 sm:flex-row" aria-label="Nova tarefa do projeto">
            <TextInput value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Nova tarefa para este projeto" maxLength={160} aria-label="Título da nova tarefa" />
            <div className="flex gap-2">
              <TextInput type="date" value={newDue} onChange={(e) => setNewDue(e.target.value)} className="sm:w-44" aria-label="Prazo da nova tarefa" />
              <button type="submit" className="l-btn l-btn-plum l-focus h-11 shrink-0 px-4" disabled={!newTitle.trim()} aria-label="Adicionar tarefa">
                <Plus className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </form>
          {linkedSorted.length === 0 ? (
            <p className="l-muted py-3 text-sm">Nenhuma tarefa ainda.</p>
          ) : (
            <ul>
              {linkedSorted.map((t) => (
                <li key={t.id} className="flex items-center gap-2 py-1" style={{ borderBottom: "1px solid var(--l-border)" }}>
                  <Check label={`Concluir ${t.title}`} checked={t.done} onChange={(v) => toggleTask(t, v)} />
                  <div className="min-w-0 flex-1 py-2">
                    <p className={cn("truncate text-[14.5px]", t.done && "l-muted line-through")}>{t.title}</p>
                    {t.due && !t.done && <p className="l-muted text-xs">até {formatDayShort(t.due)}</p>}
                  </div>
                  <button type="button" className="l-btn-icon l-focus" onClick={() => unlinkTask(t)} aria-label={`Desvincular ${t.title} do projeto`}>
                    <Unlink className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {unlinked.length > 0 && (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Select value={linkId} onChange={(e) => setLinkId(e.target.value)} aria-label="Vincular tarefa existente">
                <option value="">Vincular uma tarefa existente…</option>
                {unlinked.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
              </Select>
              <button type="button" className="l-btn l-btn-ghost l-focus h-11 shrink-0 px-4" disabled={!linkId} onClick={linkTask}>
                <Link2 className="h-4 w-4" aria-hidden /> Vincular
              </button>
            </div>
          )}
        </div>

        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="l-btn l-btn-ghost l-focus h-11" onClick={() => haptic(4)}>
            Abrir link do projeto <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}
        {insight.total > 0 && insight.done === insight.total && project.status === "concluido" && (
          <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--l-ok)" }}>
            <CheckCircle2 className="h-4 w-4" aria-hidden /> Projeto concluído
          </p>
        )}
      </div>
    </Sheet>
  )
}

export function ProjectsView() {
  const { data, patch, remove, update } = useLife()
  const today = todayISO()
  const [filter, setFilter] = React.useState<ProjectStatus | "todos">("todos")
  const [sheet, setSheet] = React.useState<{ open: boolean; project: Project | null }>({ open: false, project: null })
  const [detailId, setDetailId] = React.useState<string | null>(null)
  const detail = data.projects.find((p) => p.id === detailId) ?? null

  const cards = React.useMemo(
    () =>
      data.projects.map((p) => ({ project: p, insight: projectInsight(p, data.tasks, today) })),
    [data.projects, data.tasks, today]
  )

  const items = React.useMemo(() => {
    const base = filter === "todos" ? cards : cards.filter((c) => c.project.status === filter)
    return [...base].sort((a, b) => Number(a.project.status === "concluido") - Number(b.project.status === "concluido") || b.insight.lastActivity.localeCompare(a.insight.lastActivity))
  }, [cards, filter])

  const active = data.projects.filter((p) => p.status === "andamento").length
  const attention = cards.filter((c) => c.insight.suggestion).length

  const deleteProject = (p: Project) => {
    update((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.projectId === p.id ? { ...t, projectId: undefined } : t)),
      projects: prev.projects.filter((x) => x.id !== p.id),
    }))
    if (detailId === p.id) setDetailId(null)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Crescer"
        title="Projetos"
        description={`${active} em andamento${attention ? ` · ${attention} pedindo atenção` : ""} · ${data.projects.length} no total`}
        action={<AddButton label="Novo projeto" onClick={() => setSheet({ open: true, project: null })} />}
      />

      <div className="l-scroll-x -mx-4 mb-5 px-4 md:mx-0 md:px-0">
        <Segmented<ProjectStatus | "todos">
          label="Filtrar por status"
          value={filter}
          onChange={setFilter}
          options={[{ value: "todos", label: "Todos" }, ...(Object.keys(PROJECT_STATUS_LABEL) as ProjectStatus[]).map((s) => ({ value: s, label: PROJECT_STATUS_LABEL[s] }))]}
        />
      </div>

      {items.length === 0 ? (
        <Card>
          <Empty icon={FolderKanban} title="Nenhum projeto por aqui" text="Crie um para cada coisa que você quer tirar do papel." action={<AddButton label="Criar projeto" onClick={() => setSheet({ open: true, project: null })} />} />
        </Card>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map(({ project: p, insight }) => {
            const progress = insight.progress ?? p.progress
            return (
              <li key={p.id}>
                <Card className="flex h-full flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <AreaBadge area={p.area} />
                        <span className={`l-chip ${STATUS_TONE[p.status]}`}>{PROJECT_STATUS_LABEL[p.status]}</span>
                      </div>
                      <h2 className="l-display text-[20px] leading-snug">{p.name}</h2>
                    </div>
                    <RowActions label={p.name} onEdit={() => setSheet({ open: true, project: p })} onDelete={() => deleteProject(p)} />
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="l-muted font-semibold">{insight.total > 0 ? `${insight.done} de ${insight.total} tarefas` : "Progresso"}</span>
                      <span className="font-semibold">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} color={AREAS[p.area].color as "teal"} label={`Progresso de ${p.name}`} />
                  </div>

                  <div className="rounded-2xl p-3 text-sm" style={{ background: "var(--l-bg-2)" }}>
                    <span className="l-eyebrow block pb-1">Próxima ação</span>
                    {insight.next ? insight.next.title : p.nextStep ?? <span className="l-muted">Nenhuma tarefa aberta</span>}
                  </div>

                  {insight.suggestion && (
                    <p className="flex items-start gap-2 text-xs font-semibold" style={{ color: "var(--l-plum)" }}>
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden /> {insight.suggestion.text}
                    </p>
                  )}

                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                    <button type="button" className="l-btn l-btn-plum l-focus h-11 flex-1 px-4" onClick={() => setDetailId(p.id)}>
                      Abrir projeto
                    </button>
                    <label className="sr-only" htmlFor={`pst-${p.id}`}>Status de {p.name}</label>
                    <Select id={`pst-${p.id}`} className="h-11 min-h-[44px] w-auto py-2 text-sm" value={p.status} onChange={(e) => patch("projects", p.id, { status: e.target.value as ProjectStatus, updatedAt: new Date().toISOString() })}>
                      {(Object.keys(PROJECT_STATUS_LABEL) as ProjectStatus[]).map((s) => <option key={s} value={s}>{PROJECT_STATUS_LABEL[s]}</option>)}
                    </Select>
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="l-btn-icon l-focus" aria-label={`Abrir link de ${p.name}`} onClick={() => haptic(4)}>
                        <ExternalLink className="h-4 w-4" aria-hidden />
                      </a>
                    )}
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      <ProjectSheet open={sheet.open} onOpenChange={(open) => setSheet((s) => ({ ...s, open }))} project={sheet.project} />
      <ProjectDetail
        project={detail}
        onClose={() => setDetailId(null)}
        onEdit={(p) => {
          setDetailId(null)
          setSheet({ open: true, project: p })
        }}
      />
    </div>
  )
}
