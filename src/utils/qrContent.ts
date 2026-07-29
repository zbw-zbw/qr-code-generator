// 二维码内容构建与解析（WiFi / mailto / SMS / vCard）
// 集中在此便于单元测试与格式规范维护

import { WiFiData, EmailData, SMSData, VCardData } from '@/types'

// ── WiFi ──────────────────────────────────────────────
// WIFI: 语法要求转义的特殊字符：\ ; , : "
const escapeWiFi = (s: string) => s.replace(/([\\;,:"])/g, '\\$1')
const unescapeWiFi = (s: string) => s.replace(/\\(.)/g, '$1')

export const buildWiFi = (d: WiFiData): string => {
  const parts = [`T:${d.encryption}`, `S:${escapeWiFi(d.ssid)}`]
  if (d.encryption !== 'nopass') parts.push(`P:${escapeWiFi(d.password)}`)
  if (d.hidden) parts.push('H:true')
  return `WIFI:${parts.join(';')};;`
}

export const parseWiFi = (content: string): WiFiData | null => {
  if (!content.startsWith('WIFI:')) return null
  const body = content.slice(5).replace(/;;$/, '')
  const data: WiFiData = { ssid: '', password: '', encryption: 'WPA', hidden: false }
  // 按未转义的分号切分字段
  const fields = body.match(/(?:\\.|[^\\;])+/g) || []
  for (const field of fields) {
    const idx = field.indexOf(':')
    if (idx === -1) continue
    const key = field.slice(0, idx).toUpperCase()
    const val = unescapeWiFi(field.slice(idx + 1))
    if (key === 'T') data.encryption = val === 'WEP' ? 'WEP' : val === 'nopass' ? 'nopass' : 'WPA'
    else if (key === 'S') data.ssid = val
    else if (key === 'P') data.password = val
    else if (key === 'H') data.hidden = val === 'true'
  }
  return data
}

// ── mailto（RFC 6068：使用 percent-encoding，空格为 %20 而非 +）──
export const buildMailto = (d: EmailData): string => {
  const qs: string[] = []
  if (d.subject) qs.push(`subject=${encodeURIComponent(d.subject)}`)
  if (d.body) qs.push(`body=${encodeURIComponent(d.body)}`)
  return `mailto:${d.address}${qs.length ? '?' + qs.join('&') : ''}`
}

export const parseMailto = (content: string): EmailData | null => {
  if (!content.startsWith('mailto:')) return null
  const rest = content.slice(7)
  const qIdx = rest.indexOf('?')
  const data: EmailData = { address: qIdx === -1 ? rest : rest.slice(0, qIdx), subject: '', body: '' }
  if (qIdx !== -1) {
    for (const pair of rest.slice(qIdx + 1).split('&')) {
      const eq = pair.indexOf('=')
      if (eq === -1) continue
      const key = pair.slice(0, eq).toLowerCase()
      let val = pair.slice(eq + 1)
      try { val = decodeURIComponent(val) } catch { /* keep raw */ }
      if (key === 'subject') data.subject = val
      else if (key === 'body') data.body = val
    }
  }
  return data
}

// ── SMS（RFC 5724：sms:number?body=...，兼容解析旧的 smsto:）──
export const sanitizePhone = (s: string) => s.replace(/[^0-9+\-() ]/g, '')

export const buildSMS = (d: SMSData): string =>
  `sms:${d.phone}${d.message ? `?body=${encodeURIComponent(d.message)}` : ''}`

export const parseSMS = (content: string): SMSData | null => {
  if (content.startsWith('smsto:')) {
    const rest = content.slice(6)
    const idx = rest.indexOf(':')
    return idx === -1
      ? { phone: rest, message: '' }
      : { phone: rest.slice(0, idx), message: rest.slice(idx + 1) }
  }
  if (content.startsWith('sms:')) {
    const rest = content.slice(4)
    const qIdx = rest.indexOf('?')
    const data: SMSData = { phone: qIdx === -1 ? rest : rest.slice(0, qIdx), message: '' }
    if (qIdx !== -1) {
      for (const pair of rest.slice(qIdx + 1).split('&')) {
        const eq = pair.indexOf('=')
        if (eq !== -1 && pair.slice(0, eq).toLowerCase() === 'body') {
          try { data.message = decodeURIComponent(pair.slice(eq + 1)) } catch { data.message = pair.slice(eq + 1) }
        }
      }
    }
    return data
  }
  return null
}

// ── vCard 3.0 ──────────────────────────────────────────
const escapeVCard = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
const unescapeVCard = (s: string) =>
  s.replace(/\\([\\;,nN])/g, (_, c: string) => (c === 'n' || c === 'N' ? '\n' : c))

export const buildVCard = (d: VCardData): string => [
  'BEGIN:VCARD', 'VERSION:3.0',
  `N:${escapeVCard(d.lastName)};${escapeVCard(d.firstName)}`,
  `FN:${escapeVCard([d.firstName, d.lastName].filter(Boolean).join(' '))}`,
  d.phone ? `TEL:${escapeVCard(d.phone)}` : '',
  d.email ? `EMAIL:${escapeVCard(d.email)}` : '',
  d.org ? `ORG:${escapeVCard(d.org)}` : '',
  'END:VCARD',
].filter(Boolean).join('\n')

export const parseVCard = (content: string): VCardData | null => {
  if (!content.startsWith('BEGIN:VCARD')) return null
  const data: VCardData = { firstName: '', lastName: '', phone: '', email: '', org: '' }
  for (const line of content.split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).toUpperCase().split(';')[0]
    const val = line.slice(idx + 1)
    if (key === 'N') {
      // 按未转义的分号切分 姓;名
      const segs = val.match(/(?:\\.|[^\\;])+/g) || []
      data.lastName = segs[0] ? unescapeVCard(segs[0]) : ''
      data.firstName = segs[1] ? unescapeVCard(segs[1]) : ''
    } else if (key === 'TEL') data.phone = unescapeVCard(val)
    else if (key === 'EMAIL') data.email = unescapeVCard(val)
    else if (key === 'ORG') data.org = unescapeVCard(val)
  }
  return data
}
