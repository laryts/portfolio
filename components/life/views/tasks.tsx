"use client"

import * as React from "react"
import { CheckSquare, Plus } from "lucide-react"
import { useLife } from "../store"
import { AREAS, AREA_IDS, PRIORITY_LABEL, type AreaId, type Priority, type Task } from "@/lib/life/types"
import { formatDayShort, todayISO } from "@/lib/life/dates"
import { isOverdue, sortTasks } from "@/lib/life/selectors"
import { AddButton, AreaBadge, Check, Empty, Field, PageHeader, Segmented, Select, Sheet, TextInput, haptic } from "../ui"
import { ActionRow, RowActions, emptyToUndef } from "./shared"
import { cn } from "@/lib/utils"

type Filter = "abertas" | "feitas" | "todas"

function TaskSheet({
  open,
  onOpenChange,
  task,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  task: Task | null
}) {
  const { add, patch, data } = useLife()
  const [title, setTitle] = React.useState("")
  const [area, setArea] = React.useState<AreaId>("pessoal")
  const [projectId, setProjectId] = React.useState("")
  const [priority, setPriority] = React.useState<Priority>(2)
  const [due, setDue] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    setTitle(task?.title ?? "")
    setArea(task?.area ?? "pessoal")
    setProjectId(task?.projectId ?? "")
    setPriority(task?.priority ?? 2)
    setDue(task?.due ?? "")
  }, [open, task])

  const save = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!title.trim()) return
    const payload = { title: title.trim(), area, priority, due: emptyToUndef(due), done: task?.done ?? false, projectId: projectId || undefined }
    if (task) patch("tasks", task.id, payload)
    else add("tasks", payload)
    haptic(8)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={task ? "Editar tarefa" : "Nova tarefa"}
      description="Um título claro. O resto é opcional."
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="button" className="l-btn l-btn-plum l-focus" onClick={() => save()} disabled={!title.trim()}>Salvar</button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5 pb-4">
        <Field label="O que precisa ser feito?">
          <TextInput autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: pagar conta de luz" maxLength={160} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Área">
            <Select value={area} onChange={(e) => setArea(e.target.value as AreaId)}>
              {AREA_IDS.map((a) => (
                <option key={a} value={a}>{AREAS[a].label}</option>
              ))}
            </Select>
          </Field>
          <Field label="Projeto" hint="Opcional. Vincular faz o progresso do projeto ser calculado por esta tarefa.">
            <Select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="">Sem projeto</option>
              {data.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </Field>
          <Field label="Prazo">
            <TextInput type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </Field>
        </div>
        <Field label="Prioridade">
          <Segmented<Priority>
            label="Prioridade"
            value={priority}
            onChange={setPriority}
            options={[1, 2, 3].map((p) => ({ value: p as Priority, label: PRIORITY_LABEL[p as Priority] }))}
          />
        </Field>
      </form>
    </Sheet>
  )
}

export function TasksView() {
  const { data, patch, remove } = useLife()
  const projectName = (id?: string) => data.projects.find((p) => p.id === id)?.name
  const today = todayISO()
  const [filter, setFilter] = React.useState<Filter>("abertas")
  const [areaFilter, setAreaFilter] = React.useState<AreaId | "todas">("todas")
  const [sheet, setSheet] = React.useState<{ open: boolean; task: Task | null }>({ open: false, task: null })

  const list = React.useMemo(() => {
    let items = data.tasks
    if (filter === "abertas") items = items.filter((t) => !t.done)
    if (filter === "feitas") items = items.filter((t) => t.done)
    if (areaFilter !== "todas") items = items.filter((t) => t.area === areaFilter)
    return sortTasks(items)
  }, [data.tasks, filter, areaFilter])

  const groups = React.useMemo(() => {
    const g = { atrasadas: [] as Task[], hoje: [] as Task[], proximas: [] as Task[], semData: [] as Task[], feitas: [] as Task[] }
    for (const t of list) {
      if (t.done) g.feitas.push(t)
      else if (!t.due) g.semData.push(t)
      else if (t.due < today) g.atrasadas.push(t)
      else if (t.due === today) g.hoje.push(t)
      else g.proximas.push(t)
    }
    return g
  }, [list, today])

  const sections: { key: keyof typeof groups; label: string }[] = [
    { key: "atrasadas", label: "Atrasadas" },
    { key: "hoje", label: "Hoje" },
    { key: "proximas", label: "Próximas" },
    { key: "semData", label: "Sem prazo" },
    { key: "feitas", label: "Concluídas" },
  ]

  const toggle = (t: Task, done: boolean) => patch("tasks", t.id, { done, doneAt: done ? new Date().toISOString() : undefined })

  return (
    <div>
      <PageHeader
        eyebrow="Dia a dia"
        title="Tarefas"
        description={`${data.tasks.filter((t) => !t.done).length} abertas${data.tasks.some((t) => !t.done && isOverdue(t.due, today)) ? " · algumas atrasadas" : ""}`}
        action={<AddButton label="Nova tarefa" onClick={() => setSheet({ open: true, task: null })} />}
      />

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Segmented<Filter>
          label="Filtrar tarefas"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "abertas", label: "Abertas" },
            { value: "feitas", label: "Concluídas" },
            { value: "todas", label: "Todas" },
          ]}
        />
        <div className="md:w-56">
          <label className="sr-only" htmlFor="area-filter">Filtrar por área</label>
          <Select id="area-filter" value={areaFilter} onChange={(e) => setAreaFilter(e.target.value as AreaId | "todas")}>
            <option value="todas">Todas as áreas</option>
            {AREA_IDS.map((a) => (
              <option key={a} value={a}>{AREAS[a].label}</option>
            ))}
          </Select>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="l-card">
          <Empty
            icon={CheckSquare}
            title={filter === "feitas" ? "Nada concluído ainda" : "Lista limpa"}
            text="Adicione o que precisa sair do papel. Pequenas vitórias contam."
            action={<AddButton label="Adicionar tarefa" onClick={() => setSheet({ open: true, task: null })} />}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map(({ key, label }) => {
            const items = groups[key]
            if (!items.length) return null
            return (
              <section key={key} aria-labelledby={`sec-${key}`}>
                <h2 id={`sec-${key}`} className="l-eyebrow mb-2 flex items-center gap-2">
                  {label}
                  <span className="l-muted font-semibold">{items.length}</span>
                </h2>
                <div className="l-card px-4 md:px-5">
                  <ul>
                    {items.map((t) => {
                      const overdue = isOverdue(t.due, today) && !t.done
                      return (
                        <ActionRow key={t.id} className={cn(t.done && "opacity-60")}>
                          <Check label={`Concluir ${t.title}`} checked={t.done} onChange={(v) => toggle(t, v)} />
                          <div className="min-w-0 flex-1">
                            <p className={cn("truncate text-[15px] font-medium", t.done && "line-through")}>{t.title}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                              <AreaBadge area={t.area} />
                              {projectName(t.projectId) && (
                                <span className="l-chip" style={{ background: "var(--l-bg-2)", color: "var(--l-ink-2)" }}>{projectName(t.projectId)}</span>
                              )}
                              {t.due && (
                                <span className="l-muted font-semibold" style={overdue ? { color: "var(--l-danger)" } : undefined}>
                                  {formatDayShort(t.due)}
                                </span>
                              )}
                              {t.priority === 1 && !t.done && (
                                <span className="font-semibold" style={{ color: "var(--l-coral)" }}>Prioridade alta</span>
                              )}
                            </div>
                          </div>
                          <RowActions
                            label={t.title}
                            onEdit={() => setSheet({ open: true, task: t })}
                            onDelete={() => remove("tasks", t.id)}
                          />
                        </ActionRow>
                      )
                    })}
                  </ul>
                </div>
              </section>
            )
          })}
        </div>
      )}

      <TaskSheet open={sheet.open} onOpenChange={(open) => setSheet((s) => ({ ...s, open }))} task={sheet.task} />
    </div>
  )
}
