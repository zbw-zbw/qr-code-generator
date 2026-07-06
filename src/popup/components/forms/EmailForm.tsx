import { useState } from 'react'
import { EmailData } from '@/types'
import { t } from '@/utils/i18n'

const build = ({ address, subject, body }: EmailData) => {
  const p = new URLSearchParams()
  if (subject) p.set('subject', subject)
  if (body) p.set('body', body)
  const qs = p.toString()
  return `mailto:${address}${qs ? '?' + qs : ''}`
}

const EmailForm = ({ onChange }: { onChange: (value: string) => void }) => {
  const [data, setData] = useState<EmailData>({ address: '', subject: '', body: '' })
  const update = (patch: Partial<EmailData>) => {
    const next = { ...data, ...patch }
    setData(next); onChange(build(next))
  }
  return (
    <div className="space-y-2">
      <input type="email" value={data.address} onChange={e => update({ address: e.target.value })} placeholder={t('email.address')} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-mono" />
      <input type="text" value={data.subject} onChange={e => update({ subject: e.target.value })} placeholder={t('email.subject')} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-mono" />
      <textarea value={data.body} onChange={e => update({ body: e.target.value })} placeholder={t('email.body')} rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-mono resize-none" />
    </div>
  )
}

export default EmailForm
