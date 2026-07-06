import { useState, useEffect, useCallback } from 'react'
import { DecodeRecord } from '@/types'

const MAX = 30

export function useDecodeHistory() {
  const [records, setRecords] = useState<DecodeRecord[]>([])

  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.storage) return
    chrome.storage.local.get(['decodeHistory']).then(r => {
      if (Array.isArray(r.decodeHistory)) setRecords(r.decodeHistory)
    }).catch(() => {})
  }, [])

  const persist = useCallback((next: DecodeRecord[]) => {
    if (typeof chrome === 'undefined' || !chrome.storage) return
    chrome.storage.local.set({ decodeHistory: next }).catch(() => {})
  }, [])

  const addRecord = useCallback((content: string, type: 'url' | 'text', previewUrl?: string) => {
    if (!content.trim()) return
    setRecords(prev => {
      if (prev[0]?.content === content) return prev
      const record: DecodeRecord = { id: crypto.randomUUID(), content, type, timestamp: Date.now(), previewUrl }
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
