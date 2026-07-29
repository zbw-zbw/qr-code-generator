import { URLParam } from '@/types'

// 保真解析：key/value 保持 URL 中的原始（已编码）形态。
// 避免 URLSearchParams 解码→重编码往返改写未编辑参数（对带签名的链接是致命的）。
export const parseParams = (url: string): URLParam[] => {
  try {
    const search = new URL(url).search
    if (!search || search === '?') return []
    return search.slice(1).split('&').filter(Boolean).map(pair => {
      const idx = pair.indexOf('=')
      return idx === -1
        ? { key: pair, value: '' }
        : { key: pair.slice(0, idx), value: pair.slice(idx + 1) }
    })
  } catch {
    return []
  }
}

// 原样拼回参数（仅过滤空 key），未编辑的参数字节级不变
export const buildUrl = (baseUrl: string, params: URLParam[]): string => {
  try {
    const urlObj = new URL(baseUrl)
    const pairs = params.filter(p => p.key.trim()).map(p => `${p.key}=${p.value}`)
    urlObj.search = pairs.length ? `?${pairs.join('&')}` : ''
    return urlObj.toString()
  } catch {
    return baseUrl
  }
}

// 展示用解码：query 语义中 + 代表空格；解码失败返回原文
export const safeDecode = (s: string): string => {
  try {
    return decodeURIComponent(s.replace(/\+/g, '%20'))
  } catch {
    return s
  }
}
