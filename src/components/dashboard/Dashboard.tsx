import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { DashboardGrid, WidgetConfig } from "./DashboardGrid"
import { ApplicantWidgets } from "./ApplicantWidgets"
import { RecruiterWidgets } from "./RecruiterWidgets"

const defaultApplicantLayout: WidgetConfig[] = [
  { id: "status", type: "status", x: 0, y: 0, w: 6, h: 2 },
  { id: "recommendations", type: "recommendations", x: 6, y: 0, w: 6, h: 2 },
  { id: "stats", type: "stats", x: 0, y: 2, w: 6, h: 2 },
  { id: "calendar", type: "calendar", x: 6, y: 2, w: 6, h: 2 },
]
const defaultRecruiterLayout: WidgetConfig[] = [
  { id: "candidates", type: "candidates", x: 0, y: 0, w: 6, h: 2 },
  { id: "jobs", type: "jobs", x: 6, y: 0, w: 6, h: 2 },
  { id: "pipeline", type: "pipeline", x: 0, y: 2, w: 6, h: 2 },
  { id: "stats", type: "stats", x: 6, y: 2, w: 6, h: 2 },
]

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  // Annahme: user?.role ist "applicant" oder "recruiter"
  const role = (user as any)?.role || "applicant"
  const widgets = role === "recruiter" ? defaultRecruiterLayout : defaultApplicantLayout
  const renderWidget = role === "recruiter" ? RecruiterWidgets : ApplicantWidgets

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto py-4 px-2 md:px-6">
      <DashboardGrid
        widgets={widgets}
        dashboardType={role}
        renderWidget={w => renderWidget[w.type]?.(w) ?? null}
      />
    </main>
  )
} 