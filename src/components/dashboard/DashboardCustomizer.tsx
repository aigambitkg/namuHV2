import React from "react"

export const DashboardCustomizer: React.FC = () => {
  return (
    <aside className="w-full md:w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-2">Dashboard anpassen</h2>
      <div className="flex flex-col gap-2">
        <button className="w-full py-2 px-3 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-medium hover:bg-blue-200 dark:hover:bg-blue-800">Widget hinzufügen</button>
        <button className="w-full py-2 px-3 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700">Widget entfernen</button>
        <button className="w-full py-2 px-3 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700">Anordnung ändern</button>
      </div>
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">Drag & Drop, Reihenfolge, Größe und Sichtbarkeit der Widgets werden hier später konfigurierbar.</div>
    </aside>
  )
} 