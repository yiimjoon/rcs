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
  source: 'remote' | 'local'
  url: string
  assetId: string | null
  caption: string
  filename: string | null
}

export interface AiVersion {
  id: string
  originalText: string
  correctedText: string
  createdAt: string
}

export type SegmentRole =
  | 'hook'
  | 'problem'
  | 'desire'
  | 'positioning'
  | 'solution'
  | 'benefit'
  | 'closing_copy'
  | 'proof'
  | 'offer'
  | 'retain'
  | 'retention'
  | 'reward'
  | 'cta'

export type HookType =
  | 'callout_hook'
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
  | 'b_roll'
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

export type BRollSubtype =
  | 'object_metaphor'
  | 'action_metaphor'
  | 'prop_roleplay'
  | 'on_site_fieldwork'
  | 'physical_data_proof'
  | 'document_process_proof'
  | 'behind_the_scenes'
  | 'radical_vulnerability'
  | 'nostalgic_archive'
  | 'reflective_routine'
  | 'screen_recording'
  | 'ui_overlay'
  | 'random_montage'
  | 'spatial_transition'
  | 'culinary_metaphor'
  | 'lego_blocks'
  | 'domino_metaphor'
  | 'storyboard_sketch'
  | 'software_ui'

export interface Scene {
  id: string
  projectId: string
  order: number
  title: string
  narration: string
  planningNotes: string
  durationManual: number   // seconds of manual padding
  isLocked: boolean
  segmentRoles: SegmentRole[]
  hookTypes: HookType[]
  retentionEnabled: boolean
  retentionDevices: RetentionDevice[]
  bRollSubtypes: BRollSubtype[]
  onScreenTexts: OnScreenText[]
  references: Reference[]
  aiVersions: AiVersion[]
}
