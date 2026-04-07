import { useSceneStore } from '../../stores/sceneStore'
import { B_ROLL_SUBTYPES, CINEMATOGRAPHY_TAGS, SEGMENT_ROLES, HOOK_TYPES, RETENTION_DEVICES, getRoleColor } from '../../lib/taxonomy'
import type { Scene, SegmentRole, HookType, RetentionDevice, BRollSubtype, CinematographyTag } from '../../lib/types'

interface Props {
  scene: Scene
}

export function TaxonomyPanel({ scene }: Props) {
  const updateScene = useSceneStore(s => s.updateScene)
  const segmentRoles = Array.isArray(scene.segmentRoles)
    ? scene.segmentRoles
    : []
  const hookTypes = Array.isArray(scene.hookTypes)
    ? scene.hookTypes
    : []
  const bRollSubtypes = Array.isArray(scene.bRollSubtypes)
    ? scene.bRollSubtypes
    : []
  const cinematographyTags = Array.isArray(scene.cinematographyTags)
    ? scene.cinematographyTags
    : []

  const toggleRole = (role: SegmentRole) => {
    const next = segmentRoles.includes(role)
      ? segmentRoles.filter(value => value !== role)
      : [...segmentRoles, role]

    updateScene(scene.id, {
      segmentRoles: next,
      hookTypes: next.includes('hook') ? hookTypes : [],
    })
  }

  const toggleHookType = (hookType: HookType) => {
    const next = hookTypes.includes(hookType)
      ? hookTypes.filter(value => value !== hookType)
      : [...hookTypes, hookType]
    updateScene(scene.id, { hookTypes: next })
  }

  const toggleDevice = (device: RetentionDevice) => {
    const next = scene.retentionDevices.includes(device)
      ? scene.retentionDevices.filter(d => d !== device)
      : [...scene.retentionDevices, device]
    updateScene(scene.id, {
      retentionEnabled: true,
      retentionDevices: next,
      bRollSubtypes: next.includes('b_roll') ? bRollSubtypes : [],
    })
  }

  const toggleBRollSubtype = (bRollSubtype: BRollSubtype) => {
    const next = bRollSubtypes.includes(bRollSubtype)
      ? bRollSubtypes.filter(value => value !== bRollSubtype)
      : [...bRollSubtypes, bRollSubtype]
    updateScene(scene.id, { bRollSubtypes: next })
  }

  const toggleCinematographyTag = (tag: CinematographyTag) => {
    const next = cinematographyTags.includes(tag)
      ? cinematographyTags.filter(value => value !== tag)
      : [...cinematographyTags, tag]
    updateScene(scene.id, { cinematographyTags: next })
  }

  const toggleRetention = () => {
    const next = !scene.retentionEnabled
    updateScene(scene.id, {
      retentionEnabled: next,
      retentionDevices: next ? scene.retentionDevices : [],
      bRollSubtypes: next ? bRollSubtypes : [],
    })
  }

  const activeDeviceCount = scene.retentionDevices.length
  const hasBRoll = scene.retentionEnabled && scene.retentionDevices.includes('b_roll')

  return (
    <div className="taxonomy-panel" data-export-hide="true">
      {/* Segment Role — 항상 표시 */}
      <div className="taxonomy-section">
        <div className="taxonomy-label">SEGMENT ROLE</div>
        <div className="taxonomy-role-pills">
          {SEGMENT_ROLES.map(r => (
            <button
              key={r.value}
              className={`role-pill${segmentRoles.includes(r.value) ? ' active' : ''}`}
              style={segmentRoles.includes(r.value) ? { background: r.color, borderColor: r.color } : { '--role-color': r.color } as React.CSSProperties}
              onClick={() => toggleRole(r.value)}
              title={r.value}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hook Type — role=hook일 때만 */}
      {segmentRoles.includes('hook') && (
        <div className="taxonomy-section">
          <div className="taxonomy-label">HOOK TYPE</div>
          <div className="taxonomy-role-pills">
            {HOOK_TYPES.map(h => (
              <button
                key={h.value}
                className={`role-pill role-pill--sub${hookTypes.includes(h.value) ? ' active' : ''}`}
                style={hookTypes.includes(h.value) ? { background: getRoleColor('hook'), borderColor: getRoleColor('hook') } : {}}
                onClick={() => toggleHookType(h.value)}
                title={h.description}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="taxonomy-section">
        <button
          className={`taxonomy-retention-toggle${scene.retentionEnabled ? ' active' : ''}`}
          onClick={toggleRetention}
        >
          <span className="taxonomy-label" style={{ margin: 0 }}>RETENTION</span>
          {activeDeviceCount > 0 && (
            <span className="taxonomy-retention-count">{activeDeviceCount}</span>
          )}
        </button>

        {scene.retentionEnabled && (
          <>
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

            {hasBRoll && (
              <div className="taxonomy-section taxonomy-section--nested">
                <div className="taxonomy-label">B-ROLL TYPE</div>
                <div className="taxonomy-role-pills">
                  {B_ROLL_SUBTYPES.map(subtype => (
                    <button
                      key={subtype.value}
                      className={`role-pill role-pill--sub${bRollSubtypes.includes(subtype.value) ? ' active' : ''}`}
                      style={bRollSubtypes.includes(subtype.value) ? { background: getRoleColor('retain'), borderColor: getRoleColor('retain') } : {}}
                      onClick={() => toggleBRollSubtype(subtype.value)}
                    >
                      {subtype.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="taxonomy-section">
        <div className="taxonomy-label">CINEMATOGRAPHY</div>
        <div className="taxonomy-role-pills">
          {CINEMATOGRAPHY_TAGS.map(tag => (
            <button
              key={tag.value}
              className={`role-pill role-pill--sub${cinematographyTags.includes(tag.value) ? ' active' : ''}`}
              style={cinematographyTags.includes(tag.value) ? { background: getRoleColor('retain'), borderColor: getRoleColor('retain') } : {}}
              onClick={() => toggleCinematographyTag(tag.value)}
              title={tag.description}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
