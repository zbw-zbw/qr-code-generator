import { QRLevel } from '@/types'

// 字节模式（8-bit）下 QR Version 40 各纠错等级的最大容量（字节）
export const QR_BYTE_CAPACITY: Record<QRLevel, number> = {
  L: 2953,
  M: 2331,
  Q: 1663,
  H: 1273,
}

// QR 按 UTF-8 字节编码，必须用字节数而非 UTF-16 字符数校验
export const getByteLength = (s: string): number => new TextEncoder().encode(s).length

export const exceedsCapacity = (value: string, level: QRLevel): boolean =>
  getByteLength(value) > QR_BYTE_CAPACITY[level]
