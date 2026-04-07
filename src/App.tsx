import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useProjectStore } from './stores/projectStore'
import { useSceneStore } from './stores/sceneStore'
import { useUiStore } from './stores/uiStore'
import { Toolbar } from './features/toolbar/Toolbar'
import { Timeline } from './features/timeline/Timeline'
import { ProjectDrawer } from './features/sidebar/ProjectDrawer'
import { FixedSidebar } from './features/sidebar/FixedSidebar'
import { TeleprompterView } from './features/teleprompter/TeleprompterView'
import { ProjectBriefPanel } from './features/toolbar/ProjectBriefPanel'
import { Film, Plus } from './components/Icons'
import { SCRIPT_PRESETS, normalizePresetTitle } from './lib/scriptPresets'
import './app.css'

function EmptyState() {
  const createProject = useProjectStore(s => s.createProject)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleStart = () => {
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleConfirm = () => {
    const t = title.trim()
    if (t) createProject(t)
    setTitle('')
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConfirm()
    if (e.key === 'Escape') { setEditing(false); setTitle('') }
  }

  return (
    <div className="empty-state">
      <div className="empty-state__icon"><Film size={48} /></div>
      <div className="empty-state__title">RCScript</div>
      <div className="empty-state__sub">영상 기획을 시작하려면 새 프로젝트를 만드세요.</div>
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="input"
            className="empty-state__new"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <input
              ref={inputRef}
              className="empty-state__input"
              placeholder="프로젝트 이름"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="empty-state__btn" onClick={handleConfirm} disabled={!title.trim()}>
              만들기
            </button>
            <button className="empty-state__btn--ghost" onClick={() => { setEditing(false); setTitle('') }}>
              취소
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="btn"
            className="empty-state__btn"
            onClick={handleStart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Plus size={16} /> 새 프로젝트 시작
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  const {
    projects,
    activeProjectId,
    hasHydrated: projectsHydrated,
  } = useProjectStore()
  const {
    migrateLegacyScenes,
    hasHydrated: scenesHydrated,
    replaceScenesForProject,
  } = useSceneStore()
  const { mode, setTeleprompterSceneIndex } = useUiStore()
  const activeProject = projects.find(p => p.id === activeProjectId) ?? null

  // #1: Migrate legacy localStorage data missing new taxonomy fields
  useEffect(() => {
    if (!scenesHydrated) return
    migrateLegacyScenes()
  }, [scenesHydrated, migrateLegacyScenes])

  useEffect(() => {
    if (!projectsHydrated || !scenesHydrated) return

    const importVersion = '2026-04-07-script-presets-v4'
    if (localStorage.getItem(importVersion) === 'done') return

    const projectStore = useProjectStore.getState()
    const sceneStore = useSceneStore.getState()
    const previousActiveProjectId = projectStore.activeProjectId
    const scenesByProjectId = new Map<string, number>()
    const existingProjects = new Map(
      projectStore.projects.map(project => [normalizePresetTitle(project.title), project])
    )

    for (const scene of sceneStore.scenes) {
      scenesByProjectId.set(scene.projectId, (scenesByProjectId.get(scene.projectId) ?? 0) + 1)
    }

    for (const preset of SCRIPT_PRESETS) {
      let project = existingProjects.get(normalizePresetTitle(preset.projectTitle))

      if (!project) {
        project = projectStore.createProject(preset.projectTitle)
        existingProjects.set(normalizePresetTitle(project.title), project)
      }

      if ((scenesByProjectId.get(project.id) ?? 0) > 0) continue

      sceneStore.replaceScenesForProject(project.id, preset.scenes)
      scenesByProjectId.set(project.id, preset.scenes.length)
    }

    if (previousActiveProjectId) {
      projectStore.setActiveProject(previousActiveProjectId)
    }

    localStorage.setItem(importVersion, 'done')
  }, [projectsHydrated, scenesHydrated, replaceScenesForProject])

  // #2: Reset teleprompter index when active project changes
  const prevProjectId = useRef(activeProjectId)
  useEffect(() => {
    if (prevProjectId.current !== activeProjectId) {
      setTeleprompterSceneIndex(0)
      prevProjectId.current = activeProjectId
    }
  }, [activeProjectId, setTeleprompterSceneIndex])

  return (
    <div className="app-shell" data-export-root="true">
      <AnimatePresence>
        {mode === 'teleprompter' && activeProjectId && (
          <TeleprompterView key="teleprompter" projectId={activeProjectId} />
        )}
      </AnimatePresence>

      <ProjectDrawer />

      {activeProject && <Toolbar projectId={activeProject.id} />}
      {activeProject && <ProjectBriefPanel project={activeProject} />}

      <div className="app-body">
        <FixedSidebar />
        {!activeProject ? (
          <EmptyState />
        ) : (
          <Timeline projectId={activeProject.id} />
        )}
      </div>
    </div>
  )
}
