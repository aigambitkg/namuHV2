import React from "react"
import { Shuffle } from "lucide-react"

export const RecruiterPipelineWidget: React.FC = () => (
  <div className="flex flex-col h-full w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow gap-2">
    <div className="flex items-center gap-2 mb-2">
      <Shuffle className="w-5 h-5 text-blue-500" />
      <span className="font-semibold text-lg">Pipeline</span>
    </div>
    <div className="flex flex-row justify-between items-center gap-2 mt-2">
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg">5</span>
        <span className="text-xs text-blue-700">Neu</span>
      </div>
      <div className="w-6 h-1 bg-blue-200 rounded" />
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg">3</span>
        <span className="text-xs text-yellow-700">Assessment</span>
      </div>
      <div className="w-6 h-1 bg-blue-200 rounded" />
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg">2</span>
        <span className="text-xs text-green-700">Interview</span>
      </div>
      <div className="w-6 h-1 bg-blue-200 rounded" />
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg">1</span>
        <span className="text-xs text-purple-700">Angebot</span>
      </div>
    </div>
  </div>
) 