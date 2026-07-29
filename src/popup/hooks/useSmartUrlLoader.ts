import { useState, useEffect, useCallback } from 'react'
import { getCurrentTabUrl } from '@/utils/chrome'
import { URLParam } from '@/types'

interface CachedData {
  url: string
  params: URLParam[]
}

interface UseSmartUrlLoaderReturn {
  currentUrl: string
  setCurrentUrl: (url: string) => void
  originalUrl: string
  setOriginalUrl: (url: string) => void
  cachedData: CachedData | null
  showRestoreHint: boolean
  restoreCached: () => void
  dismissRestore: () => void
}

export function useSmartUrlLoader(
  onUrlLoaded: (url: string) => void,
  params: URLParam[]
): UseSmartUrlLoaderReturn {
  const [currentUrl, setCurrentUrl] = useState<string>('')
  const [originalUrl, setOriginalUrl] = useState<string>('')
  const [cachedData, setCachedData] = useState<CachedData | null>(null)
  const [showRestoreHint, setShowRestoreHint] = useState(false)

  // 智能加载：优先使用当前页面 URL，检测缓存差异
  useEffect(() => {
    const smartLoad = async () => {
      try {
        const tabUrl = await getCurrentTabUrl()

        let cachedUrl = ''
        let cachedParams: URLParam[] = []

        if (typeof chrome !== 'undefined' && chrome.storage) {
          const result = await chrome.storage.local.get(['cachedUrl', 'cachedParams'])
          if (result.cachedUrl) {
            cachedUrl = result.cachedUrl
            cachedParams = result.cachedParams || []
          }
        }

        if (tabUrl) {
          if (cachedUrl && tabUrl === cachedUrl) {
            setCurrentUrl(cachedUrl)
            setOriginalUrl(cachedUrl)
            onUrlLoaded(cachedUrl)
          } else {
            setCurrentUrl(tabUrl)
            setOriginalUrl(tabUrl)
            onUrlLoaded(tabUrl)

            if (cachedUrl && cachedUrl !== tabUrl) {
              setCachedData({ url: cachedUrl, params: cachedParams })
              setShowRestoreHint(true)
            }
          }
        } else if (cachedUrl) {
          setCurrentUrl(cachedUrl)
          setOriginalUrl(cachedUrl)
          onUrlLoaded(cachedUrl)
        }
      } catch (error) {
        console.error('Smart load failed:', error)
      }
    }

    smartLoad()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 仅在存在未完成的编辑时缓存，避免把每个浏览过的 tab URL 都持久化到 storage
  useEffect(() => {
    if (!currentUrl || typeof chrome === 'undefined' || !chrome.storage) return
    if (currentUrl === originalUrl) {
      chrome.storage.local.remove(['cachedUrl', 'cachedParams']).catch(() => {})
      return
    }
    chrome.storage.local.set({
      cachedUrl: currentUrl,
      cachedParams: params,
    }).catch((error) => {
      console.error('Cache save failed:', error)
    })
  }, [currentUrl, originalUrl, params])

  const restoreCached = useCallback(() => {
    if (cachedData) {
      setCurrentUrl(cachedData.url)
      setOriginalUrl(cachedData.url)
      setShowRestoreHint(false)
      setCachedData(null)
    }
  }, [cachedData])

  const dismissRestore = useCallback(() => {
    setShowRestoreHint(false)
    setCachedData(null)
  }, [])

  return {
    currentUrl,
    setCurrentUrl,
    originalUrl,
    setOriginalUrl,
    cachedData,
    showRestoreHint,
    restoreCached,
    dismissRestore,
  }
}
