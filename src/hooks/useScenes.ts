import { useMemo } from 'react'
import { useSceneStore } from '../stores/sceneStore'

export function useScenes(projectId: string) {
  const scenes = useSceneStore(s => s.scenes)
  return useMemo(
    () =>
      scenes
        .filter(sc => sc.projectId === projectId)
        .sort((a, b) => a.order - b.order),
    [scenes, projectId]
  )
}
