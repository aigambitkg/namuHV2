import React from "react"
import { Briefcase } from "lucide-react"

export const RecruiterJobsWidget: React.FC = () => (
  <div className="flex flex-col h-full w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow gap-2">
    <div className="flex items-center gap-2 mb-2">
      <Briefcase className="w-5 h-5 text-blue-500" />
      <span className="font-semibold text-lg">Jobanzeigen</span>
    </div>
    <ul className="flex flex-col gap-2">
      <li className="flex items-center justify-between bg-blue-50 dark:bg-blue-950 rounded p-2">
        <div>
          <div className="font-medium">Frontend Developer</div>
          <div className="text-xs text-gray-500">12 Bewerber</div>
        </div>
        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Offen</span>
      </li>
      <li className="flex items-center justify-between bg-blue-50 dark:bg-blue-950 rounded p-2">
        <div>
          <div className="font-medium">Data Analyst</div>
          <div className="text-xs text-gray-500">7 Bewerber</div>
        </div>
        <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700">Geschlossen</span>
      </li>
    </ul>
  </div>
) 