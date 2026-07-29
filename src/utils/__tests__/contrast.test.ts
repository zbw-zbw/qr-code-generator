import { describe, it, expect } from 'vitest'
import { contrastRatio, isPoorScanContrast } from '../contrast'

describe('contrast', () => {
  it('黑白对比度为 21:1', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0)
  })

  it('经典配色与预设配色可扫', () => {
    expect(isPoorScanContrast('#000000', '#FFFFFF')).toBe(false)
    expect(isPoorScanContrast('#1a56db', '#eff6ff')).toBe(false)
    expect(isPoorScanContrast('#047857', '#ecfdf5')).toBe(false)
  })

  it('低对比度配色告警', () => {
    expect(isPoorScanContrast('#CCCCCC', '#FFFFFF')).toBe(true)
    expect(isPoorScanContrast('#FFFF00', '#FFFFFF')).toBe(true)
  })

  it('反色码（前景浅于背景）告警', () => {
    expect(isPoorScanContrast('#FFFFFF', '#000000')).toBe(true)
  })

  it('支持 3 位 hex，非法输入不告警', () => {
    expect(isPoorScanContrast('#000', '#fff')).toBe(false)
    expect(isPoorScanContrast('red', '#fff')).toBe(false)
  })
})
