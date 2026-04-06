import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BRollSubtype, Scene, OnScreenText, Reference, SegmentRole } from '../lib/types'
import { generateId } from '../lib/id'
import { backupPersistedValue } from '../lib/persistBackup'
import {
  sanitizeChecklistText,
  sanitizeLocalReferenceDraft,
  sanitizeOnScreenTextPatch,
  sanitizePersistedSceneState,
  sanitizeReferenceDraft,
  sanitizeScenePatch,
} from '../lib/sanitize'

function getLegacyCompatibleSegmentRoles(scene: Scene & { segmentRole?: SegmentRole | null }) {
  if (Array.isArray(scene.segmentRoles)) {
    return scene.segmentRoles.filter((role): role is SegmentRole => Boolean(role))
  }

  return scene.segmentRole && scene.segmentRole !== 'retention'
    ? [scene.segmentRole]
    : []
}

function getLegacyCompatibleHookTypes(scene: Scene & { hookType?: string | null }) {
  if (Array.isArray(scene.hookTypes)) {
    return scene.hookTypes.filter(Boolean)
  }

  return scene.hookType ? [scene.hookType as Scene['hookTypes'][number]] : []
}

function getLegacyCompatibleBRollSubtypes(scene: Scene & { bRollSubtype?: BRollSubtype | null }) {
  if (Array.isArray(scene.bRollSubtypes)) {
    return scene.bRollSubtypes.filter(Boolean)
  }

  return scene.bRollSubtype ? [scene.bRollSubtype] : []
}

function normalizeScene(scene: Scene): Scene {
  const segmentRoles = getLegacyCompatibleSegmentRoles(scene as Scene & { segmentRole?: SegmentRole | null })
  const hookTypes = getLegacyCompatibleHookTypes(scene as Scene & { hookType?: string | null })
  const bRollSubtypes = getLegacyCompatibleBRollSubtypes(scene as Scene & { bRollSubtype?: BRollSubtype | null })
  const retentionEnabled =
    scene.retentionEnabled ||
    segmentRoles.includes('retention') ||
    scene.retentionDevices.length > 0
  const hasBRoll = retentionEnabled && scene.retentionDevices.includes('b_roll')

  return {
    ...scene,
    planningNotes: scene.planningNotes ?? '',
    segmentRoles: Array.from(new Set(segmentRoles.filter(role => role !== 'retention'))),
    hookTypes: segmentRoles.includes('hook') ? hookTypes : [],
    retentionEnabled,
    retentionDevices: retentionEnabled ? scene.retentionDevices : [],
    bRollSubtypes: hasBRoll ? bRollSubtypes : [],
  }
}

interface SceneState {
  scenes: Scene[]
  hasHydrated: boolean
  // Scene CRUD
  createScene: (projectId: string) => Scene
  updateScene: (id: string, patch: Partial<Scene>) => void
  deleteScene: (id: string) => void
  deleteScenesByProject: (projectId: string) => void
  duplicateScene: (id: string) => void
  reorderScenes: (projectId: string, orderedIds: string[]) => void
  replaceScenesForProject: (
    projectId: string,
    drafts: Array<{
      title: string
      narration: string
      planningNotes: string
      segmentRole: SegmentRole
    }>
  ) => void
  migrateLegacyScenes: () => void
  // Lock
  toggleLock: (id: string) => void
  // OnScreen texts
  addOnScreenText: (sceneId: string, text: string) => void
  updateOnScreenText: (sceneId: string, textId: string, patch: Partial<OnScreenText>) => void
  deleteOnScreenText: (sceneId: string, textId: string) => void
  // References
  addReference: (sceneId: string, ref: Omit<Reference, 'id'>) => boolean
  addLocalReference: (sceneId: string, ref: Pick<Reference, 'assetId' | 'caption' | 'filename'>) => boolean
  deleteReference: (sceneId: string, refId: string) => void
  setHasHydrated: (value: boolean) => void
}

const SCENE_BACKUP_KEY = 'rcscript-scenes-backup'
const SCENE_RAW_BACKUP_KEY = 'rcscript-scenes-backup-raw'

export const useSceneStore = create<SceneState>()(
  persist(
    (set, get) => {
      const backupCurrentSceneState = () => {
        backupPersistedValue(SCENE_BACKUP_KEY, {
          scenes: get().scenes,
        })
      }

      return {
        scenes: [],
        hasHydrated: false,

      createScene: (projectId) => {
        const existing = get().scenes.filter(s => s.projectId === projectId)
        const scene: Scene = {
          id: generateId(),
          projectId,
          order: existing.length,
          title: `씬 ${existing.length + 1}`,
          narration: '',
          planningNotes: '',
          durationManual: 0,
          isLocked: false,
          segmentRoles: [],
          hookTypes: [],
          retentionEnabled: false,
          retentionDevices: [],
          bRollSubtypes: [],
          onScreenTexts: [],
          references: [],
          aiVersions: [],
        }
        set(s => ({ scenes: [...s.scenes, scene] }))
        return scene
      },

      updateScene: (id, patch) => {
        const safePatch = sanitizeScenePatch(patch)
        set(s => ({
          scenes: s.scenes.map(sc =>
            sc.id === id ? normalizeScene({ ...sc, ...safePatch }) : sc
          ),
        }))
      },

      // Migrate legacy scenes missing new fields or using removed roles
      migrateLegacyScenes: () => {
        backupCurrentSceneState()
        const roleRemap: Record<string, SegmentRole> = { setup: 'retain', proof: 'proof' }
        set(s => ({
          scenes: s.scenes.map(sc => {
            const role = (sc as Scene & { segmentRole?: string | null }).segmentRole as string | null
            const remapped = role ? (roleRemap[role] ?? role) : null
            const normalizedNarration = sc.narration.trim()
            const splitRole =
              remapped === 'problem' &&
              sc.title === '브랜드 욕구' &&
              normalizedNarration === '내 브랜드도 나이키처럼 만들고 싶다면?'
                ? 'desire'
                : remapped === 'solution' &&
                    (
                      normalizedNarration === '저는 매출과 브랜딩을 한번에 해결하는 커머스 브랜딩 전문 회사 브랜드 큐레이터 입니다' ||
                      normalizedNarration === '매출을 올리는 브랜딩 회사'
                    )
                  ? 'positioning'
                : remapped === 'benefit' &&
                    normalizedNarration === '당신의 브랜드의 매출이 올라가도록 큐레이팅 합니다'
                  ? 'closing_copy'
                : remapped
            const legacyRoles = Array.isArray((sc as Scene & { segmentRoles?: SegmentRole[] }).segmentRoles)
              ? ((sc as Scene & { segmentRoles?: SegmentRole[] }).segmentRoles ?? [])
              : []
            const normalizedRoles = legacyRoles.length > 0
              ? legacyRoles.filter(role => role !== 'retention')
              : splitRole && splitRole !== 'retention'
                ? [splitRole]
                : []
            const retentionEnabled =
              Boolean(sc.retentionEnabled) ||
              splitRole === 'retention' ||
              (sc.retentionDevices ?? []).length > 0
            const legacyBRollSubtypes = Array.isArray((sc as Scene & { bRollSubtypes?: string[] }).bRollSubtypes)
              ? ((sc as Scene & { bRollSubtypes?: BRollSubtype[] }).bRollSubtypes ?? [])
              : []
            const legacyBRollSubtype = (sc as Scene & { bRollSubtype?: BRollSubtype | null }).bRollSubtype ?? null
            return {
              ...sc,
              segmentRoles: normalizedRoles,
              hookTypes: normalizedRoles.includes('hook') ? (sc.hookTypes ?? []) : [],
              retentionEnabled,
              retentionDevices: retentionEnabled ? (sc.retentionDevices ?? []) : [],
              bRollSubtypes:
                retentionEnabled && (sc.retentionDevices ?? []).includes('b_roll')
                  ? (legacyBRollSubtypes.length > 0 ? legacyBRollSubtypes : legacyBRollSubtype ? [legacyBRollSubtype] : [])
                  : [],
              planningNotes: sc.planningNotes ?? '',
            }
          }),
        }))
      },

      deleteScene: (id) => {
        backupCurrentSceneState()
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
        backupCurrentSceneState()
        set(s => ({
          scenes: s.scenes.filter(sc => sc.projectId !== projectId),
        }))
      },

      duplicateScene: (id) => {
        const original = get().scenes.find(sc => sc.id === id)
        if (!original) return
        const clone: Scene = {
          ...normalizeScene(original),
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

      replaceScenesForProject: (projectId, drafts) => {
        backupCurrentSceneState()
        const nextScenes = drafts.map((draft, index) =>
          normalizeScene({
            id: generateId(),
            projectId,
            order: index,
            title: draft.title,
            narration: draft.narration,
            planningNotes: draft.planningNotes,
            durationManual: 0,
            isLocked: false,
            segmentRoles: [draft.segmentRole],
            hookTypes: [],
            retentionEnabled: false,
            retentionDevices: [],
            bRollSubtypes: [],
            onScreenTexts: [],
            references: [],
            aiVersions: [],
          })
        )

        set(s => ({
          scenes: [
            ...s.scenes.filter(sc => sc.projectId !== projectId),
            ...nextScenes,
          ],
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
        const safeText = sanitizeChecklistText(text)
        if (!safeText) return

        const item: OnScreenText = { id: generateId(), text: safeText, checked: false }
        set(s => ({
          scenes: s.scenes.map(sc =>
            sc.id === sceneId
              ? { ...sc, onScreenTexts: [...sc.onScreenTexts, item] }
              : sc
          ),
        }))
      },

      updateOnScreenText: (sceneId, textId, patch) => {
        const safePatch = sanitizeOnScreenTextPatch(patch)
        set(s => ({
          scenes: s.scenes.map(sc =>
            sc.id === sceneId
              ? {
                  ...sc,
                  onScreenTexts: sc.onScreenTexts.map(t =>
                    t.id === textId ? { ...t, ...safePatch } : t
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
        const safeReference = sanitizeReferenceDraft(ref)
        if (!safeReference) return false

        const item: Reference = { ...safeReference, id: generateId() }
        set(s => ({
          scenes: s.scenes.map(sc =>
            sc.id === sceneId
              ? { ...sc, references: [...sc.references, item] }
              : sc
          ),
        }))
        return true
      },

      addLocalReference: (sceneId, ref) => {
        const safeReference = sanitizeLocalReferenceDraft(ref)
        if (!safeReference) return false

        const item: Reference = { ...safeReference, id: generateId() }
        set(s => ({
          scenes: s.scenes.map(sc =>
            sc.id === sceneId
              ? { ...sc, references: [...sc.references, item] }
              : sc
          ),
        }))
        return true
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

        setHasHydrated: (value) => set({ hasHydrated: value }),

      }
    },
    {
      name: 'rcscript-scenes',
      version: 2,
      migrate: (persistedState) => {
        backupPersistedValue(SCENE_RAW_BACKUP_KEY, persistedState)
        return sanitizePersistedSceneState(persistedState)
      },
      merge: (persistedState, currentState) => {
        backupPersistedValue(SCENE_RAW_BACKUP_KEY, persistedState)
        return {
          ...currentState,
          ...sanitizePersistedSceneState(persistedState),
        }
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
