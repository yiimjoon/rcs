import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProjectStore } from '../../stores/projectStore'
import { useUiStore } from '../../stores/uiStore'
import { X, Plus } from '../../components/Icons'
import type { Project, ProjectStatus } from '../../lib/types'

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'backlog',     label: 'B' },
  { value: 'in_progress', label: 'W' },
  { value: 'done',        label: 'D' },
]

function ProjectCard({ project }: { project: Project }) {
  const { activeProjectId, setActiveProject, updateProject, deleteProject } = useProjectStore()
  const { setSidebarOpen } = useUiStore()
  const isActive = project.id === activeProjectId

  return (
    <div
      className={`project-card${isActive ? ' active' : ''}`}
      onClick={() => { setActiveProject(project.id); setSidebarOpen(false) }}
    >
      <span className="project-card__title">{project.title}</span>
      <div className="project-card__status" onClick={e => e.stopPropagation()}>
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`status-btn${project.status === opt.value ? ' active' : ''}`}
            title={opt.value}
            onClick={() => updateProject(project.id, { status: opt.value })}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        className="project-card__delete"
        title="프로젝트 삭제"
        onClick={e => {
          e.stopPropagation()
          if (confirm(`"${project.title}" 프로젝트를 삭제하시겠습니까?`)) {
            deleteProject(project.id)
          }
        }}
      ><X size={12} /></button>
    </div>
  )
}

function NewProjectInput({ onDone }: { onDone: () => void }) {
  const createProject = useProjectStore(s => s.createProject)
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const confirm = () => {
    const t = title.trim()
    if (t) createProject(t)
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
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') confirm()
          if (e.key === 'Escape') onDone()
        }}
      />
      <button className="new-project-input__ok" onClick={confirm} disabled={!title.trim()}>
        추가
      </button>
    </motion.div>
  )
}

export function ProjectDrawer() {
  const { projects } = useProjectStore()
  const { sidebarOpen, setSidebarOpen } = useUiStore()
  const [adding, setAdding] = useState(false)

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
              <span className="sidebar__title">PROJECTS</span>
              <button
                className="sidebar__new-btn"
                onClick={() => setAdding(a => !a)}
              ><Plus size={14} /> 새 프로젝트</button>
            </div>

            <AnimatePresence>
              {adding && (
                <NewProjectInput onDone={() => setAdding(false)} />
              )}
            </AnimatePresence>

            <div className="sidebar__list">
              {projects.length === 0 ? (
                <div style={{ padding: '24px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
                  프로젝트가 없습니다.
                </div>
              ) : (
                projects.map(p => <ProjectCard key={p.id} project={p} />)
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
