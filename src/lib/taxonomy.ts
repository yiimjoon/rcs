import type { SegmentRole, HookType, RetentionDevice } from './types'

export const SEGMENT_ROLES: { value: SegmentRole; label: string; color: string }[] = [
  { value: 'hook',      label: '훅',    color: '#E85D2C' },
  { value: 'retain',    label: '지속',  color: '#4A9EBF' },
  { value: 'retention', label: '리텐션', color: '#2E86AB' },
  { value: 'reward',    label: '보상',   color: '#C96DD8' },
  { value: 'cta',       label: 'CTA',   color: '#E8A22C' },
  { value: 'bridge',    label: '브리지', color: '#888880' },
]

export const HOOK_TYPES: { value: HookType; label: string; description: string }[] = [
  { value: 'problem_hook',      label: '문제 제기',   description: '문제/페인포인트를 먼저 던져서 멈추게 함' },
  { value: 'number_hook',       label: '숫자',        description: '구체적 숫자로 신뢰감+궁금증 동시 유발' },
  { value: 'twist_hook',        label: '반전',        description: '예상을 깨는 사실/결과로 시선 잡기' },
  { value: 'crisis_hook',       label: '위기',        description: '위기감/긴급함을 조성해서 멈추게 함' },
  { value: 'quote_hook',        label: '명언',        description: '격언/명언으로 시선 잡기' },
  { value: 'meta_hook',         label: '메타',        description: '영상의 구조 자체를 훅으로 사용' },
  { value: 'bait_switch_hook',  label: '낚시 전환',   description: '한 방향으로 기대시킨 뒤 전혀 다른 방향으로 전환' },
  { value: 'counter_norm_hook', label: '반통념',      description: '통념을 정면 반박해서 시선 잡기' },
  { value: 'identity_hook',     label: '정체성',      description: "'이런 사람 있지' 자기투영 유발" },
  { value: 'cheer_hook',        label: '응원',        description: '힘든 상태를 인정하고 응원하는 메시지' },
  { value: 'empathy_hook',      label: '공감',        description: "누구나 겪는 상황을 건드려서 '나도!' 유발" },
  { value: 'skit_hook',         label: '스킷',        description: '짧은 연기/상황극으로 시선 잡기' },
  { value: 'visual_hook',       label: '그림',        description: '시각적 컨셉/이미지로 즉각 시선 잡기' },
  { value: 'exaggeration_hook', label: '과장 비유',   description: '과장된 비유로 호기심 유발' },
  { value: 'declaration_hook',  label: '선언',        description: '강한 주장/선언으로 시선 잡기' },
  { value: 'emotion_hook',      label: '감정',        description: '감정에 직접 호소해서 멈추게 함' },
  { value: 'specificity_hook',  label: '구체성',      description: '구체적 디테일로 현실감 유발' },
  { value: 'warning_hook',      label: '경고',        description: '경고성 메시지로 시선 잡기' },
]

export const RETENTION_DEVICES: { value: RetentionDevice; label: string; description: string }[] = [
  { value: 'open_loop',           label: '오픈 루프',    description: '질문/상황을 던지고 답을 일부러 안 줘서 못 나가게 만듦' },
  { value: 'infinite_loop',       label: '무한 루프',    description: '마지막이 처음으로 돌아가서 다시 보게 만듦' },
  { value: 'gradual_reveal',      label: '점진적 공개',  description: '정보를 조금씩 풀어서 계속 궁금하게' },
  { value: 'dramatic_irony',      label: '극적 아이러니', description: '시청자만 알고 영상 속 인물은 모르는 상태' },
  { value: 'time_limit',          label: '타임 리밋',    description: "'60초 안에' 같은 시간 제한으로 집중시킴" },
  { value: 'countdown',           label: '카운트다운',   description: '3, 2, 1 또는 넘버링으로 진행감' },
  { value: 'pressure_build',      label: '압력 높이기',  description: '감정/상황 강도를 단계적으로 올림' },
  { value: 'fake_out',            label: '페이크 아웃',  description: '예상한 결과를 한 번 배신해서 긴장 리셋' },
  { value: 'deferred_payoff',     label: '보상 지연',    description: '답/결과를 의도적으로 뒤로 미뤄서 기대감 유지' },
  { value: 'confession',          label: '솔직 고백',    description: '본인의 실패/약점을 솔직하게 털어서 몰입' },
  { value: 'meta_breakdown',      label: '뜯어보기',     description: '영상 자체의 구조를 분석하며 설명하는 메타 기법' },
  { value: 'emotional_breathing', label: '감성 호흡',    description: '느린 컷, 여백, 음악으로 감정의 리듬 조절' },
  { value: 'data_proof',          label: '데이터 증명',  description: '통계/숫자로 주장의 신뢰감을 높임' },
  { value: 'chronological',       label: '시간순 전개',  description: '과거→현재 순서로 흐름을 만듦' },
  { value: 'pacing',              label: '페이싱',       description: '컷의 속도/리듬 조절로 지루함 방지' },
  { value: 'promise',             label: '약속',         description: "'알려드릴게요' 처럼 뒤에 보상이 있다고 예고" },
  { value: 'direct_question',     label: '직접 질문',    description: '시청자에게 직접 질문을 던져 참여감 유발' },
  { value: 'repetition',          label: '반복 자극',    description: '같은 소리/이미지 반복으로 긴장 쌓기' },
  { value: 'callback',            label: '떡밥 회수',    description: '앞에서 던진 복선을 나중에 회수' },
  { value: 'preview_effect',      label: '예고편 효과',  description: '뒤에 나올 장면을 미리 살짝 보여줌' },
  { value: 'question_stacking',   label: '질문 쌓기',    description: '답 없이 질문만 연속으로 던져 호기심 누적' },
  { value: 'pattern_break',       label: '패턴 깨기',    description: '반복 패턴을 갑자기 깨서 주의 환기' },
  { value: 'macguffin',           label: '맥거핀',       description: '목표처럼 보이지만 실은 긴장을 끌어가는 장치' },
  { value: 'cut_split',           label: '컷 쪼개기',    description: '장면을 잘게 쪼개 리듬감 생성' },
  { value: 'blur_preview',        label: '블러 미리보기', description: '결과를 흐리게 미리 보여줘 궁금증 유발' },
  { value: 'step',                label: '스텝',         description: '단계별 진행으로 끝까지 보게 만듦' },
  { value: 'level',               label: '레벨',         description: '레벨업 구조로 성장감과 기대감 부여' },
  { value: 'comparison',          label: '비교(vs)',     description: '두 대상을 나란히 놓아 판단 욕구 자극' },
]

export function getRoleColor(role: SegmentRole | null): string {
  return SEGMENT_ROLES.find(r => r.value === role)?.color ?? '#888880'
}

export function getRoleLabel(role: SegmentRole | null): string {
  return SEGMENT_ROLES.find(r => r.value === role)?.label ?? '—'
}

export function getDeviceLabel(device: RetentionDevice): string {
  return RETENTION_DEVICES.find(d => d.value === device)?.label ?? device
}
