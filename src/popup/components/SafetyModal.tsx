import { t } from '@/utils/i18n'

interface SafetyModalProps {
  url: string
  onConfirm: () => void
  onCancel: () => void
}

const SafetyModal = ({ url, onConfirm, onCancel }: SafetyModalProps) => {
  let hostname = ''
  let protocol = ''
  try {
    const u = new URL(url)
    hostname = u.hostname
    protocol = u.protocol.replace(':', '')
  } catch {
    hostname = url
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onCancel}>
      <div className="w-80 rounded-2xl shadow-2xl p-4 space-y-3 mx-4" style={{ background: 'var(--color-card)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEF3C7' }}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#D97706' }}>
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{t('safety.title')}</h3>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{t('safety.message')}</p>
        <div className="p-2.5 rounded-xl space-y-1.5" style={{ background: 'var(--color-muted-bg)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium w-12 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>{t('safety.protocol')}</span>
            <span className={`text-xs font-mono font-semibold`} style={{ color: protocol === 'https' ? 'var(--color-success)' : '#D97706' }}>{protocol}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium w-12 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>{t('safety.domain')}</span>
            <span className="text-xs font-mono font-semibold" style={{ color: 'var(--color-text)' }}>{hostname}</span>
          </div>
          <div className="pt-1.5" style={{ borderTop: '1px solid var(--color-border)' }}>
            <p className="text-xs font-mono break-all leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{url}</p>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={onCancel}
            className="flex-1 py-2 text-xs font-medium rounded-xl transition-colors hover:bg-[var(--color-muted-bg)]"
            style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', background: 'var(--color-card)' }}>
            {t('safety.cancel')}
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2 text-xs font-medium text-white rounded-xl transition-colors hover:opacity-90"
            style={{ background: 'var(--color-primary)' }}>
            {t('safety.confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SafetyModal
