import { useState } from 'react'
import { WiFiData } from '@/types'
import { buildWiFi, parseWiFi } from '@/utils/qrContent'
import { t } from '@/utils/i18n'

const ENCRYPTIONS: WiFiData['encryption'][] = ['WPA', 'WEP', 'nopass']

const inputCls = "w-full px-3 py-2 text-sm rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
const inputStyle = { border: '1px solid var(--color-border)', background: 'var(--color-card)' }

const WiFiForm = ({ onChange, initialValue = '' }: { onChange: (value: string) => void; initialValue?: string }) => {
  const [data, setData] = useState<WiFiData>(
    () => parseWiFi(initialValue) ?? { ssid: '', password: '', encryption: 'WPA', hidden: false }
  )
  const update = (patch: Partial<WiFiData>) => {
    const next = { ...data, ...patch }
    setData(next); onChange(buildWiFi(next))
  }
  return (
    <div className="space-y-2">
      <input type="text" value={data.ssid} onChange={e => update({ ssid: e.target.value })} placeholder={t('wifi.ssid')} className={inputCls} style={inputStyle} />
      <input type="text" value={data.password} onChange={e => update({ password: e.target.value })} placeholder={t('wifi.password')} className={inputCls} style={inputStyle} />
      <div className="flex gap-1.5">
        {ENCRYPTIONS.map(enc => (
          <button key={enc} onClick={() => update({ encryption: enc })}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${data.encryption === enc ? 'text-white' : ''}`}
            style={data.encryption === enc
              ? { background: 'var(--color-primary)' }
              : { background: 'var(--color-muted-bg)', color: 'var(--color-text-secondary)' }}>
            {enc}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'var(--color-text-secondary)' }}>
        <input type="checkbox" checked={data.hidden} onChange={e => update({ hidden: e.target.checked })} className="accent-[var(--color-primary)]" />
        {t('wifi.hidden')}
      </label>
    </div>
  )
}

export default WiFiForm
