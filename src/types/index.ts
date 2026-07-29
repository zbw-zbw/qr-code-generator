export interface URLParam {
  key: string
  value: string
}

export interface DecodeResult {
  content: string
  type: 'url' | 'text'
}

export type QRLevel = 'L' | 'M' | 'Q' | 'H'

export interface QRStyle {
  fgColor: string
  bgColor: string
  logoSrc: string | null
  logoSize: number
  // 白边宽度（占 logo 盒子的百分比）0/8/14
  logoPadding: number
  // 圆角半径（占 logo 盒子的百分比）0/20/50，50 为圆形
  logoRadius: number
  level: QRLevel
}

export interface HistoryRecord {
  id: string
  content: string
  timestamp: number
  qrStyle: QRStyle
}

export interface DecodeRecord {
  id: string
  content: string
  type: 'url' | 'text'
  timestamp: number
  previewUrl?: string
}

export type Mode = 'generate' | 'decode'

export type ContentType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'sms' | 'vcard'

export interface WiFiData {
  ssid: string
  password: string
  encryption: 'WPA' | 'WEP' | 'nopass'
  hidden: boolean
}

export interface EmailData {
  address: string
  subject: string
  body: string
}

export interface SMSData {
  phone: string
  message: string
}

export interface VCardData {
  firstName: string
  lastName: string
  phone: string
  email: string
  org: string
}
