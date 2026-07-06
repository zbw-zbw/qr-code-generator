import { useState } from 'react'
import { t } from '@/utils/i18n'

const TextForm = ({ onChange }: { onChange: (value: string) => void }) => {
  const [text, setText] = useState('')
  return (
    <textarea
      value={text}
      onChange={e => { setText(e.target.value); onChange(e.target.value) }}
      placeholder={t('text.placeholder')}
      rows={4}
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-mono resize-none"
    />
  )
}

export default TextForm
