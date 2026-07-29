import { describe, it, expect } from 'vitest'
import QRCode from 'qrcode'
import jsQR from 'jsqr'
import { computeLogoLayout, EXPORT_MARGIN } from '../qrExport'

const URL_SAMPLE = 'https://devix.alibaba-inc.com/devix/super/chats/session0b63db50dfe64cd79a'

// 用 QRCode 模块矩阵合成像素图，模拟导出图上的 logo 破坏，再用 jsQR 真实解码验证
function renderDamagedPixels(value: string, logoPct: number) {
  const qr = QRCode.create(value, { errorCorrectionLevel: 'H' })
  const n = qr.modules.size
  const scale = 8
  const size = (n + EXPORT_MARGIN * 2) * scale
  const data = new Uint8ClampedArray(size * size * 4)

  const fillRect = (x0: number, y0: number, w: number, h: number, v: number) => {
    for (let y = Math.max(0, Math.floor(y0)); y < Math.min(size, Math.ceil(y0 + h)); y++) {
      for (let x = Math.max(0, Math.floor(x0)); x < Math.min(size, Math.ceil(x0 + w)); x++) {
        const i = (y * size + x) * 4
        data[i] = data[i + 1] = data[i + 2] = v
        data[i + 3] = 255
      }
    }
  }

  // 底色（含静区）为白
  fillRect(0, 0, size, size, 255)
  // 绘制深色模块
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      if (qr.modules.get(row, col)) {
        fillRect((col + EXPORT_MARGIN) * scale, (row + EXPORT_MARGIN) * scale, scale, scale, 0)
      }
    }
  }

  // 按导出布局施加 logo 破坏（最坏情况：直角无白边，盒子内全部被 logo 覆盖）：
  // 盒子区置白后再填中灰模拟任意图案
  const { boxPx, boxOffset, innerPx, innerOffset } = computeLogoLayout(n, size, EXPORT_MARGIN, logoPct, 0)
  fillRect(boxOffset, boxOffset, boxPx, boxPx, 255)
  fillRect(innerOffset, innerOffset, innerPx, innerPx, 100)

  return { data, size }
}

describe('导出图 logo 布局可扫性', () => {
  it('最大 35% logo 破坏后 jsQR 仍能解码（回归：曾按整图宽度取百分比导致不可扫）', () => {
    const { data, size } = renderDamagedPixels(URL_SAMPLE, 35)
    const code = jsQR(data, size, size)
    expect(code?.data).toBe(URL_SAMPLE)
  })

  it('logo 盒子按码区宽度计算，破坏面积不超过 H 级纠错预算', () => {
    const n = QRCode.create(URL_SAMPLE, { errorCorrectionLevel: 'H' }).modules.size
    const size = (n + EXPORT_MARGIN * 2) * 8
    const { boxPx } = computeLogoLayout(n, size, EXPORT_MARGIN, 35, 14)
    const codePx = size * n / (n + EXPORT_MARGIN * 2)
    const damagedArea = (boxPx / codePx) ** 2
    // 35% 宽度 ≈ 12% 面积；白边向内收缩，不随白边档位扩大
    expect(damagedArea).toBeLessThan(0.2)
  })

  it('无 logo 基准图可解码（测试装置自检）', () => {
    const qr = QRCode.create(URL_SAMPLE, { errorCorrectionLevel: 'H' })
    const n = qr.modules.size
    const { data, size } = renderDamagedPixels(URL_SAMPLE, 0)
    expect(n).toBeGreaterThan(0)
    expect(jsQR(data, size, size)?.data).toBe(URL_SAMPLE)
  })
})
