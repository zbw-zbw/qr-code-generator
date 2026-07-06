import { ContentType } from '@/types'
import { t } from '@/utils/i18n'

const TYPES: ContentType[] = ['url', 'text', 'wifi', 'email', 'phone', 'sms', 'vcard']

const LABEL_KEYS = {
  url: 'content.url', text: 'content.text', wifi: 'content.wifi',
  email: 'content.email', phone: 'content.phone', sms: 'content.sms', vcard: 'content.vcard',
} as const

const ContentTypeSelector = ({ value, onChange, expanded, onToggle }: {
  value: ContentType; onChange: (type: ContentType) => void; expanded: boolean; onToggle: () => void
}) => {
  return (
    <div>
      <button onClick={onToggle}
        className="w-full flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          {t('content.typeLabel')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-lg text-xs font-medium"
            style={{ background: 'var(--color-muted-bg)', color: 'var(--color-text-secondary)' }}>
            {t(LABEL_KEYS[value])}
          </span>
          <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${expanded ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]'}`}>
        <div className="min-h-0">
          <div className="flex gap-1.5 flex-wrap">
            {TYPES.map(tp => (
              <button key={tp} onClick={() => onChange(tp)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
                  value === tp ? 'text-white shadow-sm' : 'hover:bg-[var(--color-muted-bg)]'
                }`}
                style={value === tp
                  ? { background: 'var(--color-primary)' }
                  : { color: 'var(--color-text-secondary)', background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                {t(LABEL_KEYS[tp])}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentTypeSelector
