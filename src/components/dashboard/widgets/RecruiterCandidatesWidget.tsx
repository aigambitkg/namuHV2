import React from "react"
import { Users } from "lucide-react"

export const RecruiterCandidatesWidget: React.FC = () => (
  <div className="flex flex-col h-full w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow gap-2">
    <div className="flex items-center gap-2 mb-2">
      <Users className="w-5 h-5 text-blue-500" />
      <span className="font-semibold text-lg">Kandidatenübersicht</span>
    </div>
    <ul className="flex flex-col gap-2">
      <li className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded p-2">
        <div>
          <div className="font-medium">Anna Schmidt</div>
          <div className="text-xs text-gray-500">Frontend Developer</div>
        </div>
        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Interview</span>
      </li>
      <li className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded p-2">
        <div>
          <div className="font-medium">Max Müller</div>
          <div className="text-xs text-gray-500">Data Analyst</div>
        </div>
        <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">Assessment</span>
      </li>
      <li className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded p-2">
        <div>
          <div className="font-medium">Lisa Becker</div>
          <div className="text-xs text-gray-500">Product Owner</div>
        </div>
        <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">Neu</span>
      </li>
    </ul>
  </div>
) 