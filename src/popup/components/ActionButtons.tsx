import { useState } from 'react'
import QRCode from 'qrcode'
import { copyToClipboard, downloadFile } from '@/utils/chrome'

interface ActionButtonsProps {
  url: string
  onReset: () => void
  hasChanges: boolean
}

const ActionButtons = ({ url, onReset, hasChanges }: ActionButtonsProps) => {
  const [copyStatus, setCopyStatus] = useState<{[key: string]: boolean}>({})

  const showCopyFeedback = (key: string) => {
    setCopyStatus(prev => ({ ...prev, [key]: true }))
    setTimeout(() => {
      setCopyStatus(prev => ({ ...prev, [key]: false }))
    }, 2000)
  }

  const handleCopyUrl = async () => {
    const success = await copyToClipboard(url)
    if (success) {
      showCopyFeedback('url')
    }
  }

  const handleCopyQRCode = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      const response = await fetch(dataUrl)
      const blob = await response.blob()

      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ])

      showCopyFeedback('qrcode')
    } catch (error) {
      console.error('Error copying QR code:', error)
      try {
        const dataUrl = await QRCode.toDataURL(url)
        await copyToClipboard(dataUrl)
        showCopyFeedback('qrcode')
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError)
      }
    }
  }

  const handleDownloadQRCode = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      downloadFile(dataUrl, `qrcode_${timestamp}.png`)
    } catch (error) {
      console.error('Error downloading QR code:', error)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={handleCopyUrl}
        className="py-2 px-3 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
      >
        {copyStatus.url ? '已复制 ✓' : '复制链接 Copy URL'}
      </button>

      <button
        onClick={handleCopyQRCode}
        className="py-2 px-3 text-xs font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg hover:from-purple-600 hover:to-purple-800 transition-all"
      >
        {copyStatus.qrcode ? '已复制 ✓' : '复制码图 Copy QR'}
      </button>

      <button
        onClick={handleDownloadQRCode}
        className="py-2 px-3 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-all"
      >
        下载码图 Download
      </button>

      <button
        onClick={onReset}
        disabled={!hasChanges}
        className="py-2 px-3 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        重置 Reset
      </button>
    </div>
  )
}

export default ActionButtons 
 