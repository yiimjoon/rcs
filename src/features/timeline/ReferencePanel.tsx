import { useState } from 'react'
import { useSceneStore } from '../../stores/sceneStore'
import { Link as LinkIcon } from '../../components/Icons'
import type { Scene } from '../../lib/types'

interface Props { scene: Scene }

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url)
}

export function ReferencePanel({ scene }: Props) {
  const { addReference, deleteReference } = useSceneStore()
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleAdd = () => {
    if (!url.trim()) return
    addReference(scene.id, {
      type: isImageUrl(url) ? 'image' : 'link',
      url: url.trim(),
      caption: caption.trim(),
    })
    setUrl('')
    setCaption('')
    setShowForm(false)
  }

  return (
    <div className="reference-section">
      <div className="section-label">References</div>

      {scene.references.map(ref => (
        <div key={ref.id} className="reference-item">
          {ref.type === 'image' ? (
            <img src={ref.url} alt={ref.caption} className="reference-thumb" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          ) : (
            <div className="reference-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><LinkIcon size={20} /></div>
          )}
          <div className="reference-info">
            <div className="reference-caption">{ref.caption || '(no caption)'}</div>
            <div className="reference-url">{ref.url}</div>
          </div>
          <button className="reference-delete" onClick={() => deleteReference(scene.id, ref.id)}>×</button>
        </div>
      ))}

      {showForm ? (
        <div className="reference-add-form">
          <input className="ref-input" placeholder="URL (이미지 또는 링크)" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAdd() }} />
          <input className="ref-input" placeholder="설명 (선택)" value={caption} onChange={e => setCaption(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAdd() }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="ref-add-btn" onClick={handleAdd}>추가</button>
            <button style={{ fontSize: 12, color: 'var(--text-muted)', padding: '5px 8px' }} onClick={() => setShowForm(false)}>취소</button>
          </div>
        </div>
      ) : (
        <button className="checklist-add" onClick={() => setShowForm(true)}>
          + 레퍼런스 추가
        </button>
      )}
    </div>
  )
}
