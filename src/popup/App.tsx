import { useState, useCallback, useEffect, useRef } from 'react'
import QRCodeDisplay from './components/QRCodeDisplay'
import URLInput from './components/URLInput'
import URLParamsEditor from './components/URLParamsEditor'
import ActionButtons from './components/ActionButtons'
import ModeSwitch from './components/ModeSwitch'
import QRCodeDecoder from './components/QRCodeDecoder'
import DecodeResult from './components/DecodeResult'
import QRStyleEditor from './components/QRStyleEditor'
import LogoEditor from './components/LogoEditor'
import ContentTypeSelector from './components/ContentTypeSelector'
import HistoryPanel from './components/HistoryPanel'
import DecodeHistoryPanel from './components/DecodeHistoryPanel'
import TextForm from './components/forms/TextForm'
import WiFiForm from './components/forms/WiFiForm'
import EmailForm from './components/forms/EmailForm'
import PhoneForm from './components/forms/PhoneForm'
import SMSForm from './components/forms/SMSForm'
import VCardForm from './components/forms/VCardForm'
import { ToastProvider } from './context/ToastContext'
import { DecodeResult as DecodeResultType, Mode, ContentType, HistoryRecord } from '@/types'
import { useUrlParams } from './hooks/useUrlParams'
import { useSmartUrlLoader } from './hooks/useSmartUrlLoader'
import { useQRStyle } from './hooks/useQRStyle'
import { useHistory } from './hooks/useHistory'
import { useDecodeHistory } from './hooks/useDecodeHistory'
import { t } from '@/utils/i18n'

type Section = 'style' | 'logo' | 'contentType'

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// 历史图标按钮 — 放在内容区右上角
function HistoryBtn({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-1.5 text-xs font-medium transition-colors"
      style={{ color: 'var(--color-text-secondary)' }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{t('history.title')}</span>
      {count > 0 && (
        <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-lg text-xs leading-none"
          style={{ background: 'var(--color-muted-bg)', color: 'var(--color-text-secondary)' }}>
          {count}
        </span>
      )}
    </button>
  )
}

function AppInner() {
  const [mode, setMode] = useState<Mode>('generate')
  const [showHistory, setShowHistory] = useState(false)
  const [decodeResult, setDecodeResult] = useState<DecodeResultType | null>(null)
  const [decodePreview, setDecodePreview] = useState('')
  const [contentType, setContentType] = useState<ContentType>('url')
  const [customContent, setCustomContent] = useState('')
  const [expandedSection, setExpandedSection] = useState<Section | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const savedScrollRef = useRef(0)
  const { qrStyle, setQRStyle, resetStyle } = useQRStyle()
  const { records, addRecord, removeRecord, clearAll } = useHistory()
  const { records: decodeRecords, addRecord: addDecodeRecord, removeRecord: removeDecodeRecord, clearAll: clearDecodeAll } = useDecodeHistory()
  const { params, setParams, parseURLParams, rebuildURL } = useUrlParams()

  const handleUrlLoaded = useCallback((url: string) => parseURLParams(url), [parseURLParams])

  const {
    currentUrl, setCurrentUrl, originalUrl, setOriginalUrl,
    cachedData, showRestoreHint, restoreCached, dismissRestore,
  } = useSmartUrlLoader(handleUrlLoaded, params)

  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.storage) return
    chrome.storage.local.get(['contextMenuData']).then(result => {
      if (!result.contextMenuData) return
      const { text } = result.contextMenuData
      chrome.storage.local.remove(['contextMenuData'])
      if (!text) return
      setCurrentUrl(text); setOriginalUrl(text)
      parseURLParams(text); setMode('generate'); setContentType('url')
    }).catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const qrValue = contentType === 'url' ? currentUrl : customContent
  const debouncedQrValue = useDebounce(qrValue, 300)

  const didMountRef = useRef(false)
  useEffect(() => {
    if (!didMountRef.current) { didMountRef.current = true; return }
    if (!debouncedQrValue) return
    addRecord(debouncedQrValue, qrStyle)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQrValue])

  const toggleSection = (s: Section) =>
    setExpandedSection(prev => prev === s ? null : s)

  // 从历史页返回时恢复滚动位置
  useEffect(() => {
    if (!showHistory && scrollRef.current && savedScrollRef.current > 0) {
      requestAnimationFrame(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = savedScrollRef.current
      })
    }
  }, [showHistory])

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode)
    setShowHistory(false)
    if (newMode === 'decode') { setDecodeResult(null); setDecodePreview('') }
  }

  const handleSelectHistory = (record: HistoryRecord) => {
    const c = record.content
    if (c.startsWith('WIFI:'))            { setCustomContent(c); setContentType('wifi') }
    else if (c.startsWith('mailto:'))      { setCustomContent(c); setContentType('email') }
    else if (c.startsWith('tel:'))         { setCustomContent(c); setContentType('phone') }
    else if (c.startsWith('smsto:'))       { setCustomContent(c); setContentType('sms') }
    else if (c.startsWith('BEGIN:VCARD')) { setCustomContent(c); setContentType('vcard') }
    else { setCurrentUrl(c); setOriginalUrl(c); parseURLParams(c); setContentType('url') }
    setQRStyle(record.qrStyle)
    setShowHistory(false)
  }

  const handleDecodeSuccess = (result: DecodeResultType, preview: string) => {
    setDecodeResult(result); setDecodePreview(preview)
    addDecodeRecord(result.content, result.type, preview)
  }

  const historyCount = mode === 'generate' ? records.length : decodeRecords.length

  return (
    // flex 布局：header 固定，内容区独立滚动。尺寸完全继承自 #root（见 globals.css）
    <div className="flex flex-col w-full h-full">

      {/* ── 固定 Header（永不随内容滚动）── */}
      <div className="flex-shrink-0 bg-[var(--color-card)] px-3 pt-3 pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <ModeSwitch mode={mode} onChange={handleModeChange} />
      </div>

      {/* ── 可滚动内容区（唯一的滚动容器）── */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

        {/* 内容区右上角：历史按钮（浮于内容顶部） */}
        {!showHistory && (
          <div className="flex justify-end px-3 pt-3 pb-2">
            <HistoryBtn count={historyCount} onClick={() => { savedScrollRef.current = scrollRef.current?.scrollTop || 0; setShowHistory(true) }} />
          </div>
        )}

        {/* 生成模式 */}
        {!showHistory && mode === 'generate' && (
          <>
            <div className="px-3 pt-1 pb-3">
              <QRCodeDisplay url={debouncedQrValue} qrStyle={qrStyle} ref={canvasRef} />
            </div>

            {showRestoreHint && cachedData && contentType === 'url' && (
              <div className="mx-3 mb-3 p-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[var(--color-text)] mb-1">{t('restore.title')}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] break-all font-mono mb-2">{cachedData.url}</p>
                    <div className="flex gap-2">
                      <button onClick={() => { restoreCached(); if (cachedData) setParams(cachedData.params) }}
                        className="px-3 py-1 text-xs font-medium text-white bg-[var(--color-primary)] rounded-lg hover:opacity-90 transition-colors">
                        {t('restore.restore')}
                      </button>
                      <button onClick={dismissRestore}
                        className="px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-muted-bg)] transition-colors">
                        {t('restore.dismiss')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="px-3 pb-3">
              <QRStyleEditor qrStyle={qrStyle} onChange={setQRStyle} onReset={resetStyle}
                expanded={expandedSection === 'style'} onToggle={() => toggleSection('style')} />
            </div>
            <div className="px-3 pb-3">
              <LogoEditor logoSrc={qrStyle.logoSrc} logoSize={qrStyle.logoSize}
                onLogoChange={src => setQRStyle({ logoSrc: src })}
                onSizeChange={size => setQRStyle({ logoSize: size })}
                expanded={expandedSection === 'logo'} onToggle={() => toggleSection('logo')} />
            </div>
            <div className="px-3 pb-2">
              <ContentTypeSelector value={contentType}
                onChange={type => { setContentType(type); setCustomContent('') }}
                expanded={expandedSection === 'contentType'} onToggle={() => toggleSection('contentType')} />
            </div>

            {contentType === 'url' ? (
              <>
                <div className="px-3 pb-3">
                  <URLInput url={currentUrl} onChange={url => { setCurrentUrl(url); parseURLParams(url) }} />
                </div>
                <div className="px-3 pb-3">
                  <URLParamsEditor params={params} onChange={newParams => {
                    setParams(newParams); setCurrentUrl(rebuildURL(currentUrl, newParams))
                  }} />
                </div>
              </>
            ) : (
              <div className="px-3 pb-3">
                {contentType === 'text'  && <TextForm  onChange={setCustomContent} />}
                {contentType === 'wifi'  && <WiFiForm  onChange={setCustomContent} />}
                {contentType === 'email' && <EmailForm onChange={setCustomContent} />}
                {contentType === 'phone' && <PhoneForm onChange={setCustomContent} />}
                {contentType === 'sms'   && <SMSForm   onChange={setCustomContent} />}
                {contentType === 'vcard' && <VCardForm onChange={setCustomContent} />}
              </div>
            )}

            <div className="px-3 pb-4">
              <ActionButtons url={qrValue}
                onReset={() => { setCurrentUrl(originalUrl); parseURLParams(originalUrl) }}
                hasChanges={contentType === 'url' ? currentUrl !== originalUrl : !!customContent}
                canvasRef={canvasRef} />
            </div>
          </>
        )}

        {/* 生成历史全页 — 占满剩余空间 */}
        {showHistory && mode === 'generate' && (
          <HistoryPanel records={records} onSelect={handleSelectHistory}
            onRemove={removeRecord} onClearAll={clearAll}
            onBack={() => setShowHistory(false)} />
        )}

        {/* 解码模式 */}
        {!showHistory && mode === 'decode' && (
          <div className="p-3 space-y-3">
            {!decodeResult ? (
              <QRCodeDecoder onDecodeSuccess={handleDecodeSuccess} />
            ) : (
              <DecodeResult result={decodeResult} previewUrl={decodePreview}
                onCopy={() => navigator.clipboard.writeText(decodeResult.content)}
                onOpenLink={() => decodeResult.type === 'url' && chrome.tabs.create({ url: decodeResult.content })}
                onEditParams={() => {
                  if (decodeResult.type === 'url') {
                    setMode('generate'); setContentType('url')
                    setCurrentUrl(decodeResult.content); setOriginalUrl(decodeResult.content)
                    parseURLParams(decodeResult.content); setDecodeResult(null); setDecodePreview('')
                  }
                }}
                onReDecode={() => { setDecodeResult(null); setDecodePreview('') }}
              />
            )}
          </div>
        )}

        {/* 解码历史全页 — 占满剩余空间 */}
        {showHistory && mode === 'decode' && (
          <DecodeHistoryPanel records={decodeRecords}
            onSelect={r => {
              setDecodeResult({ content: r.content, type: r.type })
              setDecodePreview(r.previewUrl || '')
              setShowHistory(false)
            }}
            onRemove={removeDecodeRecord}
            onClearAll={clearDecodeAll}
            onBack={() => setShowHistory(false)}
          />
        )}

      </div>
    </div>
  )
}

function App() {
  return <ToastProvider><AppInner /></ToastProvider>
}

export default App
