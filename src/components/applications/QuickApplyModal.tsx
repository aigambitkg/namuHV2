import React from "react"

export const QuickApplyModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-blue-500" onClick={onClose}>×</button>
        <h2 className="text-lg font-semibold mb-4">Quick Apply für mehrere Jobs</h2>
        <div className="mb-4">Job-Auswahl (max. 10):
          <div className="flex flex-col gap-2 mt-2">
            {[1,2,3].map(i => (
              <label key={i} className="flex items-center gap-2">
                <input type="checkbox" /> Job {i} <span className="text-xs text-gray-400">Match: 82%</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4 flex gap-4 items-center">
          <label><input type="checkbox" /> Bulk-Anschreiben verwenden</label>
          <label><input type="checkbox" /> Standard-Dokumente</label>
        </div>
        <div className="mb-4 text-xs text-gray-500">Kosten: 3 AI-Credits</div>
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
            <div className="bg-blue-500 h-2 rounded" style={{ width: "40%" }} />
          </div>
          <div className="text-xs text-gray-400 mt-1">Batch-Progress: 4/10 Bewerbungen gesendet</div>
        </div>
        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Jetzt bewerben</button>
      </div>
    </div>
  )
} 