import { calculateAutoDuration, formatDuration } from './duration'
import { getBRollSubtypeLabel, getDeviceLabel, getHookTypeLabel, getRoleLabel } from './taxonomy'
import { getReferenceAsset } from './referenceAssets'
import type { Project, Reference, Scene } from './types'

interface PreparedImageReference {
  id: string
  caption: string
  meta: string
  src: string | null
  isRemote: boolean
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatMultiline(value: string) {
  return escapeHtml(value).replace(/\n/g, '<br />')
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

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

async function resolveImageReference(reference: Reference): Promise<PreparedImageReference | null> {
  if (reference.type !== 'image') return null

  if (reference.source === 'local' && reference.assetId) {
    try {
      const asset = await getReferenceAsset(reference.assetId)
      if (!asset) {
        return {
          id: reference.id,
          caption: reference.caption || getReferenceMeta(reference),
          meta: getReferenceMeta(reference),
          src: null,
          isRemote: false,
        }
      }

      return {
        id: reference.id,
        caption: reference.caption || getReferenceMeta(reference),
        meta: getReferenceMeta(reference),
        src: await blobToDataUrl(asset.blob),
        isRemote: false,
      }
    } catch {
      return {
        id: reference.id,
        caption: reference.caption || getReferenceMeta(reference),
        meta: getReferenceMeta(reference),
        src: null,
        isRemote: false,
      }
    }
  }

  return {
    id: reference.id,
    caption: reference.caption || getReferenceMeta(reference),
    meta: getReferenceMeta(reference),
    src: reference.url,
    isRemote: true,
  }
}

function renderInfoList(title: string, items: string[]) {
  if (items.length === 0) return ''

  return `
    <section class="export-section">
      <div class="export-label">${escapeHtml(title)}</div>
      <div class="export-chip-row">
        ${items.map(item => `<span class="export-chip">${escapeHtml(item)}</span>`).join('')}
      </div>
    </section>
  `
}

function buildPrintHtml(
  project: Project,
  scenes: Scene[],
  preparedImages: Map<string, PreparedImageReference[]>
) {
  const totalSeconds = scenes.reduce(
    (sum, scene) => sum + calculateAutoDuration(scene.narration) + scene.durationManual,
    0
  )

  const generatedAt = new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date())

  const sceneMarkup = scenes.map((scene, index) => {
    const totalSceneSeconds = calculateAutoDuration(scene.narration) + scene.durationManual
    const roleLabels = scene.segmentRoles.map(getRoleLabel)
    const hookTypeLabels = scene.hookTypes.map(getHookTypeLabel)
    const retentionLabels = scene.retentionEnabled
      ? scene.retentionDevices.map(getDeviceLabel)
      : []
    const bRollSubtypeLabels = scene.bRollSubtypes.map(getBRollSubtypeLabel)
    const onScreenTexts = scene.onScreenTexts
      .map(item => item.text.trim())
      .filter(Boolean)
    const linkReferences = scene.references.filter(reference => reference.type === 'link')
    const imageReferences = preparedImages.get(scene.id) ?? []

    return `
      <article class="scene-sheet">
        <div class="scene-sheet__meta">
          <div class="scene-sheet__number">SCENE ${index + 1}</div>
          <div class="scene-sheet__duration">${escapeHtml(formatDuration(totalSceneSeconds))}</div>
        </div>
        <h2 class="scene-sheet__title">${escapeHtml(scene.title)}</h2>

        ${renderInfoList('세그먼트 롤', roleLabels)}
        ${renderInfoList('훅 타입', hookTypeLabels)}
        ${renderInfoList('리텐션', retentionLabels)}
        ${renderInfoList('B-ROLL TYPE', bRollSubtypeLabels)}

        <section class="export-section">
          <div class="export-label">내레이션</div>
          <div class="export-copy">${formatMultiline(scene.narration || '작성 내용 없음')}</div>
        </section>

        ${
          scene.planningNotes.trim()
            ? `
              <section class="export-section">
                <div class="export-label">기획 메모</div>
                <div class="export-copy export-copy--notes">${formatMultiline(scene.planningNotes)}</div>
              </section>
            `
            : ''
        }

        ${
          onScreenTexts.length > 0
            ? `
              <section class="export-section">
                <div class="export-label">온스크린 텍스트</div>
                <ul class="export-list">
                  ${onScreenTexts.map(text => `<li>${escapeHtml(text)}</li>`).join('')}
                </ul>
              </section>
            `
            : ''
        }

        ${
          imageReferences.length > 0
            ? `
              <section class="export-section">
                <div class="export-label">이미지 레퍼런스</div>
                <div class="export-image-grid">
                  ${imageReferences.map(reference => `
                    <figure class="export-image-card">
                      ${
                        reference.src
                          ? `<img class="export-image-card__img" src="${escapeHtml(reference.src)}" alt="${escapeHtml(reference.caption)}" ${reference.isRemote ? 'referrerpolicy="no-referrer"' : ''} />`
                          : `<div class="export-image-card__fallback">미리보기를 불러오지 못했습니다</div>`
                      }
                      <figcaption class="export-image-card__caption">
                        <strong>${escapeHtml(reference.caption)}</strong>
                        <span>${escapeHtml(reference.meta)}</span>
                      </figcaption>
                    </figure>
                  `).join('')}
                </div>
              </section>
            `
            : ''
        }

        ${
          linkReferences.length > 0
            ? `
              <section class="export-section">
                <div class="export-label">링크 레퍼런스</div>
                <ul class="export-list export-list--links">
                  ${linkReferences.map(reference => `
                    <li>
                      <strong>${escapeHtml(reference.caption || getReferenceMeta(reference))}</strong>
                      <span>${escapeHtml(reference.url)}</span>
                    </li>
                  `).join('')}
                </ul>
              </section>
            `
            : ''
        }
      </article>
    `
  }).join('')

  return `<!doctype html>
  <html lang="ko">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(project.title)} - PDF Export</title>
      <style>
        :root {
          color-scheme: light;
          --paper: #ffffff;
          --ink: #1f1f1b;
          --muted: #726d66;
          --line: #dfd9d1;
          --accent: #e85d2c;
          --chip: #f5efe8;
          --section: #fbf8f4;
        }

        * { box-sizing: border-box; }

        body {
          margin: 0;
          color: var(--ink);
          background: #efe9e2;
          font-family: "Malgun Gothic", "Apple SD Gothic Neo", sans-serif;
        }

        .export-doc {
          max-width: 1120px;
          margin: 0 auto;
          padding: 32px 24px 48px;
        }

        .export-header {
          background: linear-gradient(135deg, #fff7ef, #ffffff);
          border: 1px solid var(--line);
          padding: 28px 30px;
          margin-bottom: 24px;
        }

        .export-kicker {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: var(--accent);
          text-transform: uppercase;
        }

        .export-title {
          margin: 10px 0 8px;
          font-size: 34px;
          line-height: 1.1;
        }

        .export-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          color: var(--muted);
          font-size: 13px;
        }

        .scene-sheet {
          background: var(--paper);
          border: 1px solid var(--line);
          padding: 24px;
          margin-bottom: 18px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .scene-sheet__meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .scene-sheet__title {
          margin: 10px 0 20px;
          font-size: 24px;
          line-height: 1.2;
        }

        .export-section {
          margin-top: 16px;
          padding: 14px 16px;
          background: var(--section);
          border: 1px solid #ebe4dc;
        }

        .export-label {
          margin-bottom: 10px;
          font-size: 11px;
          font-weight: 700;
          color: var(--muted);
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .export-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .export-chip {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 10px;
          background: var(--chip);
          border: 1px solid #ead8c9;
          font-size: 12px;
          font-weight: 600;
        }

        .export-copy {
          white-space: normal;
          line-height: 1.72;
          font-size: 14px;
        }

        .export-copy--notes {
          color: #403a33;
        }

        .export-list {
          margin: 0;
          padding-left: 18px;
          display: grid;
          gap: 8px;
          font-size: 13px;
          line-height: 1.6;
        }

        .export-list--links li {
          list-style: disc;
        }

        .export-list--links strong,
        .export-list--links span {
          display: block;
        }

        .export-list--links span {
          color: var(--muted);
          word-break: break-all;
        }

        .export-image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }

        .export-image-card {
          margin: 0;
          border: 1px solid #e7dfd6;
          background: #fff;
        }

        .export-image-card__img,
        .export-image-card__fallback {
          width: 100%;
          aspect-ratio: 4 / 3;
          display: block;
          background: #f1ece6;
        }

        .export-image-card__img {
          object-fit: cover;
        }

        .export-image-card__fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          text-align: center;
          color: var(--muted);
          font-size: 12px;
        }

        .export-image-card__caption {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px 12px 12px;
          font-size: 12px;
          line-height: 1.5;
        }

        .export-image-card__caption span {
          color: var(--muted);
        }

        @page {
          size: A4;
          margin: 12mm;
        }

        @media print {
          body {
            background: #fff;
          }

          .export-doc {
            max-width: none;
            padding: 0;
          }

          .export-header {
            break-after: avoid;
          }
        }
      </style>
    </head>
    <body>
      <main class="export-doc">
        <header class="export-header">
          <div class="export-kicker">RCScript PDF</div>
          <h1 class="export-title">${escapeHtml(project.title)}</h1>
          <div class="export-summary">
            <span>총 ${scenes.length}개 씬</span>
            <span>${escapeHtml(formatDuration(totalSeconds))}</span>
            <span>${escapeHtml(generatedAt)} 생성</span>
          </div>
        </header>
        ${sceneMarkup}
      </main>
      <script>
        window.addEventListener('load', () => {
          const imagePromises = Array.from(document.images).map(image => {
            if (image.complete) return Promise.resolve()
            return new Promise(resolve => {
              image.addEventListener('load', resolve, { once: true })
              image.addEventListener('error', resolve, { once: true })
            })
          })

          Promise.race([
            Promise.all(imagePromises),
            new Promise(resolve => setTimeout(resolve, 1500)),
          ]).then(() => {
            setTimeout(() => window.print(), 150)
          })
        })
      </script>
    </body>
  </html>`
}

export async function exportProjectToPdf(project: Project, scenes: Scene[]) {
  const printWindow = window.open('', '_blank')

  if (!printWindow) {
    throw new Error('팝업 차단으로 인쇄 창을 열 수 없습니다.')
  }

  printWindow.document.open()
  printWindow.document.write(`<!doctype html>
    <html lang="ko">
      <head>
        <meta charset="utf-8" />
        <title>PDF 준비 중</title>
        <style>
          body {
            margin: 0;
            display: grid;
            place-items: center;
            min-height: 100vh;
            background: #f7f2eb;
            color: #1f1f1b;
            font-family: "Malgun Gothic", "Apple SD Gothic Neo", sans-serif;
          }

          .loading {
            padding: 24px 28px;
            border: 1px solid #e2d9cf;
            background: #fff;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="loading">PDF 문서를 준비하는 중입니다...</div>
      </body>
    </html>`)
  printWindow.document.close()

  const preparedEntries = await Promise.all(
    scenes.map(async scene => [
      scene.id,
      (
        await Promise.all(scene.references.map(reference => resolveImageReference(reference)))
      ).filter((item): item is PreparedImageReference => item !== null),
    ] as const)
  )

  const preparedImages = new Map(preparedEntries)
  const printHtml = buildPrintHtml(project, scenes, preparedImages)

  printWindow.document.open()
  printWindow.document.write(printHtml)
  printWindow.document.close()
  printWindow.focus()
}
