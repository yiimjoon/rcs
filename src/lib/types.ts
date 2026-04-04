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

export type SegmentRole = 'hook' | 'retain' | 'reward' | 'cta' | 'bridge'

export type HookType =
  | 'problem_hook'
  | 'number_hook'
  | 'twist_hook'
  | 'crisis_hook'
  | 'quote_hook'
  | 'meta_hook'
  | 'bait_switch_hook'
  | 'counter_norm_hook'
  | 'identity_hook'
  | 'cheer_hook'
  | 'empathy_hook'
  | 'skit_hook'
  | 'visual_hook'
  | 'exaggeration_hook'
  | 'declaration_hook'
  | 'emotion_hook'
  | 'specificity_hook'
  | 'warning_hook'

export type RetentionDevice =
  | 'open_loop'
  | 'infinite_loop'
  | 'gradual_reveal'
  | 'dramatic_irony'
  | 'time_limit'
  | 'countdown'
  | 'pressure_build'
  | 'fake_out'
  | 'deferred_payoff'
  | 'confession'
  | 'meta_breakdown'
  | 'emotional_breathing'
  | 'data_proof'
  | 'chronological'
  | 'pacing'
  | 'promise'
  | 'direct_question'
  | 'repetition'
  | 'callback'
  | 'preview_effect'
  | 'question_stacking'
  | 'pattern_break'
  | 'macguffin'
  | 'cut_split'
  | 'blur_preview'
  | 'step'
  | 'level'
  | 'comparison'

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
