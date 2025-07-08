import React from "react"
import { Briefcase } from "lucide-react"

export const ApplicantStatusWidget: React.FC = () => (
  <div className="flex flex-col h-full w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow gap-2">
    <div className="flex items-center gap-2 mb-2">
      <Briefcase className="w-5 h-5 text-blue-500" />
      <span className="font-semibold text-lg">Bewerbungsstatus</span>
    </div>
    <div className="flex flex-col gap-1 text-sm">
      <div className="flex justify-between"><span>Offen</span><span>2</span></div>
      <div className="flex justify-between"><span>In Bearbeitung</span><span>1</span></div>
      <div className="flex justify-between"><span>Abgeschlossen</span><span>1</span></div>
    </div>
    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-800 rounded h-2 overflow-hidden">
      <div className="bg-blue-500 h-2 rounded" style={{ width: "60%" }} />
    </div>
    <div className="text-xs text-gray-500 mt-1">Fortschritt: 60%</div>
  </div>
) 