import React, { useState, useEffect } from "react"
import type { JobCardProps } from "./JobCard"
import { ProcessTimeline } from "./ProcessTimeline"
import { JobCard } from "./JobCard"
import { motion, AnimatePresence } from "framer-motion"

export interface JobDetailProps {
  job: JobCardProps
  onApply: () => void
}

const TABS = ["Beschreibung", "Anforderungen", "Prozess", "Firma"]

const JobDetailSkeleton: React.FC = () => (
  <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow p-4 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 h-16 bg-gray-200 rounded" />
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-40 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-32" />
      </div>
    </div>
    <div className="h-8 bg-gray-100 rounded w-full mb-4" />
    <div className="h-32 bg-gray-100 rounded w-full mb-4" />
    <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
    <div className="h-32 bg-gray-100 rounded w-full" />
  </div>
)

export const JobDetail: React.FC<JobDetailProps> = ({ job, onApply }) => {
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [similarJobs, setSimilarJobs] = useState<JobCardProps[]>([])
  const [similarPage, setSimilarPage] = useState(1)
  const [similarLoading, setSimilarLoading] = useState(false)

  // Simuliertes Laden
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [job])

  // Ähnliche Jobs (Dummy, Infinite Scroll)
  useEffect(() => {
    setSimilarLoading(true)
    const t = setTimeout(() => {
      setSimilarJobs(prev => [...prev, ...Array(3).fill(0).map((_, i) => ({
        ...job,
        jobId: `${job.jobId}-sim${prev.length + i + 1}`,
        title: `Ähnlicher Job ${prev.length + i + 1}`
      }))])
      setSimilarLoading(false)
    }, 600)
    return () => clearTimeout(t)
  }, [similarPage, job])

  // Recently Viewed (localStorage)
  useEffect(() => {
    if (job.jobId) {
      const viewed = JSON.parse(localStorage.getItem("recentlyViewedJobs") || "[]")
      if (!viewed.includes(job.jobId)) {
        localStorage.setItem("recentlyViewedJobs", JSON.stringify([job.jobId, ...viewed].slice(0, 10)))
      }
    }
  }, [job.jobId])

  if (loading) return <JobDetailSkeleton />

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow p-4 relative">
      {/* Hero Section */}
      <div className="flex items-center gap-4 mb-4">
        <img src={job.logoUrl} alt="Logo" className="w-16 h-16 rounded object-contain bg-gray-100" />
        <div>
          <div className="font-bold text-2xl">{job.title}</div>
          <div className="text-sm text-gray-500">{job.company} · {job.location}</div>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{job.salaryMin} - {job.salaryMax} €</span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">{job.remoteType}</span>
          </div>
        </div>
      </div>
      {/* Tab Navigation */}
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
      {/* Tab Content */}
      <div className="min-h-[120px] mb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 0 && <div className="text-gray-700 dark:text-gray-200">Hier steht die ausführliche Jobbeschreibung...</div>}
            {tab === 1 && <div className="text-gray-700 dark:text-gray-200">Hier stehen die Anforderungen...</div>}
            {tab === 2 && (
              <div>
                <ProcessTimeline phases={["Bewerbung", "Assessment", "Interview", "Angebot"]} currentPhase={1} durations={[2, 5, 3, 2]} />
                <div className="mt-2 text-xs text-gray-400">Geschätzte Dauer: 12 Tage</div>
              </div>
            )}
            {tab === 3 && <div className="text-gray-700 dark:text-gray-200">Hier steht die Firmenbeschreibung...</div>}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Ähnliche Jobs */}
      <div className="mt-8">
        <div className="font-semibold mb-2">Ähnliche Jobs</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {similarJobs.map(j => <JobCard key={j.jobId} {...j} />)}
        </div>
        {similarLoading && <div className="text-xs text-gray-400 mt-2">Lädt weitere Jobs...</div>}
        <button className="mt-2 text-blue-500 underline text-xs" onClick={() => setSimilarPage(p => p + 1)}>Mehr anzeigen</button>
      </div>
      {/* Sticky Apply Button */}
      <div className="sticky bottom-4 flex justify-end mt-8 z-20">
        <motion.button
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          whileTap={{ scale: 0.97 }}
          onClick={onApply}
        >Jetzt bewerben</motion.button>
      </div>
      {/* Share Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button className="bg-gray-100 p-2 rounded hover:bg-gray-200" title="Link kopieren" onClick={() => navigator.clipboard.writeText(window.location.href)}>Share</button>
        <a className="bg-gray-100 p-2 rounded hover:bg-gray-200" title="LinkedIn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a className="bg-gray-100 p-2 rounded hover:bg-gray-200" title="Email" href={`mailto:?subject=Job%20Empfehlung&body=${encodeURIComponent(window.location.href)}`}>Email</a>
      </div>
    </div>
  )
} 