import { useState } from 'react'
import { SMSData } from '@/types'
import { buildSMS, parseSMS, sanitizePhone } from '@/utils/qrContent'
import { t } from '@/utils/i18n'

const inputCls = "w-full px-3 py-2 text-sm rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
const inputStyle = { border: '1px solid var(--color-border)', background: 'var(--color-card)' }

const SMSForm = ({ onChange, initialValue = '' }: { onChange: (value: string) => void; initialValue?: string }) => {
  const [data, setData] = useState<SMSData>(
    () => parseSMS(initialValue) ?? { phone: '', message: '' }
  )
  const update = (patch: Partial<SMSData>) => {
    const next = { ...data, ...patch }
    setData(next); onChange(buildSMS(next))
  }
  return (
    <div className="space-y-2">
      {/* 输入即过滤，保证所见即所码 */}
      <input type="tel" value={data.phone} onChange={e => update({ phone: sanitizePhone(e.target.value) })} placeholder={t('sms.phone')} className={inputCls} style={inputStyle} />
      <textarea value={data.message} onChange={e => update({ message: e.target.value })} placeholder={t('sms.message')} rows={3} className={`${inputCls} resize-none`} style={inputStyle} />
    </div>
  )
}

export default SMSForm
