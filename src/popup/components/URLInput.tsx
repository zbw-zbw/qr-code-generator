import { useEffect, useRef } from 'react'
import { isValidUrl } from '@/utils/url'

interface URLInputProps {
  url: string
  onChange: (url: string) => void
}

const URLInput = ({ url, onChange }: URLInputProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 实时更新URL
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newUrl = e.target.value
    onChange(newUrl)
  }

  // 自动聚焦
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      // 将光标移到末尾
      const length = inputRef.current.value.length
      inputRef.current.setSelectionRange(length, length)
    }
  }, [])

  return (
    <div className="space-y-2 mb-3">
      <label className="block text-xs font-semibold gradient-text">
        链接地址 URL
      </label>

      <div className="relative">
        <textarea
          ref={inputRef}
          value={url}
          onChange={handleChange}
          rows={3}
          className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg transition-all duration-300 font-mono resize-none ${
            !url || isValidUrl(url)
              ? 'border-gray-200 shadow-sm focus:outline-none focus:border-transparent focus:shadow-lg focus:ring-2 focus:ring-purple-400'
              : 'border-red-300 shadow-sm bg-red-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-red-400'
          }`}
          style={{ wordBreak: 'break-all', overflowWrap: 'anywhere', lineHeight: '1.5' }}
          placeholder="输入完整的 URL 地址 (Enter full URL)"
        />
        {url && isValidUrl(url) && (
          <div className="absolute right-3 top-2 pointer-events-none bg-white rounded-full p-0.5">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {url && !isValidUrl(url) && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2 py-1.5 rounded-lg">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>URL 格式无效 Invalid URL</span>
        </div>
      )}
    </div>
  )
}

export default URLInput 
 