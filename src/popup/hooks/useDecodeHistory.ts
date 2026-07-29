import { useState, useEffect, useCallback } from 'react'
import { DecodeRecord } from '@/types'
import { useToast } from '../context/ToastContext'
import { t } from '@/utils/i18n'

const MAX = 30

export function useDecodeHistory() {
  const [records, setRecords] = useState<DecodeRecord[]>([])
  const { showToast } = useToast()

  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.storage) return
    chrome.storage.local.get(['decodeHistory']).then(r => {
      if (Array.isArray(r.decodeHistory)) setRecords(r.decodeHistory)
    }).catch(() => {})
  }, [])

  const persist = useCallback((next: DecodeRecord[]) => {
    if (typeof chrome === 'undefined' || !chrome.storage) return
    // 写入失败（如配额已满）必须让用户感知，不能静默丢数据
    chrome.storage.local.set({ decodeHistory: next }).catch(() => {
      showToast(t('storage.saveFailed'), 'error')
    })
  }, [showToast])

  const addRecord = useCallback((content: string, type: 'url' | 'text', previewUrl?: string) => {
    if (!content.trim()) return
    setRecords(prev => {
      if (prev.slice(0, 5).some(r => r.content === content)) return prev
      const safePreview = previewUrl && previewUrl.length > 50_000 ? undefined : previewUrl
      const record: DecodeRecord = { id: crypto.randomUUID(), content, type, timestamp: Date.now(), previewUrl: safePreview }
      const next = [record, ...prev].slice(0, MAX)
      persist(next)
      return next
    })
  }, [persist])

  const removeRecord = useCallback((id: string) => {
    setRecords(prev => {
      const next = prev.filter(r => r.id !== id)
      persist(next)
      return next
    })
  }, [persist])

  const clearAll = useCallback(() => {
    setRecords([]); persist([])
  }, [persist])

  return { records, addRecord, removeRecord, clearAll }
}
