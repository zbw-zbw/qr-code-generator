import { useState } from 'react'
import { sanitizePhone } from '@/utils/qrContent'
import { t } from '@/utils/i18n'

const inputCls = "w-full px-3 py-2 text-sm rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
const inputStyle = { border: '1px solid var(--color-border)', background: 'var(--color-card)' }

const PhoneForm = ({ onChange, initialValue = '' }: { onChange: (value: string) => void; initialValue?: string }) => {
  const initial = initialValue.startsWith('tel:') ? initialValue.slice(4) : initialValue
  const [number, setNumber] = useState(() => sanitizePhone(initial))
  return (
    <input type="tel" value={number}
      onChange={e => {
        // 输入即过滤，保证所见即所码
        const safe = sanitizePhone(e.target.value)
        setNumber(safe)
        onChange(`tel:${safe}`)
      }}
      placeholder={t('phone.number')}
      className={inputCls}
      style={inputStyle} />
  )
}

export default PhoneForm
