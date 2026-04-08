import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProjectStore } from '../../stores/projectStore'
import { useSceneStore } from '../../stores/sceneStore'
import { useUiStore } from '../../stores/uiStore'
import { X, Plus, Layers, ChevronRight } from '../../components/Icons'
import type { Project, ProjectStatus } from '../../lib/types'

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'backlog', label: 'B' },
  { value: 'in_progress', label: 'W' },
  { value: 'done', label: 'D' },
]

function getDayStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

function getLocalDateKey(value: string) {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatGroupLabel(dateKey: string, now: Date) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const target = new Date(year, month - 1, day)
  const diffInDays = Math.round((getDayStart(now) - getDayStart(target)) / 86400000)

  if (diffInDays === 0) return '오늘'
  if (diffInDays === 1) return '어제'

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(target)
}

function formatProjectTimestamp(value: string, now: Date) {
  const date = new Date(value)
  const diffInDays = Math.round((getDayStart(now) - getDayStart(date)) / 86400000)

  if (diffInDays <= 1) {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

function getThemePreview(theme: string) {
  return theme.replace(/\s+/g, ' ').trim()
}

function ProjectCard({
  now,
  project,
  sceneCount,
}: {
  now: Date
  project: Project
  sceneCount: number
}) {
  const { activeProjectId, setActiveProject, updateProject, deleteProject } = useProjectStore()
  const { setSidebarOpen } = useUiStore()
  const isActive = project.id === activeProjectId
  const themePreview = getThemePreview(project.theme)

  return (
    <div
      className={`project-card${isActive ? ' active' : ''}`}
      onClick={() => {
        setActiveProject(project.id)
        setSidebarOpen(false)
      }}
    >
      <div className="project-card__body">
        <div className="project-card__top">
          <span className="project-card__title">{project.title}</span>
          <span className="project-card__date">{formatProjectTimestamp(project.updatedAt, now)}</span>
        </div>

        {themePreview && (
          <div className="project-card__theme">{themePreview}</div>
        )}

        <div className="project-card__footer">
          <div className="project-card__scene-count" title="씬 개수">
            <Layers size={12} />
            <span>씬 {sceneCount}</span>
          </div>

          <div className="project-card__status" onClick={event => event.stopPropagation()}>
            {STATUS_OPTIONS.map(option => (
              <button
                key={option.value}
                className={`status-btn${project.status === option.value ? ' active' : ''}`}
                title={option.value}
                onClick={() => updateProject(project.id, { status: option.value })}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        className="project-card__delete"
        title="프로젝트 삭제"
        onClick={event => {
          event.stopPropagation()
          if (confirm(`"${project.title}" 프로젝트를 삭제하시겠습니까?`)) {
            deleteProject(project.id)
          }
        }}
      >
        <X size={12} />
      </button>
    </div>
  )
}

function NewProjectInput({ onDone }: { onDone: () => void }) {
  const createProject = useProjectStore(state => state.createProject)
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const confirm = () => {
    const trimmedTitle = title.trim()
    if (trimmedTitle) createProject(trimmedTitle)
    onDone()
  }

  return (
    <motion.div
      className="new-project-input"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <input
        ref={inputRef}
        autoFocus
        className="new-project-input__field"
        placeholder="프로젝트 이름"
        value={title}
        onChange={event => setTitle(event.target.value)}
        onKeyDown={event => {
          if (event.key === 'Enter') confirm()
          if (event.key === 'Escape') onDone()
        }}
      />
      <button className="new-project-input__ok" onClick={confirm} disabled={!title.trim()}>
        추가
      </button>
    </motion.div>
  )
}

export function ProjectDrawer() {
  const projects = useProjectStore(state => state.projects)
  const scenes = useSceneStore(state => state.scenes)
  const { sidebarOpen, setSidebarOpen } = useUiStore()
  const [adding, setAdding] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  const sceneCountByProjectId = useMemo(() => {
    const counts = new Map<string, number>()

    for (const scene of scenes) {
      counts.set(scene.projectId, (counts.get(scene.projectId) ?? 0) + 1)
    }

    return counts
  }, [scenes])

  const now = useMemo(() => new Date(), [projects])

  const projectGroups = useMemo(() => {
    const sortedProjects = [...projects].sort(
      (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    )

    const grouped = new Map<string, Project[]>()

    for (const project of sortedProjects) {
      const key = getLocalDateKey(project.updatedAt)
      const group = grouped.get(key)

      if (group) {
        group.push(project)
      } else {
        grouped.set(key, [project])
      }
    }

    return Array.from(grouped.entries()).map(([dateKey, groupedProjects]) => ({
      dateKey,
      label: formatGroupLabel(dateKey, now),
      projects: groupedProjects,
    }))
  }, [now, projects])

  useEffect(() => {
    setOpenGroups(current => {
      const nextState: Record<string, boolean> = {}

      for (const [index, group] of projectGroups.entries()) {
        nextState[group.dateKey] = current[group.dateKey] ?? index === 0
      }

      return nextState
    })
  }, [projectGroups])

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <div className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}>
          <motion.div
            className="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
          <motion.div
            className="sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="sidebar__header">
              <div className="sidebar__heading">
                <div className="sidebar__eyebrow">Organizer</div>
                <span className="sidebar__title">프로젝트 정리함</span>
                <div className="sidebar__subtitle">최근 수정일 기준으로 자동 정리됩니다.</div>
              </div>
              <button
                className="sidebar__new-btn"
                onClick={() => setAdding(current => !current)}
              >
                <Plus size={14} /> 새 프로젝트
              </button>
            </div>

            <AnimatePresence>
              {adding && <NewProjectInput onDone={() => setAdding(false)} />}
            </AnimatePresence>

            <div className="sidebar__list">
              {projectGroups.length === 0 ? (
                <div style={{ padding: '24px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
                  프로젝트가 없습니다.
                </div>
              ) : (
                projectGroups.map(group => (
                  <section key={group.dateKey} className="sidebar__group">
                    <button
                      className={`sidebar__group-header${openGroups[group.dateKey] ? ' open' : ''}`}
                      onClick={() =>
                        setOpenGroups(current => ({
                          ...current,
                          [group.dateKey]: !current[group.dateKey],
                        }))
                      }
                    >
                      <div className="sidebar__group-header-main">
                        <span
                          className={`sidebar__group-arrow${openGroups[group.dateKey] ? ' open' : ''}`}
                        >
                          <ChevronRight size={12} />
                        </span>
                        <span className="sidebar__group-name">{group.label}</span>
                      </div>
                      <span className="sidebar__group-count">{group.projects.length}</span>
                    </button>

                    <AnimatePresence initial={false}>
                      {openGroups[group.dateKey] && (
                        <motion.div
                          className="sidebar__group-list"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                        >
                          {group.projects.map(project => (
                            <ProjectCard
                              key={project.id}
                              now={now}
                              project={project}
                              sceneCount={sceneCountByProjectId.get(project.id) ?? 0}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
