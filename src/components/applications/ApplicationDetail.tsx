import React, { useState } from "react"

const TABS = ["Übersicht", "Dokumente", "Kommunikation", "Notizen"]

export const ApplicationDetail: React.FC = () => {
  const [tab, setTab] = useState(0)
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Info-Panel */}
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow p-4">
        <div className="font-bold text-lg mb-2">Bewerber-Info (Platzhalter)</div>
        <div className="mb-4">Stage-Progression (Drag & Drop, Platzhalter)</div>
        <div className="mb-4">Bewertung: ⭐⭐⭐⭐⭐ (Platzhalter)</div>
        <div className="mb-4">Interview-Scheduling (Platzhalter)</div>
        <div className="mb-4">Email-Templates (Platzhalter)</div>
      </div>
      {/* Dokumente & Tabs */}
      <div className="flex-[2] bg-white dark:bg-gray-900 rounded-lg shadow p-4">
        <div className="flex gap-4 border-b mb-4">
          {TABS.map((t, i) => (
            <button
              key={t}
              className={`py-2 px-4 font-medium border-b-2 transition-colors ${tab === i ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"}`}
              onClick={() => setTab(i)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="min-h-[120px]">
          {tab === 0 && <div>Übersicht (Platzhalter)</div>}
          {tab === 1 && <div>Dokumente (Platzhalter)</div>}
          {tab === 2 && <div>Kommunikation (Platzhalter)</div>}
          {tab === 3 && <div>Notizen (Platzhalter)</div>}
        </div>
      </div>
    </div>
  )
} 