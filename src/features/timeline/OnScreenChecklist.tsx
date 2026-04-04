import { useState, useRef } from 'react'
import { useSceneStore } from '../../stores/sceneStore'
import type { Scene } from '../../lib/types'

interface Props { scene: Scene }

export function OnScreenChecklist({ scene }: Props) {
  const { addOnScreenText, updateOnScreenText, deleteOnScreenText } = useSceneStore()
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAdd = () => {
    if (!draft.trim()) return
    addOnScreenText(scene.id, draft.trim())
    setDraft('')
    inputRef.current?.focus()
  }

  return (
    <div className="checklist-section">
      <div className="section-label">On-Screen Text</div>

      {scene.onScreenTexts.map(item => (
        <div key={item.id} className="checklist-item">
          <input
            type="checkbox"
            className="checklist-checkbox"
            checked={item.checked}
            onChange={() => updateOnScreenText(scene.id, item.id, { checked: !item.checked })}
          />
          <input
            className={`checklist-text${item.checked ? ' checked' : ''}`}
            value={item.text}
            onChange={e => updateOnScreenText(scene.id, item.id, { text: e.target.value })}
          />
          <button
            className="checklist-delete"
            onClick={() => deleteOnScreenText(scene.id, item.id)}
            title="삭제"
          >×</button>
        </div>
      ))}

      <div className="checklist-item">
        <input
          ref={inputRef}
          className="checklist-text"
          placeholder="+ 항목 추가..."
          value={draft}
          style={{ color: 'var(--text-muted)', fontSize: 12 }}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
        />
      </div>
    </div>
  )
}
