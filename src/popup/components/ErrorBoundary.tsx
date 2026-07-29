import React from 'react'
import { t } from '@/utils/i18n'

interface State { hasError: boolean }

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          style={{ color: 'var(--color-text-muted)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
          {t('error.title')}
        </p>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          {t('error.subtitle')}
        </p>
        <button
          onClick={() => { this.setState({ hasError: false }); window.location.reload() }}
          className="px-4 py-2 text-xs font-medium text-white rounded-xl hover:opacity-90 transition-colors"
          style={{ background: 'var(--color-primary)' }}>
          {t('error.reload')}
        </button>
      </div>
    )
  }
}
