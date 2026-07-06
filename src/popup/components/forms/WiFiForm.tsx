import { useState } from 'react'
import { WiFiData } from '@/types'
import { t } from '@/utils/i18n'

const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/"/g, '\\"')
const build = (d: WiFiData) => `WIFI:T:${d.encryption};S:${escape(d.ssid)};P:${escape(d.password)};H:${d.hidden};;`
const ENCRYPTIONS: WiFiData['encryption'][] = ['WPA', 'WEP', 'nopass']

const WiFiForm = ({ onChange }: { onChange: (value: string) => void }) => {
  const [data, setData] = useState<WiFiData>({ ssid: '', password: '', encryption: 'WPA', hidden: false })
  const update = (patch: Partial<WiFiData>) => {
    const next = { ...data, ...patch }
    setData(next); onChange(build(next))
  }
  return (
    <div className="space-y-2">
      <input type="text" value={data.ssid} onChange={e => update({ ssid: e.target.value })} placeholder={t('wifi.ssid')} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-mono" />
      <input type="text" value={data.password} onChange={e => update({ password: e.target.value })} placeholder={t('wifi.password')} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] font-mono" />
      <div className="flex gap-1.5">
        {ENCRYPTIONS.map(enc => (
          <button key={enc} onClick={() => update({ encryption: enc })}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${data.encryption === enc ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {enc}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
        <input type="checkbox" checked={data.hidden} onChange={e => update({ hidden: e.target.checked })} className="accent-[var(--color-primary)]" />
        {t('wifi.hidden')}
      </label>
    </div>
  )
}

export default WiFiForm
