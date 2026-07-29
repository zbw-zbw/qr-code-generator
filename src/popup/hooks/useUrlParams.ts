import { useState, useCallback } from 'react'
import { URLParam } from '@/types'
import { parseParams, buildUrl } from '@/utils/urlParams'

interface UseUrlParamsReturn {
  params: URLParam[]
  setParams: (params: URLParam[]) => void
  parseURLParams: (url: string) => URLParam[]
  rebuildURL: (baseUrl: string, newParams: URLParam[]) => string
}

// params 中的 key/value 均为 URL 原始（已编码）形态，保证往返不改写未编辑参数
export function useUrlParams(initialParams: URLParam[] = []): UseUrlParamsReturn {
  const [params, setParams] = useState<URLParam[]>(initialParams)

  const parseURLParams = useCallback((url: string): URLParam[] => {
    const paramsList = parseParams(url)
    setParams(paramsList)
    return paramsList
  }, [])

  const rebuildURL = useCallback(
    (baseUrl: string, newParams: URLParam[]): string => buildUrl(baseUrl, newParams),
    []
  )

  return { params, setParams, parseURLParams, rebuildURL }
}
