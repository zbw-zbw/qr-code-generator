import QRCode from 'qrcode'
import { QRStyle } from '@/types'

// 导出图的静区宽度（模块数）
export const EXPORT_MARGIN = 2

export interface LogoLayout {
  boxPx: number
  boxOffset: number
  innerPx: number
  innerOffset: number
}

/**
 * 计算 Logo 布局，与预览保持同一几何语义：
 * - logoSize% 表示 logo 盒子（含白边）相对码区宽度的占比，
 *   白边向内收缩，破坏面积恒定不随白边扩大；
 * - 按码区（不含静区）取百分比。若按整图宽度取百分比再外扩 padding，
 *   破坏面积会翻倍，超出 H 级纠错能力（历史回归）。
 */
export function computeLogoLayout(
  moduleCount: number, size: number, margin: number,
  logoSizePct: number, paddingPct: number
): LogoLayout {
  const modulePx = size / (moduleCount + margin * 2)
  const codePx = modulePx * moduleCount
  const boxPx = Math.round(codePx * logoSizePct / 100)
  const boxOffset = (size - boxPx) / 2
  const pad = Math.round(boxPx * paddingPct / 100)
  return {
    boxPx,
    boxOffset,
    innerPx: boxPx - pad * 2,
    innerOffset: boxOffset + pad,
  }
}

const roundRectPath = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2))
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('logo load failed'))
    img.src = src
  })

/**
 * 按目标尺寸真实渲染二维码（而非拉伸预览 canvas），
 * 保证导出/复制的码图边缘锐利、大幅面打印可扫。
 * 带 2 个模块的静区（quiet zone）提升扫描可靠性。
 */
export async function renderQRCanvas(value: string, size: number, style: QRStyle): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  const level = style.logoSrc ? 'H' : style.level
  await QRCode.toCanvas(canvas, value, {
    width: size,
    margin: EXPORT_MARGIN,
    errorCorrectionLevel: level,
    color: { dark: style.fgColor, light: style.bgColor },
  })
  if (style.logoSrc) {
    const img = await loadImage(style.logoSrc)
    const moduleCount = QRCode.create(value, { errorCorrectionLevel: level }).modules.size
    const { boxPx, boxOffset, innerPx, innerOffset } =
      computeLogoLayout(moduleCount, size, EXPORT_MARGIN, style.logoSize, style.logoPadding)
    const ctx = canvas.getContext('2d')!
    const boxRadius = boxPx * style.logoRadius / 100

    // 圆角垫底（等价于 excavate，圆角外的模块保留）
    roundRectPath(ctx, boxOffset, boxOffset, boxPx, boxPx, boxRadius)
    ctx.fillStyle = style.bgColor
    ctx.fill()

    // logo 以 cover 居中裁剪绘制：占满盒子不留白，非正方形图片裁剪而非拉伸
    const w = img.naturalWidth || img.width
    const h = img.naturalHeight || img.height
    const crop = Math.min(w, h)
    const sx = (w - crop) / 2
    const sy = (h - crop) / 2
    ctx.save()
    roundRectPath(ctx, innerOffset, innerOffset, innerPx, innerPx, Math.max(0, boxRadius - (boxPx - innerPx) / 2))
    ctx.clip()
    ctx.drawImage(img, sx, sy, crop, crop, innerOffset, innerOffset, innerPx, innerPx)
    ctx.restore()
  }
  return canvas
}

/**
 * 矢量 SVG 导出（印刷场景无限放大不失真）。
 * qrcode 库的 SVG viewBox 以模块为单位，Logo 布局在同一坐标系下计算；
 * preserveAspectRatio="slice" 实现与 canvas 导出一致的 cover 居中裁剪。
 */
export async function renderQRSVG(value: string, size: number, style: QRStyle): Promise<string> {
  const level = style.logoSrc ? 'H' : style.level
  const svg = await QRCode.toString(value, {
    type: 'svg',
    width: size,
    margin: EXPORT_MARGIN,
    errorCorrectionLevel: level,
    color: { dark: style.fgColor, light: style.bgColor },
  })
  if (!style.logoSrc) return svg

  const moduleCount = QRCode.create(value, { errorCorrectionLevel: level }).modules.size
  const units = moduleCount + EXPORT_MARGIN * 2
  // 用 ×100 坐标计算后缩回，避免模块单位下取整精度损失
  const layout = computeLogoLayout(moduleCount, units * 100, EXPORT_MARGIN, style.logoSize, style.logoPadding)
  const u = (v: number) => (v / 100).toFixed(3)
  const boxR = layout.boxPx * style.logoRadius / 100
  const innerR = Math.max(0, boxR - (layout.boxPx - layout.innerPx) / 2)

  const logoMarkup =
    `<rect x="${u(layout.boxOffset)}" y="${u(layout.boxOffset)}" width="${u(layout.boxPx)}" height="${u(layout.boxPx)}" rx="${u(boxR)}" fill="${style.bgColor}"/>` +
    `<clipPath id="logo-clip"><rect x="${u(layout.innerOffset)}" y="${u(layout.innerOffset)}" width="${u(layout.innerPx)}" height="${u(layout.innerPx)}" rx="${u(innerR)}"/></clipPath>` +
    `<image href="${style.logoSrc}" x="${u(layout.innerOffset)}" y="${u(layout.innerOffset)}" width="${u(layout.innerPx)}" height="${u(layout.innerPx)}" preserveAspectRatio="xMidYMid slice" clip-path="url(#logo-clip)"/>`

  return svg.replace('</svg>', `${logoMarkup}</svg>`)
}
