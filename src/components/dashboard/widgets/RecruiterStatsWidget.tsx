import React from "react"
import { BarChart2, UserPlus, XCircle, Mail } from "lucide-react"

export const RecruiterStatsWidget: React.FC = () => (
  <div className="flex flex-col h-full w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow gap-2">
    <div className="flex items-center gap-2 mb-2">
      <BarChart2 className="w-5 h-5 text-blue-500" />
      <span className="font-semibold text-lg">Recruiter-Statistiken</span>
    </div>
    <div className="flex gap-4 justify-between mt-2">
      <div className="flex flex-col items-center">
        <Mail className="w-5 h-5 text-blue-400 mb-1" />
        <span className="font-bold text-lg">24</span>
        <span className="text-xs text-gray-500">Bewerbungen</span>
      </div>
      <div className="flex flex-col items-center">
        <UserPlus className="w-5 h-5 text-green-500 mb-1" />
        <span className="font-bold text-lg">4</span>
        <span className="text-xs text-gray-500">Einstellungen</span>
      </div>
      <div className="flex flex-col items-center">
        <XCircle className="w-5 h-5 text-red-500 mb-1" />
        <span className="font-bold text-lg">8</span>
        <span className="text-xs text-gray-500">Absagen</span>
      </div>
    </div>
  </div>
) 