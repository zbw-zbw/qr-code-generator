export interface URLParam {
  key: string
  value: string
}

export interface DecodeResult {
  content: string
  type: 'url' | 'text'
}

export type Mode = 'generate' | 'decode'
