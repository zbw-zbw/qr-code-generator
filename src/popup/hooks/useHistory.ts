import { useState, useEffect, useCallback, useRef } from 'react'
import { HistoryRecord, QRStyle } from '@/types'

const MAX_RECORDS = 50

export function useHistory() {
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const loadedRef = useRef(false)

  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.storage) return
    chrome.storage.local.get(['qrHistory']).then((result) => {
      if (result.qrHistory && Array.isArray(result.qrHistory)) {
        setRecords(result.qrHistory)
      }
      loadedRef.current = true
    }).catch(() => { loadedRef.current = true })
  }, [])

  const persist = useCallback((next: HistoryRecord[]) => {
    if (typeof chrome === 'undefined' || !chrome.storage) return
    chrome.storage.local.set({ qrHistory: next }).catch(() => {})
  }, [])

  const addRecord = useCallback((content: string, qrStyle: QRStyle) => {
    if (!content.trim()) return
    setRecords((prev) => {
      // 同内容已在最近 → 不重复添加
      if (prev[0]?.content === content) return prev
      const record: HistoryRecord = {
        id: crypto.randomUUID(),
        content,
        timestamp: Date.now(),
        qrStyle,
      }
      const next = [record, ...prev].slice(0, MAX_RECORDS)
      persist(next)
      return next
    })
  }, [persist])

  const removeRecord = useCallback((id: string) => {
    setRecords((prev) => {
      const next = prev.filter((r) => r.id !== id)
      persist(next)
      return next
    })
  }, [persist])

  const clearAll = useCallback(() => {
    setRecords([])
    persist([])
  }, [persist])

  return { records, addRecord, removeRecord, clearAll }
}

// 工具函数：对记录按日期分组
export function groupRecordsByDate(records: HistoryRecord[]) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const yesterdayStart = todayStart - 86400000

  const today: HistoryRecord[] = []
  const yesterday: HistoryRecord[] = []
  const earlier: HistoryRecord[] = []

  for (const r of records) {
    if (r.timestamp >= todayStart) today.push(r)
    else if (r.timestamp >= yesterdayStart) yesterday.push(r)
    else earlier.push(r)
  }

  return { today, yesterday, earlier }
}
