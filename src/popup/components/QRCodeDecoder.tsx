import React, { useState, useRef, useCallback } from 'react'
import jsQR from 'jsqr'
import { isValidUrl } from '@/utils/url'
import { DecodeResult } from '@/types'

interface QRCodeDecoderProps {
  onDecodeSuccess: (result: DecodeResult) => void
}

const QRCodeDecoder: React.FC<QRCodeDecoderProps> = ({ onDecodeSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 解码图片函数
  const decodeImage = useCallback((imageElement: HTMLImageElement) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = imageElement.width
    canvas.height = imageElement.height
    ctx.drawImage(imageElement, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)

    if (code) {
      const content = code.data
      const type = isValidUrl(content) ? 'url' : 'text'
      onDecodeSuccess({ content, type })
      setError('')
    } else {
      setError('未识别到二维码，请确保图片清晰且包含有效二维码\nNo QR code detected, please ensure the image is clear and contains a valid QR code')
    }
  }, [onDecodeSuccess])


  // 处理文件上传
  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('请选择有效的图片文件\nPlease select a valid image file')
      return
    }

    setIsLoading(true)
    setError('')

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        decodeImage(img)
        setIsLoading(false)
      }
      img.onerror = () => {
        setError('图片加载失败\nImage loading failed')
        setIsLoading(false)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [decodeImage])

  // 处理点击上传
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  // 处理粘贴事件
  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          handleFileUpload(file)
          e.preventDefault()
        }
      }
    }
  }, [handleFileUpload])

  // 验证URL格式
  const validateImageUrl = (url: string) => {
    // Base64格式检查
    if (url.startsWith('data:image/')) {
      return { valid: true, type: 'base64' }
    }
    
    // SVG格式检查
    if (url.startsWith('data:image/svg+xml')) {
      return { valid: true, type: 'svg' }
    }
    
    // URL格式检查
    try {
      const urlObj = new URL(url)
      const extension = urlObj.pathname.split('.').pop()?.toLowerCase()
      const supportedFormats = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg']
      
      if (extension && supportedFormats.includes(extension)) {
        return { valid: true, type: 'url' }
      } else {
        return { valid: false, message: '请确保URL指向图片文件（支持png、jpg、gif、webp、svg等格式）\nPlease ensure URL points to an image file (supports png, jpg, gif, webp, svg formats)' }
      }
    } catch {
      return { valid: false, message: '请输入有效的URL地址或Base64数据\nPlease enter a valid URL or Base64 data' }
    }
  }

  // 处理SVG转位图
  const convertSvgToCanvas = (svgData: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('SVG加载失败'))
      
      // 如果是data URL，直接使用
      if (svgData.startsWith('data:')) {
        img.src = svgData
      } else {
        // 如果是SVG代码，转换为data URL
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
        img.src = URL.createObjectURL(svgBlob)
      }
    })
  }

  // 处理网络图片URL解码
  const handleUrlDecode = () => {
    if (!imageUrl.trim()) {
      setError('请输入图片URL或Base64数据\nPlease enter image URL or Base64 data')
      return
    }

    // 验证URL格式
    const validation = validateImageUrl(imageUrl.trim())
    if (!validation.valid) {
      setError(validation.message || '格式错误')
      return
    }

    setIsLoading(true)
    setError('')

    // 检查是否为SVG格式
    if (imageUrl.startsWith('data:image/svg+xml')) {
      try {
        convertSvgToCanvas(imageUrl)
          .then((img) => {
            decodeImage(img)
            setIsLoading(false)
          })
          .catch(() => {
            setError('SVG格式二维码处理失败\nSVG QR code processing failed')
            setIsLoading(false)
          })
      } catch (error) {
        setError('SVG数据格式错误\nSVG data format error')
        setIsLoading(false)
      }
    } 
    // 检查是否为Base64格式
    else if (imageUrl.startsWith('data:image/')) {
      const img = new Image()
      img.onload = () => {
        decodeImage(img)
        setIsLoading(false)
      }
      img.onerror = () => {
        setError('Base64图片数据格式错误或不是有效的图片\nBase64 image data format error or not a valid image')
        setIsLoading(false)
      }
      img.src = imageUrl
    } else {
      // 普通URL处理
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        decodeImage(img)
        setIsLoading(false)
      }
      img.onerror = () => {
        setError('图片加载失败：可能是URL错误、图片不存在、或不支持跨域访问\nImage loading failed: URL error, image not found, or CORS not supported')
        setIsLoading(false)
      }
      img.src = imageUrl
    }
  }

  // 绑定粘贴事件
  React.useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [handlePaste])

  return (
    <div className="space-y-3">
      {/* 文件上传 & 拖拽区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
          isDragging
            ? 'border-purple-400 bg-purple-50 shadow-md'
            : 'border-purple-200 hover:border-purple-300 hover:bg-purple-50/30'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsDragging(true)
        }}
        onDragEnter={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsDragging(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsDragging(false)
          const file = e.dataTransfer.files?.[0]
          if (file) {
            handleFileUpload(file)
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isDragging ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              )}
            </svg>
          </div>
          <div>
            <button
              onClick={handleUploadClick}
              disabled={isLoading}
              className="text-sm font-semibold gradient-text disabled:text-gray-400"
            >
              {isDragging ? '释放以解码 Drop to Decode' : '点击或拖拽图片到此处'}
            </button>
            <p className="text-xs text-gray-500 mt-0.5">Click or Drag Image Here</p>
          </div>
          <div className="text-xs text-gray-400 leading-relaxed">
            <p>支持格式 Supported: PNG、JPG、JPEG、GIF、WebP、SVG</p>
            <p className="mt-0.5">图片需包含清晰可识别的二维码</p>
            <p className="text-gray-300">Image must contain a clear QR code</p>
          </div>
        </div>
      </div>

      {/* 粘贴提示 */}
      <div className="param-item flex items-center gap-3 p-3">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-700">快捷粘贴 Quick Paste</p>
          <p className="text-xs text-gray-500 mt-0.5">
            截图后按 Ctrl+V 粘贴图片直接解码<br/>
            Press Ctrl+V to paste screenshot for decoding
          </p>
        </div>
        <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded-md border border-gray-200">
          Ctrl+V
        </kbd>
      </div>

      {/* 网络图片URL */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold gradient-text">
          网络图片 Image URL
        </label>
        <p className="text-xs text-gray-400">
          支持图片直链URL、Base64数据 / Support image URL, Base64 data
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/qrcode.png"
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg font-mono focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-400 shadow-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleUrlDecode}
            disabled={isLoading || !imageUrl}
            className="py-2 px-3 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            解码 Decode
          </button>
        </div>
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex items-center justify-center py-3">
          <div className="loading-spinner w-5 h-5"></div>
          <span className="ml-2 text-xs text-gray-500 font-medium">解码中 Decoding...</span>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600 leading-relaxed">{error}</p>
        </div>
      )}

      {/* 隐藏的canvas用于图片处理 */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default QRCodeDecoder 
 