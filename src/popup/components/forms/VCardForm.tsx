import { useState } from 'react'
import { VCardData } from '@/types'
import { buildVCard, parseVCard } from '@/utils/qrContent'
import { t } from '@/utils/i18n'

const inputCls = "w-full px-3 py-2 text-sm rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
const inputStyle = { border: '1px solid var(--color-border)', background: 'var(--color-card)' }

const VCardForm = ({ onChange, initialValue = '' }: { onChange: (value: string) => void; initialValue?: string }) => {
  const [data, setData] = useState<VCardData>(
    () => parseVCard(initialValue) ?? { firstName: '', lastName: '', phone: '', email: '', org: '' }
  )
  const update = (patch: Partial<VCardData>) => {
    const next = { ...data, ...patch }
    setData(next); onChange(buildVCard(next))
  }
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input type="text" value={data.firstName} onChange={e => update({ firstName: e.target.value })} placeholder={t('vcard.firstName')} className={inputCls} style={inputStyle} />
        <input type="text" value={data.lastName} onChange={e => update({ lastName: e.target.value })} placeholder={t('vcard.lastName')} className={inputCls} style={inputStyle} />
      </div>
      <input type="tel" value={data.phone} onChange={e => update({ phone: e.target.value })} placeholder={t('vcard.phone')} className={inputCls} style={inputStyle} />
      <input type="email" value={data.email} onChange={e => update({ email: e.target.value })} placeholder={t('vcard.email')} className={inputCls} style={inputStyle} />
      <input type="text" value={data.org} onChange={e => update({ org: e.target.value })} placeholder={t('vcard.org')} className={inputCls} style={inputStyle} />
    </div>
  )
}

export default VCardForm
