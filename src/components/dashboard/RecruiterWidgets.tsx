import React from "react"
import { WidgetConfig } from "./DashboardGrid"
import { RecruiterCandidatesWidget } from "./widgets/RecruiterCandidatesWidget"
import { RecruiterJobsWidget } from "./widgets/RecruiterJobsWidget"
import { RecruiterPipelineWidget } from "./widgets/RecruiterPipelineWidget"
import { RecruiterStatsWidget } from "./widgets/RecruiterStatsWidget"

export const RecruiterWidgets: Record<string, (widget: WidgetConfig) => React.ReactNode> = {
  candidates: () => <RecruiterCandidatesWidget />,
  jobs: () => <RecruiterJobsWidget />,
  pipeline: () => <RecruiterPipelineWidget />,
  stats: () => <RecruiterStatsWidget />,
} 