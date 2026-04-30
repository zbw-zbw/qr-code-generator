import { QRCodeSVG } from 'qrcode.react'
import { isValidUrl } from '@/utils/url'

interface QRCodeDisplayProps {
  url: string
}

const QRCodeDisplay = ({ url }: QRCodeDisplayProps) => {
  if (!url || !isValidUrl(url)) {
    return (
      <div className="w-full bg-gray-50 rounded-xl p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-white rounded-2xl mb-3 flex items-center justify-center mx-auto shadow-sm">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 font-medium">请输入有效的 URL<br/>Please enter a valid URL</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 flex items-center justify-center">
      <div className="bg-white p-3 rounded-xl shadow-md">
        <QRCodeSVG
          value={url}
          size={240}
          level="M"
          includeMargin={false}
          className="block"
        />
      </div>
    </div>
  )
}

export default QRCodeDisplay 
 