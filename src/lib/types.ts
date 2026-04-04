export type ProjectStatus = 'backlog' | 'in_progress' | 'done'

export interface Project {
  id: string
  title: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
}

export interface OnScreenText {
  id: string
  text: string
  checked: boolean
}

export interface Reference {
  id: string
  type: 'image' | 'link'
  url: string
  caption: string
}

export interface AiVersion {
  id: string
  originalText: string
  correctedText: string
  createdAt: string
}

export interface Scene {
  id: string
  projectId: string
  order: number
  title: string
  narration: string
  durationManual: number   // seconds of manual padding
  isLocked: boolean
  onScreenTexts: OnScreenText[]
  references: Reference[]
  aiVersions: AiVersion[]
}
