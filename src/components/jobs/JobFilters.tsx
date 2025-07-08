import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface JobFiltersProps {
  values: any
  onChange: (values: any) => void
}

const BRANCHEN = ["IT", "Consulting", "Finance", "Healthcare", "Education"]
const SKILLS = ["React", "Node.js", "Python", "SQL", "AWS", "Figma", "Excel"]

export const JobFilters: React.FC<JobFiltersProps> = ({ values, onChange }) => {
  const [open, setOpen] = useState(true)
  const [skillInput, setSkillInput] = useState("")
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([])

  // Filter-Handler
  const handleChange = (field: string, value: any) => {
    onChange({ ...values, [field]: value })
  }
  // Skills Autocomplete
  const handleSkillInput = (val: string) => {
    setSkillInput(val)
    setSuggestedSkills(SKILLS.filter(s => s.toLowerCase().includes(val.toLowerCase()) && !values.skills?.includes(s)))
  }
  const addSkill = (skill: string) => {
    handleChange("skills", [...(values.skills || []), skill])
    setSkillInput("")
    setSuggestedSkills([])
  }
  const removeSkill = (skill: string) => {
    handleChange("skills", (values.skills || []).filter((s: string) => s !== skill))
  }
  // Branchen Multi-Select
  const toggleBranche = (branche: string) => {
    const arr = values.branchen || []
    if (arr.includes(branche)) handleChange("branchen", arr.filter((b: string) => b !== branche))
    else handleChange("branchen", [...arr, branche])
  }
  // Filter-Badge Remove
  const removeFilter = (field: string, value: any) => {
    if (field === "skills") removeSkill(value)
    else if (field === "branchen") toggleBranche(value)
    else handleChange(field, undefined)
  }

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="w-full md:w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow flex flex-col gap-4"
    >
      <button className="md:hidden mb-2 text-blue-500 underline" onClick={() => setOpen(o => !o)}>{open ? "Filter ausblenden" : "Filter anzeigen"}</button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-lg font-semibold mb-2">Filter</h2>
            {/* Standort */}
            <div>
              <label className="block text-xs font-medium mb-1">Standort</label>
              <input type="text" className="w-full px-2 py-1 rounded border" placeholder="Ort oder PLZ" value={values.standort || ""} onChange={e => handleChange("standort", e.target.value)} />
              <div className="text-xs text-gray-400 mt-1">Umkreissuche (API-Platzhalter)</div>
            </div>
            {/* Gehaltsrange */}
            <div>
              <label className="block text-xs font-medium mb-1">Gehalt (€)</label>
              <div className="flex gap-2 items-center">
                <input type="range" min={20000} max={200000} step={1000} value={values.salaryMin || 20000} onChange={e => handleChange("salaryMin", Number(e.target.value))} className="flex-1" />
                <input type="range" min={20000} max={200000} step={1000} value={values.salaryMax || 200000} onChange={e => handleChange("salaryMax", Number(e.target.value))} className="flex-1" />
              </div>
              <div className="text-xs text-gray-400 mt-1">{values.salaryMin || 20000} - {values.salaryMax || 200000} €</div>
            </div>
            {/* Remote-Optionen */}
            <div>
              <label className="block text-xs font-medium mb-1">Remote</label>
              <div className="flex gap-2">
                <label><input type="checkbox" checked={values.remote?.includes("remote")} onChange={e => handleChange("remote", e.target.checked ? [...(values.remote || []), "remote"] : (values.remote || []).filter((r: string) => r !== "remote"))} /> Remote</label>
                <label><input type="checkbox" checked={values.remote?.includes("hybrid")} onChange={e => handleChange("remote", e.target.checked ? [...(values.remote || []), "hybrid"] : (values.remote || []).filter((r: string) => r !== "hybrid"))} /> Hybrid</label>
                <label><input type="checkbox" checked={values.remote?.includes("onsite")} onChange={e => handleChange("remote", e.target.checked ? [...(values.remote || []), "onsite"] : (values.remote || []).filter((r: string) => r !== "onsite"))} /> Onsite</label>
              </div>
            </div>
            {/* Berufserfahrung */}
            <div>
              <label className="block text-xs font-medium mb-1">Berufserfahrung</label>
              <input type="range" min={0} max={20} value={values.experience || 0} onChange={e => handleChange("experience", Number(e.target.value))} className="w-full" />
              <div className="text-xs text-gray-400 mt-1">{values.experience || 0} Jahre</div>
            </div>
            {/* Skills */}
            <div>
              <label className="block text-xs font-medium mb-1">Skills</label>
              <input type="text" className="w-full px-2 py-1 rounded border" placeholder="Skills (Tag-Input)" value={skillInput} onChange={e => handleSkillInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && skillInput) addSkill(skillInput) }} />
              <div className="flex flex-wrap gap-1 mt-1">
                {(values.skills || []).map((skill: string) => (
                  <span key={skill} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs flex items-center gap-1">{skill} <button onClick={() => removeSkill(skill)} className="ml-1">×</button></span>
                ))}
                {suggestedSkills.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {suggestedSkills.map(skill => (
                      <button key={skill} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs" onClick={() => addSkill(skill)}>{skill}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Branchen */}
            <div>
              <label className="block text-xs font-medium mb-1">Branchen</label>
              <div className="flex flex-wrap gap-2">
                {BRANCHEN.map(b => (
                  <label key={b} className={`px-2 py-1 rounded text-xs cursor-pointer ${values.branchen?.includes(b) ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}>
                    <input type="checkbox" checked={values.branchen?.includes(b)} onChange={() => toggleBranche(b)} className="mr-1" />{b}
                  </label>
                ))}
              </div>
            </div>
            {/* Aktive Filter-Badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {values.remote?.map((r: string) => <span key={r} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center">{r} <button onClick={() => removeFilter("remote", r)} className="ml-1">×</button></span>)}
              {(values.skills || []).map((s: string) => <span key={s} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs flex items-center">{s} <button onClick={() => removeFilter("skills", s)} className="ml-1">×</button></span>)}
              {(values.branchen || []).map((b: string) => <span key={b} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs flex items-center">{b} <button onClick={() => removeFilter("branchen", b)} className="ml-1">×</button></span>)}
              {values.standort && <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs flex items-center">{values.standort} <button onClick={() => removeFilter("standort", values.standort)} className="ml-1">×</button></span>}
              {(values.salaryMin || values.salaryMax) && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs flex items-center">{values.salaryMin || 20000} - {values.salaryMax || 200000} € <button onClick={() => { handleChange("salaryMin", 20000); handleChange("salaryMax", 200000) }} className="ml-1">×</button></span>}
              {values.experience && <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs flex items-center">{values.experience} Jahre <button onClick={() => removeFilter("experience", values.experience)} className="ml-1">×</button></span>}
            </div>
            {/* Job Alert Button */}
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">Job Alert erstellen</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
} 