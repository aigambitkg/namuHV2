import React from "react"

export const ApplicationForm: React.FC = () => {
  const steps = ["Dokumente", "Anschreiben", "Fragen", "Review"]
  const [step, setStep] = React.useState(0)

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      {/* Stepper */}
      <div className="flex justify-between mb-6">
        {steps.map((s, i) => (
          <div key={s} className={`flex-1 flex flex-col items-center ${i === step ? "text-blue-600 font-bold" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${i === step ? "bg-blue-500 text-white" : "bg-gray-200"}`}>{i + 1}</div>
            <span className="text-xs">{s}</span>
          </div>
        ))}
      </div>
      {/* Step Content */}
      {step === 0 && (
        <div className="mb-4">
          <div className="font-semibold mb-2">Dokumente hochladen</div>
          <div className="border-dashed border-2 border-gray-300 rounded p-6 text-center text-gray-400">Drag & Drop Bereich (Platzhalter)</div>
        </div>
      )}
      {step === 1 && (
        <div className="mb-4">
          <div className="font-semibold mb-2">Anschreiben</div>
          <button className="mb-2 px-3 py-1 bg-blue-100 text-blue-700 rounded">KI-Anschreiben generieren</button>
          <textarea className="w-full min-h-[120px] rounded border p-2" placeholder="Dein Anschreiben..." />
        </div>
      )}
      {step === 2 && (
        <div className="mb-4">
          <div className="font-semibold mb-2">Fragen zum Job</div>
          <div className="space-y-2">
            <div>Frage 1 (Platzhalter): <input className="border rounded px-2 py-1 ml-2" /></div>
            <div>Frage 2 (Platzhalter): <input className="border rounded px-2 py-1 ml-2" /></div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="mb-4">
          <div className="font-semibold mb-2">Vorschau & Absenden</div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded p-4">Preview der Bewerbung (Platzhalter)</div>
        </div>
      )}
      {/* Step Controls */}
      <div className="flex justify-between mt-6">
        <button className="px-4 py-2 rounded bg-gray-100" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>Zurück</button>
        <button className="px-4 py-2 rounded bg-blue-500 text-white" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}>{step === steps.length - 1 ? "Absenden" : "Weiter"}</button>
      </div>
      {/* Fortschritt speichern */}
      <button className="mt-4 text-xs text-blue-500 underline">Als Entwurf speichern</button>
    </div>
  )
} 