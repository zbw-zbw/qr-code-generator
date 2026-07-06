import { forwardRef, useRef, useImperativeHandle } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { QRStyle } from '@/types'

interface QRCodeDisplayProps {
  url: string
  qrStyle: QRStyle
}

const QRCodeDisplay = forwardRef<HTMLCanvasElement, QRCodeDisplayProps>(
  ({ url, qrStyle }, ref) => {
    const { fgColor, bgColor, logoSrc, logoSize, level } = qrStyle
    const size = 240
    const wrapperRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => {
      return wrapperRef.current?.querySelector('canvas') as HTMLCanvasElement
    })

    const imageSettings = logoSrc
      ? { src: logoSrc, width: Math.round(size * logoSize / 100), height: Math.round(size * logoSize / 100), excavate: true }
      : undefined

    return (
      <div className="w-full rounded-2xl flex items-center justify-center py-6" style={{ background: 'var(--color-card)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)' }}>
        {url ? (
          <div key={url.slice(0, 30)} className="p-3 rounded-2xl animate-qr-in" style={{ backgroundColor: bgColor }}>
            <div ref={wrapperRef}>
              <QRCodeCanvas value={url} size={size} level={logoSrc ? 'H' : level}
                fgColor={fgColor} bgColor={bgColor} includeMargin={false}
                className="block rounded-xl" imageSettings={imageSettings} />
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl animate-qr-in">
            <div className="rounded-2xl flex items-center justify-center" style={{ width: size, height: size, background: 'var(--color-muted-bg)' }}>
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
                <rect x="2" y="2" width="8" height="8" rx="1" strokeWidth="1" />
                <rect x="14" y="2" width="8" height="8" rx="1" strokeWidth="1" />
                <rect x="2" y="14" width="8" height="8" rx="1" strokeWidth="1" />
                <path d="M14 14h2v2h-2zM16 16h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" fill="currentColor" stroke="none" />
              </svg>
            </div>
          </div>
        )}
      </div>
    )
  }
)

QRCodeDisplay.displayName = 'QRCodeDisplay'
export default QRCodeDisplay
