import type { SegmentRole } from './types'

interface ScriptPresetSceneOptions {
  planningNotes?: string
  onScreenTexts?: string[]
  location?: string
  gesture?: string
  blocking?: string
  cameraMovement?: string
  propsNotes?: string
}

export interface ScriptPresetSceneDraft {
  title: string
  narration: string
  planningNotes: string
  segmentRole: SegmentRole
  onScreenTexts?: string[]
  location?: string
  gesture?: string
  blocking?: string
  cameraMovement?: string
  propsNotes?: string
}

export interface ScriptPreset {
  projectTitle: string
  projectTheme?: string
  forceRefresh?: boolean
  scenes: ScriptPresetSceneDraft[]
}

function draft(
  title: string,
  segmentRole: SegmentRole,
  narration: string,
  options: ScriptPresetSceneOptions = {}
): ScriptPresetSceneDraft {
  return {
    title,
    segmentRole,
    narration,
    planningNotes: '',
    ...options,
  }
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
    projectTitle: '커머스 브랜딩 01 - 유통 중심',
    projectTheme:
      '쿠팡, 네이버, 대형마트 유통 경험과 브랜딩 역량을 함께 내세우는 기본 소개형 커머스 브랜딩 스크립트입니다.',
    forceRefresh: true,
    scenes: [
      draft(
        '채널 확장 훅',
        'hook',
        '내 브랜드를 쿠팡, 네이버, 대형마트에서 잘 팔리게 만들고 싶은가요?',
        {
          planningNotes: '오프닝에서 채널 로고가 먼저 뜨고, 질문 카피를 크게 띄운 뒤 앤서가 화면 정면에서 질문을 던진다.',
          onScreenTexts: ['잘 팔고 싶나요??'],
          gesture: '앤서가 정면을 보며 질문을 던진다.',
          blocking: '중앙 원샷에서 시작한다.',
          cameraMovement: '빠른 푸시인 후 정지.',
          propsNotes: '쿠팡, 네이버, 대형마트 로고 그래픽을 순차 노출.',
        }
      ),
      draft(
        '유통 중심 해답',
        'solution',
        '쿠팡, 네이버, 대형마트 유통 경험이 풍부한 전문가가 기획하고\n브랜딩 전문가가 브랜딩 하는\n유통 중심 커머스 브랜딩 해보세요',
        {
          planningNotes: '앤서가 설명하듯 말하는 장면. 앤서 상단에 역할 네임택을 얹어 유통과 브랜딩을 동시에 강조한다.',
          onScreenTexts: ['유통 전문가', '브랜딩 전문가'],
          gesture: '앤서가 손으로 포인트를 짚으며 설명한다.',
          blocking: '정면에서 반신샷 유지.',
          cameraMovement: '고정 샷.',
        }
      ),
      draft(
        '회사 증거',
        'proof',
        '저희는 오모가리, 카카오, 아이리버 등 큰 브랜드를 직접 유통 하고\n코카콜라, 3M, 정관장 같은 대기업 에이전시까지 해본\n유통과 브랜딩을 동시에 하는 회사입니다.',
        {
          planningNotes: '실적 증명 구간. 브랜드명은 줄 단위로 강조하고, 직접 유통과 대기업 에이전시 경험을 한 번에 보여준다.',
          onScreenTexts: ['오모가리', '카카오', '아이리버', '코카콜라', '3M', '정관장'],
          gesture: '앤서가 차분하게 신뢰감을 주는 톤으로 말한다.',
          cameraMovement: '슬로우 푸시인.',
        }
      ),
      draft(
        '매출 연결 베네핏',
        'benefit',
        '유통을 직접 해본 사람이 하는 브랜딩은 다릅니다.\n어떻게 매출로 연결되는지 알고 있거든요.',
        {
          planningNotes: '왜 다른지 설명하는 핵심 설득 구간. 매출 연결이라는 문구를 짧게 띄워준다.',
          onScreenTexts: ['매출로 연결'],
          gesture: '앤서가 카메라를 짚듯 말한다.',
        }
      ),
      draft('커머스 브랜딩 클로징', 'closing_copy', '매출을 올리는 브랜딩, 커머스 브랜딩.'),
      draft('문의 CTA', 'cta', '브랜드큐레이터에 문의하세요.'),
    ],
  },
  {
    projectTitle: '커머스 브랜딩 02 - 채널 분석',
    projectTheme:
      '판매 라인은 많은데 매출이 안 나는 브랜드를 향해, 채널 분석과 유통 구조 설계의 필요성을 강조하는 스크립트입니다.',
    forceRefresh: true,
    scenes: [
      draft(
        '매출 정체 훅',
        'hook',
        '네이버, 쿠팡, 오프라인등 판매 라인은 다 해봤는데\n매출이 안나오는 사람들 주목하세요!',
        {
          planningNotes: '채널 로고가 먼저 뜨고, 앤서가 손가락으로 카메라를 가리키며 타깃을 직접 호출한다.',
          onScreenTexts: ['매출이 안나오는 사람들 주목하세요!'],
          gesture: '앤서가 손가락으로 카메라를 가리킨다.',
          blocking: '로고 그래픽 뒤로 앤서가 전면 등장.',
          cameraMovement: '짧은 줌인.',
          propsNotes: '쿠팡, 네이버, 마트 로고 그래픽 사용.',
        }
      ),
      draft(
        '채널 분석 진단',
        'answer',
        '이유는 채널 분석이 잘못되었기 때문이에요',
        {
          planningNotes: '앤서가 시선을 한번 틀었다가 왼손으로 카메라를 다시 짚으며 원인을 분명히 말한다.',
          gesture: '고개를 돌린 뒤 왼손으로 카메라를 가리킨다.',
          cameraMovement: '고정 샷.',
        }
      ),
      draft(
        '유통 구조 문제',
        'problem',
        '유통 구조를 파악하지 않고 판매하기 때문에 매출이 안나오는거죠',
        {
          planningNotes: '하단에 유통 단계가 순차적으로 뜨면서 구조 부재를 시각화한다.',
          onScreenTexts: ['제조', '브랜딩', '노출', '설득', '구매'],
          gesture: '앤서가 단계가 뜨는 위치를 따라 손으로 흐름을 보여준다.',
        }
      ),
      draft(
        '매출 중심 솔루션',
        'solution',
        '쿠팡, 네이버, 대형마트 등 유통 경험이 풍부한 전문가가 기획하고\n브랜딩 전문가가 브랜딩 하는\n매출 중심 커머스 브랜딩 해보세요',
        {
          planningNotes: '솔루션 제안 파트. 앤서 위에 역할 네임택을 다시 올리고 구조 있는 브랜딩을 제시한다.',
          onScreenTexts: ['유통 전문가', '브랜딩 전문가'],
          gesture: '설명하듯 손을 펼쳐 솔루션을 제안한다.',
        }
      ),
      draft(
        '회사 증거',
        'proof',
        '저희는 오모가리, 카카오, 아이리버 등 큰 브랜드를 직접 유통 하고\n코카콜라, 3M, 정관장 같은 대기업 에이전시까지 해본\n유통과 브랜딩을 동시에 하는 회사입니다.'
      ),
      draft(
        '매출 연결 베네핏',
        'benefit',
        '유통을 직접 해본 사람이 하는 브랜딩은 다릅니다.\n어떻게 매출로 연결되는지 알고 있거든요.'
      ),
      draft('커머스 브랜딩 클로징', 'closing_copy', '매출을 올리는 브랜딩, 커머스 브랜딩.'),
      draft('문의 CTA', 'cta', '브랜드큐레이터에 문의하세요.'),
    ],
  },
  {
    projectTitle: '커머스 브랜딩 03 - 디자인 오해',
    projectTheme:
      '디자인만 예쁘다고 매출이 오르지 않는다는 점을 짚고, 유통 기획과 채널 분석이 함께 가야 한다는 메시지를 주는 스크립트입니다.',
    forceRefresh: true,
    scenes: [
      draft(
        '디자인 착각 훅',
        'hook',
        '브랜딩 = 디자인 = 매출??\n아닙니다.',
        {
          planningNotes: '세로로 브랜딩, 디자인, 매출, ?? 그래픽을 띄우고, 앤서가 화면을 뚫고 나오듯 강하게 등장한다.',
          onScreenTexts: ['브랜딩', '디자인', '매출', '??'],
          gesture: '앤서가 마이크를 들고 강하게 주장한다.',
          cameraMovement: '빠른 푸시인.',
          propsNotes: '핸드 마이크 소품.',
        }
      ),
      draft(
        '디자인 한계 문제',
        'problem',
        '디자인만 예뻐서는 매출이 오르지 않습니다!',
        {
          planningNotes: '직설적으로 문제를 선언하는 컷. 전 장면의 세로 텍스트를 부정하는 느낌으로 마무리한다.',
          gesture: '정면 응시로 단호하게 말한다.',
        }
      ),
      draft(
        '유통 기획 해답',
        'solution',
        '매출이 오르려면 내 상품과 시장의 니즈 파악 및 판매 채널 분석 등\n유통 전문가의 기획과\n기획에 맞는 디자인 및 마케팅이 필요합니다.',
        {
          planningNotes: '제품 박스, 소비자 니즈, 판매 채널 아이콘을 순차 노출하고 앤서 위에 유통 전문가 네임택을 올린다.',
          onScreenTexts: ['제품', '소비자 니즈', '판매 채널', '유통 전문가'],
          gesture: '앤서가 아이콘 흐름을 짚으며 설명한다.',
          propsNotes: '제품 박스 그래픽, 사람 이모지, 쿠팡/코스트코/이마트 로고.',
        }
      ),
      draft(
        '회사 증거',
        'proof',
        '저희는 오모가리, 카카오, 아이리버 등 큰 브랜드를 직접 유통 하고\n코카콜라, 3M, 정관장 같은 대기업 에이전시까지 해본\n유통과 브랜딩을 동시에 하는 회사입니다.'
      ),
      draft(
        '매출 연결 베네핏',
        'benefit',
        '유통을 직접 해본 사람이 하는 브랜딩은 다릅니다.\n어떻게 매출로 연결되는지 알고 있거든요.'
      ),
      draft('커머스 브랜딩 클로징', 'closing_copy', '매출을 올리는 브랜딩, 커머스 브랜딩.'),
      draft('문의 CTA', 'cta', '브랜드큐레이터에 문의하세요.'),
    ],
  },
  {
    projectTitle: '커머스 브랜딩 04 - 구조 설계',
    projectTheme:
      '상품과 디자인은 좋은데도 안 팔리는 브랜드를 향해, 고객과 채널, 유통 구조부터 다시 설계해야 한다는 메시지를 담은 스크립트입니다.',
    forceRefresh: true,
    scenes: [
      draft(
        '성과 정체 훅',
        'hook',
        '상품도 좋고 디자인도 좋은데\n매출이 안오른다면 보세요!',
        {
          planningNotes: '앤서가 설명하듯 등장하고 오른손엔 상품, 왼손엔 디자인을 든 뒤 카메라를 가리킨다.',
          onScreenTexts: ['상품', '디자인'],
          gesture: '오른손에 상품, 왼손에 디자인을 올린 뒤 손으로 카메라를 가리킨다.',
          propsNotes: '상품 그래픽과 디자인 카드 소품.',
        }
      ),
      draft(
        '유통 구조 문제',
        'problem',
        '안팔리는 이유는\n상품이 어떤 고객에게, 어떤 채널에서, 어떻게 팔려야 하는지\n유통 구조부터 설계가 안 되어 있기 때문입니다.',
        {
          planningNotes: '하단에 고객 아이콘, 판매 채널 로고, 배송 아이콘이 순차적으로 등장하며 구조 설계 부재를 보여준다.',
          onScreenTexts: ['고객', '쿠팡', '네이버', '코스트코', '이마트', '배송'],
          gesture: '앤서가 아래 흐름을 따라 설명한다.',
        }
      ),
      draft(
        '커머스 브랜딩 해답',
        'answer',
        '그래서 이럴땐 유통 중심의 브랜딩 (커머스 브랜딩)이 필요합니다.',
        {
          planningNotes: '앤서 밑에 유통 전문가 네임택을 노출해 해결 주체를 명확하게 만든다.',
          onScreenTexts: ['유통 전문가', '커머스 브랜딩'],
          gesture: '앤서가 화면을 보며 해답을 또렷하게 말한다.',
        }
      ),
      draft(
        '채널 맞춤 솔루션',
        'solution',
        '유통 경험 있는 전문가가 기획하고,\n그 구조에 맞게 브랜딩과 마케팅을 설계합니다.'
      ),
      draft(
        '회사 증거',
        'proof',
        '저희는 오모가리, 카카오, 아이리버 등 큰 브랜드를 직접 유통 하고\n코카콜라, 3M, 정관장 같은 대기업 에이전시까지 해본\n유통과 브랜딩을 동시에 하는 회사입니다.'
      ),
      draft(
        '매출 연결 베네핏',
        'benefit',
        '유통을 직접 해본 사람이 하는 브랜딩은 다릅니다.\n어떻게 매출로 연결되는지 알고 있거든요.'
      ),
      draft('커머스 브랜딩 클로징', 'closing_copy', '매출을 올리는 브랜딩, 커머스 브랜딩.'),
      draft('문의 CTA', 'cta', '브랜드큐레이터에 문의하세요.'),
    ],
  },
  {
    projectTitle: '커머스 브랜딩 05 - 매출 기준',
    projectTheme:
      '감으로 하는 브랜딩을 비판하고, 매출과 이익률 기준으로 판단하는 성과형 브랜딩을 강조하는 스크립트입니다.',
    forceRefresh: true,
    scenes: [
      draft(
        '감 의존 훅',
        'hook',
        '브랜딩 아직도 감으로 하시나요?\n감이 아닌 매출 기반으로 하세요',
        {
          planningNotes: '검은 화면에 질문 카피를 먼저 띄운 뒤, 앤서가 화면을 찢고 나오듯 강하게 등장한다.',
          onScreenTexts: ['브랜딩 아직도 감으로 하시나요?', '감이 아닌 매출 기반으로 하세요'],
          gesture: '앤서가 강하게 등장해 카피를 밀어내듯 말한다.',
          cameraMovement: '블랙 화면 후 급격한 컷인.',
        }
      ),
      draft(
        '성과 중심 솔루션',
        'solution',
        '브랜드의 성과를 매출과 이익율로 판단해서\n매출 중심의 커머스 브랜딩 합니다!',
        {
          planningNotes: '오른손엔 매출, 왼손엔 이익율 텍스트를 올리고 마지막에 화면을 가리킨다.',
          onScreenTexts: ['매출', '이익율'],
          gesture: '오른손에 매출, 왼손에 이익율 텍스트를 올린 뒤 화면을 가리킨다.',
        }
      ),
      draft(
        '회사 증거',
        'proof',
        '저희는 오모가리, 카카오, 아이리버 등 큰 브랜드를 직접 유통 하고\n코카콜라, 3M, 정관장 같은 대기업 에이전시까지 해본\n유통과 브랜딩을 동시에 하는 회사입니다.'
      ),
      draft(
        '매출 연결 베네핏',
        'benefit',
        '유통을 직접 해본 사람이 하는 브랜딩은 다릅니다.\n어떻게 매출로 연결되는지 알고 있거든요.'
      ),
      draft('커머스 브랜딩 클로징', 'closing_copy', '매출을 올리는 브랜딩, 커머스 브랜딩.'),
      draft('문의 CTA', 'cta', '브랜드큐레이터에 문의하세요.'),
    ],
  },
  {
    projectTitle: '커머스 브랜딩 06 - 브랜드 격차',
    projectTheme:
      '이상적인 브랜드와 현재 브랜드 사이의 차이를 매출로 정의하고, 커머스 브랜딩을 그 해답으로 제시하는 스크립트입니다.',
    forceRefresh: true,
    scenes: [
      draft(
        '브랜드 질문 훅',
        'hook',
        '당신이 만들고 싶은 브랜드는 먼가요?',
        {
          planningNotes: '앤서가 차분하게 질문을 던지며 시작한다.',
          gesture: '정면을 보며 질문한다.',
        }
      ),
      draft(
        '브랜드 격차 진단',
        'problem',
        '저희는 생각합니다.\n당신이 가고자 하는 브랜드와 당신의 브랜드의 차이는 매출이라고',
        {
          planningNotes: '앤서가 설명하다가 매출이라는 단어가 커지며 화면을 덮어 앤서를 가린다.',
          onScreenTexts: ['매출'],
          gesture: '설명 톤으로 말하다가 마지막 단어를 강조한다.',
          cameraMovement: '매출 텍스트와 함께 느린 푸시인.',
        }
      ),
      draft(
        '매출 중심 포지셔닝',
        'positioning',
        '그래서\n저희는 매출을 만들어주는 브랜딩\n커머스 브랜딩을 합니다.',
        {
          planningNotes: '커머스 브랜딩 문구를 크게 강조하고, 앤서가 그 단어를 힘주어 말한다.',
          onScreenTexts: ['커머스 브랜딩'],
          gesture: '앤서가 핵심 문구를 손으로 짚으며 말한다.',
        }
      ),
      draft(
        '회사 증거',
        'proof',
        '오모가리, 카카오, 아이리버 등 큰 브랜드를 직접 유통 하고\n코카콜라, 3M, 정관장 같은 대기업 에이전시까지 해본\n유통과 브랜딩을 동시에 하는 회사입니다.'
      ),
      draft(
        '매출 연결 베네핏',
        'benefit',
        '유통을 직접 해본 사람이 하는 브랜딩은 다릅니다.\n어떻게 매출로 연결되는지 알고 있거든요.'
      ),
      draft('커머스 브랜딩 클로징', 'closing_copy', '매출을 올리는 브랜딩, 커머스 브랜딩.'),
      draft('문의 CTA', 'cta', '브랜드큐레이터에 문의하세요.'),
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
