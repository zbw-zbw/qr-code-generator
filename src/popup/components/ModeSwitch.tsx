import React from 'react'
import { Mode } from '@/types'

interface ModeSwitchProps {
  mode: Mode
  onChange: (mode: Mode) => void
}

const ModeSwitch: React.FC<ModeSwitchProps> = ({ mode, onChange }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange('generate')}
        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
          mode === 'generate'
            ? 'bg-white text-purple-600 shadow-md border-2 border-purple-200'
            : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        <span>生成 Generate</span>
      </button>
      <button
        onClick={() => onChange('decode')}
        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
          mode === 'decode'
            ? 'bg-white text-purple-600 shadow-md border-2 border-purple-200'
            : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>解码 Decode</span>
      </button>
    </div>
  )
}

export default ModeSwitch 
 