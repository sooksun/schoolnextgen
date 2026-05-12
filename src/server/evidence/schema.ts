export const ALLOWED_MIMES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  // Video
  'video/mp4',
  'video/webm',
  'video/quicktime',
  // PDF
  'application/pdf',
  // Office docs
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',       // .xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
] as const

export type EvidenceMime = (typeof ALLOWED_MIMES)[number]
export type EvidenceFileType = 'image' | 'video' | 'pdf' | 'document' | 'other'

export function mimeToType(mime: string): EvidenceFileType {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime === 'application/pdf') return 'pdf'
  if (mime.startsWith('application/vnd.openxml')) return 'document'
  return 'other'
}

export const MAX_SIZE: Record<EvidenceFileType, number> = {
  image: 10 * 1024 * 1024, // 10 MB
  video: 100 * 1024 * 1024, // 100 MB
  pdf: 25 * 1024 * 1024, // 25 MB
  document: 25 * 1024 * 1024, // 25 MB
  other: 10 * 1024 * 1024, // 10 MB safety cap
}
