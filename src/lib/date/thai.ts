import dayjs from 'dayjs'
import 'dayjs/locale/th'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'

dayjs.extend(buddhistEra)
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.locale('th')

export type DateInput = Date | string | number | null | undefined

/** Default Thai BE format: "11 พฤษภาคม พ.ศ. 2569" */
export const formatThai = (d: DateInput, fmt = 'D MMMM พ.ศ. BBBB'): string => {
  if (d == null || d === '') return ''
  const dj = dayjs(d)
  if (!dj.isValid()) return ''
  return dj.format(fmt)
}

/** Short Thai BE: "11 พ.ค. 2569" */
export const formatThaiShort = (d: DateInput) => formatThai(d, 'D MMM BBBB')

/** With time: "11 พ.ค. 2569 เวลา 14:30" */
export const formatThaiDateTime = (d: DateInput) => formatThai(d, 'D MMM BBBB เวลา HH:mm')

/** With weekday: "วันจันทร์ ที่ 11 พฤษภาคม พ.ศ. 2569" */
export const formatThaiWeekday = (d: DateInput) => formatThai(d, 'dddd ที่ D MMMM พ.ศ. BBBB')

/** Relative ("3 ชั่วโมงที่แล้ว") with smart today/yesterday */
export const formatThaiRelative = (d: DateInput): string => {
  if (d == null || d === '') return ''
  const dj = dayjs(d)
  if (!dj.isValid()) return ''
  if (dj.isToday()) return `วันนี้ ${dj.format('HH:mm')}`
  if (dj.isYesterday()) return `เมื่อวาน ${dj.format('HH:mm')}`
  if (dayjs().diff(dj, 'day') < 7) return dj.fromNow()
  return formatThaiShort(dj.toDate())
}

/** JS Date → ISO date-only (server-safe for DATE columns) */
export const toIsoDate = (d: Date | null): string | null =>
  d ? dayjs(d).format('YYYY-MM-DD') : null

/** ISO string → JS Date for form initial values */
export const fromIsoDate = (s: string | null | undefined): Date | null =>
  s ? dayjs(s).toDate() : null

/** Convert Gregorian year → BE year */
export const toBeYear = (gregorian: number): number => gregorian + 543

/** Convert BE year → Gregorian year */
export const toGregorianYear = (be: number): number => be - 543
