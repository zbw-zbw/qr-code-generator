import { describe, it, expect } from 'vitest'
import { QR_BYTE_CAPACITY, getByteLength, exceedsCapacity } from '../qrCapacity'

describe('qrCapacity', () => {
  it('按 UTF-8 字节数计算（汉字 3 字节）', () => {
    expect(getByteLength('abc')).toBe(3)
    expect(getByteLength('中文')).toBe(6)
  })

  it('不同纠错等级容量不同', () => {
    expect(QR_BYTE_CAPACITY.L).toBe(2953)
    expect(QR_BYTE_CAPACITY.M).toBe(2331)
    expect(QR_BYTE_CAPACITY.H).toBe(1273)
  })

  it('1000 个汉字（3000 字节）超出 M 级容量', () => {
    const s = '码'.repeat(1000)
    expect(exceedsCapacity(s, 'M')).toBe(true)
    // 旧实现按 length=1000 < 2953 会误判为安全，导致渲染崩溃
    expect(s.length).toBeLessThan(2953)
  })

  it('临界值不误报', () => {
    expect(exceedsCapacity('a'.repeat(2331), 'M')).toBe(false)
    expect(exceedsCapacity('a'.repeat(2332), 'M')).toBe(true)
  })
})
