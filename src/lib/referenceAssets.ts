const DB_NAME = 'rcscript-reference-assets'
const STORE_NAME = 'assets'
const DB_VERSION = 1

interface StoredReferenceAsset {
  id: string
  blob: Blob
  name: string
  type: string
  createdAt: string
}

function generateAssetId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  handler: (store: IDBObjectStore, resolve: (value: T) => void, reject: (reason?: unknown) => void) => void
) {
  return openDatabase().then(
    db =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode)
        const store = transaction.objectStore(STORE_NAME)

        transaction.oncomplete = () => db.close()
        transaction.onerror = () => reject(transaction.error)
        transaction.onabort = () => reject(transaction.error)

        handler(store, resolve, reject)
      })
  )
}

export function saveReferenceAsset(file: File) {
  const assetId = generateAssetId()
  const record: StoredReferenceAsset = {
    id: assetId,
    blob: file,
    name: file.name,
    type: file.type,
    createdAt: new Date().toISOString(),
  }

  return runTransaction<void>('readwrite', (store, resolve, reject) => {
    const request = store.put(record)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  }).then(() => ({
    assetId,
    filename: file.name,
  }))
}

export function getReferenceAsset(assetId: string) {
  return runTransaction<StoredReferenceAsset | null>('readonly', (store, resolve, reject) => {
    const request = store.get(assetId)
    request.onsuccess = () => resolve((request.result as StoredReferenceAsset | undefined) ?? null)
    request.onerror = () => reject(request.error)
  })
}

export function deleteReferenceAsset(assetId: string) {
  return runTransaction<void>('readwrite', (store, resolve, reject) => {
    const request = store.delete(assetId)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
