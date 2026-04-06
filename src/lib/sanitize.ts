import type {
  AiVersion,
  BRollSubtype,
  HookType,
  OnScreenText,
  Project,
  ProjectStatus,
  Reference,
  RetentionDevice,
  Scene,
  SegmentRole,
} from './types'

const PROJECT_STATUSES = ['backlog', 'in_progress', 'done'] as const
const SEGMENT_ROLES = [
  'hook',
  'problem',
  'desire',
  'positioning',
  'solution',
  'benefit',
  'closing_copy',
  'proof',
  'offer',
  'retain',
  'retention',
  'reward',
  'cta',
] as const
const HOOK_TYPES = [
  'callout_hook',
  'problem_hook',
  'number_hook',
  'twist_hook',
  'crisis_hook',
  'quote_hook',
  'meta_hook',
  'bait_switch_hook',
  'counter_norm_hook',
  'identity_hook',
  'cheer_hook',
  'empathy_hook',
  'skit_hook',
  'visual_hook',
  'exaggeration_hook',
  'declaration_hook',
  'emotion_hook',
  'specificity_hook',
  'warning_hook',
] as const
const REFERENCE_SOURCES = ['remote', 'local'] as const
const RETENTION_DEVICES = [
  'b_roll',
  'open_loop',
  'infinite_loop',
  'gradual_reveal',
  'dramatic_irony',
  'time_limit',
  'countdown',
  'pressure_build',
  'fake_out',
  'deferred_payoff',
  'confession',
  'meta_breakdown',
  'emotional_breathing',
  'data_proof',
  'chronological',
  'pacing',
  'promise',
  'direct_question',
  'repetition',
  'callback',
  'preview_effect',
  'question_stacking',
  'pattern_break',
  'macguffin',
  'cut_split',
  'blur_preview',
  'step',
  'level',
  'comparison',
] as const
const B_ROLL_SUBTYPES = [
  'object_metaphor',
  'action_metaphor',
  'prop_roleplay',
  'on_site_fieldwork',
  'physical_data_proof',
  'document_process_proof',
  'behind_the_scenes',
  'radical_vulnerability',
  'nostalgic_archive',
  'reflective_routine',
  'screen_recording',
  'ui_overlay',
  'random_montage',
  'spatial_transition',
  'culinary_metaphor',
  'lego_blocks',
  'domino_metaphor',
  'storyboard_sketch',
  'software_ui',
] as const

const SAFE_PROTOCOLS = new Set(['http:', 'https:'])
const MAX_ID_LENGTH = 120
const MAX_PROJECT_TITLE_LENGTH = 120
const MAX_SCENE_TITLE_LENGTH = 120
const MAX_NARRATION_LENGTH = 20000
const MAX_PLANNING_NOTES_LENGTH = 8000
const MAX_TEXT_LENGTH = 200
const MAX_CAPTION_LENGTH = 200
const MAX_FILENAME_LENGTH = 200
const MAX_URL_LENGTH = 2048
const MAX_DURATION_SECONDS = 60 * 60
const MAX_ON_SCREEN_ITEMS = 50
const MAX_REFERENCES = 24
const MAX_AI_VERSIONS = 12
const MAX_RETENTION_DEVICE_COUNT = 8
const MAX_HOOK_TYPE_COUNT = 8
const MAX_SEGMENT_ROLE_COUNT = 8
const MAX_B_ROLL_SUBTYPE_COUNT = 8

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function unwrapPersistedState(value: unknown) {
  const record = asRecord(value)
  if (!record) return null
  return asRecord(record.state) ?? record
}

function sanitizeText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return ''
  return value.replace(/\u0000/g, '').slice(0, maxLength)
}

function sanitizeSingleLine(value: unknown, maxLength: number) {
  return sanitizeText(value, maxLength).replace(/[\r\n]+/g, ' ').trim()
}

function sanitizeMultiline(value: unknown, maxLength: number) {
  return sanitizeText(value, maxLength).replace(/\r\n/g, '\n')
}

function sanitizeId(value: unknown) {
  const id = sanitizeSingleLine(value, MAX_ID_LENGTH)
  return id || null
}

function sanitizeIsoDate(value: unknown) {
  if (typeof value !== 'string') return new Date().toISOString()
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? new Date().toISOString() : new Date(parsed).toISOString()
}

function asEnumValue<T extends readonly string[]>(value: unknown, values: T): T[number] | null {
  if (typeof value !== 'string') return null
  return values.includes(value as T[number]) ? (value as T[number]) : null
}

function dedupe<T>(values: T[]) {
  return Array.from(new Set(values))
}

export function sanitizeProjectTitle(value: unknown) {
  return sanitizeSingleLine(value, MAX_PROJECT_TITLE_LENGTH) || 'Untitled'
}

export function sanitizeSceneTitle(value: unknown) {
  return sanitizeSingleLine(value, MAX_SCENE_TITLE_LENGTH) || 'Untitled Scene'
}

export function sanitizeNarration(value: unknown) {
  return sanitizeMultiline(value, MAX_NARRATION_LENGTH)
}

export function sanitizePlanningNotes(value: unknown) {
  return sanitizeMultiline(value, MAX_PLANNING_NOTES_LENGTH)
}

export function sanitizeChecklistText(value: unknown) {
  return sanitizeSingleLine(value, MAX_TEXT_LENGTH)
}

export function sanitizeCaption(value: unknown) {
  return sanitizeSingleLine(value, MAX_CAPTION_LENGTH)
}

export function sanitizeFilename(value: unknown) {
  return sanitizeSingleLine(value, MAX_FILENAME_LENGTH) || null
}

export function sanitizeDurationManual(value: unknown) {
  const numericValue = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numericValue)) return 0
  return Math.max(0, Math.min(MAX_DURATION_SECONDS, Math.round(numericValue)))
}

export function sanitizeExternalUrl(value: unknown) {
  const input = sanitizeSingleLine(value, MAX_URL_LENGTH)
  if (!input) return null

  try {
    const url = new URL(input)
    if (!SAFE_PROTOCOLS.has(url.protocol)) return null
    url.username = ''
    url.password = ''
    return url.toString()
  } catch {
    return null
  }
}

export function inferReferenceType(url: string): Reference['type'] {
  try {
    const pathname = new URL(url).pathname.toLowerCase()
    return /\.(jpg|jpeg|png|gif|webp|svg)$/.test(pathname) ? 'image' : 'link'
  } catch {
    return 'link'
  }
}

function sanitizeOnScreenText(value: unknown): OnScreenText | null {
  const record = asRecord(value)
  if (!record) return null

  const id = sanitizeId(record.id)
  if (!id) return null

  return {
    id,
    text: sanitizeChecklistText(record.text),
    checked: Boolean(record.checked),
  }
}

function sanitizeAiVersion(value: unknown): AiVersion | null {
  const record = asRecord(value)
  if (!record) return null

  const id = sanitizeId(record.id)
  if (!id) return null

  return {
    id,
    originalText: sanitizeNarration(record.originalText),
    correctedText: sanitizeNarration(record.correctedText),
    createdAt: sanitizeIsoDate(record.createdAt),
  }
}

function sanitizeHookTypes(
  hookTypesValue: unknown,
  hookTypeValue?: unknown
): HookType[] {
  if (Array.isArray(hookTypesValue)) {
    return dedupe(
      hookTypesValue
        .map(value => asEnumValue(value, HOOK_TYPES))
        .filter((value): value is HookType => value !== null)
    ).slice(0, MAX_HOOK_TYPE_COUNT)
  }

  const legacyHookType = asEnumValue(hookTypeValue, HOOK_TYPES)
  return legacyHookType ? [legacyHookType as HookType] : []
}

function sanitizeRetentionEnabled(value: unknown) {
  return Boolean(value)
}

function sanitizeBRollSubtypes(
  bRollSubtypesValue: unknown,
  bRollSubtypeValue?: unknown
): BRollSubtype[] {
  if (Array.isArray(bRollSubtypesValue)) {
    return dedupe(
      bRollSubtypesValue
        .map(value => asEnumValue(value, B_ROLL_SUBTYPES))
        .filter((value): value is BRollSubtype => value !== null)
    ).slice(0, MAX_B_ROLL_SUBTYPE_COUNT)
  }

  const legacyBRollSubtype = asEnumValue(bRollSubtypeValue, B_ROLL_SUBTYPES)
  return legacyBRollSubtype ? [legacyBRollSubtype as BRollSubtype] : []
}

function sanitizeSegmentRoles(
  segmentRolesValue: unknown,
  segmentRoleValue?: unknown
): SegmentRole[] {
  if (Array.isArray(segmentRolesValue)) {
    return dedupe(
      segmentRolesValue
        .map(value => asEnumValue(value, SEGMENT_ROLES))
        .filter((value): value is SegmentRole => value !== null && value !== 'retention')
    ).slice(0, MAX_SEGMENT_ROLE_COUNT)
  }

  const legacySegmentRole = asEnumValue(segmentRoleValue, SEGMENT_ROLES)
  return legacySegmentRole && legacySegmentRole !== 'retention'
    ? [legacySegmentRole as SegmentRole]
    : []
}

export function sanitizeReferenceDraft(
  value: { url: unknown; caption: unknown }
): Omit<Reference, 'id'> | null {
  const url = sanitizeExternalUrl(value.url)
  if (!url) return null

  return {
    type: inferReferenceType(url),
    source: 'remote',
    url,
    assetId: null,
    caption: sanitizeCaption(value.caption),
    filename: null,
  }
}

export function sanitizeLocalReferenceDraft(
  value: { assetId: unknown; caption: unknown; filename: unknown }
): Omit<Reference, 'id'> | null {
  const assetId = sanitizeId(value.assetId)
  if (!assetId) return null

  return {
    type: 'image',
    source: 'local',
    url: '',
    assetId,
    caption: sanitizeCaption(value.caption),
    filename: sanitizeFilename(value.filename),
  }
}

function sanitizeReference(value: unknown): Reference | null {
  const record = asRecord(value)
  if (!record) return null

  const id = sanitizeId(record.id)
  const source = asEnumValue(record.source, REFERENCE_SOURCES) ?? 'remote'
  const reference =
    source === 'local'
      ? sanitizeLocalReferenceDraft({
          assetId: record.assetId,
          caption: record.caption,
          filename: record.filename,
        })
      : sanitizeReferenceDraft({
          url: record.url,
          caption: record.caption,
        })

  if (!id || !reference) return null

  return {
    id,
    ...reference,
  }
}

function sanitizeProject(value: unknown): Project | null {
  const record = asRecord(value)
  if (!record) return null

  const id = sanitizeId(record.id)
  if (!id) return null

  return {
    id,
    title: sanitizeProjectTitle(record.title),
    status: asEnumValue(record.status, PROJECT_STATUSES) ?? 'backlog',
    createdAt: sanitizeIsoDate(record.createdAt),
    updatedAt: sanitizeIsoDate(record.updatedAt),
  }
}

function sanitizeScene(value: unknown): Scene | null {
  const record = asRecord(value)
  if (!record) return null

  const id = sanitizeId(record.id)
  const projectId = sanitizeId(record.projectId)
  if (!id || !projectId) return null
  const legacySegmentRole = asEnumValue(record.segmentRole, SEGMENT_ROLES) as SegmentRole | null

  const onScreenTexts = Array.isArray(record.onScreenTexts)
    ? record.onScreenTexts
        .map(sanitizeOnScreenText)
        .filter((item): item is OnScreenText => item !== null)
        .slice(0, MAX_ON_SCREEN_ITEMS)
    : []

  const references = Array.isArray(record.references)
    ? record.references
        .map(sanitizeReference)
        .filter((item): item is Reference => item !== null)
        .slice(0, MAX_REFERENCES)
    : []

  const aiVersions = Array.isArray(record.aiVersions)
    ? record.aiVersions
        .map(sanitizeAiVersion)
        .filter((item): item is AiVersion => item !== null)
        .slice(0, MAX_AI_VERSIONS)
    : []

  const retentionDevices = Array.isArray(record.retentionDevices)
    ? dedupe(
        record.retentionDevices
          .map(value => asEnumValue(value, RETENTION_DEVICES))
          .filter((value): value is RetentionDevice => value !== null)
      ).slice(0, MAX_RETENTION_DEVICE_COUNT)
    : []
  const hasBRoll = retentionDevices.includes('b_roll')
  const bRollSubtypes = hasBRoll
    ? sanitizeBRollSubtypes(record.bRollSubtypes, record.bRollSubtype)
    : []
  const hookTypes = sanitizeHookTypes(record.hookTypes, record.hookType)
  const segmentRoles = sanitizeSegmentRoles(record.segmentRoles, record.segmentRole)
  const retentionEnabled =
    sanitizeRetentionEnabled(record.retentionEnabled) ||
    legacySegmentRole === 'retention' ||
    retentionDevices.length > 0

  return {
    id,
    projectId,
    order: sanitizeDurationManual(record.order),
    title: sanitizeSceneTitle(record.title),
    narration: sanitizeNarration(record.narration),
    planningNotes: sanitizePlanningNotes(record.planningNotes),
    durationManual: sanitizeDurationManual(record.durationManual),
    isLocked: Boolean(record.isLocked),
    segmentRoles,
    hookTypes: segmentRoles.includes('hook') ? hookTypes : [],
    retentionEnabled,
    retentionDevices: retentionEnabled ? retentionDevices : [],
    bRollSubtypes: retentionEnabled && hasBRoll ? bRollSubtypes : [],
    onScreenTexts,
    references,
    aiVersions,
  }
}

export function sanitizeProjectPatch(
  patch: Partial<Pick<Project, 'title' | 'status'>>
): Partial<Pick<Project, 'title' | 'status'>> {
  const sanitizedPatch: Partial<Pick<Project, 'title' | 'status'>> = {}

  if ('title' in patch) {
    sanitizedPatch.title = sanitizeProjectTitle(patch.title)
  }

  if ('status' in patch) {
    const status = asEnumValue(patch.status, PROJECT_STATUSES)
    if (status) sanitizedPatch.status = status as ProjectStatus
  }

  return sanitizedPatch
}

export function sanitizeOnScreenTextPatch(
  patch: Partial<OnScreenText>
): Partial<OnScreenText> {
  const sanitizedPatch: Partial<OnScreenText> = {}

  if ('text' in patch) {
    sanitizedPatch.text = sanitizeChecklistText(patch.text)
  }

  if ('checked' in patch) {
    sanitizedPatch.checked = Boolean(patch.checked)
  }

  return sanitizedPatch
}

export function sanitizeScenePatch(
  patch: Partial<Scene> & {
    hookType?: HookType | null
    segmentRole?: SegmentRole | null
    bRollSubtype?: BRollSubtype | null
  }
): Partial<Scene> {
  const sanitizedPatch: Partial<Scene> = {}

  if ('order' in patch) sanitizedPatch.order = sanitizeDurationManual(patch.order)
  if ('title' in patch) sanitizedPatch.title = sanitizeSceneTitle(patch.title)
  if ('narration' in patch) sanitizedPatch.narration = sanitizeNarration(patch.narration)
  if ('planningNotes' in patch) {
    sanitizedPatch.planningNotes = sanitizePlanningNotes(patch.planningNotes)
  }
  if ('durationManual' in patch) {
    sanitizedPatch.durationManual = sanitizeDurationManual(patch.durationManual)
  }
  if ('isLocked' in patch) sanitizedPatch.isLocked = Boolean(patch.isLocked)

  if ('segmentRoles' in patch) {
    sanitizedPatch.segmentRoles = sanitizeSegmentRoles(patch.segmentRoles)
    if (!sanitizedPatch.segmentRoles.includes('hook')) sanitizedPatch.hookTypes = []
  }

  if ('segmentRole' in patch) {
    sanitizedPatch.segmentRoles = sanitizeSegmentRoles(undefined, patch.segmentRole)
    if (!sanitizedPatch.segmentRoles.includes('hook')) sanitizedPatch.hookTypes = []
  }

  if ('hookTypes' in patch) {
    sanitizedPatch.hookTypes = sanitizeHookTypes(patch.hookTypes)
  }

  if ('hookType' in patch) {
    sanitizedPatch.hookTypes = sanitizeHookTypes(undefined, patch.hookType)
  }

  if ('retentionDevices' in patch) {
    sanitizedPatch.retentionDevices = Array.isArray(patch.retentionDevices)
      ? dedupe(
          patch.retentionDevices
            .map(value => asEnumValue(value, RETENTION_DEVICES))
            .filter((value): value is RetentionDevice => value !== null)
        ).slice(0, MAX_RETENTION_DEVICE_COUNT)
      : []

    sanitizedPatch.retentionEnabled = sanitizedPatch.retentionDevices.length > 0

    if (!sanitizedPatch.retentionDevices.includes('b_roll')) {
      sanitizedPatch.bRollSubtypes = []
    }
  }

  if ('retentionEnabled' in patch) {
    sanitizedPatch.retentionEnabled = sanitizeRetentionEnabled(patch.retentionEnabled)
    if (!sanitizedPatch.retentionEnabled) {
      sanitizedPatch.retentionDevices = []
      sanitizedPatch.bRollSubtypes = []
    }
  }

  if ('bRollSubtypes' in patch) {
    sanitizedPatch.bRollSubtypes = sanitizeBRollSubtypes(patch.bRollSubtypes)
  }

  if ('bRollSubtype' in patch) {
    sanitizedPatch.bRollSubtypes = sanitizeBRollSubtypes(undefined, patch.bRollSubtype)
  }

  if ('onScreenTexts' in patch) {
    sanitizedPatch.onScreenTexts = Array.isArray(patch.onScreenTexts)
      ? patch.onScreenTexts
          .map(sanitizeOnScreenText)
          .filter((item): item is OnScreenText => item !== null)
          .slice(0, MAX_ON_SCREEN_ITEMS)
      : []
  }

  if ('references' in patch) {
    sanitizedPatch.references = Array.isArray(patch.references)
      ? patch.references
          .map(sanitizeReference)
          .filter((item): item is Reference => item !== null)
          .slice(0, MAX_REFERENCES)
      : []
  }

  if ('aiVersions' in patch) {
    sanitizedPatch.aiVersions = Array.isArray(patch.aiVersions)
      ? patch.aiVersions
          .map(sanitizeAiVersion)
          .filter((item): item is AiVersion => item !== null)
          .slice(0, MAX_AI_VERSIONS)
      : []
  }

  return sanitizedPatch
}

export function sanitizePersistedProjectState(value: unknown) {
  const record = unwrapPersistedState(value)
  const projects = Array.isArray(record?.projects)
    ? record.projects
        .map(sanitizeProject)
        .filter((project): project is Project => project !== null)
    : []

  const projectIds = new Set(projects.map(project => project.id))
  const activeProjectId = sanitizeId(record?.activeProjectId)

  return {
    projects,
    activeProjectId:
      activeProjectId && projectIds.has(activeProjectId)
        ? activeProjectId
        : projects[0]?.id ?? null,
  }
}

export function sanitizePersistedSceneState(value: unknown) {
  const record = unwrapPersistedState(value)
  const scenes = Array.isArray(record?.scenes)
    ? record.scenes
        .map(sanitizeScene)
        .filter((scene): scene is Scene => scene !== null)
    : []

  return { scenes }
}
