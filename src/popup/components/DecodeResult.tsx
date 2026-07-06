import React, { useState } from 'react'
import { DecodeResult as DecodeResultType } from '@/types'
import SafetyModal from './SafetyModal'
import { t } from '@/utils/i18n'

interface DecodeResultProps {
  result: DecodeResultType
  previewUrl?: string
  onCopy: () => void
  onOpenLink: () => void
  onEditParams: () => void
  onReDecode: () => void
}

const DecodeResult: React.FC<DecodeResultProps> = ({ result, previewUrl, onCopy, onOpenLink, onEditParams, onReDecode }) => {
  const { content, type } = result
  const [showSafety, setShowSafety] = useState(false)

  let urlDetails: { protocol: string; hostname: string; path: string; paramCount: number; params: { key: string; value: string }[] } | null = null
  if (type === 'url') {
    try {
      const u = new URL(content)
      const params: { key: string; value: string }[] = []
      u.searchParams.forEach((v, k) => params.push({ key: k, value: v }))
      urlDetails = { protocol: u.protocol.replace(':', ''), hostname: u.hostname, path: u.pathname !== '/' ? u.pathname : '', paramCount: params.length, params }
    } catch { /* noop */ }
  }

  const btnPrimary = "py-2 px-3 text-xs font-medium text-white rounded-xl transition-colors hover:opacity-90"
  const btnSecondary = "py-2 px-3 text-xs font-medium rounded-xl transition-colors hover:bg-[var(--color-muted-bg)]"

  return (
    <>
      <div className="space-y-3">
        {previewUrl && (
          <div className="rounded-xl overflow-hidden flex items-center justify-center" style={{ maxHeight: 160, border: '1px solid var(--color-border)', background: 'var(--color-muted-bg)' }}>
            <img src={previewUrl} alt="decoded" className="max-h-40 w-full object-contain" />
          </div>
        )}

        <div className="param-item space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#DCFCE7' }}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-success)' }}>
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{t('result.decoded')}</span>
            <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium"
              style={type === 'url' ? { background: 'var(--color-muted-bg)', color: 'var(--color-primary)' } : { background: 'var(--color-muted-bg)', color: 'var(--color-text-secondary)' }}>
              {type === 'url' ? 'URL' : 'TEXT'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl" style={{ background: 'var(--color-muted-bg)' }}>
            <p className="text-xs break-all font-mono leading-relaxed" style={{ color: 'var(--color-text)' }}>{content}</p>
          </div>
          {urlDetails && (
            <div className="space-y-2 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>{t('result.urlDetails')}</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 p-2 rounded-lg" style={{ background: 'var(--color-muted-bg)' }}>
                  <span className="text-xs w-10 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>{t('result.protocol')}</span>
                  <span className="text-xs font-mono font-semibold uppercase" style={{ color: 'var(--color-text)' }}>{urlDetails.protocol}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg" style={{ background: 'var(--color-muted-bg)' }}>
                  <span className="text-xs w-10 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>{t('result.domain')}</span>
                  <span className="text-xs font-mono font-semibold break-all" style={{ color: 'var(--color-text)' }}>{urlDetails.hostname}</span>
                </div>
                {urlDetails.path && (
                  <div className="flex items-center gap-1.5 p-2 rounded-lg" style={{ background: 'var(--color-muted-bg)' }}>
                    <span className="text-xs w-10 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>{t('result.path')}</span>
                    <span className="text-xs font-mono break-all" style={{ color: 'var(--color-text-secondary)' }}>{urlDetails.path}</span>
                  </div>
                )}
                {urlDetails.paramCount > 0 && (
                  <div className="flex items-start gap-1.5 p-2 rounded-lg" style={{ background: 'var(--color-muted-bg)' }}>
                    <span className="text-xs w-10 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{t('result.params')}</span>
                    <div className="flex-1 min-w-0 space-y-1">
                      {urlDetails.params.slice(0, 3).map(p => (
                        <div key={p.key} className="flex items-baseline gap-1 text-xs font-mono">
                          <span className="font-semibold flex-shrink-0" style={{ color: 'var(--color-text)' }}>{p.key}</span>
                          <span style={{ color: 'var(--color-text-muted)' }}>=</span>
                          <span className="truncate" style={{ color: 'var(--color-text-secondary)' }}>{p.value}</span>
                        </div>
                      ))}
                      {urlDetails.paramCount > 3 && <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>+{urlDetails.paramCount - 3}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onCopy} className={btnPrimary} style={{ background: 'var(--color-primary)' }}>{t('result.copy')}</button>
          {type === 'url' && <button onClick={() => setShowSafety(true)} className={btnSecondary}
            style={{ color: 'var(--color-text)', border: '1px solid var(--color-border)', background: 'var(--color-card)' }}>{t('result.open')}</button>}
          {type === 'url' && <button onClick={onEditParams} className={btnSecondary}
            style={{ color: 'var(--color-text)', border: '1px solid var(--color-border)', background: 'var(--color-card)' }}>{t('result.edit')}</button>}
          <button onClick={onReDecode} className="py-2 px-3 text-xs font-medium transition-colors rounded-xl"
            style={{ color: 'var(--color-text-muted)' }}>{t('result.retry')}</button>
        </div>
      </div>
      {showSafety && <SafetyModal url={content} onConfirm={() => { setShowSafety(false); onOpenLink() }} onCancel={() => setShowSafety(false)} />}
    </>
  )
}

export default DecodeResult
