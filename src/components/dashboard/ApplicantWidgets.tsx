import React from "react"
import { WidgetConfig } from "./DashboardGrid"
import { ApplicantStatusWidget } from "./widgets/ApplicantStatusWidget"
import { ApplicantRecommendationsWidget } from "./widgets/ApplicantRecommendationsWidget"
import { ApplicantStatsWidget } from "./widgets/ApplicantStatsWidget"
import { ApplicantCalendarWidget } from "./widgets/ApplicantCalendarWidget"

export const ApplicantWidgets: Record<string, (widget: WidgetConfig) => React.ReactNode> = {
  status: () => <ApplicantStatusWidget />, 
  recommendations: () => <ApplicantRecommendationsWidget />, 
  stats: () => <ApplicantStatsWidget />, 
  calendar: () => <ApplicantCalendarWidget />, 
} 