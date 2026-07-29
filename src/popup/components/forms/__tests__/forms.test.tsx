// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import WiFiForm from '../WiFiForm'
import EmailForm from '../EmailForm'
import SMSForm from '../SMSForm'
import PhoneForm from '../PhoneForm'
import VCardForm from '../VCardForm'
import { buildWiFi, buildVCard } from '@/utils/qrContent'

afterEach(cleanup)

describe('表单 initialValue 回填（历史恢复回归）', () => {
  it('WiFiForm 回填含转义字符的记录', () => {
    const initial = buildWiFi({ ssid: 'My:Net;1', password: 'p,w"x', encryption: 'WEP', hidden: true })
    render(<WiFiForm onChange={() => {}} initialValue={initial} />)
    expect(screen.getByDisplayValue('My:Net;1')).toBeTruthy()
    expect(screen.getByDisplayValue('p,w"x')).toBeTruthy()
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(true)
  })

  it('EmailForm 回填 percent-encoding 的 mailto', () => {
    render(<EmailForm onChange={() => {}} initialValue="mailto:a@b.com?subject=hi%20there&body=x%20%26%20y" />)
    expect(screen.getByDisplayValue('a@b.com')).toBeTruthy()
    expect(screen.getByDisplayValue('hi there')).toBeTruthy()
    expect(screen.getByDisplayValue('x & y')).toBeTruthy()
  })

  it('SMSForm 兼容回填旧 smsto: 格式记录', () => {
    render(<SMSForm onChange={() => {}} initialValue="smsto:13800138000:hello world" />)
    expect(screen.getByDisplayValue('13800138000')).toBeTruthy()
    expect(screen.getByDisplayValue('hello world')).toBeTruthy()
  })

  it('VCardForm 回填含转义字符的记录', () => {
    const initial = buildVCard({ firstName: '小明;', lastName: '王,', phone: '138', email: 'a@b.com', org: 'ACME' })
    render(<VCardForm onChange={() => {}} initialValue={initial} />)
    expect(screen.getByDisplayValue('小明;')).toBeTruthy()
    expect(screen.getByDisplayValue('王,')).toBeTruthy()
    expect(screen.getByDisplayValue('ACME')).toBeTruthy()
  })

  it('PhoneForm 回填 tel: 记录', () => {
    render(<PhoneForm onChange={() => {}} initialValue="tel:+8613800138000" />)
    expect(screen.getByDisplayValue('+8613800138000')).toBeTruthy()
  })
})

describe('表单所见即所码', () => {
  it('PhoneForm 输入即过滤非法字符，显示值与编码值一致', () => {
    const onChange = vi.fn()
    render(<PhoneForm onChange={onChange} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: '138中文abc-0000' } })
    expect(input.value).toBe('138-0000')
    expect(onChange).toHaveBeenLastCalledWith('tel:138-0000')
  })

  it('WiFiForm 输入生成完整转义的 WIFI: 内容', () => {
    const onChange = vi.fn()
    render(<WiFiForm onChange={onChange} />)
    const [ssid] = screen.getAllByRole('textbox') as HTMLInputElement[]
    fireEvent.change(ssid, { target: { value: 'Cafe:Guest' } })
    expect(onChange).toHaveBeenLastCalledWith('WIFI:T:WPA;S:Cafe\\:Guest;P:;;')
  })
})
