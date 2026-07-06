import { useState, useEffect, useRef } from 'react'
import { copyToClipboard, downloadFile } from '@/utils/chrome'
import { useToast } from '../context/ToastContext'
import { t } from '@/utils/i18n'

const FORMATS = [
  { value: 'png', label: 'PNG' },
  { value: 'jpg', label: 'JPG' },
  { value: 'webp', label: 'WebP' },
] as const
type Format = typeof FORMATS[number]['value']
const SIZES = [256, 512, 1024, 2048]

interface ActionButtonsProps {
  url: string
  onReset: () => void
  hasChanges: boolean
  canvasRef: React.RefObject<HTMLCanvasElement>
}

const ActionButtons = ({ url, onReset, hasChanges, canvasRef }: ActionButtonsProps) => {
  const [showDl, setShowDl] = useState(false)
  const [fmt, setFmt] = useState<Format>('png')
  const [sz, setSz] = useState(512)
  const [uc, setUc] = useState(false)
  const [qc, setQc] = useState(false)
  const dlRef = useRef<HTMLDivElement>(null)
  const ht = useRef<ReturnType<typeof setTimeout>>()
  const { showToast } = useToast()

  useEffect(() => {
    if (!showDl) return
    const h = (e: MouseEvent) => { if (dlRef.current && !dlRef.current.contains(e.target as Node)) setShowDl(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [showDl])

  const fb = (s: (v: boolean) => void) => { s(true); setTimeout(() => s(false), 2000) }

  const copyUrl = async () => {
    if (await copyToClipboard(url)) { fb(setUc); showToast(t('action.urlCopied')) }
    else showToast(t('action.copyFailed'), 'error')
  }

  const copyQR = async () => {
    const c = canvasRef.current; if (!c) return
    try {
      const b = await new Promise<Blob>((r, j) => c.toBlob(x => x ? r(x) : j(), 'image/png'))
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })])
      fb(setQc); showToast(t('action.qrCopied'))
    } catch {
      try { await copyToClipboard(c.toDataURL('image/png')); fb(setQc); showToast(t('action.qrCopied')) }
      catch { showToast(t('action.copyFailed'), 'error') }
    }
  }

  const dl = () => {
    const c = canvasRef.current; if (!c) return
    // 从 URL 提取域名用于文件名
    let domain = ''
    try { domain = new URL(url).hostname.replace(/[^a-zA-Z0-9.-]/g, '_') } catch { /* non-url content */ }
    const prefix = domain ? `qr_${domain}` : 'qrcode'
    const ts = new Date().toISOString().slice(0, 10)
    const mime = fmt === 'jpg' ? 'image/jpeg' : `image/${fmt}`
    let d: string
    if (sz === c.width) { d = c.toDataURL(mime, 0.92) }
    else {
      const o = document.createElement('canvas'); o.width = sz; o.height = sz
      const x = o.getContext('2d')!
      if (fmt === 'jpg') { x.fillStyle = '#FFF'; x.fillRect(0, 0, sz, sz) }
      x.drawImage(c, 0, 0, sz, sz); d = o.toDataURL(mime, 0.92)
    }
    downloadFile(d, `${prefix}_${ts}.${fmt}`)
    showToast(t('action.downloaded')); setShowDl(false)
  }

  const bs = 'py-2 px-3 text-xs font-medium rounded-lg transition-colors'

  return (
    <div className="grid grid-cols-2 gap-2">
      <button onClick={copyUrl} className={`${bs} text-white hover:opacity-90`} style={{ background: 'var(--color-accent)' }}>
        {uc ? '✓' : t('action.copyUrl')}
      </button>
      <button onClick={copyQR} className={`${bs} hover:bg-[var(--color-muted-bg)]`}
        style={{ color: 'var(--color-text)', background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
        {qc ? '✓' : t('action.copyQr')}
      </button>

      <div className="relative" ref={dlRef}
        onMouseEnter={() => { clearTimeout(ht.current); setShowDl(true) }}
        onMouseLeave={() => { ht.current = setTimeout(() => setShowDl(false), 200) }}>
        <button className={`w-full ${bs} flex items-center justify-center gap-1 hover:bg-[var(--color-muted-bg)]`}
          style={{ color: 'var(--color-text)', background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          {t('action.download')}
          <svg className={`w-3 h-3 transition-transform ${showDl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showDl && (
          <div className="absolute bottom-full left-0 right-0 mb-1 rounded-lg shadow-lg z-10 p-3 space-y-3"
            style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <div>
              <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>{t('export.format')}</p>
              <div className="flex gap-1.5">
                {FORMATS.map(f => (
                  <button key={f.value} onClick={() => setFmt(f.value)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${fmt === f.value ? 'text-white' : ''}`}
                    style={fmt === f.value ? { background: 'var(--color-accent)' } : { background: 'var(--color-muted-bg)', color: 'var(--color-text-secondary)' }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>{t('export.size')}</p>
              <div className="grid grid-cols-4 gap-1.5">
                {SIZES.map(s => (
                  <button key={s} onClick={() => setSz(s)}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${sz === s ? 'text-white' : ''}`}
                    style={sz === s ? { background: 'var(--color-accent)' } : { background: 'var(--color-muted-bg)', color: 'var(--color-text-secondary)' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 8 }}>
              <button onClick={dl} className="w-full py-1.5 text-xs font-medium text-white rounded-lg hover:opacity-90 transition-colors"
                style={{ background: 'var(--color-accent)' }}>
                {t('export.download')}
              </button>
            </div>
          </div>
        )}
      </div>

      <button onClick={onReset} disabled={!hasChanges}
        className={`${bs} disabled:opacity-40 disabled:cursor-not-allowed`}
        style={{ color: 'var(--color-text-muted)' }}>
        {t('action.reset')}
      </button>
    </div>
  )
}

export default ActionButtons
