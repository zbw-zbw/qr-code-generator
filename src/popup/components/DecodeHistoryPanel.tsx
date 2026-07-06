import { DecodeRecord } from '@/types'
import { t } from '@/utils/i18n'

interface DecodeHistoryPanelProps {
  records: DecodeRecord[]
  onSelect: (r: DecodeRecord) => void
  onRemove: (id: string) => void
  onClearAll: () => void
  onBack: () => void
}

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })

const today = () => {
  const d = new Date(); d.setHours(0,0,0,0); return d.getTime()
}

export default function DecodeHistoryPanel({ records, onSelect, onRemove, onClearAll, onBack }: DecodeHistoryPanelProps) {
  const todayStart = today()
  const yesterdayStart = todayStart - 86400000
  const todayItems = records.filter(r => r.timestamp >= todayStart)
  const yesterdayItems = records.filter(r => r.timestamp >= yesterdayStart && r.timestamp < todayStart)
  const earlierItems = records.filter(r => r.timestamp < yesterdayStart)

  const Section = ({ label, items }: { label: string; items: DecodeRecord[] }) => (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide mb-1.5 px-0.5"
        style={{ color: 'var(--color-text-muted)' }}>{label}</p>
      <div className="space-y-1.5 mb-3">
        {items.map(r => (
          <div key={r.id} className="group param-item cursor-pointer flex items-start gap-2.5" onClick={() => onSelect(r)}>
            {/* 缩略图 */}
            {r.previewUrl && (
              <img src={r.previewUrl} alt=""
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 mt-0.5"
                style={{ border: '1px solid var(--color-border)' }} />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg text-xs font-medium flex-shrink-0"
                  style={r.type === 'url'
                    ? { background: 'var(--color-muted-bg)', color: 'var(--color-primary)' }
                    : { background: 'var(--color-muted-bg)', color: 'var(--color-text-secondary)' }}>
                  {r.type === 'url' ? 'URL' : 'TEXT'}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{formatTime(r.timestamp)}</span>
              </div>
              <p className="text-xs font-mono break-all leading-relaxed" style={{ color: 'var(--color-text)' }}>{r.content}</p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); onRemove(r.id) }}
              className="p-1 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 mt-0.5 rounded-lg"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-error)'; e.currentTarget.style.background = 'var(--color-muted-bg)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-2.5 bg-[var(--color-card)]"
        style={{ borderBottom: '1px solid var(--color-border)' }}>
        <button onClick={onBack}
          className="flex items-center gap-1 text-xs font-medium transition-colors"
          style={{ color: 'var(--color-text-secondary)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {records.length > 0 ? t('history.count', { count: records.length }) : ''}
        </span>
        {records.length > 0 && (
          <button onClick={onClearAll} className="text-xs font-medium transition-colors"
            style={{ color: 'var(--color-error)' }}>
            {t('history.clearAll')}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: 'none' }}>
        {records.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              style={{ color: 'var(--color-text-muted)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{t('history.empty')}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {todayItems.length > 0 && <Section label={t('history.today')} items={todayItems} />}
            {yesterdayItems.length > 0 && <Section label={t('history.yesterday')} items={yesterdayItems} />}
            {earlierItems.length > 0 && <Section label={t('history.earlier')} items={earlierItems} />}
          </div>
        )}
      </div>
    </div>
  )
}
