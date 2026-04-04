import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { useSceneStore } from '../../stores/sceneStore'
import { SPRING_HEAVY } from '../../lib/constants'
import { LockOpen, LockClosed, Copy, X } from '../../components/Icons'
import type { Scene } from '../../lib/types'
import { DurationStepper } from './DurationStepper'
import { NarrationEditor } from './NarrationEditor'
import { OnScreenChecklist } from './OnScreenChecklist'
import { ReferencePanel } from './ReferencePanel'

interface Props {
  scene: Scene
  index: number
}

export function SceneColumn({ scene, index }: Props) {
  const { updateScene, deleteScene, duplicateScene, toggleLock } = useSceneStore()

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

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      transition={SPRING_HEAVY}
      animate={isDragging ? { rotate: 2, scale: 1.02 } : { rotate: 0, scale: 1 }}
      className={`scene-col${scene.isLocked ? ' locked' : ''}${isDragging ? ' scene-col--dragging' : ''}`}
    >
      {/* Header */}
      <div className="scene-header">
        <div className="scene-header__top">
          {/* Drag handle = scene number */}
          <div
            className="scene-number"
            {...attributes}
            {...listeners}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            title="드래그해서 순서 변경"
          >
            {index + 1}
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
                if (confirm(`"${scene.title}" 씬을 삭제하시겠습니까?`)) {
                  deleteScene(scene.id)
                }
              }}
              title="씬 삭제"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        <input
          className="scene-title-input"
          value={scene.title}
          placeholder="SCENE TITLE"
          onChange={e => updateScene(scene.id, { title: e.target.value })}
        />
      </div>

      {/* Duration */}
      <DurationStepper scene={scene} />

      {/* Narration */}
      <NarrationEditor scene={scene} />

      {/* On-screen checklist */}
      <OnScreenChecklist scene={scene} />

      {/* References */}
      <ReferencePanel scene={scene} />
    </motion.div>
  )
}
