import { useEffect, useRef } from 'react'
import { isValidUrl } from '@/utils/url'
import { t } from '@/utils/i18n'

const MAX_QR_LENGTH = 2953

interface URLInputProps {
  url: string
  onChange: (url: string) => void
}

const URLInput = ({ url, onChange }: URLInputProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isValid = !url || isValidUrl(url)
  const isText = !!url && !isValidUrl(url)
  const isTooLong = url.length > MAX_QR_LENGTH

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      const len = inputRef.current.value.length
      inputRef.current.setSelectionRange(len, len)
    }
  }, [])

  return (
    <div className="space-y-2 mb-3">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text)]">
        <svg className="w-3.5 h-3.5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        {t('url.label')}
      </label>
      <div className="relative">
        <textarea
          ref={inputRef}
          value={url}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className={`w-full px-3 py-2.5 pr-8 text-sm border rounded-lg transition-colors duration-150 font-mono resize-none ${
            isTooLong
              ? 'border-red-300 bg-red-50 focus:outline-none focus:ring-1 focus:ring-red-400'
              : isText
              ? 'border-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-400'
              : 'border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]'
          }`}
          style={{ wordBreak: 'break-all', overflowWrap: 'anywhere', lineHeight: '1.5' }}
          placeholder={t('url.placeholder')}
        />
        {url && isValid && !isTooLong && (
          <div className="absolute right-3 top-2.5 pointer-events-none bg-white rounded-full p-0.5">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {isTooLong && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2 py-1.5 rounded-lg">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{t('url.tooLong', { length: url.length, max: MAX_QR_LENGTH })}</span>
        </div>
      )}

      {!isTooLong && isText && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1.5 rounded-lg">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{t('url.textHint')}</span>
        </div>
      )}
    </div>
  )
}

export default URLInput
