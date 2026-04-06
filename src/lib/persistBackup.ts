interface PersistBackupEnvelope {
  savedAt: string
  value: unknown
}

function getLocalStorageSafe() {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function parseEnvelope(value: string | null): PersistBackupEnvelope | null {
  if (!value) return null

  try {
    const parsed = JSON.parse(value) as PersistBackupEnvelope
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

export function backupPersistedValue(backupKey: string, value: unknown) {
  const storage = getLocalStorageSafe()
  if (!storage) return

  try {
    const nextSerialized = JSON.stringify(value)
    const latestKey = `${backupKey}:latest`
    const previousKey = `${backupKey}:previous`
    const latestEnvelope = parseEnvelope(storage.getItem(latestKey))

    if (latestEnvelope) {
      const latestSerialized = JSON.stringify(latestEnvelope.value)
      if (latestSerialized === nextSerialized) return
      storage.setItem(previousKey, JSON.stringify(latestEnvelope))
    }

    storage.setItem(
      latestKey,
      JSON.stringify({
        savedAt: new Date().toISOString(),
        value,
      } satisfies PersistBackupEnvelope)
    )
  } catch {
    // Ignore backup errors so persistence still works.
  }
}
