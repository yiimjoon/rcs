import { useRef, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useSceneStore } from '../../stores/sceneStore'
import { useScenes } from '../../hooks/useScenes'
import { SceneColumn } from './SceneColumn'
import { getRoleColor, getRoleLabel } from '../../lib/taxonomy'
import type { Scene } from '../../lib/types'

function DragSnapshot({ scene, index }: { scene: Scene; index: number }) {
  return (
    <div className="scene-col drag-snapshot">
      <div className="scene-header">
        <div className="scene-header__top">
          <div className="scene-header__left">
            <div className="scene-number">{index + 1}</div>
            <div className="scene-header__badges">
              {scene.segmentRole && (
                <span className="scene-role-badge" style={{ background: getRoleColor(scene.segmentRole) }}>
                  {getRoleLabel(scene.segmentRole)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="scene-title-input" style={{ pointerEvents: 'none' }}>{scene.title}</div>
      </div>
    </div>
  )
}

interface Props {
  projectId: string
}

export function Timeline({ projectId }: Props) {
  const { createScene, reorderScenes } = useSceneStore()
  const scenes = useScenes(projectId)
  const [activeId, setActiveId] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    const ids = scenes.map(s => s.id)
    const oldIdx = ids.indexOf(active.id as string)
    const newIdx = ids.indexOf(over.id as string)
    const newOrder = arrayMove(ids, oldIdx, newIdx)
    reorderScenes(projectId, newOrder)
  }

  // Horizontal scroll with mouse wheel (non-passive to allow preventDefault)
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  const activeScene = activeId ? scenes.find(s => s.id === activeId) : null

  return (
    <div
      ref={wrapRef}
      className="timeline-wrap"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={scenes.map(s => s.id)} strategy={horizontalListSortingStrategy}>
          <div className="timeline">
            <AnimatePresence initial={false}>
              {scenes.map((scene, i) => (
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, scale: 0.92, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  layout
                >
                  <SceneColumn scene={scene} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add scene */}
            <motion.div
              className="add-scene-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button
                className="add-scene-btn"
                onClick={() => createScene(projectId)}
                title="씬 추가"
              >+</button>
            </motion.div>
          </div>
        </SortableContext>

        <DragOverlay>
          {activeScene && (
            <motion.div
              animate={{ rotate: 2, scale: 1.03 }}
              style={{ opacity: 0.85, cursor: 'grabbing' }}
            >
              <DragSnapshot scene={activeScene} index={scenes.indexOf(activeScene)} />
            </motion.div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
