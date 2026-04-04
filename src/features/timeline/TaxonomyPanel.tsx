import { useSceneStore } from '../../stores/sceneStore'
import { SEGMENT_ROLES, HOOK_TYPES, RETENTION_DEVICES, getRoleColor } from '../../lib/taxonomy'
import type { Scene, SegmentRole, HookType, RetentionDevice } from '../../lib/types'

interface Props {
  scene: Scene
}

export function TaxonomyPanel({ scene }: Props) {
  const updateScene = useSceneStore(s => s.updateScene)

  const setRole = (role: SegmentRole | null) => {
    updateScene(scene.id, {
      segmentRole: role,
      hookType: role !== 'hook' ? null : scene.hookType,
    })
  }

  const setHookType = (hookType: HookType | null) => {
    updateScene(scene.id, { hookType })
  }

  const toggleDevice = (device: RetentionDevice) => {
    const current = scene.retentionDevices
    const next = current.includes(device)
      ? current.filter(d => d !== device)
      : [...current, device]
    updateScene(scene.id, { retentionDevices: next })
  }

  return (
    <div className="taxonomy-panel">
      {/* Segment Role */}
      <div className="taxonomy-section">
        <div className="taxonomy-label">SEGMENT ROLE</div>
        <div className="taxonomy-role-pills">
          {SEGMENT_ROLES.map(r => (
            <button
              key={r.value}
              className={`role-pill${scene.segmentRole === r.value ? ' active' : ''}`}
              style={scene.segmentRole === r.value ? { background: r.color, borderColor: r.color } : { '--role-color': r.color } as React.CSSProperties}
              onClick={() => setRole(scene.segmentRole === r.value ? null : r.value)}
              title={r.value}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hook Type — role=hook일 때만 */}
      {scene.segmentRole === 'hook' && (
        <div className="taxonomy-section">
          <div className="taxonomy-label">HOOK TYPE</div>
          <div className="taxonomy-role-pills">
            {HOOK_TYPES.map(h => (
              <button
                key={h.value}
                className={`role-pill role-pill--sub${scene.hookType === h.value ? ' active' : ''}`}
                style={scene.hookType === h.value ? { background: getRoleColor('hook'), borderColor: getRoleColor('hook') } : {}}
                onClick={() => setHookType(scene.hookType === h.value ? null : h.value)}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Retention Devices */}
      <div className="taxonomy-section">
        <div className="taxonomy-label">RETENTION</div>
        <div className="taxonomy-devices">
          {RETENTION_DEVICES.map(d => {
            const active = scene.retentionDevices.includes(d.value)
            return (
              <button
                key={d.value}
                className={`device-chip${active ? ' active' : ''}`}
                onClick={() => toggleDevice(d.value)}
                title={d.description}
              >
                {d.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
