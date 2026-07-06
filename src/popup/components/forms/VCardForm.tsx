import { useState } from 'react'
import { VCardData } from '@/types'
import { t } from '@/utils/i18n'

const build = (d: VCardData) => [
  'BEGIN:VCARD', 'VERSION:3.0',
  `N:${d.lastName};${d.firstName}`,
  `FN:${[d.firstName, d.lastName].filter(Boolean).join(' ')}`,
  d.phone ? `TEL:${d.phone}` : '',
  d.email ? `EMAIL:${d.email}` : '',
  d.org   ? `ORG:${d.org}` : '',
  'END:VCARD',
].filter(Boolean).join('\n')

const VCardForm = ({ onChange }: { onChange: (value: string) => void }) => {
  const [data, setData] = useState<VCardData>({ firstName: '', lastName: '', phone: '', email: '', org: '' })
  const update = (patch: Partial<VCardData>) => {
    const next = { ...data, ...patch }
    setData(next); onChange(build(next))
  }
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input type="text" value={data.firstName} onChange={e => update({ firstName: e.target.value })} placeholder={t('vcard.firstName')} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
        <input type="text" value={data.lastName} onChange={e => update({ lastName: e.target.value })} placeholder={t('vcard.lastName')} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
      </div>
      <input type="tel" value={data.phone} onChange={e => update({ phone: e.target.value })} placeholder={t('vcard.phone')} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-mono" />
      <input type="email" value={data.email} onChange={e => update({ email: e.target.value })} placeholder={t('vcard.email')} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-mono" />
      <input type="text" value={data.org} onChange={e => update({ org: e.target.value })} placeholder={t('vcard.org')} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-mono" />
    </div>
  )
}

export default VCardForm
