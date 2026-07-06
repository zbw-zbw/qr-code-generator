import { QRStyle, QRLevel } from '@/types'
import { t } from '@/utils/i18n'

interface QRStyleEditorProps {
  qrStyle: QRStyle
  onChange: (style: Partial<QRStyle>) => void
  onReset: () => void
  expanded: boolean
  onToggle: () => void
}

const PRESETS = [
  { fg: '#000000', bg: '#FFFFFF', label: 'Classic' },
  { fg: '#1a56db', bg: '#eff6ff', label: 'Blue' },
  { fg: '#047857', bg: '#ecfdf5', label: 'Green' },
  { fg: '#7c3aed', bg: '#f5f3ff', label: 'Purple' },
  { fg: '#dc2626', bg: '#fef2f2', label: 'Red' },
  { fg: '#ea580c', bg: '#fff7ed', label: 'Orange' },
]

const LEVELS: { value: QRLevel; label: string; desc: string }[] = [
  { value: 'L', label: 'L', desc: '7%' },
  { value: 'M', label: 'M', desc: '15%' },
  { value: 'Q', label: 'Q', desc: '25%' },
  { value: 'H', label: 'H', desc: '30%' },
]

const isDefault = (s: QRStyle) =>
  s.fgColor === '#000000' && s.bgColor === '#FFFFFF' && s.level === 'M'

const QRStyleEditor = ({ qrStyle, onChange, onReset, expanded, onToggle }: QRStyleEditorProps) => {
  const customized = !isDefault(qrStyle)

  return (
    <div>
      <button onClick={onToggle}
        className="w-full flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          {t('style.title')}
          {customized && <span className="w-1.5 h-1.5 rounded-full inline-block ml-0.5" style={{ background: 'var(--color-primary)' }} />}
        </span>
        <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="min-h-0">
          <div className="space-y-3 pt-2.5 px-0.5">
            <div>
              <p className="text-xs mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>{t('style.presets')}</p>
              <div className="flex gap-2">
                {PRESETS.map(p => (
                  <button key={p.label} onClick={() => onChange({ fgColor: p.fg, bgColor: p.bg })} title={p.label}
                    className={`w-8 h-8 rounded-xl border-2 transition-all flex items-center justify-center flex-shrink-0 ${
                      qrStyle.fgColor === p.fg && qrStyle.bgColor === p.bg
                        ? 'border-[var(--color-primary)] scale-110 shadow-sm'
                        : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                    }`}
                    style={{ backgroundColor: p.bg }}>
                    <span className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: p.fg }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>{t('style.foreground')}</p>
                <div className="flex items-center gap-2">
                  <input type="color" value={qrStyle.fgColor} onChange={e => onChange({ fgColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer flex-shrink-0" style={{ border: '1px solid var(--color-border)' }} />
                  <span className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>{qrStyle.fgColor}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>{t('style.background')}</p>
                <div className="flex items-center gap-2">
                  <input type="color" value={qrStyle.bgColor} onChange={e => onChange({ bgColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer flex-shrink-0" style={{ border: '1px solid var(--color-border)' }} />
                  <span className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>{qrStyle.bgColor}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>{t('style.errorLevel')}</p>
              <div className="flex gap-1.5">
                {LEVELS.map(l => (
                  <button key={l.value} onClick={() => onChange({ level: l.value })}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all ${
                      qrStyle.level === l.value ? 'text-white shadow-sm' : 'hover:bg-[var(--color-muted-bg)]'
                    }`}
                    style={qrStyle.level === l.value
                      ? { background: 'var(--color-primary)' }
                      : { color: 'var(--color-text-secondary)', background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                    {l.label}<span className="opacity-60 ml-0.5">{l.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {customized && (
              <button onClick={onReset}
                className="w-full py-1.5 text-xs font-medium rounded-xl transition-colors"
                style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                {t('style.reset')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRStyleEditor
