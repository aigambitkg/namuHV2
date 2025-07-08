import React from "react"
import dynamic from "next/dynamic"
import { Dashboard } from "@/components/dashboard/Dashboard"
import { DashboardCustomizer } from "@/components/dashboard/DashboardCustomizer"
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton"
import { ErrorBoundary } from "@/components/dashboard/ErrorBoundary"

const DashboardPage: React.FC = () => {
  // Dynamisches Laden für bessere Performance
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex-1">
        <ErrorBoundary>
          {loading ? <DashboardSkeleton /> : <Dashboard />}
        </ErrorBoundary>
      </div>
      <div className="hidden md:block md:w-80">
        <DashboardCustomizer />
      </div>
    </div>
  )
}

export default DashboardPage 