import { useState } from 'react'
import { SMSData } from '@/types'
import { t } from '@/utils/i18n'

const SMSForm = ({ onChange }: { onChange: (value: string) => void }) => {
  const [data, setData] = useState<SMSData>({ phone: '', message: '' })
  const update = (patch: Partial<SMSData>) => {
    const next = { ...data, ...patch }
    setData(next); onChange(`smsto:${next.phone}:${next.message}`)
  }
  return (
    <div className="space-y-2">
      <input type="tel" value={data.phone} onChange={e => update({ phone: e.target.value })} placeholder={t('sms.phone')} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-mono" />
      <textarea value={data.message} onChange={e => update({ message: e.target.value })} placeholder={t('sms.message')} rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-mono resize-none" />
    </div>
  )
}

export default SMSForm
