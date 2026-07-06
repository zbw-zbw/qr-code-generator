import React, { useState, useRef, useCallback } from 'react'
import jsQR from 'jsqr'
import { isValidUrl } from '@/utils/url'
import { DecodeResult } from '@/types'
import { t } from '@/utils/i18n'

interface QRCodeDecoderProps {
  onDecodeSuccess: (result: DecodeResult, previewUrl: string) => void
}

const QRCodeDecoder: React.FC<QRCodeDecoderProps> = ({ onDecodeSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [previewSrc, setPreviewSrc] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const decodeImage = useCallback((img: HTMLImageElement, preview: string) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = img.width; canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)
    if (code) {
      onDecodeSuccess({ content: code.data, type: isValidUrl(code.data) ? 'url' : 'text' }, preview)
      setError('')
    } else {
      setError(t('decode.noQrCode'))
    }
  }, [onDecodeSuccess])

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) { setError(t('decode.invalidFile')); return }
    setIsLoading(true); setError('')
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setPreviewSrc(dataUrl)
      const img = new Image()
      img.onload = () => { decodeImage(img, dataUrl); setIsLoading(false) }
      img.onerror = () => { setError(t('decode.loadFailed')); setIsLoading(false) }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }, [decodeImage])

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) { handleFileUpload(file); e.preventDefault() }
      }
    }
  }, [handleFileUpload])

  const handleUrlDecode = () => {
    const url = imageUrl.trim()
    if (!url) { setError(t('decode.enterUrl')); return }
    setIsLoading(true); setError(''); setPreviewSrc(url)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { decodeImage(img, url); setIsLoading(false) }
    img.onerror = () => { setError(t('decode.corsError')); setIsLoading(false); setPreviewSrc('') }
    img.src = url
  }

  const handleClear = () => {
    setPreviewSrc(''); setError(''); setImageUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  React.useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [handlePaste])

  return (
    <div className="space-y-3">
      {/* 图片预览 */}
      {previewSrc && (
        <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)', background: 'var(--color-muted-bg)' }}>
          <img src={previewSrc} alt="preview" className="w-full max-h-48 object-contain" />
          <button onClick={handleClear}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <div className="loading-spinner w-6 h-6" />
            </div>
          )}
        </div>
      )}

      {/* Section 1: 上传二维码图片 */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {t('decode.section.upload')}
        </label>

        {!previewSrc ? (
          <div
            className={`rounded-xl p-6 text-center cursor-pointer transition-colors duration-150 border border-dashed ${
              isDragging ? 'border-[var(--color-primary)]' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
            }`}
            style={{ background: isDragging ? 'var(--color-muted-bg)' : 'transparent' }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }}
            onDragEnter={e => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }}
            onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }}
            onDrop={e => {
              e.preventDefault(); e.stopPropagation(); setIsDragging(false)
              const file = e.dataTransfer.files?.[0]
              if (file) handleFileUpload(file)
            }}
          >
            <input ref={fileInputRef} type="file" accept="image/*"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }}
              className="hidden" />
            <svg className="w-6 h-6 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              style={{ color: isDragging ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
              {isDragging
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              }
            </svg>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {isDragging ? t('decode.dropHere') : t('decode.dragDrop')}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {t('decode.supportedFormats')}
            </p>
          </div>
        ) : (
          <div className="rounded-xl p-4 text-center cursor-pointer transition-colors border border-dashed"
            style={{ borderColor: 'var(--color-border)' }}
            onClick={() => fileInputRef.current?.click()}>
            <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{t('decode.dragDrop')}</p>
            <input ref={fileInputRef} type="file" accept="image/*"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }}
              className="hidden" />
          </div>
        )}

        {/* 单独一行提示：粘贴支持，只出现一次 */}
        <div className="flex items-center gap-1.5 px-0.5">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{t('decode.pasteHint')}</p>
          <kbd className="px-1.5 py-0.5 text-xs font-mono rounded-lg"
            style={{ background: 'var(--color-muted-bg)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>Ctrl+V</kbd>
        </div>
      </div>

      {/* Section 2: 在线图片地址 */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {t('decode.section.url')}
        </label>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{t('decode.section.urlDesc')}</p>
        <div className="flex gap-2">
          <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
            placeholder="https://cdn.example.com/qrcode.png" disabled={isLoading}
            className="flex-1 px-3 py-2 text-sm rounded-xl font-mono focus:outline-none"
            style={{ border: '1px solid var(--color-border)', background: 'var(--color-card)' }} />
          <button onClick={handleUrlDecode} disabled={isLoading || !imageUrl}
            className="py-2 px-3 text-xs font-medium text-white rounded-xl flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:opacity-90"
            style={{ background: 'var(--color-primary)' }}>
            {t('decode.decode')}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-2.5 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-error)' }}>{error}</p>
        </div>
      )}

      {/* 使用技巧 */}
      <div className="rounded-xl p-3 space-y-2" style={{ background: 'var(--color-muted-bg)' }}>
        <p className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{t('decode.tips.title')}</p>
        {(['decode.tips.1', 'decode.tips.2', 'decode.tips.3'] as const).map(key => (
          <div key={key} className="flex items-start gap-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              style={{ color: 'var(--color-primary)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{t(key)}</p>
          </div>
        ))}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default QRCodeDecoder
