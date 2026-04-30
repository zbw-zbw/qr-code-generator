import { useState, useCallback } from 'react'
import QRCodeDisplay from './components/QRCodeDisplay'
import URLInput from './components/URLInput'
import URLParamsEditor from './components/URLParamsEditor'
import ActionButtons from './components/ActionButtons'
import ModeSwitch from './components/ModeSwitch'
import QRCodeDecoder from './components/QRCodeDecoder'
import DecodeResult from './components/DecodeResult'
import { URLParam, DecodeResult as DecodeResultType, Mode } from '@/types'
import { useUrlParams } from './hooks/useUrlParams'
import { useSmartUrlLoader } from './hooks/useSmartUrlLoader'

function App() {
  const [mode, setMode] = useState<Mode>('generate')
  const [decodeResult, setDecodeResult] = useState<DecodeResultType | null>(null)

  const { params, setParams, parseURLParams, rebuildURL } = useUrlParams()

  const handleUrlLoaded = useCallback((url: string) => {
    parseURLParams(url)
  }, [parseURLParams])

  const {
    currentUrl,
    setCurrentUrl,
    originalUrl,
    setOriginalUrl,
    cachedData,
    showRestoreHint,
    restoreCached,
    dismissRestore,
  } = useSmartUrlLoader(handleUrlLoaded, params)

  // 更新 URL
  const handleUrlChange = (newUrl: string) => {
    setCurrentUrl(newUrl)
    parseURLParams(newUrl)
  }

  // 更新参数
  const handleParamsChange = (newParams: URLParam[]) => {
    setParams(newParams)
    const newUrl = rebuildURL(currentUrl, newParams)
    setCurrentUrl(newUrl)
  }

  // 恢复原始 URL
  const handleReset = () => {
    setCurrentUrl(originalUrl)
    parseURLParams(originalUrl)
  }

  // 处理模式切换
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode)
    if (newMode === 'decode') {
      setDecodeResult(null)
    }
  }

  // 处理解码成功
  const handleDecodeSuccess = (result: DecodeResultType) => {
    setDecodeResult(result)
  }

  // 处理复制解码结果
  const handleCopyDecodeResult = () => {
    if (decodeResult) {
      navigator.clipboard.writeText(decodeResult.content)
    }
  }

  // 处理打开解码的链接
  const handleOpenDecodeLink = () => {
    if (decodeResult && decodeResult.type === 'url') {
      chrome.tabs.create({ url: decodeResult.content })
    }
  }

  // 处理编辑解码的 URL 参数
  const handleEditDecodeParams = () => {
    if (decodeResult && decodeResult.type === 'url') {
      setMode('generate')
      setCurrentUrl(decodeResult.content)
      setOriginalUrl(decodeResult.content)
      parseURLParams(decodeResult.content)
      setDecodeResult(null)
    }
  }

  // 恢复上次编辑的内容
  const handleRestoreCached = () => {
    restoreCached()
    if (cachedData) {
      setParams(cachedData.params)
    }
  }

  return (
    <div className="w-96 bg-white">
      {/* 顶部区域 - 模式切换和二维码 */}
      <div className="p-3">
        <ModeSwitch mode={mode} onChange={handleModeChange} />

        {mode === 'generate' && (
          <div className="mt-3">
            <QRCodeDisplay url={currentUrl} />
          </div>
        )}
      </div>

      {/* 生成模式内容 */}
      {mode === 'generate' && (
        <>
          {/* 恢复缓存提示 */}
          {showRestoreHint && cachedData && (
            <div className="mx-3 mb-3 p-2.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-purple-900 mb-1">检测到上次编辑的内容 Previous Edit Detected</p>
                  <p className="text-xs text-purple-700 break-all font-mono mb-2">{cachedData.url}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRestoreCached}
                      className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                      恢复编辑 Restore
                    </button>
                    <button
                      onClick={dismissRestore}
                      className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      忽略 Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="px-3 pb-3">
            <URLInput
              url={currentUrl}
              onChange={handleUrlChange}
            />
          </div>

          <div className="px-3 pb-3">
            <URLParamsEditor
              params={params}
              onChange={handleParamsChange}
            />
          </div>

          <div className="px-3 pb-3">
            <ActionButtons
              url={currentUrl}
              onReset={handleReset}
              hasChanges={currentUrl !== originalUrl}
            />
          </div>
        </>
      )}

      {/* 解码模式内容 */}
      {mode === 'decode' && (
        <div className="p-3">
          {!decodeResult ? (
            <QRCodeDecoder onDecodeSuccess={handleDecodeSuccess} />
          ) : (
            <DecodeResult
              result={decodeResult}
              onCopy={handleCopyDecodeResult}
              onOpenLink={handleOpenDecodeLink}
              onEditParams={handleEditDecodeParams}
            />
          )}

          {decodeResult && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setDecodeResult(null)}
                className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                重新解码
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
