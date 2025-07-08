import React from "react"

export const ApplicationsTable: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow p-4">
      <div className="flex gap-2 mb-4">
        <input className="flex-1 px-2 py-1 rounded border" placeholder="Suche Bewerber..." />
        <select className="px-2 py-1 rounded border"><option>Status</option></select>
        <select className="px-2 py-1 rounded border"><option>Sortieren nach</option></select>
        <button className="px-3 py-1 bg-gray-100 rounded">Export</button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th><input type="checkbox" /></th>
            <th>Name</th>
            <th>Status</th>
            <th>Match</th>
            <th>Dokumente</th>
            <th>Bewertung</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {[1,2,3].map(i => (
            <tr key={i} className="border-b">
              <td><input type="checkbox" /></td>
              <td>Max Mustermann</td>
              <td><span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">In Prüfung</span></td>
              <td>82%</td>
              <td><button className="text-xs underline">Preview</button></td>
              <td>⭐⭐⭐⭐☆</td>
              <td>
                <button className="text-xs bg-blue-100 text-blue-700 rounded px-2 py-1 mr-1">Status</button>
                <button className="text-xs bg-red-100 text-red-700 rounded px-2 py-1">Ablehnen</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-xs text-gray-400">Collaboration, @mention, Export, Undo/Redo (Platzhalter)</div>
    </div>
  )
} 