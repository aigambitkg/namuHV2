import React, { useState } from "react"

const STATUSES = ["Eingereicht", "In Prüfung", "Interview", "Angebot", "Abgelehnt", "Archiviert"]

export const ApplicationTracker: React.FC = () => {
  const [view, setView] = useState<"kanban" | "timeline">("kanban")
  const [filter, setFilter] = useState("Aktiv")

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex gap-4 mb-4">
        <button className={`px-3 py-1 rounded ${view === "kanban" ? "bg-blue-500 text-white" : "bg-gray-100"}`} onClick={() => setView("kanban")}>Kanban</button>
        <button className={`px-3 py-1 rounded ${view === "timeline" ? "bg-blue-500 text-white" : "bg-gray-100"}`} onClick={() => setView("timeline")}>Timeline</button>
        <select className="ml-auto px-2 py-1 rounded border" value={filter} onChange={e => setFilter(e.target.value)}>
          <option>Aktiv</option>
          <option>Archiviert</option>
          <option>Abgelehnt</option>
        </select>
      </div>
      {view === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATUSES.slice(0, 4).map(status => (
            <div key={status} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 min-h-[200px]">
              <div className="font-semibold mb-2">{status}</div>
              <div className="space-y-2 text-xs text-gray-500">Bewerbungskarten (Platzhalter)</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 min-h-[200px]">
          <div className="font-semibold mb-2">Timeline-View</div>
          <div className="text-xs text-gray-500">Timeline mit Status-Updates, nächste Schritte, Interview-Termine (Platzhalter)</div>
        </div>
      )}
    </div>
  )
} 