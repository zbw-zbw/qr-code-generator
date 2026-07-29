// 前景/背景配色的可扫性校验（WCAG 相对亮度）

const parseHex = (hex: string): [number, number, number] | null => {
  const h = hex.replace('#', '')
  if (h.length === 3) {
    return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
  }
  if (h.length === 6) {
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }
  return null
}

const luminance = ([r, g, b]: [number, number, number]): number => {
  const f = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

export const contrastRatio = (a: string, b: string): number => {
  const ca = parseHex(a)
  const cb = parseHex(b)
  if (!ca || !cb) return 21
  const la = luminance(ca)
  const lb = luminance(cb)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/**
 * 扫码器需要「深色前景 + 浅色背景」且足够对比度：
 * - 对比度 < 3:1 时大量扫码器无法二值化；
 * - 反色码（前景比背景浅）许多扫码器不支持。
 */
export const isPoorScanContrast = (fg: string, bg: string): boolean => {
  const cf = parseHex(fg)
  const cb = parseHex(bg)
  if (!cf || !cb) return false
  return contrastRatio(fg, bg) < 3 || luminance(cf) > luminance(cb)
}
