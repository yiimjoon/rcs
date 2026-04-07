import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project } from '../lib/types'
import { generateId } from '../lib/id'
import { backupPersistedValue } from '../lib/persistBackup'
import {
  sanitizePersistedProjectState,
  sanitizeProjectPatch,
  sanitizeProjectTitle,
} from '../lib/sanitize'
import { useSceneStore } from './sceneStore'

const PROJECT_BACKUP_KEY = 'rcscript-projects-backup'
const PROJECT_RAW_BACKUP_KEY = 'rcscript-projects-backup-raw'

interface ProjectState {
  projects: Project[]
  activeProjectId: string | null
  hasHydrated: boolean
  createProject: (title?: string) => Project
  updateProject: (id: string, patch: Partial<Pick<Project, 'title' | 'theme' | 'status'>>) => void
  deleteProject: (id: string) => void
  setActiveProject: (id: string) => void
  setHasHydrated: (value: boolean) => void
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => {
      const backupCurrentProjectState = () => {
        backupPersistedValue(PROJECT_BACKUP_KEY, {
          projects: get().projects,
          activeProjectId: get().activeProjectId,
        })
      }

      return {
        projects: [],
        activeProjectId: null,
        hasHydrated: false,

      createProject: (title = 'Untitled') => {
        const project: Project = {
          id: generateId(),
          title: sanitizeProjectTitle(title),
          theme: '',
          status: 'backlog',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set(s => ({ projects: [...s.projects, project], activeProjectId: project.id }))
        return project
      },

      updateProject: (id, patch) => {
        const safePatch = sanitizeProjectPatch(patch)
        set(s => ({
          projects: s.projects.map(p =>
            p.id === id ? { ...p, ...safePatch, updatedAt: new Date().toISOString() } : p
          ),
        }))
      },

      deleteProject: (id) => {
        backupCurrentProjectState()
        // Clean up orphan scenes
        useSceneStore.getState().deleteScenesByProject(id)
        set(s => {
          const remaining = s.projects.filter(p => p.id !== id)
          const nextActive =
            s.activeProjectId === id
              ? remaining[0]?.id ?? null
              : s.activeProjectId
          return { projects: remaining, activeProjectId: nextActive }
        })
      },

        setActiveProject: (id) => set({ activeProjectId: id }),
        setHasHydrated: (value) => set({ hasHydrated: value }),
      }
    },
    {
      name: 'rcscript-projects',
      version: 2,
      migrate: (persistedState) => {
        backupPersistedValue(PROJECT_RAW_BACKUP_KEY, persistedState)
        return sanitizePersistedProjectState(persistedState)
      },
      merge: (persistedState, currentState) => {
        backupPersistedValue(PROJECT_RAW_BACKUP_KEY, persistedState)
        return {
          ...currentState,
          ...sanitizePersistedProjectState(persistedState),
        }
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

export function useActiveProject() {
  const { projects, activeProjectId } = useProjectStore()
  return projects.find(p => p.id === activeProjectId) ?? null
}
