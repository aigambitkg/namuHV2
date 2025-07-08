import React from "react"
import { Sparkles } from "lucide-react"

export const ApplicantRecommendationsWidget: React.FC = () => (
  <div className="flex flex-col h-full w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow gap-2">
    <div className="flex items-center gap-2 mb-2">
      <Sparkles className="w-5 h-5 text-blue-500" />
      <span className="font-semibold text-lg">Jobempfehlungen</span>
    </div>
    <ul className="flex flex-col gap-2">
      <li className="flex flex-col md:flex-row md:items-center justify-between bg-blue-50 dark:bg-blue-950 rounded p-2">
        <div>
          <div className="font-medium">Frontend Developer</div>
          <div className="text-xs text-gray-500">Tech AG · Berlin</div>
        </div>
        <button className="mt-2 md:mt-0 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">Jetzt ansehen</button>
      </li>
      <li className="flex flex-col md:flex-row md:items-center justify-between bg-blue-50 dark:bg-blue-950 rounded p-2">
        <div>
          <div className="font-medium">Data Analyst</div>
          <div className="text-xs text-gray-500">Data GmbH · München</div>
        </div>
        <button className="mt-2 md:mt-0 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">Jetzt ansehen</button>
      </li>
      <li className="flex flex-col md:flex-row md:items-center justify-between bg-blue-50 dark:bg-blue-950 rounded p-2">
        <div>
          <div className="font-medium">Product Owner</div>
          <div className="text-xs text-gray-500">InnovateX · Remote</div>
        </div>
        <button className="mt-2 md:mt-0 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">Jetzt ansehen</button>
      </li>
    </ul>
  </div>
) 