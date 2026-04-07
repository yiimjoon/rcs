import { useRef, useEffect } from 'react'
import { useSceneStore } from '../../stores/sceneStore'
import { countWords } from '../../lib/duration'
import type { Scene } from '../../lib/types'

interface Props { scene: Scene }

export function NarrationEditor({ scene }: Props) {
  const updateScene = useSceneStore(s => s.updateScene)
  const ref = useRef<HTMLTextAreaElement>(null)

  // Auto-resize
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [scene.narration])

  return (
    <div className="narration-section">
      <div className="section-label">Voiceover</div>
      <textarea
        ref={ref}
        className="narration-textarea"
        value={scene.narration}
        placeholder="보이스오버 대본을 입력하세요..."
        onChange={e => updateScene(scene.id, { narration: e.target.value })}
        rows={4}
      />
      <div className="narration-wordcount">{countWords(scene.narration)} 단어</div>
    </div>
  )
}
