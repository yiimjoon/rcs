import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSceneStore } from '../../stores/sceneStore'
import { SPRING_HEAVY } from '../../lib/constants'
import { LockOpen, LockClosed, Copy, X } from '../../components/Icons'
import { getRoleColor, getRoleLabel, getDeviceLabel } from '../../lib/taxonomy'
import type { Scene } from '../../lib/types'
import { DurationStepper } from './DurationStepper'
import { NarrationEditor } from './NarrationEditor'
import { SceneDirectionBoard } from './SceneDirectionBoard'
import { SceneNotesEditor } from './SceneNotesEditor'
import { OnScreenChecklist } from './OnScreenChecklist'
import { ReferencePanel } from './ReferencePanel'
import { TaxonomyPanel } from './TaxonomyPanel'

interface Props {
  scene: Scene
  index: number
}

export function SceneColumn({ scene, index }: Props) {
  const { updateScene, deleteScene, duplicateScene, toggleLock } = useSceneStore()
  const [titleDraft, setTitleDraft] = useState(scene.title)
  const segmentRoles = Array.isArray(scene.segmentRoles) ? scene.segmentRoles : []

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scene.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  useEffect(() => {
    setTitleDraft(scene.title)
  }, [scene.title])

  const commitTitle = () => {
    if (titleDraft === scene.title) return
    updateScene(scene.id, { title: titleDraft })
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      transition={SPRING_HEAVY}
      animate={isDragging ? { rotate: 2, scale: 1.02 } : { rotate: 0, scale: 1 }}
      className={`scene-col${scene.isLocked ? ' locked' : ''}${isDragging ? ' scene-col--dragging' : ''}`}
      data-export-scroll="true"
      data-export-key={`scene-col-${scene.id}`}
    >
      {/* Header */}
      <div className="scene-header">
        <div className="scene-header__top">
          {/* Drag handle = scene number */}
          <div className="scene-header__left">
            <div
              className="scene-number"
              {...attributes}
              {...listeners}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              title="드래그해서 순서 변경"
            >
              {index + 1}
            </div>
            <div className="scene-header__badges">
              {segmentRoles.map(role => (
                <span
                  key={role}
                  className="scene-role-badge"
                  style={{ background: getRoleColor(role) }}
                >
                  {getRoleLabel(role)}
                </span>
              ))}
              {scene.retentionEnabled && scene.retentionDevices.length === 0 && (
                <span className="scene-retention-badge">리텐션</span>
              )}
              {scene.retentionDevices.map(d => (
                <span key={d} className="scene-retention-badge">
                  {getDeviceLabel(d)}
                </span>
              ))}
            </div>
          </div>
          <div className="scene-header__actions">
            <button
              className={`scene-action-btn${scene.isLocked ? ' active' : ''}`}
              onClick={() => toggleLock(scene.id)}
              title={scene.isLocked ? '잠금 해제' : '잠금'}
            >
              {scene.isLocked ? <LockClosed size={14} /> : <LockOpen size={14} />}
            </button>
            <button
              className="scene-action-btn"
              onClick={() => duplicateScene(scene.id)}
              title="씬 복제"
            >
              <Copy size={14} />
            </button>
            <button
              className="scene-action-btn danger"
              onClick={() => {
                if (scene.isLocked) return
                if (confirm(`"${scene.title}" 씬을 삭제하시겠습니까?`)) {
                  deleteScene(scene.id)
                }
              }}
              title={scene.isLocked ? '잠금 해제 후 삭제 가능' : '씬 삭제'}
              disabled={scene.isLocked}
            >
              <X size={14} />
            </button>
          </div>
        </div>
        <input
          className="scene-title-input"
          value={titleDraft}
          placeholder="SCENE TITLE"
          onChange={e => setTitleDraft(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.currentTarget.blur()
            }

            if (e.key === 'Escape') {
              setTitleDraft(scene.title)
              e.currentTarget.blur()
            }
          }}
        />
      </div>

      {/* References */}
      <ReferencePanel scene={scene} />

      {/* Duration */}
      <DurationStepper scene={scene} />

      {/* Narration */}
      <NarrationEditor scene={scene} />

      {/* On-screen checklist */}
      <OnScreenChecklist scene={scene} />

      {/* Direction board */}
      <SceneDirectionBoard scene={scene} />

      {/* Planning notes */}
      <SceneNotesEditor scene={scene} />

      {/* Taxonomy — role, hook type, retention devices */}
      <TaxonomyPanel scene={scene} />
    </motion.div>
  )
}
