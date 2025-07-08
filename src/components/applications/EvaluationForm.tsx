import React from "react"

export const EvaluationForm: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Bewerber bewerten</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Skills</label>
        <input type="range" min={1} max={5} className="w-full" />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Culture Fit</label>
        <input type="range" min={1} max={5} className="w-full" />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Communication</label>
        <input type="range" min={1} max={5} className="w-full" />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Pros</label>
        <textarea className="w-full rounded border p-2" rows={2} />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Cons</label>
        <textarea className="w-full rounded border p-2" rows={2} />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Empfehlung</label>
        <select className="w-full rounded border">
          <option>Ja</option>
          <option>Vielleicht</option>
          <option>Nein</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Vergleich mit anderen Bewerbern</label>
        <input className="w-full rounded border p-2" placeholder="z.B. besser als..." />
      </div>
      <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Bewertung speichern</button>
    </div>
  )
} 