import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUiStore } from '../../stores/uiStore'
import { useScenes } from '../../hooks/useScenes'
import { X, ChevronLeft, ChevronRight } from '../../components/Icons'

interface Props {
  projectId: string
}

export function TeleprompterView({ projectId }: Props) {
  const { teleprompterSceneIndex, setTeleprompterSceneIndex, setMode } = useUiStore()
  const scenes = useScenes(projectId)

  const current = scenes[teleprompterSceneIndex]
  const isFirst = teleprompterSceneIndex === 0
  const isLast = teleprompterSceneIndex === scenes.length - 1

  const prev = useCallback(
    () => { if (!isFirst) setTeleprompterSceneIndex(teleprompterSceneIndex - 1) },
    [isFirst, teleprompterSceneIndex, setTeleprompterSceneIndex]
  )
  const next = useCallback(
    () => { if (!isLast) setTeleprompterSceneIndex(teleprompterSceneIndex + 1) },
    [isLast, teleprompterSceneIndex, setTeleprompterSceneIndex]
  )
  const exit = useCallback(() => setMode('edit'), [setMode])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'Escape') exit()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next, exit])

  if (!current) return null

  return (
    <motion.div
      className="teleprompter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="teleprompter__header">
        <div className="teleprompter__scene-info">
          {current.title} — {teleprompterSceneIndex + 1} / {scenes.length}
        </div>
        <div className="teleprompter__progress">
          {scenes.map((_, i) => (
            <div
              key={i}
              className={`tp-dot ${i === teleprompterSceneIndex ? 'active' : i < teleprompterSceneIndex ? 'done' : ''}`}
              onClick={() => setTeleprompterSceneIndex(i)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
        <button className="teleprompter__close" onClick={exit}><X size={18} /> ESC</button>
      </div>

      {/* Content */}
      <div className="teleprompter__content">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="teleprompter__text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {current.narration || <span style={{ opacity: 0.3 }}>(내레이션 없음)</span>}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="teleprompter__footer">
        <button className="tp-nav-btn" onClick={prev} disabled={isFirst}>
          <ChevronLeft size={18} /> 이전
        </button>
        <button className="tp-nav-btn primary" onClick={next} disabled={isLast}>
          다음 <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  )
}
