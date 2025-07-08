import React from "react"
import { Calendar } from "lucide-react"

export const ApplicantCalendarWidget: React.FC = () => (
  <div className="flex flex-col h-full w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow gap-2">
    <div className="flex items-center gap-2 mb-2">
      <Calendar className="w-5 h-5 text-blue-500" />
      <span className="font-semibold text-lg">Kalender</span>
    </div>
    <ul className="flex flex-col gap-2">
      <li className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded p-2">
        <div>
          <div className="font-medium">Interview Tech AG</div>
          <div className="text-xs text-gray-500">12.07.2024 · 10:00 Uhr</div>
        </div>
        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Bestätigt</span>
      </li>
      <li className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded p-2">
        <div>
          <div className="font-medium">Assessment Data GmbH</div>
          <div className="text-xs text-gray-500">15.07.2024 · 14:30 Uhr</div>
        </div>
        <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">Ausstehend</span>
      </li>
    </ul>
  </div>
) 