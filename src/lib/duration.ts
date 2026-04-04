import { KOREAN_CHARS_PER_SECOND, ENGLISH_WPM } from './constants'

export function countWords(text: string): number {
  if (!text.trim()) return 0
  const korean = (text.match(/[가-힣]/g) || []).length
  const stripped = text.replace(/[가-힣]/g, ' ')
  const english = stripped.trim().split(/\s+/).filter(Boolean).length
  return korean + english
}

export function calculateAutoDuration(text: string): number {
  if (!text.trim()) return 0
  const koreanChars = (text.match(/[가-힣]/g) || []).length
  const stripped = text.replace(/[가-힣]/g, ' ')
  const englishWords = stripped.trim().split(/\s+/).filter(Boolean).length
  const koreanSeconds = koreanChars / KOREAN_CHARS_PER_SECOND
  const englishSeconds = (englishWords / ENGLISH_WPM) * 60
  return Math.ceil(koreanSeconds + englishSeconds)
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s === 0 ? `${m}m` : `${m}m ${s}s`
}
