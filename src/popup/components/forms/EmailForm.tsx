import { useState } from 'react'
import { EmailData } from '@/types'
import { buildMailto, parseMailto } from '@/utils/qrContent'
import { t } from '@/utils/i18n'

const inputCls = "w-full px-3 py-2 text-sm rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
const inputStyle = { border: '1px solid var(--color-border)', background: 'var(--color-card)' }

const EmailForm = ({ onChange, initialValue = '' }: { onChange: (value: string) => void; initialValue?: string }) => {
  const [data, setData] = useState<EmailData>(
    () => parseMailto(initialValue) ?? { address: '', subject: '', body: '' }
  )
  const update = (patch: Partial<EmailData>) => {
    const next = { ...data, ...patch }
    setData(next); onChange(buildMailto(next))
  }
  return (
    <div className="space-y-2">
      <input type="email" value={data.address} onChange={e => update({ address: e.target.value })} placeholder={t('email.address')} className={inputCls} style={inputStyle} />
      <input type="text" value={data.subject} onChange={e => update({ subject: e.target.value })} placeholder={t('email.subject')} className={inputCls} style={inputStyle} />
      <textarea value={data.body} onChange={e => update({ body: e.target.value })} placeholder={t('email.body')} rows={3} className={`${inputCls} resize-none`} style={inputStyle} />
    </div>
  )
}

export default EmailForm
