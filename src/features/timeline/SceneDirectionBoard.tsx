import { useEffect, useRef } from 'react'
import { useSceneStore } from '../../stores/sceneStore'
import type { Scene } from '../../lib/types'

interface Props { scene: Scene }

interface DirectionFieldProps {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}

function DirectionField({ label, value, placeholder, onChange }: DirectionFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <label className="direction-card">
      <span className="direction-card__label">{label}</span>
      <textarea
        ref={ref}
        className="direction-card__textarea"
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        rows={2}
      />
    </label>
  )
}

export function SceneDirectionBoard({ scene }: Props) {
  const updateScene = useSceneStore(s => s.updateScene)

  return (
    <div className="direction-board-section">
      <div className="section-label">연출 보드</div>
      <div className="direction-board">
        <DirectionField
          label="장소 / 세팅"
          value={scene.location}
          placeholder="예: 회의실 창가, 사무실 복도, 카페 테이블"
          onChange={value => updateScene(scene.id, { location: value })}
        />
        <DirectionField
          label="행동 / 제스처"
          value={scene.gesture}
          placeholder="예: 손가락으로 비교, 노트북을 펼치며 설명, 고개를 끄덕임"
          onChange={value => updateScene(scene.id, { gesture: value })}
        />
        <DirectionField
          label="블로킹"
          value={scene.blocking}
          placeholder="예: 문 쪽에서 들어와 의자 옆에 멈춤, 책상 앞으로 이동"
          onChange={value => updateScene(scene.id, { blocking: value })}
        />
        <DirectionField
          label="카메라 무빙"
          value={scene.cameraMovement}
          placeholder="예: 고정, 슬로우 푸시인, 좌측 패닝, 핸드헬드 팔로우"
          onChange={value => updateScene(scene.id, { cameraMovement: value })}
        />
        <DirectionField
          label="소품 / 디테일"
          value={scene.propsNotes}
          placeholder="예: 노트북, 커피잔, 패키지 샘플, 차트 출력물"
          onChange={value => updateScene(scene.id, { propsNotes: value })}
        />
      </div>
      <div className="direction-board__helper">
        다른 사람에게 씬 연출을 넘길 때 필요한 장소, 동선, 행동, 촬영 디테일을 고정 슬롯으로 정리합니다.
      </div>
    </div>
  )
}
