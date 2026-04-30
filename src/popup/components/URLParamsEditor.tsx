import { useState, useEffect } from 'react'
import { URLParam } from '@/types'

interface URLParamsEditorProps {
  params: URLParam[]
  onChange: (params: URLParam[]) => void
}

const URLParamsEditor = ({ params, onChange }: URLParamsEditorProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingValues, setEditingValues] = useState<{ key: string; value: string }>({ key: '', value: '' })
  const [newParam, setNewParam] = useState({ key: '', value: '' })
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    if (editingIndex !== null && params[editingIndex]) {
      const param = params[editingIndex]
      setEditingValues({ key: param.key, value: param.value })
    }
  }, [editingIndex, params])

  const handleEditParamChange = (field: 'key' | 'value', value: string) => {
    setEditingValues(prev => ({ ...prev, [field]: value }))
  }

  // 保存编辑修改
  const saveEdit = () => {
    if (editingIndex !== null) {
      const newParams = [...params]
      newParams[editingIndex] = { ...newParams[editingIndex], ...editingValues }
      onChange(newParams)
    }
    setEditingIndex(null)
  }

  // 取消编辑，恢复原始值
  const cancelEdit = () => {
    setEditingIndex(null)
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      saveEdit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      cancelEdit()
    }
  }

  // 处理失去焦点
  const handleBlur = () => {
    // 延迟检查，避免在两个输入框之间切换时误触发
    setTimeout(() => {
      const activeElement = document.activeElement
      const isInputFocused = activeElement?.tagName === 'INPUT'
      // 如果焦点移到了另一个输入框，不执行任何操作
      if (isInputFocused) {
        return
      }
      // 焦点完全移出表单后，保存编辑
      saveEdit()
    }, 0)
  }

  const handleDeleteParam = (index: number) => {
    const newParams = params.filter((_, i) => i !== index)
    onChange(newParams)
  }

  const handleAddParam = () => {
    if (newParam.key.trim() && newParam.value.trim()) {
      onChange([...params, { key: newParam.key.trim(), value: newParam.value.trim() }])
      setNewParam({ key: '', value: '' })
      setShowAddForm(false)
    }
  }

  // 处理添加参数的键盘事件
  const handleAddKeyDown = (e: React.KeyboardEvent, field: 'key' | 'value') => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      if (field === 'key' && newParam.key.trim()) {
        const valueInput = e.currentTarget.parentElement?.parentElement?.querySelector('input[placeholder*="Value"]') as HTMLInputElement
        valueInput?.focus()
      } else if (field === 'value' && newParam.key.trim() && newParam.value.trim()) {
        handleAddParam()
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      handleCancelAdd()
    }
  }

  const handleCancelAdd = () => {
    setNewParam({ key: '', value: '' })
    setShowAddForm(false)
  }

  // 处理添加参数失去焦点
  const handleAddBlur = () => {
    // 延迟检查，避免在两个输入框之间切换时误触发
    setTimeout(() => {
      const activeElement = document.activeElement
      const isInputFocused = activeElement?.tagName === 'INPUT'
      // 如果焦点移到了另一个输入框，不执行任何操作
      if (isInputFocused) {
        return
      }
      // 焦点完全移出表单后，根据内容决定是添加还是取消
      if (newParam.key.trim() && newParam.value.trim()) {
        handleAddParam()
      } else {
        handleCancelAdd()
      }
    }, 0)
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold gradient-text">参数列表 Parameters</h3>
        {params.length > 0 && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {params.length} 个参数 params
          </span>
        )}
      </div>

      {params.length === 0 && !showAddForm && (
        <div className="text-xs text-gray-400 text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          暂无参数，点击下方按钮添加<br/>No parameters, click below to add
        </div>
      )}

      <div className="space-y-2">
        {params.map((param, index) => (
          <div key={index} className="param-item">
            {editingIndex === index ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="label-primary w-10 flex-shrink-0">Key</label>
                  <input
                    type="text"
                    value={editingValues.key}
                    onChange={(e) => handleEditParamChange('key', e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-400 font-mono"
                    placeholder="参数键 Key"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="label-primary w-10 flex-shrink-0">Value</label>
                  <input
                    type="text"
                    value={editingValues.value}
                    onChange={(e) => handleEditParamChange('value', e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-400 font-mono"
                    placeholder="参数值 Value"
                  />
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd>
                  <span>保存 Save</span>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs ml-2">Esc</kbd>
                  <span>取消 Cancel</span>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-semibold text-gray-800 break-all">
                      {param.key}
                    </span>
                    <span className="text-gray-300">=</span>
                    <span className="text-xs font-mono text-gray-600 break-all">
                      {param.value}
                    </span>
                  </div>
                  {(() => {
                    try {
                      const decoded = decodeURIComponent(param.value)
                      return decoded !== param.value && (
                        <div className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded inline-block">
                          解码 Decoded: {decoded}
                        </div>
                      )
                    } catch {
                      return null
                    }
                  })()}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => setEditingIndex(index)}
                    className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-all"
                    title="编辑 Edit"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleDeleteParam(index)}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                    title="删除 Delete"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddForm ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="label-primary w-10 flex-shrink-0">Key</label>
            <input
              type="text"
              value={newParam.key}
              onChange={(e) => setNewParam({ ...newParam, key: e.target.value })}
              onKeyDown={(e) => handleAddKeyDown(e, 'key')}
              onBlur={handleAddBlur}
              placeholder="参数键 Key"
              className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-400 font-mono"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="label-primary w-10 flex-shrink-0">Value</label>
            <input
              type="text"
              value={newParam.value}
              onChange={(e) => setNewParam({ ...newParam, value: e.target.value })}
              onKeyDown={(e) => handleAddKeyDown(e, 'value')}
              onBlur={handleAddBlur}
              placeholder="参数值 Value"
              className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-400 font-mono"
            />
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd>
            <span>添加 Add</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs ml-2">Esc</kbd>
            <span>取消 Cancel</span>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-2 text-xs font-medium text-purple-600 border-2 border-purple-200 border-dashed rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all flex items-center justify-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>添加参数 Add Parameter</span>
        </button>
      )}
    </div>
  )
}

export default URLParamsEditor 
 