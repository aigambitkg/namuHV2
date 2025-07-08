import React, { Component, ReactNode } from "react"

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  handleReset = () => {
    this.setState({ hasError: false })
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-100 dark:bg-red-900 rounded-lg text-red-700 dark:text-red-200 flex flex-col items-center">
          <div className="mb-2 font-semibold">Ein Fehler ist aufgetreten.</div>
          <button onClick={this.handleReset} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Zurücksetzen</button>
        </div>
      )
    }
    return this.props.children
  }
} 