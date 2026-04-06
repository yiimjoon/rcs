import { useEffect, useRef } from 'react'
import { useSceneStore } from '../../stores/sceneStore'
import type { Scene } from '../../lib/types'

interface Props { scene: Scene }

export function SceneNotesEditor({ scene }: Props) {
  const updateScene = useSceneStore(s => s.updateScene)
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [scene.planningNotes])

  return (
    <div className="scene-notes-section">
      <div className="section-label">기획 메모</div>
      <textarea
        ref={ref}
        className="scene-notes-textarea"
        value={scene.planningNotes}
        placeholder="구도, 컷 아이디어, 소품, 감정선 같은 기획 메모를 적어두세요..."
        onChange={e => updateScene(scene.id, { planningNotes: e.target.value })}
        rows={3}
      />
      <div className="scene-notes-helper">온스크린 문구와 별도로 연출 메모를 남길 수 있어요.</div>
    </div>
  )
}
