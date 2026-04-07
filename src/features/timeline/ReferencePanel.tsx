import { useEffect, useMemo, useRef, useState } from 'react'
import { Link as LinkIcon } from '../../components/Icons'
import {
  deleteReferenceAsset,
  getReferenceAsset,
  saveReferenceAsset,
} from '../../lib/referenceAssets'
import { inferReferenceType } from '../../lib/sanitize'
import type { Reference, Scene } from '../../lib/types'
import { useSceneStore } from '../../stores/sceneStore'

interface Props { scene: Scene }

let activePasteSceneId: string | null = null

function getReferenceMeta(reference: Reference) {
  if (reference.source === 'local') {
    return reference.filename ?? '로컬 이미지'
  }

  try {
    return new URL(reference.url).hostname
  } catch {
    return reference.url
  }
}

function useLocalAssetUrl(reference: Reference) {
  const [assetUrl, setAssetUrl] = useState<string | null>(null)

  useEffect(() => {
    if (reference.source !== 'local' || !reference.assetId) {
      setAssetUrl(null)
      return
    }

    let disposed = false
    let objectUrl: string | null = null

    getReferenceAsset(reference.assetId)
      .then(asset => {
        if (disposed || !asset) return
        objectUrl = URL.createObjectURL(asset.blob)
        setAssetUrl(objectUrl)
      })
      .catch(() => {
        if (!disposed) setAssetUrl(null)
      })

    return () => {
      disposed = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [reference.assetId, reference.source])

  return assetUrl
}

function ImageReferenceCard({ sceneId, reference }: { sceneId: string; reference: Reference }) {
  const deleteReference = useSceneStore(s => s.deleteReference)
  const scenes = useSceneStore(s => s.scenes)
  const localAssetUrl = useLocalAssetUrl(reference)
  const [showPreview, setShowPreview] = useState(reference.source === 'local')
  const [previewFailed, setPreviewFailed] = useState(false)

  const previewUrl = reference.source === 'local'
    ? localAssetUrl
    : showPreview && !previewFailed
      ? reference.url
      : null

  const handleDelete = async () => {
    if (reference.source === 'local' && reference.assetId) {
      const usageCount = scenes.reduce((count, scene) => {
        return count + scene.references.filter(item => item.assetId === reference.assetId).length
      }, 0)

      if (usageCount <= 1) {
        try {
          await deleteReferenceAsset(reference.assetId)
        } catch {
          // Keep UI responsive even if asset cleanup fails.
        }
      }
    }

    deleteReference(sceneId, reference.id)
  }

  return (
    <div className="reference-image-card">
      <button
        type="button"
        className="reference-image-card__delete"
        onClick={handleDelete}
      >
        ×
      </button>

      {previewUrl ? (
        <img
          src={previewUrl}
          alt={reference.caption || 'Reference image'}
          className="reference-image-card__img"
          loading="lazy"
          decoding="async"
          crossOrigin={reference.source === 'remote' ? 'anonymous' : undefined}
          referrerPolicy={reference.source === 'remote' ? 'no-referrer' : undefined}
          onError={() => setPreviewFailed(true)}
        />
      ) : (
        <button
          type="button"
          className="reference-image-card__placeholder"
          onClick={() => {
            setPreviewFailed(false)
            setShowPreview(true)
          }}
        >
          {reference.source === 'local'
            ? '이미지 불러오는 중'
            : previewFailed
              ? '다시 시도'
              : '미리보기'}
        </button>
      )}

      <div className="reference-image-card__meta">
        <div className="reference-caption">{reference.caption || getReferenceMeta(reference)}</div>
        <div className="reference-image-card__sub">{getReferenceMeta(reference)}</div>
      </div>
    </div>
  )
}

function LinkReferenceItem({ sceneId, reference }: { sceneId: string; reference: Reference }) {
  const deleteReference = useSceneStore(s => s.deleteReference)

  return (
    <div className="reference-item">
      <div
        className="reference-thumb"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
      >
        <LinkIcon size={20} />
      </div>

      <div className="reference-info">
        <div className="reference-caption">{reference.caption || '(no caption)'}</div>
        <a
          className="reference-url"
          href={reference.url}
          target="_blank"
          rel="noreferrer noopener"
          title={reference.url}
        >
          {reference.url}
        </a>
      </div>

      <button
        type="button"
        className="reference-delete"
        onClick={() => deleteReference(sceneId, reference.id)}
      >
        ×
      </button>
    </div>
  )
}

export function ReferencePanel({ scene }: Props) {
  const addReference = useSceneStore(s => s.addReference)
  const addLocalReference = useSceneStore(s => s.addLocalReference)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [expanded, setExpanded] = useState(true)
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocusedWithin, setIsFocusedWithin] = useState(false)

  const imageReferences = useMemo(
    () => scene.references.filter(reference => reference.type === 'image'),
    [scene.references]
  )
  const linkReferences = useMemo(
    () => scene.references.filter(reference => reference.type === 'link'),
    [scene.references]
  )
  const pasteEnabled = expanded && (isHovered || isFocusedWithin)

  const claimPasteTarget = () => {
    activePasteSceneId = scene.id
  }

  const releasePasteTarget = (nextHovered: boolean, nextFocusedWithin: boolean) => {
    if (!nextHovered && !nextFocusedWithin && activePasteSceneId === scene.id) {
      activePasteSceneId = null
    }
  }

  const addUrlReference = (rawUrl: string, nextCaption = '') => {
    const trimmedUrl = rawUrl.trim()

    if (!trimmedUrl) {
      setError('http:// 또는 https:// 주소를 입력해주세요.')
      return false
    }

    const didAdd = addReference(scene.id, {
      type: inferReferenceType(trimmedUrl),
      source: 'remote',
      url: trimmedUrl,
      assetId: null,
      caption: nextCaption.trim(),
      filename: null,
    })

    if (!didAdd) {
      setError('http:// 또는 https:// 주소만 추가할 수 있습니다.')
      return false
    }

    setError('')
    return true
  }

  const handleAdd = () => {
    const didAdd = addUrlReference(url, caption)
    if (!didAdd) return

    setUrl('')
    setCaption('')
    setShowForm(false)
  }

  const handleFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))

    if (imageFiles.length === 0) {
      setError('이미지 파일만 끌어올 수 있습니다.')
      return
    }

    setUploading(true)
    setError('')

    try {
      for (const file of imageFiles) {
        const { assetId, filename } = await saveReferenceAsset(file)
        const baseCaption = filename.replace(/\.[^.]+$/, '')
        const didAdd = addLocalReference(scene.id, {
          assetId,
          caption: baseCaption,
          filename,
        })

        if (!didAdd) {
          await deleteReferenceAsset(assetId).catch(() => undefined)
        }
      }
    } catch {
      setError('이미지를 붙이는 중 문제가 생겼습니다.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    if (!pasteEnabled) return

    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false
      return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))
    }

    const getClipboardImageFiles = (clipboard: DataTransfer | null) => {
      if (!clipboard) return []

      const fileList = Array.from(clipboard.files).filter(file => file.type.startsWith('image/'))
      if (fileList.length > 0) return fileList

      return Array.from(clipboard.items)
        .filter(item => item.kind === 'file' && item.type.startsWith('image/'))
        .map(item => item.getAsFile())
        .filter((file): file is File => file !== null)
    }

    const handlePaste = (event: ClipboardEvent) => {
      if (activePasteSceneId !== scene.id) return
      if (isEditableTarget(event.target)) return

      const clipboard = event.clipboardData
      if (!clipboard) return

      const imageFiles = getClipboardImageFiles(clipboard)
      if (imageFiles.length > 0) {
        event.preventDefault()
        void handleFiles(imageFiles)
        return
      }

      const pastedText = clipboard.getData('text/plain').trim()
      if (!pastedText) return

      const didAdd = addUrlReference(pastedText)
      if (!didAdd) return

      event.preventDefault()
      setShowForm(false)
      setUrl('')
      setCaption('')
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [pasteEnabled, scene.id])

  useEffect(() => {
    if (scene.references.length > 0 || showForm || uploading) {
      setExpanded(true)
    }
  }, [scene.references.length, showForm, uploading])

  useEffect(() => {
    return () => {
      if (activePasteSceneId === scene.id) {
        activePasteSceneId = null
      }
    }
  }, [scene.id])

  return (
    <div className="reference-section">
      <button
        type="button"
        className={`reference-section__toggle${expanded ? ' active' : ''}`}
        onClick={() => setExpanded(value => !value)}
      >
        <span className="section-label">References</span>
        <span className="reference-section__meta">{scene.references.length} items</span>
        <span className="reference-section__arrow">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div
          className="reference-section__body"
          onMouseEnter={() => {
            setIsHovered(true)
            claimPasteTarget()
          }}
          onMouseLeave={() => {
            setIsHovered(false)
            releasePasteTarget(false, isFocusedWithin)
          }}
          onFocusCapture={() => {
            setIsFocusedWithin(true)
            claimPasteTarget()
          }}
          onBlurCapture={event => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setIsFocusedWithin(false)
              releasePasteTarget(isHovered, false)
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={e => {
              if (e.target.files?.length) void handleFiles(e.target.files)
            }}
          />

          {showForm ? (
            <div className="reference-add-form">
              <input
                className="ref-input"
                placeholder="URL (이미지 또는 링크)"
                value={url}
                maxLength={2048}
                onChange={e => {
                  setUrl(e.target.value)
                  setError('')
                }}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
              />
              <input
                className="ref-input"
                placeholder="설명 (선택)"
                value={caption}
                maxLength={200}
                onChange={e => setCaption(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
              />
              {error && <div className="ref-error">{error}</div>}
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" className="ref-add-btn" onClick={handleAdd}>링크 추가</button>
                <button
                  type="button"
                  style={{ fontSize: 12, color: 'var(--text-muted)', padding: '5px 8px' }}
                  onClick={() => {
                    setShowForm(false)
                    setError('')
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="checklist-add"
              onClick={() => {
                setShowForm(true)
                setError('')
              }}
            >
              + 링크 레퍼런스 추가
            </button>
          )}

          {!showForm && error && <div className="ref-error">{error}</div>}

          <button
            type="button"
            className={`reference-dropzone${dragActive ? ' active' : ''}`}
            aria-label="이미지 레퍼런스 붙이기"
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={e => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragOver={e => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={e => {
              e.preventDefault()
              if (e.currentTarget === e.target) setDragActive(false)
            }}
            onDrop={e => {
              e.preventDefault()
              setDragActive(false)
              if (e.dataTransfer.files?.length) void handleFiles(e.dataTransfer.files)
            }}
          >
            {uploading && <div className="reference-dropzone__status">이미지 붙이는 중...</div>}
          </button>

          {imageReferences.length > 0 && (
            <div className="reference-board">
              {imageReferences.map(reference => (
                <ImageReferenceCard key={reference.id} sceneId={scene.id} reference={reference} />
              ))}
            </div>
          )}

          {linkReferences.map(reference => (
            <LinkReferenceItem key={reference.id} sceneId={scene.id} reference={reference} />
          ))}
        </div>
      )}
    </div>
  )
}
