import React from 'react'
import { Mode } from '@/types'
import { t } from '@/utils/i18n'

interface ModeSwitchProps {
  mode: Mode
  onChange: (mode: Mode) => void
}

const ModeSwitch: React.FC<ModeSwitchProps> = ({ mode, onChange }) => {
  const btn = (m: Mode, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => onChange(m)}
      className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
        mode === m
          ? 'bg-white text-[var(--color-text)] shadow-sm'
          : 'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )

  return (
    <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'var(--color-muted-bg)' }}>
      {btn('generate',
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>,
        t('mode.generate')
      )}
      {btn('decode',
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>,
        t('mode.decode')
      )}
    </div>
  )
}

export default ModeSwitch
