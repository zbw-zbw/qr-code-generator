import { useState, useEffect, useCallback, useRef } from 'react'
import { HistoryRecord, QRStyle } from '@/types'
import { useToast } from '../context/ToastContext'
import { t } from '@/utils/i18n'

const MAX_RECORDS = 50

export function useHistory() {
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const loadedRef = useRef(false)
  const { showToast } = useToast()

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
    // 写入失败（如配额已满）必须让用户感知，不能静默丢数据
    chrome.storage.local.set({ qrHistory: next }).catch(() => {
      showToast(t('storage.saveFailed'), 'error')
    })
  }, [showToast])

  const addRecord = useCallback((content: string, qrStyle: QRStyle) => {
    if (!content.trim()) return
    setRecords((prev) => {
      if (prev.slice(0, 5).some(r => r.content === content)) return prev
      const { logoSrc: _logo, ...styleWithoutLogo } = qrStyle
      const record: HistoryRecord = {
        id: crypto.randomUUID(),
        content,
        timestamp: Date.now(),
        qrStyle: { ...styleWithoutLogo, logoSrc: null },
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

// 工具函数：对记录按日期分组（用日历日计算，避免 DST 时区偏移）
export function groupRecordsByDate(records: HistoryRecord[]) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const todayStart = d.getTime()
  d.setDate(d.getDate() - 1)
  const yesterdayStart = d.getTime()

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
