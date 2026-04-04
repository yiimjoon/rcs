import { useRef, useCallback } from 'react'
import { calculateAutoDuration, formatDuration } from '../../lib/duration'
import { useSceneStore } from '../../stores/sceneStore'
import type { Scene } from '../../lib/types'

interface Props {
  scene: Scene
}

const MAX_MANUAL = 30

export function DurationStepper({ scene }: Props) {
  const updateScene = useSceneStore(s => s.updateScene)
  const autoDuration = calculateAutoDuration(scene.narration)
  const total = autoDuration + scene.durationManual
  const barPct = Math.min((scene.durationManual / MAX_MANUAL) * 100, 100)

  const barRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const step = (delta: number) => {
    const next = Math.max(0, Math.min(MAX_MANUAL, scene.durationManual + delta))
    updateScene(scene.id, { durationManual: next })
  }

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!barRef.current) return
    e.preventDefault()
    dragging.current = true
    barRef.current.setPointerCapture(e.pointerId)

    const rect = barRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const next = Math.round(pct * MAX_MANUAL)
    updateScene(scene.id, { durationManual: next })
  }, [scene.id, updateScene])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !barRef.current) return
    const rect = barRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const next = Math.round(pct * MAX_MANUAL)
    updateScene(scene.id, { durationManual: next })
  }, [scene.id, updateScene])

  const handlePointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  return (
    <div className="duration-section">
      <div className="duration-label">Duration</div>
      <div className="duration-display">
        <div className="duration-total">{formatDuration(total)}</div>
        <div className="duration-breakdown">
          auto {formatDuration(autoDuration)}
          {scene.durationManual > 0 && <> + +{scene.durationManual}s pad</>}
        </div>
      </div>
      <div className="duration-stepper">
        <button className="stepper-btn" onClick={() => step(-1)} disabled={scene.durationManual === 0}>−</button>
        <div
          ref={barRef}
          className="stepper-bar stepper-bar--draggable"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="stepper-bar__fill" style={{ width: `${barPct}%` }} />
        </div>
        <button className="stepper-btn" onClick={() => step(1)} disabled={scene.durationManual >= MAX_MANUAL}>+</button>
        <span className="stepper-value">+{scene.durationManual}s</span>
      </div>
    </div>
  )
}
