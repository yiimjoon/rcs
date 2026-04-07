function sanitizeFilename(value: string) {
  const normalized = value.trim().replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
  return normalized.length > 0 ? normalized : 'project'
}

interface SliceRange {
  startX: number
  endX: number
}

interface SceneBound {
  left: number
  right: number
}

function createSliceCanvas(canvas: HTMLCanvasElement, range: SliceRange) {
  const sliceWidth = Math.max(1, Math.round(range.endX - range.startX))
  const sliceCanvas = document.createElement('canvas')
  sliceCanvas.width = sliceWidth
  sliceCanvas.height = canvas.height

  const context = sliceCanvas.getContext('2d')
  if (!context) return null

  context.drawImage(
    canvas,
    range.startX,
    0,
    sliceWidth,
    canvas.height,
    0,
    0,
    sliceWidth,
    canvas.height
  )

  return sliceCanvas
}

function buildSceneAlignedSliceRanges(
  canvasWidth: number,
  maxSliceWidth: number,
  sceneBounds: SceneBound[]
) {
  if (sceneBounds.length === 0) {
    return [{ startX: 0, endX: canvasWidth }]
  }

  const ranges: SliceRange[] = []
  let startSceneIndex = 0

  while (startSceneIndex < sceneBounds.length) {
    const startX = startSceneIndex === 0 ? 0 : sceneBounds[startSceneIndex].left
    let endX = sceneBounds[startSceneIndex].right
    let endSceneIndex = startSceneIndex

    for (let index = startSceneIndex + 1; index < sceneBounds.length; index += 1) {
      const candidateEndX = sceneBounds[index].right
      if (candidateEndX - startX > maxSliceWidth) break
      endX = candidateEndX
      endSceneIndex = index
    }

    ranges.push({
      startX: Math.max(0, Math.round(startX)),
      endX: Math.min(canvasWidth, Math.round(endX)),
    })

    startSceneIndex = endSceneIndex + 1
  }

  return ranges
}

function isScrollableElement(element: HTMLElement) {
  const overflowY = window.getComputedStyle(element).overflowY
  return (overflowY === 'auto' || overflowY === 'scroll') && element.scrollHeight > element.clientHeight + 1
}

export async function exportProjectToPdf(projectTitle: string) {
  const exportRoot = document.querySelector<HTMLElement>('[data-export-root="true"]')
  if (!exportRoot) {
    throw new Error('캡처할 화면을 찾지 못했습니다.')
  }

  const appBody = exportRoot.querySelector<HTMLElement>('.app-body')
  const timelineWrap = exportRoot.querySelector<HTMLElement>('.timeline-wrap')
  const timeline = exportRoot.querySelector<HTMLElement>('.timeline')
  const fixedSidebar = exportRoot.querySelector<HTMLElement>('.fixed-sidebar')
  const toolbar = exportRoot.querySelector<HTMLElement>('.toolbar')
  const projectBrief = exportRoot.querySelector<HTMLElement>('.project-brief')
  const sceneColumns = Array.from(
    exportRoot.querySelectorAll<HTMLElement>('.scene-col[data-export-key]')
  )
  const sceneHeights = new Map(
    sceneColumns.map(column => [column.dataset.exportKey ?? '', column.scrollHeight])
  )
  const maxSceneHeight = sceneColumns.reduce(
    (maxHeight, column) => Math.max(maxHeight, column.scrollHeight),
    appBody?.clientHeight ?? 0
  )
  const timelineWidth = Math.max(
    timeline?.scrollWidth ?? 0,
    timelineWrap?.scrollWidth ?? 0,
    timelineWrap?.clientWidth ?? 0
  )
  const fixedSidebarWidth = fixedSidebar?.offsetWidth ?? 0
  const fullWidth = Math.max(exportRoot.clientWidth, fixedSidebarWidth + timelineWidth)
  const appBodyHeight = Math.max(appBody?.clientHeight ?? 0, maxSceneHeight)
  const totalHeight = Math.max(
    exportRoot.clientHeight,
    (toolbar?.offsetHeight ?? 0) + (projectBrief?.offsetHeight ?? 0) + appBodyHeight
  )

  const { default: html2canvas } = await import('html2canvas')
  const [{ jsPDF }] = await Promise.all([import('jspdf')])
  const scrollSnapshots = Array.from(
    document.querySelectorAll<HTMLElement>('[data-export-scroll="true"]')
  ).map(element => ({
    key: element.dataset.exportKey ?? '',
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop,
  }))

  const canvas = await html2canvas(exportRoot, {
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
    scale: Math.min(Math.max(window.devicePixelRatio || 1, 1), 2),
    width: fullWidth,
    height: totalHeight,
    windowWidth: fullWidth,
    windowHeight: totalHeight,
    onclone: clonedDocument => {
      clonedDocument.documentElement.style.height = 'auto'
      clonedDocument.documentElement.style.overflow = 'visible'
      clonedDocument.body.style.height = 'auto'
      clonedDocument.body.style.overflow = 'visible'

      const clonedExportRoot = clonedDocument.querySelector<HTMLElement>('[data-export-root="true"]')
      if (clonedExportRoot) {
        clonedExportRoot.style.width = `${fullWidth}px`
        clonedExportRoot.style.height = `${totalHeight}px`
        clonedExportRoot.style.minHeight = `${totalHeight}px`
        clonedExportRoot.style.overflow = 'visible'
      }

      const clonedAppBody = clonedDocument.querySelector<HTMLElement>('.app-body')
      if (clonedAppBody) {
        clonedAppBody.style.height = `${appBodyHeight}px`
        clonedAppBody.style.minHeight = `${appBodyHeight}px`
        clonedAppBody.style.width = `${fullWidth}px`
        clonedAppBody.style.overflow = 'visible'
        clonedAppBody.style.alignItems = 'flex-start'
      }

      const clonedFixedSidebar = clonedDocument.querySelector<HTMLElement>('.fixed-sidebar')
      if (clonedFixedSidebar) {
        clonedFixedSidebar.style.height = `${appBodyHeight}px`
        clonedFixedSidebar.style.minHeight = `${appBodyHeight}px`
      }

      const clonedToolbar = clonedDocument.querySelector<HTMLElement>('.toolbar')
      if (clonedToolbar) {
        clonedToolbar.style.width = `${fullWidth}px`
      }

      const clonedProjectBrief = clonedDocument.querySelector<HTMLElement>('.project-brief')
      if (clonedProjectBrief) {
        clonedProjectBrief.style.width = `${fullWidth}px`
      }

      const clonedTimelineWrap = clonedDocument.querySelector<HTMLElement>('.timeline-wrap')
      if (clonedTimelineWrap) {
        clonedTimelineWrap.style.height = `${appBodyHeight}px`
        clonedTimelineWrap.style.minHeight = `${appBodyHeight}px`
        clonedTimelineWrap.style.width = `${timelineWidth}px`
        clonedTimelineWrap.style.minWidth = `${timelineWidth}px`
        clonedTimelineWrap.style.overflow = 'visible'
      }

      const clonedTimeline = clonedDocument.querySelector<HTMLElement>('.timeline')
      if (clonedTimeline) {
        clonedTimeline.style.height = 'auto'
        clonedTimeline.style.minHeight = `${appBodyHeight}px`
        clonedTimeline.style.width = `${timelineWidth}px`
        clonedTimeline.style.minWidth = `${timelineWidth}px`
        clonedTimeline.style.alignItems = 'flex-start'
      }

      const clonedScrollables = Array.from(
        clonedDocument.querySelectorAll<HTMLElement>('[data-export-scroll="true"]')
      )

      for (const clonedElement of clonedScrollables) {
        const key = clonedElement.dataset.exportKey ?? ''
        const snapshot = scrollSnapshots.find(item => item.key === key)

        if (clonedElement.classList.contains('scene-col')) {
          const columnHeight = sceneHeights.get(key) ?? appBodyHeight
          clonedElement.style.height = `${columnHeight}px`
          clonedElement.style.minHeight = `${columnHeight}px`
          clonedElement.style.maxHeight = 'none'
          clonedElement.style.overflow = 'visible'
          clonedElement.scrollTop = 0

          const sceneShell = clonedElement.parentElement
          if (sceneShell instanceof HTMLElement) {
            sceneShell.style.height = `${columnHeight}px`
            sceneShell.style.minHeight = `${columnHeight}px`
            sceneShell.style.maxHeight = 'none'
            sceneShell.style.overflow = 'visible'
          }

          const nestedScrollables = Array.from(clonedElement.querySelectorAll<HTMLElement>('*')).filter(
            nestedElement => isScrollableElement(nestedElement)
          )

          for (const nestedElement of nestedScrollables) {
            nestedElement.style.height = `${nestedElement.scrollHeight}px`
            nestedElement.style.minHeight = `${nestedElement.scrollHeight}px`
            nestedElement.style.maxHeight = 'none'
            nestedElement.style.overflow = 'visible'
            nestedElement.scrollTop = 0
          }
          continue
        }

        if (clonedElement.classList.contains('timeline-wrap')) {
          clonedElement.style.height = `${appBodyHeight}px`
          clonedElement.style.minHeight = `${appBodyHeight}px`
          clonedElement.style.width = `${timelineWidth}px`
          clonedElement.style.minWidth = `${timelineWidth}px`
          clonedElement.style.maxHeight = 'none'
          clonedElement.style.overflow = 'visible'
          clonedElement.scrollLeft = 0
          continue
        }

        if (!snapshot) continue
        clonedElement.scrollLeft = snapshot.scrollLeft
        clonedElement.scrollTop = snapshot.scrollTop
      }

      const clonedSceneHeaders = Array.from(
        clonedDocument.querySelectorAll<HTMLElement>('.scene-header')
      )
      for (const header of clonedSceneHeaders) {
        header.style.position = 'static'
      }

      const exportHiddenElements = Array.from(
        clonedDocument.querySelectorAll<HTMLElement>('[data-export-hide="true"]')
      )
      for (const element of exportHiddenElements) {
        element.style.display = 'none'
      }

      const clonedAddSceneColumns = Array.from(
        clonedDocument.querySelectorAll<HTMLElement>('.add-scene-col')
      )
      for (const element of clonedAddSceneColumns) {
        element.style.display = 'none'
      }
    },
  })

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 6
  const contentWidth = pageWidth - margin * 2
  const contentHeight = pageHeight - margin * 2
  const maxSliceWidth = Math.max(1, Math.round(canvas.height * (contentWidth / contentHeight)))
  const exportRootRect = exportRoot.getBoundingClientRect()
  const timelineRect = timeline?.getBoundingClientRect()
  const timelineWrapRect = timelineWrap?.getBoundingClientRect()
  const timelineStartInRoot = timelineWrapRect
    ? timelineWrapRect.left - exportRootRect.left
    : fixedSidebarWidth
  const canvasScaleX = fullWidth > 0 ? canvas.width / fullWidth : 1
  const sceneBoundsOnCanvas = timelineRect
    ? sceneColumns
        .map<SceneBound>(column => {
          const rect = column.getBoundingClientRect()
          const leftInTimeline = rect.left - timelineRect.left
          const leftInRoot = timelineStartInRoot + leftInTimeline
          return {
            left: leftInRoot * canvasScaleX,
            right: (leftInRoot + rect.width) * canvasScaleX,
          }
        })
        .sort((left, right) => left.left - right.left)
    : []
  const pageSlices = buildSceneAlignedSliceRanges(canvas.width, maxSliceWidth, sceneBoundsOnCanvas)
    .map(range => createSliceCanvas(canvas, range))
    .filter((slice): slice is HTMLCanvasElement => slice !== null)

  pageSlices.forEach((sliceCanvas, index) => {
    if (index > 0) {
      pdf.addPage('a4', 'landscape')
    }

    const imageData = sliceCanvas.toDataURL('image/jpeg', 0.96)
    const sliceAspectRatio = sliceCanvas.width / sliceCanvas.height
    let displayWidth = contentWidth
    let displayHeight = displayWidth / sliceAspectRatio

    if (displayHeight > contentHeight) {
      displayHeight = contentHeight
      displayWidth = displayHeight * sliceAspectRatio
    }

    const offsetX = margin + (contentWidth - displayWidth) / 2
    const offsetY = margin + (contentHeight - displayHeight) / 2

    pdf.addImage(imageData, 'JPEG', offsetX, offsetY, displayWidth, displayHeight, undefined, 'FAST')
  })

  pdf.save(`${sanitizeFilename(projectTitle)}.pdf`)
}
