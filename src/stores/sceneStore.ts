import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Scene, OnScreenText, Reference } from '../lib/types'
import { generateId } from '../lib/id'

interface SceneState {
  scenes: Scene[]
  // Scene CRUD
  createScene: (projectId: string) => Scene
  updateScene: (id: string, patch: Partial<Scene>) => void
  deleteScene: (id: string) => void
  deleteScenesByProject: (projectId: string) => void
  duplicateScene: (id: string) => void
  reorderScenes: (projectId: string, orderedIds: string[]) => void
  migrateLegacyScenes: () => void
  // Lock
  toggleLock: (id: string) => void
  // OnScreen texts
  addOnScreenText: (sceneId: string, text: string) => void
  updateOnScreenText: (sceneId: string, textId: string, patch: Partial<OnScreenText>) => void
  deleteOnScreenText: (sceneId: string, textId: string) => void
  // References
  addReference: (sceneId: string, ref: Omit<Reference, 'id'>) => void
  deleteReference: (sceneId: string, refId: string) => void
}

export const useSceneStore = create<SceneState>()(
  persist(
    (set, get) => ({
      scenes: [],

      createScene: (projectId) => {
        const existing = get().scenes.filter(s => s.projectId === projectId)
        const scene: Scene = {
          id: generateId(),
          projectId,
          order: existing.length,
          title: `씬 ${existing.length + 1}`,
          narration: '',
          durationManual: 0,
          isLocked: false,
          segmentRole: null,
          hookType: null,
          retentionDevices: [],
          onScreenTexts: [],
          references: [],
          aiVersions: [],
        }
        set(s => ({ scenes: [...s.scenes, scene] }))
        return scene
      },

      updateScene: (id, patch) => {
        set(s => ({
          scenes: s.scenes.map(sc => (sc.id === id ? { ...sc, ...patch } : sc)),
        }))
      },

      // Migrate legacy scenes missing new fields (called once on app load)
      migrateLegacyScenes: () => {
        set(s => ({
          scenes: s.scenes.map(sc => ({
            ...sc,
            segmentRole: sc.segmentRole ?? null,
            hookType: sc.hookType ?? null,
            retentionDevices: sc.retentionDevices ?? [],
          })),
        }))
      },

      deleteScene: (id) => {
        set(s => {
          const filtered = s.scenes.filter(sc => sc.id !== id)
          // Re-normalize order within project
          const projectId = s.scenes.find(sc => sc.id === id)?.projectId
          if (!projectId) return { scenes: filtered }
          let idx = 0
          return {
            scenes: filtered.map(sc =>
              sc.projectId === projectId ? { ...sc, order: idx++ } : sc
            ),
          }
        })
      },

      deleteScenesByProject: (projectId) => {
        set(s => ({
          scenes: s.scenes.filter(sc => sc.projectId !== projectId),
        }))
      },

      duplicateScene: (id) => {
        const original = get().scenes.find(sc => sc.id === id)
        if (!original) return
        const clone: Scene = {
          ...original,
          id: generateId(),
          order: original.order + 1,
          title: `${original.title} (copy)`,
          isLocked: false,
          onScreenTexts: original.onScreenTexts.map(t => ({ ...t, id: generateId() })),
          references: original.references.map(r => ({ ...r, id: generateId() })),
          aiVersions: [],
        }
        set(s => {
          // Shift orders of scenes after original
          const updated = s.scenes.map(sc =>
            sc.projectId === original.projectId && sc.order > original.order
              ? { ...sc, order: sc.order + 1 }
              : sc
          )
          return { scenes: [...updated, clone] }
        })
      },

      reorderScenes: (projectId, orderedIds) => {
        set(s => ({
          scenes: s.scenes.map(sc => {
            if (sc.projectId !== projectId) return sc
            const newOrder = orderedIds.indexOf(sc.id)
            return newOrder >= 0 ? { ...sc, order: newOrder } : sc
          }),
        }))
      },

      toggleLock: (id) => {
        set(s => ({
          scenes: s.scenes.map(sc =>
            sc.id === id ? { ...sc, isLocked: !sc.isLocked } : sc
          ),
        }))
      },

      addOnScreenText: (sceneId, text) => {
        const item: OnScreenText = { id: generateId(), text, checked: false }
        set(s => ({
          scenes: s.scenes.map(sc =>
            sc.id === sceneId
              ? { ...sc, onScreenTexts: [...sc.onScreenTexts, item] }
              : sc
          ),
        }))
      },

      updateOnScreenText: (sceneId, textId, patch) => {
        set(s => ({
          scenes: s.scenes.map(sc =>
            sc.id === sceneId
              ? {
                  ...sc,
                  onScreenTexts: sc.onScreenTexts.map(t =>
                    t.id === textId ? { ...t, ...patch } : t
                  ),
                }
              : sc
          ),
        }))
      },

      deleteOnScreenText: (sceneId, textId) => {
        set(s => ({
          scenes: s.scenes.map(sc =>
            sc.id === sceneId
              ? { ...sc, onScreenTexts: sc.onScreenTexts.filter(t => t.id !== textId) }
              : sc
          ),
        }))
      },

      addReference: (sceneId, ref) => {
        const item: Reference = { ...ref, id: generateId() }
        set(s => ({
          scenes: s.scenes.map(sc =>
            sc.id === sceneId
              ? { ...sc, references: [...sc.references, item] }
              : sc
          ),
        }))
      },

      deleteReference: (sceneId, refId) => {
        set(s => ({
          scenes: s.scenes.map(sc =>
            sc.id === sceneId
              ? { ...sc, references: sc.references.filter(r => r.id !== refId) }
              : sc
          ),
        }))
      },

    }),
    { name: 'rcscript-scenes' }
  )
)
