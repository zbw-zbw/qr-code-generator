import { describe, it, expect } from 'vitest'
import { parseParams, buildUrl, safeDecode } from '../urlParams'
import { isValidUrl } from '../url'

describe('parseParams / buildUrl 保真性', () => {
  it('解析保留原始编码形态', () => {
    const params = parseParams('https://x.com/p?a=1&b=%E4%B8%AD%20c&c=x%2By')
    expect(params).toEqual([
      { key: 'a', value: '1' },
      { key: 'b', value: '%E4%B8%AD%20c' },
      { key: 'c', value: 'x%2By' },
    ])
  })

  it('parse → build 往返字节级不变（含签名类参数）', () => {
    const url = 'https://x.com/api?sign=aB%2F3%3D%3D&ts=1700000000&q=a%20b'
    expect(buildUrl(url, parseParams(url))).toBe(url)
  })

  it('保留 hash，过滤空 key', () => {
    const built = buildUrl('https://x.com/p?a=1#sec', [
      { key: 'a', value: '1' },
      { key: '  ', value: 'ghost' },
    ])
    expect(built).toBe('https://x.com/p?a=1#sec')
  })

  it('删除全部参数后无残留 ?', () => {
    expect(buildUrl('https://x.com/p?a=1', [])).toBe('https://x.com/p')
  })

  it('重复 key 与无值参数不丢失', () => {
    const url = 'https://x.com/p?a=1&a=2&flag='
    expect(buildUrl(url, parseParams(url))).toBe(url)
  })

  it('非法 URL 安全返回', () => {
    expect(parseParams('not a url')).toEqual([])
    expect(buildUrl('not a url', [{ key: 'a', value: '1' }])).toBe('not a url')
  })
})

describe('safeDecode', () => {
  it('单次解码，+ 视为空格', () => {
    expect(safeDecode('a%20b')).toBe('a b')
    expect(safeDecode('a+b')).toBe('a b')
  })

  it('非法编码不抛异常，返回原文', () => {
    expect(safeDecode('100%')).toBe('100%')
  })
})

describe('isValidUrl 安全白名单', () => {
  it('允许 http/https/ftp/ftps', () => {
    expect(isValidUrl('https://x.com')).toBe(true)
    expect(isValidUrl('http://x.com')).toBe(true)
  })

  it('拒绝 javascript: / data: / chrome: 等危险协议', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false)
    expect(isValidUrl('data:text/html,<script>')).toBe(false)
    expect(isValidUrl('chrome://settings')).toBe(false)
  })

  it('拒绝非 URL 文本', () => {
    expect(isValidUrl('hello world')).toBe(false)
  })
})
