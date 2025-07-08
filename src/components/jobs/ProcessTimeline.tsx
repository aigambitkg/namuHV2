import React from "react"
import { motion } from "framer-motion"

export interface ProcessTimelineProps {
  phases: string[]
  currentPhase: number
  durations?: number[] // Tage pro Phase
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ phases, currentPhase, durations }) => (
  <div className="flex flex-col md:flex-row gap-4 items-center w-full">
    {phases.map((phase, i) => (
      <React.Fragment key={i}>
        <motion.div
          className="flex flex-col items-center md:flex-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.05 }}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${i === currentPhase ? "bg-blue-500 shadow-lg scale-110" : "bg-gray-300"}`}>{i + 1}</div>
          <div className={`mt-2 text-xs ${i === currentPhase ? "text-blue-700 font-semibold" : "text-gray-500"}`}>{phase}</div>
          {durations && <div className="text-[10px] text-gray-400">{durations[i]} Tage</div>}
        </motion.div>
        {i < phases.length - 1 && (
          <div className="hidden md:block flex-1 h-1 bg-gray-200 my-2" />
        )}
        {i < phases.length - 1 && (
          <div className="block md:hidden w-1 h-6 bg-gray-200 my-2" />
        )}
      </React.Fragment>
    ))}
  </div>
) 