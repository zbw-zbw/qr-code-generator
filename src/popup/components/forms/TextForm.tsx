import { useState } from 'react'
import { t } from '@/utils/i18n'

const inputCls = "w-full px-3 py-2 text-sm rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] resize-none"
const inputStyle = { border: '1px solid var(--color-border)', background: 'var(--color-card)' }

const TextForm = ({ onChange, initialValue = '' }: { onChange: (value: string) => void; initialValue?: string }) => {
  const [text, setText] = useState(initialValue)
  return (
    <textarea
      value={text}
      onChange={e => { setText(e.target.value); onChange(e.target.value) }}
      placeholder={t('text.placeholder')}
      rows={4}
      className={inputCls}
      style={inputStyle}
    />
  )
}

export default TextForm
