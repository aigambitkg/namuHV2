import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bookmark, BookmarkCheck, Eye, Info, Heart, HeartFilled } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAuth } from "@/hooks/useAuth"
import { MatchScoreBreakdown } from "./MatchScoreBreakdown"

export interface JobCardProps {
  logoUrl: string
  title: string
  company: string
  location: string
  salaryMin: number
  salaryMax: number
  remoteType: "remote" | "hybrid" | "onsite"
  matchScore?: number // 0-100, optional
  bookmarked: boolean
  onBookmark: (saved: boolean) => void
  onQuickApply: () => void
  hidden?: boolean
  viewCount?: number
  jobId?: string
  shortDescription?: string
  processStage?: string
  skills?: string[]
}

export const JobCard: React.FC<JobCardProps> = ({
  logoUrl, title, company, location, salaryMin, salaryMax, remoteType, matchScore, bookmarked, onBookmark, onQuickApply, hidden, viewCount: initialViewCount, jobId, shortDescription, processStage, skills
}) => {
  const { user } = useAuth()
  const [showDetails, setShowDetails] = useState(false)
  const [saved, setSaved] = useState(bookmarked)
  const [showHeart, setShowHeart] = useState(false)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [views, setViews] = useState<number>(initialViewCount ?? 0)
  const supabase = createClientComponentClient()

  // Bookmark Toggle (localStorage + optional Supabase)
  useEffect(() => {
    setSaved(bookmarked)
  }, [bookmarked])
  const handleBookmark = useCallback(() => {
    setSaved((prev) => {
      const next = !prev
      onBookmark(next)
      if (jobId) {
        const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]")
        let updated
        if (next) {
          updated = Array.from(new Set([...savedJobs, jobId]))
        } else {
          updated = savedJobs.filter((id: string) => id !== jobId)
        }
        localStorage.setItem("savedJobs", JSON.stringify(updated))
      }
      setShowHeart(next)
      setTimeout(() => setShowHeart(false), 900)
      return next
    })
  }, [onBookmark, jobId])

  // View Counter (Supabase Realtime)
  useEffect(() => {
    if (!jobId) return
    // Increment view on mount
    supabase.from("jobs").update({ views: (views || 0) + 1 }).eq("id", jobId)
    // Subscribe to realtime updates
    const channel = supabase.channel(`job_views_${jobId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'jobs', filter: `id=eq.${jobId}` }, payload => {
        if (typeof payload.new?.views === "number") setViews(payload.new.views)
      })
      .subscribe()
    return () => { channel.unsubscribe() }
  }, [jobId])

  // Quick Apply Animation
  const [applyAnim, setApplyAnim] = useState(false)
  const handleQuickApply = () => {
    setApplyAnim(true)
    onQuickApply()
    setTimeout(() => setApplyAnim(false), 700)
  }

  // MatchScore Breakdown Dummy
  const matchDetails = {
    skills: { matched: 7, total: 10 },
    erfahrung: true,
    standort: 80,
    gehalt: true,
    verfuegbarkeit: true
  }

  return (
    <motion.div
      className="relative flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow p-4 hover:shadow-lg transition-all group cursor-pointer overflow-hidden"
      whileHover={{ scale: 1.025, boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
      tabIndex={0}
      aria-label={title}
    >
      {/* Hidden Badge */}
      {hidden && <div className="absolute top-2 right-2 bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">Hidden</div>}
      {/* Firmenlogo und Titel */}
      <div className="flex items-center gap-3 mb-2">
        <img src={logoUrl} alt="Logo" className="w-12 h-12 rounded object-contain bg-gray-100" />
        <div>
          <div className="font-semibold text-lg">{title}</div>
          <div className="text-sm text-gray-500">{company}</div>
        </div>
      </div>
      {/* Standort, Gehalt, Remote */}
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{location}</span>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{salaryMin} - {salaryMax} €</span>
        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">{remoteType}</span>
      </div>
      {/* Match Score (optional, nur für Bewerber) */}
      {typeof matchScore === "number" && user && (
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            className="relative w-10 h-10 flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
            onClick={e => { e.stopPropagation(); setShowMatchModal(true) }}
            tabIndex={0}
            aria-label="Match-Score Details anzeigen"
          >
            <svg width="40" height="40">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#e0e7ef" strokeWidth="4" />
              <motion.circle
                cx="20" cy="20" r="18" fill="none" stroke="#3b82f6" strokeWidth="4"
                strokeDasharray={113}
                strokeDashoffset={113 - (113 * (matchScore / 100))}
                initial={{ strokeDashoffset: 113 }}
                animate={{ strokeDashoffset: 113 - (113 * (matchScore / 100)) }}
                transition={{ duration: 0.7 }}
                style={{ filter: "drop-shadow(0 0 4px #3b82f6)" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-bold text-blue-700 text-sm">{matchScore}%</span>
          </motion.div>
          <span className="text-xs text-gray-500">Match</span>
        </div>
      )}
      {/* Bookmark & Quick Apply */}
      <div className="flex items-center gap-2 mt-auto">
        <button className="text-gray-400 hover:text-blue-500 relative" aria-label="Bookmark" onClick={e => { e.stopPropagation(); handleBookmark() }}>
          <AnimatePresence>
            {saved ? (
              <motion.span
                key="saved"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="inline-block"
              >
                <BookmarkCheck className="w-5 h-5 text-blue-500" />
              </motion.span>
            ) : (
              <motion.span
                key="unsaved"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="inline-block"
              >
                <Bookmark className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
          {/* Herz-Animation */}
          <AnimatePresence>
            {showHeart && (
              <motion.span
                key="heart"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.4, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute -top-3 -right-3"
              >
                <HeartFilled className="w-6 h-6 text-pink-400 drop-shadow" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <motion.button
          className={`ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center gap-2 relative overflow-hidden ${applyAnim ? "ring-2 ring-blue-300" : ""}`}
          onClick={e => { e.stopPropagation(); handleQuickApply() }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.span
            initial={false}
            animate={applyAnim ? { scale: 1.2, color: "#22c55e" } : { scale: 1, color: "#fff" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Heart className="w-4 h-4 mr-1" />
          </motion.span>
          Quick Apply
        </motion.button>
      </div>
      {/* View Counter */}
      {typeof views === "number" && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 flex items-center gap-1"><Eye className="w-4 h-4" />{views}</div>
      )}
      {/* Hover: Mehr Details (Platzhalter) */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 rounded-lg p-4 z-10 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-4 h-4 text-blue-400" />
              <span className="font-semibold">Details</span>
            </div>
            {shortDescription && <div className="text-xs text-gray-700 dark:text-gray-200 mb-1">{shortDescription}</div>}
            {processStage && <div className="text-xs text-gray-500">Prozess-Stufe: <span className="font-medium">{processStage}</span></div>}
            {skills && skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {skills.map(skill => <span key={skill} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{skill}</span>)}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* MatchScore Breakdown Modal */}
      <MatchScoreBreakdown open={showMatchModal} onClose={() => setShowMatchModal(false)} details={matchDetails} />
    </motion.div>
  )
} 