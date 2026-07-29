import { isValidUrl } from './utils/url'

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'generate-qr-selection',
    title: 'Generate QR Code for "%s"',
    contexts: ['selection'],
  })
  chrome.contextMenus.create({
    id: 'generate-qr-link',
    title: 'Generate QR Code for Link',
    contexts: ['link'],
  })
  chrome.contextMenus.create({
    id: 'decode-qr-image',
    title: 'Decode QR Code in this Image',
    contexts: ['image'],
  })
})

chrome.contextMenus.onClicked.addListener(async (info) => {
  // 解码页面图片：将图片地址交给 popup 解码模式处理
  if (info.menuItemId === 'decode-qr-image' && info.srcUrl) {
    await chrome.storage.local.set({ contextMenuData: { text: info.srcUrl, type: 'decodeImage', ts: Date.now() } })
    try {
      await chrome.action.openPopup()
    } catch {
      await chrome.tabs.create({ url: chrome.runtime.getURL('src/popup/index.html') })
    }
    return
  }

  let text = ''

  if (info.menuItemId === 'generate-qr-link' && info.linkUrl) {
    text = info.linkUrl
  } else if (info.menuItemId === 'generate-qr-selection' && info.selectionText) {
    text = info.selectionText
  }

  if (!text) return

  // 用安全协议白名单判断，javascript: 等选区文本一律按文本处理
  const type: 'url' | 'text' = isValidUrl(text) ? 'url' : 'text'

  // 带时间戳，popup 端会忽略过期残留数据
  await chrome.storage.local.set({ contextMenuData: { text, type, ts: Date.now() } })

  try {
    await chrome.action.openPopup()
  } catch {
    await chrome.tabs.create({ url: chrome.runtime.getURL('src/popup/index.html') })
  }
})
