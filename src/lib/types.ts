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

export type SegmentRole = 'hook' | 'setup' | 'build' | 'proof' | 'payoff' | 'cta' | 'bridge'
export type HookType = 'problem' | 'curiosity' | 'contrast' | 'claim' | 'emotion' | 'identity'
export type RetentionDevice =
  | 'open_loop'
  | 'deferred_payoff'
  | 'micro_reveal'
  | 'direct_questioning'
  | 'anticipating_objections'
  | 'reframe'
  | 'relatability'
  | 'confession_vulnerability'
  | 'visual_proof'

export interface Scene {
  id: string
  projectId: string
  order: number
  title: string
  narration: string
  durationManual: number   // seconds of manual padding
  isLocked: boolean
  segmentRole: SegmentRole | null
  hookType: HookType | null
  retentionDevices: RetentionDevice[]
  onScreenTexts: OnScreenText[]
  references: Reference[]
  aiVersions: AiVersion[]
}
