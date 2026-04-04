import type { SegmentRole, HookType, RetentionDevice } from './types'

export const SEGMENT_ROLES: { value: SegmentRole; label: string; color: string }[] = [
  { value: 'hook',    label: '훅',      color: '#E85D2C' },
  { value: 'setup',   label: '셋업',    color: '#6B7FD7' },
  { value: 'build',   label: '빌드',    color: '#4A9EBF' },
  { value: 'proof',   label: '증명',    color: '#5BAD8F' },
  { value: 'payoff',  label: '페이오프', color: '#C96DD8' },
  { value: 'cta',     label: 'CTA',     color: '#E8A22C' },
  { value: 'bridge',  label: '브리지',  color: '#888880' },
]

export const HOOK_TYPES: { value: HookType; label: string }[] = [
  { value: 'problem',   label: '문제 제시' },
  { value: 'curiosity', label: '호기심' },
  { value: 'contrast',  label: '대비' },
  { value: 'claim',     label: '주장' },
  { value: 'emotion',   label: '감정' },
  { value: 'identity',  label: '정체성' },
]

export const RETENTION_DEVICES: { value: RetentionDevice; label: string; description: string }[] = [
  { value: 'open_loop',               label: '오픈 루프',     description: '핵심 답변을 의도적으로 지연' },
  { value: 'deferred_payoff',         label: '지연 보상',     description: '"곧 보여줄게" 식 예고' },
  { value: 'micro_reveal',            label: '마이크로 리빌', description: '중간 작은 보상으로 호기심 유지' },
  { value: 'direct_questioning',      label: '직접 질문',     description: '시청자에게 직접 질문' },
  { value: 'anticipating_objections', label: '반론 선점',     description: '"이렇게 생각할 수도 있는데..."' },
  { value: 'reframe',                 label: '리프레임',      description: '기존 시각을 뒤집기' },
  { value: 'relatability',            label: '공감',          description: '공감 유도' },
  { value: 'confession_vulnerability',label: '고백',          description: '취약점 고백으로 신뢰 형성' },
  { value: 'visual_proof',            label: '시각적 증거',   description: '시각적 증거 제시' },
]

export function getRoleColor(role: SegmentRole | null): string {
  return SEGMENT_ROLES.find(r => r.value === role)?.color ?? '#888880'
}

export function getRoleLabel(role: SegmentRole | null): string {
  return SEGMENT_ROLES.find(r => r.value === role)?.label ?? '—'
}
