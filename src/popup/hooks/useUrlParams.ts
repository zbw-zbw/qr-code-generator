import { useState, useCallback } from 'react'
import { URLParam } from '@/types'

interface UseUrlParamsReturn {
  params: URLParam[]
  setParams: (params: URLParam[]) => void
  parseURLParams: (url: string) => URLParam[]
  rebuildURL: (baseUrl: string, newParams: URLParam[]) => string
}

export function useUrlParams(initialParams: URLParam[] = []): UseUrlParamsReturn {
  const [params, setParams] = useState<URLParam[]>(initialParams)

  const parseURLParams = useCallback((url: string): URLParam[] => {
    try {
      const urlObj = new URL(url)
      const searchParams = urlObj.searchParams
      const paramsList: URLParam[] = []

      searchParams.forEach((value, key) => {
        try {
          const decodedValue = decodeURIComponent(value)
          paramsList.push({
            key: decodeURIComponent(key),
            value: decodedValue,
          })
        } catch {
          paramsList.push({ key, value })
        }
      })

      setParams(paramsList)
      return paramsList
    } catch {
      setParams([])
      return []
    }
  }, [])

  const rebuildURL = useCallback((baseUrl: string, newParams: URLParam[]): string => {
    try {
      const urlObj = new URL(baseUrl)
      urlObj.search = ''

      newParams.forEach((param) => {
        if (param.key.trim() && param.value.trim()) {
          urlObj.searchParams.append(param.key.trim(), param.value.trim())
        }
      })

      return urlObj.toString()
    } catch {
      return baseUrl
    }
  }, [])

  return { params, setParams, parseURLParams, rebuildURL }
}
