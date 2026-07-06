import { useState } from 'react'
import { URLParam } from '@/types'
import { t } from '@/utils/i18n'

function isJSON(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return false
  try { JSON.parse(trimmed); return true } catch { return false }
}

function formatJSON(value: string): string {
  try { return JSON.stringify(JSON.parse(value), null, 2) } catch { return value }
}

const URLParamsEditor = ({ params, onChange }: { params: URLParam[]; onChange: (params: URLParam[]) => void }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingValues, setEditingValues] = useState({ key: '', value: '' })
  const [editIsComplex, setEditIsComplex] = useState(false)
  const [jsonError, setJsonError] = useState(false)
  const [newParam, setNewParam] = useState({ key: '', value: '' })
  const [showAddForm, setShowAddForm] = useState(false)

  const startEdit = (index: number) => {
    const p = params[index]
    const complex = isJSON(p.value)
    setEditingIndex(index)
    setEditIsComplex(complex)
    setJsonError(false)
    setEditingValues({ key: p.key, value: complex ? formatJSON(p.value) : p.value })
  }

  const handleValueChange = (val: string) => {
    setEditingValues(p => ({ ...p, value: val }))
    if (editIsComplex) {
      try { JSON.parse(val.trim()); setJsonError(false) } catch { setJsonError(true) }
    }
  }

  const saveEdit = () => {
    if (editingIndex !== null) {
      const next = [...params]
      let val = editingValues.value
      if (editIsComplex && !jsonError) {
        try { val = JSON.stringify(JSON.parse(val)) } catch { /* keep */ }
      }
      next[editingIndex] = { key: editingValues.key, value: val }
      onChange(next)
    }
    setEditingIndex(null)
    setEditIsComplex(false)
    setJsonError(false)
  }

  const handleDeleteParam = (index: number) => {
    if (editingIndex === index) { setEditingIndex(null); setEditIsComplex(false); setJsonError(false) }
    else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1)
    onChange(params.filter((_, i) => i !== index))
  }

  const handleAddParam = () => {
    if (newParam.key.trim()) {
      let val = newParam.value.trim()
      if (isJSON(val)) try { val = JSON.stringify(JSON.parse(val)) } catch { /* keep */ }
      onChange([...params, { key: newParam.key.trim(), value: val }])
      setNewParam({ key: '', value: '' })
      setShowAddForm(false)
    }
  }

  const inputCls = "w-full px-2.5 py-1.5 text-xs rounded-xl font-mono focus:outline-none"
  const inputStyle = { border: '1px solid var(--color-border)', background: 'var(--color-card)' }

  const iconBtn = (onClick: () => void, icon: string, hoverColor: string, title: string) => (
    <button onClick={onClick} className="p-1.5 rounded-lg transition-colors" title={title}
      style={{ color: 'var(--color-text-muted)' }}
      onMouseEnter={e => { e.currentTarget.style.color = hoverColor; e.currentTarget.style.background = 'var(--color-muted-bg)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent' }}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
      </svg>
    </button>
  )

  const editRows = editIsComplex ? Math.min(Math.max(editingValues.value.split('\n').length + 1, 4), 12) : 3

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          {t('params.title')}
        </h3>
        {params.length > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: 'var(--color-muted-bg)', color: 'var(--color-text-secondary)' }}>
            {t('params.count', { count: params.length })}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {params.map((param, index) => (
          <div key={`${param.key}-${index}`} className="param-item">
            {editingIndex === index ? (
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Key</label>
                  <input type="text" value={editingValues.key}
                    onChange={e => setEditingValues(p => ({ ...p, key: e.target.value }))}
                    className={inputCls} style={inputStyle} autoFocus />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Value</label>
                    {editIsComplex && jsonError && (
                      <span className="text-xs" style={{ color: 'var(--color-error)' }}>JSON 格式无效</span>
                    )}
                  </div>
                  <textarea value={editingValues.value}
                    onChange={e => handleValueChange(e.target.value)}
                    className={`${inputCls} resize-none`}
                    style={{
                      ...inputStyle,
                      borderColor: editIsComplex && jsonError ? 'var(--color-error)' : 'var(--color-border)',
                    }}
                    rows={editRows} />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button onClick={() => { setEditingIndex(null); setEditIsComplex(false); setJsonError(false) }}
                    className="px-2.5 py-1 text-xs font-medium rounded-xl transition-colors"
                    style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', background: 'var(--color-card)' }}>
                    {t('params.cancel')}
                  </button>
                  <button onClick={saveEdit}
                    className="px-2.5 py-1 text-xs font-medium text-white rounded-xl hover:opacity-90 transition-colors"
                    style={{ background: 'var(--color-primary)' }}>
                    {t('params.save')}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold break-all" style={{ color: 'var(--color-text)' }}>{param.key}</span>
                  <div className="flex gap-0.5 flex-shrink-0 ml-2">
                    {iconBtn(() => startEdit(index),
                      "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                      'var(--color-primary)', t('params.edit'))}
                    {iconBtn(() => handleDeleteParam(index),
                      "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
                      'var(--color-error)', t('params.delete'))}
                  </div>
                </div>
                {isJSON(param.value) ? (
                  <pre className="text-xs font-mono break-all whitespace-pre-wrap w-full mt-1.5 p-2.5 rounded-xl leading-relaxed"
                    style={{ background: 'var(--color-muted-bg)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                    {formatJSON(param.value)}
                  </pre>
                ) : (() => {
                  try {
                    const decoded = decodeURIComponent(param.value)
                    if (decoded !== param.value) return (
                      <div className="flex items-start gap-1.5 flex-wrap mt-1">
                        <span className="text-xs px-1.5 py-0.5 rounded-lg font-medium flex-shrink-0"
                          style={{ background: 'var(--color-muted-bg)', color: 'var(--color-text-muted)' }}>{t('params.decoded')}</span>
                        <span className="text-xs font-mono break-all whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>{decoded}</span>
                      </div>
                    )
                  } catch { /* noop */ }
                  return (
                    <p className="text-xs font-mono break-all mt-1" style={{ color: 'var(--color-text-secondary)' }}>{param.value}</p>
                  )
                })()}
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddForm ? (
        <div className="param-item space-y-2">
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Key</label>
            <input type="text" value={newParam.key}
              onChange={e => setNewParam(p => ({ ...p, key: e.target.value }))}
              placeholder={t('params.keyPlaceholder')} autoFocus
              className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Value</label>
            <textarea value={newParam.value}
              onChange={e => setNewParam(p => ({ ...p, value: e.target.value }))}
              placeholder={t('params.valuePlaceholder')} rows={3}
              className={`${inputCls} resize-none`} style={inputStyle} />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <button onClick={() => { setNewParam({ key: '', value: '' }); setShowAddForm(false) }}
              className="px-2.5 py-1 text-xs font-medium rounded-xl transition-colors"
              style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', background: 'var(--color-card)' }}>
              {t('params.cancel')}
            </button>
            <button onClick={handleAddParam} disabled={!newParam.key.trim()}
              className="px-2.5 py-1 text-xs font-medium text-white rounded-xl disabled:opacity-40 hover:opacity-90 transition-colors"
              style={{ background: 'var(--color-primary)' }}>
              {t('params.addParam')}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAddForm(true)}
          className="w-full py-2 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-dashed"
          style={{ color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
          {t('params.addParam')}
        </button>
      )}
    </div>
  )
}

export default URLParamsEditor
