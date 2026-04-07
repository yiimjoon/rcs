import type { SegmentRole } from './types'

export interface ScriptPreset {
  projectTitle: string
  scenes: Array<{
    title: string
    narration: string
    planningNotes: string
    segmentRole: SegmentRole
  }>
}

function draft(
  title: string,
  segmentRole: SegmentRole,
  narration: string,
  planningNotes = ''
): ScriptPreset['scenes'][number] {
  return { title, segmentRole, narration, planningNotes }
}

export const SCRIPT_PRESETS: ScriptPreset[] = [
  {
    projectTitle: '상세페이지 - 1',
    scenes: [
      draft('매출 상승 훅', 'hook', '상세페이지만 바꿔도 매출이 오릅니다'),
      draft('직접 검증', 'proof', '어떻게 아냐고요?\n제가 직접 해봤습니다.'),
      draft(
        '3,000% 상승 사례',
        'proof',
        '저희는 기존 상세페이지를\n이렇게 바꾸고 광고비를 똑같이 돌렸더니\n상세페이지 바꾸기 전보다 매출이 3,000% 올랐습니다'
      ),
      draft(
        '설득 구조가 핵심',
        'solution',
        '디자인과 촬영도 중요하지만\n진짜 중요한건 고객을 어떻게 설득하냐 였습니다'
      ),
      draft('문의 CTA', 'cta', '지금 상세페이지로 고민이시라면\n저희에게 연락주세요'),
    ],
  },
  {
    projectTitle: '상세페이지 - 2',
    scenes: [
      draft('3000% 상승 훅', 'hook', '상세페이지만 바꾸고 매출 3,000% 상승'),
      draft('직접 테스트', 'proof', '저희가 직접 테스트 하고 말씀 드립니다'),
      draft(
        '성과 증거',
        'proof',
        '기존 상세페이지를\n이렇게 바꾸고 광고비를 똑같이 돌렸더니\n상세페이지 바꾸기 전보다 매출이 3,000% 올랐습니다'
      ),
      draft(
        '상세페이지 핵심',
        'solution',
        '디자인과 촬영도 중요하지만\n진짜 중요한건 고객을 어떻게 설득하냐 였습니다'
      ),
      draft(
        '매출 영향',
        'benefit',
        '같은 상품이여도 상세페이지를 어떻게 만드냐에 따라 매출은 바뀔 수 있습니다'
      ),
      draft('연락 CTA', 'cta', '상세페이지로 고민이시라면 연락주세요'),
    ],
  },
  {
    projectTitle: '상세페이지 - 3',
    scenes: [
      draft('타깃 호출', 'hook', '상세페이지 필요한 사람 주목!'),
      draft(
        '제작 솔루션',
        'solution',
        '유통 전문가가 기획하고 디자인 전문가와 촬영 전문가가 상세페이지 만들어 줍니다'
      ),
      draft(
        '매출 연결 베네핏',
        'benefit',
        '유통 전문가가 기획하기 때문에 매출로 이어지는 상세페이지를 만들 수 있습니다'
      ),
      draft('문의 CTA', 'cta', '지금 매출로 고민이시라면 저희에게 연락 주세요'),
    ],
  },
  {
    projectTitle: '브랜딩 - 1',
    scenes: [
      draft('나이키 비교 훅', 'hook', '당신의 브랜드와 나이키가 다른 이유는?'),
      draft('핵심 진단', 'problem', '매출입니다'),
      draft('브랜드 욕구', 'desire', '내 브랜드도 나이키처럼 만들고 싶다면?'),
      draft('브랜딩 포지셔닝', 'positioning', '매출을 올리는 브랜딩 회사'),
      draft(
        '브랜드 큐레이터 증거',
        'proof',
        '오모가리 / 아이리버 / 카카오 / DJI 등 자체 유통을 하면서\n코카콜라 등 대기업 브랜드의 에이전시 역할을 하는\n유통 + 브랜딩을 하는 회사입니다'
      ),
      draft('매출 클로징 카피', 'closing_copy', '당신의 브랜드의 매출이 올라가도록 큐레이팅 합니다'),
      draft('의뢰 CTA', 'cta', '브랜드 큐레이터에 의뢰하세요'),
    ],
  },
  {
    projectTitle: '브랜딩 - 2',
    scenes: [
      draft('매출 고민 훅', 'hook', '매출로 고민인 사람 주목!'),
      draft(
        '브랜딩 포지셔닝',
        'positioning',
        '저는 매출과 브랜딩을 한번에 해결하는 커머스 브랜딩 전문 회사 브랜드 큐레이터 입니다'
      ),
      draft(
        '회사 증거',
        'proof',
        '오모가리 / 아이리버 / 카카오 / DJI 등 자체 유통을 하면서\n코카콜라 등 대기업 브랜드의 에이전시 역할을 하는\n유통 + 브랜딩을 하는 회사입니다'
      ),
      draft('매출 클로징 카피', 'closing_copy', '당신의 브랜드의 매출이 올라가도록 큐레이팅 합니다'),
    ],
  },
  {
    projectTitle: '브랜딩 - 3',
    scenes: [
      draft('비용 훅', 'hook', '마케팅 비용 그만 쓰세요'),
      draft('브랜딩 비유', 'problem', '마케팅은 물\n브랜딩은 그릇입니다'),
      draft(
        '브랜딩 문제',
        'problem',
        '브랜딩이 안되어 있다면 밑빠진 독에 물을 버리는거나 마찬가지입니다'
      ),
      draft(
        '브랜딩 정의',
        'solution',
        '브랜딩은 어렵게 생각하지 마시고 내 상품을 고객에게 어떻게 인지시키는지를 생각하세요'
      ),
      draft(
        '효과 베네핏',
        'benefit',
        '브랜딩만 잘 된다면 적은 비용으로도 최고의 효과를 얻을 수 있습니다'
      ),
      draft(
        '문의 CTA',
        'cta',
        '매출과 브랜딩을 한번에 해결해주는 커머스 브랜딩 전문 회사 브랜드 큐레이터에 문의 주시면\n대표님의 고민을 해결해드릴게요!'
      ),
    ],
  },
  {
    projectTitle: '브랜딩 - 4',
    scenes: [
      draft('브랜딩 감 의존 문제', 'problem', '브랜딩 아직도 감으로 하시나요?'),
      draft('매출 기준 해답', 'answer', '감이 아닌 매출 기준으로 하는 브랜딩이 있습니다.'),
      draft(
        '유통 브랜딩 솔루션',
        'solution',
        '오모가리, 카카오, 아이리버 등\n직접 유통을 하면서 코카콜라, 3M, 정관장 같은 대기업 에이전시까지 해온\n유통과 브랜딩을 동시에 하는 회사입니다.'
      ),
      draft(
        '매출 연결 베네핏',
        'benefit',
        '유통을 직접 해본 사람이 하는 브랜딩은 다릅니다\n매출로 연결되는 구조를 알고 있거든요'
      ),
      draft('커머스 브랜딩 클로징', 'closing_copy', '매출을 올리는 브랜딩, 커머스 브랜딩.'),
      draft('문의 CTA', 'cta', '브랜드큐레이터에 문의 하세요'),
    ],
  },
  {
    projectTitle: '브랜딩 - 5',
    scenes: [
      draft(
        '매출 고민 문제',
        'problem',
        '매출이 고민 이신가요?\n디자인도 전문가에게 맡기고 마케팅도 하는데 매출은 왜 안늘까?'
      ),
      draft('유통 구조 해답', 'answer', '이유는 유통 구조가 빠져있기 때문입니다'),
      draft(
        '구조 기반 솔루션',
        'solution',
        '유통 구조를 알고 기획하고 디자인 및 마케팅을 한다면'
      ),
      draft('구조 효과 베네핏', 'benefit', '매출은 오를 수 밖에 없습니다'),
      draft(
        '실행 회사 증거',
        'proof',
        '저희는\n오모가리, 카카오, 아이리버 등\n직접 유통을 하면서 코카콜라, 3M, 정관장 같은 대기업 에이전시까지 해온\n유통과 브랜딩을 동시에 하는 회사입니다.'
      ),
      draft(
        '매출 연결 베네핏',
        'benefit',
        '유통을 직접 해본 사람이 하는 브랜딩은 다릅니다\n매출로 연결되는 구조를 알고 있거든요'
      ),
      draft('커머스 브랜딩 클로징', 'closing_copy', '매출을 올리는 브랜딩, 커머스 브랜딩.'),
      draft('문의 CTA', 'cta', '브랜드큐레이터에 문의 하세요'),
    ],
  },
  {
    projectTitle: '브랜딩 - 6',
    scenes: [
      draft(
        '브랜딩 매출 정체 문제',
        'problem',
        '브랜딩에 돈 쓰고 있는데 매출은 그대로이신가요?\n브랜딩과 유통을 따로 하면 매출은 안 오릅니다.'
      ),
      draft(
        '커머스 브랜딩 해답',
        'answer',
        '유통과 브랜딩을 동시에 하는 커머스 브랜딩을 해보세요'
      ),
      draft(
        '실행 회사 솔루션',
        'solution',
        '저희는\n오모가리, 카카오, 아이리버 등\n직접 유통을 하면서 코카콜라, 3M, 정관장 같은 대기업 에이전시까지 해온\n유통과 브랜딩을 동시에 하는 회사입니다.'
      ),
      draft(
        '매출 연결 베네핏',
        'benefit',
        '유통을 직접 해본 사람이 하는 브랜딩은 다릅니다\n매출로 연결되는 구조를 알고 있거든요'
      ),
      draft('커머스 브랜딩 클로징', 'closing_copy', '매출을 올리는 브랜딩, 커머스 브랜딩.'),
      draft('문의 CTA', 'cta', '브랜드큐레이터에 문의 하세요'),
    ],
  },
]

export function normalizePresetTitle(title: string) {
  return title
    .normalize('NFKC')
    .replace(/[\s_-]+/g, '')
    .trim()
    .toLowerCase()
}
