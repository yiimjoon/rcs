import { useActiveProject } from '../../stores/projectStore'
import { useUiStore } from '../../stores/uiStore'
import { useScenes } from '../../hooks/useScenes'
import { calculateAutoDuration, formatDuration } from '../../lib/duration'
import { Menu, Clock, Layers } from '../../components/Icons'

export function FixedSidebar() {
  const project = useActiveProject()
  const { toggleSidebar } = useUiStore()
  const scenes = useScenes(project?.id ?? '')

  const totalSeconds = scenes.reduce(
    (sum, s) => sum + calculateAutoDuration(s.narration) + s.durationManual,
    0
  )

  return (
    <div className="fixed-sidebar">
      <button
        className="fixed-sidebar__menu"
        onClick={toggleSidebar}
        title="프로젝트 목록 열기"
      >
        <Menu size={18} />
      </button>

      <div className="fixed-sidebar__title">
        {project?.title ?? 'RCScript'}
      </div>

      <div className="fixed-sidebar__meta">
        <div className="fixed-sidebar__meta-item" title="총 시간">
          <Clock size={12} />
          <span>{formatDuration(totalSeconds)}</span>
        </div>
        <div className="fixed-sidebar__meta-item" title="씬 개수">
          <Layers size={12} />
          <span>{scenes.length}</span>
        </div>
      </div>
    </div>
  )
}
