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
})

chrome.contextMenus.onClicked.addListener(async (info) => {
  let text = ''
  let type: 'url' | 'text' = 'text'

  if (info.menuItemId === 'generate-qr-link' && info.linkUrl) {
    text = info.linkUrl
    type = 'url'
  } else if (info.menuItemId === 'generate-qr-selection' && info.selectionText) {
    text = info.selectionText
    try {
      new URL(text)
      type = 'url'
    } catch {
      type = 'text'
    }
  }

  if (!text) return

  await chrome.storage.local.set({ contextMenuData: { text, type } })

  try {
    await chrome.action.openPopup()
  } catch {
    const popupUrl = chrome.runtime.getURL('src/popup/index.html')
    await chrome.tabs.create({ url: `${popupUrl}?source=contextMenu` })
  }
})
