import React from "react"
import { WidgetConfig } from "./DashboardGrid"

export const ApplicantWidgets: Record<string, (widget: WidgetConfig) => React.ReactNode> = {
  status: (widget) => (
    <div className="h-full w-full flex flex-col items-center justify-center">Bewerbungsstatus Widget</div>
  ),
  recommendations: (widget) => (
    <div className="h-full w-full flex flex-col items-center justify-center">Jobempfehlungen Widget</div>
  ),
  stats: (widget) => (
    <div className="h-full w-full flex flex-col items-center justify-center">Bewerbungsstatistiken Widget</div>
  ),
  calendar: (widget) => (
    <div className="h-full w-full flex flex-col items-center justify-center">Kalender Widget</div>
  ),
} 