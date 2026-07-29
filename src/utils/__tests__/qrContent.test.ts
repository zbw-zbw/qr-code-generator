import { describe, it, expect } from 'vitest'
import {
  buildWiFi, parseWiFi,
  buildMailto, parseMailto,
  buildSMS, parseSMS, sanitizePhone,
  buildVCard, parseVCard,
} from '../qrContent'

describe('WiFi', () => {
  it('转义全部特殊字符（含冒号）', () => {
    const s = buildWiFi({ ssid: 'Cafe:Guest;1', password: 'p,w\\d"x', encryption: 'WPA', hidden: false })
    expect(s).toBe('WIFI:T:WPA;S:Cafe\\:Guest\\;1;P:p\\,w\\\\d\\"x;;')
  })

  it('hidden=false 时省略 H 字段，nopass 时省略 P 字段', () => {
    expect(buildWiFi({ ssid: 'a', password: 'x', encryption: 'nopass', hidden: false }))
      .toBe('WIFI:T:nopass;S:a;;')
    expect(buildWiFi({ ssid: 'a', password: 'b', encryption: 'WPA', hidden: true }))
      .toBe('WIFI:T:WPA;S:a;P:b;H:true;;')
  })

  it('build → parse 往返一致', () => {
    const data = { ssid: 'My:Net;work', password: 'a,b\\c', encryption: 'WPA' as const, hidden: true }
    expect(parseWiFi(buildWiFi(data))).toEqual(data)
  })

  it('非 WIFI 内容返回 null', () => {
    expect(parseWiFi('hello')).toBeNull()
  })
})

describe('mailto', () => {
  it('使用 percent-encoding，空格为 %20 而非 +', () => {
    const s = buildMailto({ address: 'a@b.com', subject: 'hi there', body: 'x & y' })
    expect(s).toBe('mailto:a@b.com?subject=hi%20there&body=x%20%26%20y')
    expect(s).not.toContain('+')
  })

  it('build → parse 往返一致', () => {
    const data = { address: 'a@b.com', subject: '主题 测试', body: 'line1\nline2' }
    expect(parseMailto(buildMailto(data))).toEqual(data)
  })

  it('无 subject/body 时不带 query', () => {
    expect(buildMailto({ address: 'a@b.com', subject: '', body: '' })).toBe('mailto:a@b.com')
  })
})

describe('SMS', () => {
  it('生成 RFC 5724 格式 sms:num?body=', () => {
    expect(buildSMS({ phone: '+8613800138000', message: 'hi there' }))
      .toBe('sms:+8613800138000?body=hi%20there')
  })

  it('build → parse 往返一致', () => {
    const data = { phone: '+86 138(0013)8000', message: '你好 & 再见' }
    expect(parseSMS(buildSMS(data))).toEqual(data)
  })

  it('兼容解析旧的 smsto: 格式', () => {
    expect(parseSMS('smsto:123456:hello world')).toEqual({ phone: '123456', message: 'hello world' })
  })

  it('sanitizePhone 只保留合法字符', () => {
    expect(sanitizePhone('+86中文abc138-00(13) 8000')).toBe('+86138-00(13) 8000')
  })
})

describe('vCard', () => {
  it('转义分号/逗号/反斜杠/换行', () => {
    const s = buildVCard({ firstName: 'A;B', lastName: 'C,D', phone: '', email: '', org: 'X\\Y' })
    expect(s).toContain('N:C\\,D;A\\;B')
    expect(s).toContain('ORG:X\\\\Y')
  })

  it('build → parse 往返一致', () => {
    const data = { firstName: '小明;', lastName: '王,', phone: '13800138000', email: 'a@b.com', org: 'ACME\\Inc' }
    expect(parseVCard(buildVCard(data))).toEqual(data)
  })

  it('空字段不输出对应行', () => {
    const s = buildVCard({ firstName: 'A', lastName: '', phone: '', email: '', org: '' })
    expect(s).not.toContain('TEL:')
    expect(s).not.toContain('EMAIL:')
    expect(s).not.toContain('ORG:')
  })
})
