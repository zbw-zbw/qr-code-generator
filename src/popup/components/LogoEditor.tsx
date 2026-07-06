import { useState, useRef } from 'react'
import { t } from '@/utils/i18n'

interface LogoEditorProps {
  logoSrc: string | null
  logoSize: number
  onLogoChange: (src: string | null) => void
  onSizeChange: (size: number) => void
  expanded: boolean
  onToggle: () => void
}

const LogoEditor = ({ logoSrc, logoSize, onLogoChange, onSizeChange, expanded, onToggle }: LogoEditorProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => onLogoChange(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <button onClick={onToggle}
        className="w-full flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {t('logo.title')}
          {logoSrc && <span className="w-1.5 h-1.5 rounded-full inline-block ml-0.5" style={{ background: 'var(--color-primary)' }} />}
        </span>
        <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="min-h-0">
          <div className="pt-2.5">
            {logoSrc ? (
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--color-muted-bg)' }}>
                <img src={logoSrc} className="w-10 h-10 rounded-xl object-contain flex-shrink-0"
                  style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }} alt="logo" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{t('logo.size')} {logoSize}%</span>
                    <button onClick={() => onLogoChange(null)}
                      className="text-xs font-medium" style={{ color: 'var(--color-error)' }}>
                      {t('logo.remove')}
                    </button>
                  </div>
                  <input type="range" min={10} max={35} value={logoSize}
                    onChange={e => onSizeChange(Number(e.target.value))}
                    className="w-full h-1.5 mt-1.5" style={{ accentColor: 'var(--color-primary)' }} />
                </div>
              </div>
            ) : (
              <div
                className={`rounded-xl p-6 text-center cursor-pointer transition-colors duration-150 border border-dashed ${
                  isDragging ? 'border-[var(--color-primary)]' : 'border-[var(--color-border)]'
                }`}
                style={{ background: isDragging ? 'var(--color-muted-bg)' : 'transparent' }}
                onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragEnter={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={e => { e.preventDefault(); setIsDragging(false) }}
                onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f) }}
                onMouseEnter={e => { if (!isDragging) e.currentTarget.style.borderColor = 'var(--color-primary)' }}
                onMouseLeave={e => { if (!isDragging) e.currentTarget.style.borderColor = 'var(--color-border)' }}
              >
                <svg className="w-6 h-6 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ color: isDragging ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{t('logo.upload')}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{t('logo.dragDrop')}</p>
              </div>
            )}
            <p className="text-xs mt-1.5" style={{ color: 'var(--color-text-muted)' }}>{t('logo.hint')}</p>
          </div>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
    </div>
  )
}

export default LogoEditor
