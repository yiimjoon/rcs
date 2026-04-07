import { useEffect, useRef } from 'react'
import { useProjectStore } from '../../stores/projectStore'
import type { Project } from '../../lib/types'

interface Props {
  project: Project
}

export function ProjectBriefPanel({ project }: Props) {
  const updateProject = useProjectStore(s => s.updateProject)
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [project.theme])

  return (
    <div className="project-brief">
      <div className="project-brief__label">전체 주제</div>
      <textarea
        ref={ref}
        className="project-brief__textarea"
        value={project.theme}
        placeholder="이 프로젝트의 한 줄 주제, 전달하고 싶은 핵심 메시지, 전체 방향을 적어두세요."
        onChange={event => updateProject(project.id, { theme: event.target.value })}
        rows={2}
      />
      <div className="project-brief__helper">
        모든 씬이 어디를 향해야 하는지 팀에게 한 번에 설명하는 상단 브리프입니다.
      </div>
    </div>
  )
}
