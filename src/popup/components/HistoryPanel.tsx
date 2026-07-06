import React from 'react'
import { HistoryRecord } from '@/types'
import { groupRecordsByDate } from '../hooks/useHistory'
import { t } from '@/utils/i18n'

interface HistoryPanelProps {
  records: HistoryRecord[]
  onSelect: (record: HistoryRecord) => void
  onRemove: (id: string) => void
  onClearAll: () => void
  onBack: () => void
}

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })

const truncate = (s: string, max = 80) => s.length > max ? s.slice(0, max) + '…' : s

const RecordItem = ({ record, onSelect, onRemove }: {
  record: HistoryRecord
  onSelect: (r: HistoryRecord) => void
  onRemove: (id: string) => void
}) => (
  <div className="group param-item cursor-pointer" onClick={() => onSelect(record)}>
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-[var(--color-text)] break-all leading-relaxed">
          {truncate(record.content)}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-[var(--color-text-muted)]">{formatTime(record.timestamp)}</span>
          {record.qrStyle?.fgColor && record.qrStyle.fgColor !== '#000000' && (
            <div className="w-3 h-3 rounded-full border border-[var(--color-border)]"
              style={{ backgroundColor: record.qrStyle.fgColor }} />
          )}
          {record.qrStyle?.logoSrc && (
            <img src={record.qrStyle.logoSrc} className="w-3.5 h-3.5 rounded object-contain" alt="" />
          )}
        </div>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onRemove(record.id) }}
        className="p-1 text-[var(--color-text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)

const Section = ({ label, items, onSelect, onRemove }: {
  label: string; items: HistoryRecord[]
  onSelect: (r: HistoryRecord) => void; onRemove: (id: string) => void
}) => (
  <>
    <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5 px-0.5">{label}</p>
    <div className="space-y-1.5">
      {items.map(r => <RecordItem key={r.id} record={r} onSelect={onSelect} onRemove={onRemove} />)}
    </div>
  </>
)

const HistoryPanel: React.FC<HistoryPanelProps> = ({ records, onSelect, onRemove, onClearAll, onBack }) => {
  const { today, yesterday, earlier } = groupRecordsByDate(records)

  return (
    <div className="flex flex-col h-full">
      {/* 固定头部栏：返回 | 条数 | 清空 */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-2.5 border-b border-[var(--color-border)] bg-white">
        <button onClick={onBack}
          className="flex items-center gap-1 text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
        <span className="text-xs text-[var(--color-text-muted)]">
          {records.length > 0 ? t('history.count', { count: records.length }) : ''}
        </span>
        {records.length > 0 && (
          <button onClick={onClearAll} className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
            {t('history.clearAll')}
          </button>
        )}
      </div>

      {/* 可滚动列表 */}
      <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: 'none' }}>
        {records.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-10 h-10 mx-auto text-[var(--color-text-muted)] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-[var(--color-text-muted)]">{t('history.empty')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {today.length > 0 && <Section label={t('history.today')} items={today} onSelect={onSelect} onRemove={onRemove} />}
            {yesterday.length > 0 && <Section label={t('history.yesterday')} items={yesterday} onSelect={onSelect} onRemove={onRemove} />}
            {earlier.length > 0 && <Section label={t('history.earlier')} items={earlier} onSelect={onSelect} onRemove={onRemove} />}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPanel
