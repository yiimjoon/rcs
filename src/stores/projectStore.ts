import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, ProjectStatus } from '../lib/types'
import { generateId } from '../lib/id'
import { useSceneStore } from './sceneStore'

interface ProjectState {
  projects: Project[]
  activeProjectId: string | null
  createProject: (title?: string) => Project
  updateProject: (id: string, patch: Partial<Pick<Project, 'title' | 'status'>>) => void
  deleteProject: (id: string) => void
  setActiveProject: (id: string) => void
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,

      createProject: (title = 'Untitled') => {
        const project: Project = {
          id: generateId(),
          title,
          status: 'backlog',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set(s => ({ projects: [...s.projects, project], activeProjectId: project.id }))
        return project
      },

      updateProject: (id, patch) => {
        set(s => ({
          projects: s.projects.map(p =>
            p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
          ),
        }))
      },

      deleteProject: (id) => {
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
    }),
    { name: 'rcscript-projects' }
  )
)

export function useActiveProject() {
  const { projects, activeProjectId } = useProjectStore()
  return projects.find(p => p.id === activeProjectId) ?? null
}
