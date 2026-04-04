import { useProjectStore } from '../../stores/projectStore'
import { useUiStore } from '../../stores/uiStore'
import { useScenes } from '../../hooks/useScenes'
import { calculateAutoDuration, formatDuration } from '../../lib/duration'
import { Play, Settings, Share, Zap, Clock, Film } from '../../components/Icons'

interface Props { projectId: string }

export function Toolbar({ projectId }: Props) {
  const { projects, activeProjectId, updateProject } = useProjectStore()
  const { toggleSidebar, setMode } = useUiStore()

  const project = projects.find(p => p.id === activeProjectId)
  const scenes = useScenes(projectId)

  const allLocked = scenes.length > 0 && scenes.every(s => s.isLocked)
  const totalSeconds = scenes.reduce(
    (sum, s) => sum + calculateAutoDuration(s.narration) + s.durationManual,
    0
  )

  return (
    <div className="toolbar">
      <div className="toolbar__left">
        <input
          className="toolbar__project-title"
          value={project?.title ?? ''}
          onChange={e => project && updateProject(project.id, { title: e.target.value })}
          placeholder="프로젝트 제목"
        />
      </div>

      <div className="toolbar__center">
        {/* Icon group — Anton 앱의 상단 아이콘 그룹 재현 */}
        <div className="toolbar__icon-group">
          <button className="toolbar__btn" title="AI 교정 (준비 중)">
            <Zap size={16} />
          </button>
          <button className="toolbar__btn" title="공유 (준비 중)">
            <Share size={16} />
          </button>
          <button className="toolbar__btn" title="설정 (준비 중)">
            <Settings size={16} />
          </button>
        </div>

        <div className="toolbar__divider" />

        <div className="toolbar__duration">
          <Clock size={12} />
          <span>{formatDuration(totalSeconds)}</span>
          <span className="toolbar__duration-sep">·</span>
          <Film size={12} />
          <span>{scenes.length}개 씬</span>
        </div>
      </div>

      <div className="toolbar__right">
        {allLocked && (
          <button
            className="toolbar__btn toolbar__btn--accent"
            onClick={() => setMode('teleprompter')}
            title="텔레프롬프터 모드"
          >
            <Play size={14} />
            읽기 모드
          </button>
        )}
        {!allLocked && scenes.length > 0 && (
          <span className="toolbar__hint">
            모든 씬 잠금 시 읽기 모드 활성화
          </span>
        )}
      </div>
    </div>
  )
}
