"use client"

import * as React from "react"
import { ExternalLink, FolderKanban } from "lucide-react"
import { useLife } from "../store"
import { AREAS, AREA_IDS, PROJECT_STATUS_LABEL, type AreaId, type Project, type ProjectStatus } from "@/lib/life/types"
import { AddButton, AreaBadge, Card, Empty, Field, PageHeader, ProgressBar, Segmented, Select, Sheet, TextInput, haptic } from "../ui"
import { RowActions, emptyToUndef, parseIntSafe } from "./shared"

function ProjectSheet({ open, onOpenChange, project }: { open: boolean; onOpenChange: (o: boolean) => void; project: Project | null }) {
  const { add, patch } = useLife()
  const [name, setName] = React.useState("")
  const [area, setArea] = React.useState<AreaId>("pessoal")
  const [status, setStatus] = React.useState<ProjectStatus>("ideia")
  const [progress, setProgress] = React.useState("0")
  const [nextStep, setNextStep] = React.useState("")
  const [link, setLink] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    setName(project?.name ?? "")
    setArea(project?.area ?? "pessoal")
    setStatus(project?.status ?? "ideia")
    setProgress(String(project?.progress ?? 0))
    setNextStep(project?.nextStep ?? "")
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
      nextStep: emptyToUndef(nextStep),
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
        <Field label={`Progresso: ${progress}%`}>
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
        <Field label="Próximo passo" hint="O que é a próxima ação concreta?">
          <TextInput value={nextStep} onChange={(e) => setNextStep(e.target.value)} placeholder="Ex.: revisar a proposta com a equipe" maxLength={160} />
        </Field>
        <Field label="Link" hint="Opcional">
          <TextInput inputMode="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" />
        </Field>
      </form>
    </Sheet>
  )
}

const STATUS_TONE: Record<ProjectStatus, string> = {
  ideia: "area-lilac",
  andamento: "area-teal",
  pausado: "area-mustard",
  concluido: "area-mint",
}

export function ProjectsView() {
  const { data, patch, remove } = useLife()
  const [filter, setFilter] = React.useState<ProjectStatus | "todos">("todos")
  const [sheet, setSheet] = React.useState<{ open: boolean; project: Project | null }>({ open: false, project: null })

  const items = React.useMemo(() => {
    const base = filter === "todos" ? data.projects : data.projects.filter((p) => p.status === filter)
    return [...base].sort((a, b) => (a.status === "concluido" ? 1 : 0) - (b.status === "concluido" ? 1 : 0) || b.updatedAt.localeCompare(a.updatedAt))
  }, [data.projects, filter])

  const active = data.projects.filter((p) => p.status === "andamento").length

  return (
    <div>
      <PageHeader
        eyebrow="Crescer"
        title="Projetos"
        description={`${active} em andamento · ${data.projects.length} no total`}
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
          {items.map((p) => (
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
                  <RowActions label={p.name} onEdit={() => setSheet({ open: true, project: p })} onDelete={() => remove("projects", p.id)} />
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="l-muted font-semibold">Progresso</span>
                    <span className="font-semibold">{p.progress}%</span>
                  </div>
                  <ProgressBar value={p.progress} color={AREAS[p.area].color as "teal"} label={`Progresso de ${p.name}`} />
                </div>
                {p.nextStep && (
                  <div className="rounded-2xl p-3 text-sm" style={{ background: "var(--l-bg-2)" }}>
                    <span className="l-eyebrow block pb-1">Próximo passo</span>
                    {p.nextStep}
                  </div>
                )}
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                  <label className="sr-only" htmlFor={`pst-${p.id}`}>Status de {p.name}</label>
                  <Select id={`pst-${p.id}`} className="h-11 min-h-[44px] py-2 text-sm sm:w-auto sm:flex-1" value={p.status} onChange={(e) => patch("projects", p.id, { status: e.target.value as ProjectStatus, updatedAt: new Date().toISOString() })}>
                    {(Object.keys(PROJECT_STATUS_LABEL) as ProjectStatus[]).map((s) => <option key={s} value={s}>{PROJECT_STATUS_LABEL[s]}</option>)}
                  </Select>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="l-btn l-btn-ghost l-focus h-11" onClick={() => haptic(4)}>
                      Abrir <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <ProjectSheet open={sheet.open} onOpenChange={(open) => setSheet((s) => ({ ...s, open }))} project={sheet.project} />
    </div>
  )
}
