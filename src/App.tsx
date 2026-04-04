import { AnimatePresence } from 'framer-motion'
import { useProjectStore } from './stores/projectStore'
import { useUiStore } from './stores/uiStore'
import { Toolbar } from './features/toolbar/Toolbar'
import { Timeline } from './features/timeline/Timeline'
import { ProjectDrawer } from './features/sidebar/ProjectDrawer'
import { FixedSidebar } from './features/sidebar/FixedSidebar'
import { TeleprompterView } from './features/teleprompter/TeleprompterView'
import { Film, Plus } from './components/Icons'
import './app.css'

function EmptyState() {
  const createProject = useProjectStore(s => s.createProject)

  return (
    <div className="empty-state">
      <div className="empty-state__icon"><Film size={48} /></div>
      <div className="empty-state__title">RCScript</div>
      <div className="empty-state__sub">
        영상 기획을 시작하려면 새 프로젝트를 만드세요.
      </div>
      <button
        className="empty-state__btn"
        onClick={() => {
          const title = prompt('프로젝트 이름을 입력하세요:', '나의 첫 영상')
          if (title) createProject(title)
        }}
      >
        <Plus size={16} /> 새 프로젝트 시작
      </button>
    </div>
  )
}

export default function App() {
  const { projects, activeProjectId } = useProjectStore()
  const { mode } = useUiStore()
  const activeProject = projects.find(p => p.id === activeProjectId) ?? null

  return (
    <div className="app-shell">
      {/* Teleprompter overlay */}
      <AnimatePresence>
        {mode === 'teleprompter' && activeProjectId && (
          <TeleprompterView key="teleprompter" projectId={activeProjectId} />
        )}
      </AnimatePresence>

      {/* Sidebar drawer */}
      <ProjectDrawer />

      {/* Toolbar */}
      {activeProject && <Toolbar projectId={activeProject.id} />}

      {/* Main body */}
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
