import { useState } from 'react'
import { t } from '@/utils/i18n'

const PhoneForm = ({ onChange }: { onChange: (value: string) => void }) => {
  const [number, setNumber] = useState('')
  return (
    <input type="tel" value={number}
      onChange={e => { setNumber(e.target.value); onChange(`tel:${e.target.value}`) }}
      placeholder={t('phone.number')}
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-mono" />
  )
}

export default PhoneForm
