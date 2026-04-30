import React from 'react'
import { DecodeResult as DecodeResultType } from '@/types'

interface DecodeResultProps {
  result: DecodeResultType
  onCopy: () => void
  onOpenLink: () => void
  onEditParams: () => void
}

const DecodeResult: React.FC<DecodeResultProps> = ({
  result,
  onCopy,
  onOpenLink,
  onEditParams,
}) => {
  const { content, type } = result

  return (
    <div className="space-y-3">
      {/* 解码成功卡片 */}
      <div className="param-item p-3">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-700">解码成功 Decoded</span>
          <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            type === 'url'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {type === 'url' ? 'URL' : 'TEXT'}
          </span>
        </div>

        {/* 解码内容 */}
        <div className="p-2.5 bg-white border border-gray-100 rounded-lg">
          <p className="text-xs text-gray-800 break-all font-mono leading-relaxed">
            {content}
          </p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onCopy}
          className="py-2 px-3 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          复制内容 Copy
        </button>

        {type === 'url' && (
          <button
            onClick={onOpenLink}
            className="py-2 px-3 text-xs font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg hover:from-purple-600 hover:to-purple-800 transition-all"
          >
            打开链接 Open
          </button>
        )}

        {type === 'url' && (
          <button
            onClick={onEditParams}
            className="py-2 px-3 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all"
          >
            编辑参数 Edit
          </button>
        )}
      </div>
    </div>
  )
}

export default DecodeResult 
 