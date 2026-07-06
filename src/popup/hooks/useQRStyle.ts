import { useState, useEffect, useCallback } from 'react'
import { QRStyle } from '@/types'

const DEFAULT_STYLE: QRStyle = {
  fgColor: '#000000',
  bgColor: '#FFFFFF',
  logoSrc: null,
  logoSize: 20,
  level: 'M',
}

export function useQRStyle() {
  const [qrStyle, setQRStyleState] = useState<QRStyle>(DEFAULT_STYLE)

  // 从 storage 加载持久化的样式
  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.storage) return
    chrome.storage.local.get(['qrStyle']).then((result) => {
      if (result.qrStyle) {
        const { logoSrc, ...rest } = result.qrStyle
        setQRStyleState({ ...DEFAULT_STYLE, ...rest, logoSrc: logoSrc ?? null })
      }
    }).catch(() => {})
  }, [])

  // 更新样式并持久化（logo 不存 storage，太大了）
  const setQRStyle = useCallback((updater: Partial<QRStyle> | ((prev: QRStyle) => QRStyle)) => {
    setQRStyleState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const { logoSrc: _logoSrc, ...toStore } = next
        chrome.storage.local.set({ qrStyle: toStore }).catch(() => {})
      }
      return next
    })
  }, [])

  const resetStyle = useCallback(() => {
    setQRStyle(DEFAULT_STYLE)
  }, [setQRStyle])

  return { qrStyle, setQRStyle, resetStyle, DEFAULT_STYLE }
}
