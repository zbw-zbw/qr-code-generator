import { QRCodeCanvas } from 'qrcode.react'
import { QRStyle } from '@/types'
import { exceedsCapacity } from '@/utils/qrCapacity'
import { isPoorScanContrast } from '@/utils/contrast'
import { t } from '@/utils/i18n'

interface QRCodeDisplayProps {
  url: string
  qrStyle: QRStyle
}

const QRCodeDisplay = ({ url, qrStyle }: QRCodeDisplayProps) => {
  const { fgColor, bgColor, logoSrc, logoSize, logoPadding, logoRadius, level } = qrStyle
  const size = 240
  const effectiveLevel = logoSrc ? 'H' : level
  // 超出容量时 QRCodeCanvas 会抛异常导致整页崩溃，先行拦截
  const overflow = !!url && exceedsCapacity(url, effectiveLevel)

  // 与导出（qrExport）同一套布局语义：盒子含白边，白边向内收缩，破坏面积恒定
  const boxPx = Math.round(size * logoSize / 100)
  const padPx = Math.round(boxPx * logoPadding / 100)
  const boxRadiusPx = boxPx * logoRadius / 100
  const innerRadiusPx = Math.max(0, boxRadiusPx - padPx)

  const poorContrast = !!url && !overflow && isPoorScanContrast(fgColor, bgColor)

  return (
    <div className="w-full rounded-2xl flex flex-col items-center justify-center py-4" style={{ background: 'var(--color-card)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)' }}>
      {url && !overflow ? (
        <div key={url} className="p-3 rounded-2xl animate-qr-in" style={{ backgroundColor: bgColor }}>
          <div className="relative">
            <QRCodeCanvas value={url} size={size} level={effectiveLevel}
              fgColor={fgColor} bgColor={bgColor} includeMargin={false}
              className="block rounded-xl" />
            {logoSrc && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div style={{
                  width: boxPx, height: boxPx,
                  background: bgColor,
                  borderRadius: boxRadiusPx,
                  padding: padPx,
                  boxSizing: 'border-box',
                }}>
                  {/* cover 居中裁剪：占满盒子不留白，非正方形图片裁剪而非拉伸 */}
                  <img src={logoSrc} alt="" style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    borderRadius: innerRadiusPx,
                    display: 'block',
                  }} />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : overflow ? (
        <div className="p-3 rounded-2xl animate-qr-in">
          <div className="rounded-2xl flex flex-col items-center justify-center gap-2 px-6 text-center" style={{ width: size, height: size, background: 'var(--color-muted-bg)' }}>
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#D97706' }}>
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{t('qr.overflow')}</p>
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
      {poorContrast && (
        <div className="flex items-center gap-1.5 mt-1 mx-6 px-2 py-1.5 rounded-lg" style={{ background: '#FFFBEB' }}>
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#D97706' }}>
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: '#B45309' }}>{t('style.contrastWarn')}</p>
        </div>
      )}
    </div>
  )
}

export default QRCodeDisplay
