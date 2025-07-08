import React, { useState, useEffect, useRef, useCallback } from "react"
import type { JobCardProps } from "./JobCard"
import { JobCard } from "./JobCard"
import { motion, AnimatePresence } from "framer-motion"

interface JobListViewProps {
  jobs: JobCardProps[]
  sortBy: "date" | "salary" | "match"
  onSortChange: (sort: "date" | "salary" | "match") => void
  onExpand: (jobId: string) => void
}

const SKELETON_COUNT = 6

const JobSkeleton: React.FC = () => (
  <div className="flex flex-col md:flex-row items-center gap-2 py-3 animate-pulse">
    <div className="w-10 h-10 bg-gray-200 rounded" />
    <div className="flex-1 min-w-0">
      <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
      <div className="h-3 bg-gray-100 rounded w-20" />
    </div>
    <div className="hidden md:block h-4 bg-gray-200 rounded w-16" />
    <div className="hidden md:block h-4 bg-gray-200 rounded w-20" />
    <div className="hidden md:block h-4 bg-gray-200 rounded w-14" />
    <div className="w-8 h-8 bg-gray-100 rounded-full" />
    <div className="w-5 h-5 bg-gray-200 rounded-full" />
    <div className="w-16 h-7 bg-gray-200 rounded" />
    <div className="w-12 h-4 bg-gray-100 rounded" />
  </div>
)

export const JobListView: React.FC<JobListViewProps> = ({ jobs, sortBy, onSortChange, onExpand }) => {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [displayedJobs, setDisplayedJobs] = useState<JobCardProps[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)

  // Infinite Scroll: Lade mehr Jobs, wenn am Ende
  const lastJobRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(p => p + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  // Pagination/Infinite Scroll Simulation
  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => {
      const next = jobs.slice(0, page * 10)
      setDisplayedJobs(next)
      setHasMore(next.length < jobs.length)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timeout)
  }, [jobs, page])

  // Recently Viewed (localStorage)
  useEffect(() => {
    if (expanded) {
      const viewed = JSON.parse(localStorage.getItem("recentlyViewedJobs") || "[]")
      if (!viewed.includes(expanded)) {
        localStorage.setItem("recentlyViewedJobs", JSON.stringify([expanded, ...viewed].slice(0, 10)))
      }
    }
  }, [expanded])

  // Sortierung
  const sortedJobs = [...displayedJobs].sort((a, b) => {
    if (sortBy === "salary") return (b.salaryMax - a.salaryMax)
    if (sortBy === "match") return (b.matchScore ?? 0) - (a.matchScore ?? 0)
    return 0 // Datum: Annahme, dass jobs schon nach Datum sortiert sind
  })

  // Empty State
  if (!jobs.length && !loading) {
    return <div className="text-center text-gray-400 py-12">Keine Jobs gefunden.<br /><span className="text-xs">Tipp: Filter anpassen oder Job Alert erstellen.</span></div>
  }

  return (
    <div className="w-full">
      {/* Sortierung */}
      <div className="flex gap-2 mb-2">
        <button className={`text-xs px-2 py-1 rounded ${sortBy === "date" ? "bg-blue-500 text-white" : "bg-gray-100"}`} onClick={() => onSortChange("date")}>Datum</button>
        <button className={`text-xs px-2 py-1 rounded ${sortBy === "salary" ? "bg-blue-500 text-white" : "bg-gray-100"}`} onClick={() => onSortChange("salary")}>Gehalt</button>
        <button className={`text-xs px-2 py-1 rounded ${sortBy === "match" ? "bg-blue-500 text-white" : "bg-gray-100"}`} onClick={() => onSortChange("match")}>Match</button>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {sortedJobs.map((job, i) => {
          const isLast = i === sortedJobs.length - 1
          return (
            <motion.div
              key={job.jobId || i}
              ref={isLast ? lastJobRef : undefined}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <div className="flex flex-col md:flex-row items-center gap-2 py-3">
                <JobCard {...job} />
                {/* Expand/Collapse Button */}
                <button
                  className="ml-2 text-xs underline"
                  onClick={() => setExpanded(expanded === (job.jobId || i.toString()) ? null : (job.jobId || i.toString()))}
                >
                  {expanded === (job.jobId || i.toString()) ? "Weniger" : "Details"}
                </button>
              </div>
              {/* Inline Expand (Accordion) */}
              <AnimatePresence>
                {expanded === (job.jobId || i.toString()) && (
                  <motion.div
                    key="expand"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-gray-50 dark:bg-gray-800 rounded p-4 mt-2"
                  >
                    <div className="text-sm text-gray-700 dark:text-gray-200">Mehr Details zum Job, Beschreibung, Anforderungen, Prozess etc.</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
        {/* Skeleton Loader */}
        {loading && Array.from({ length: SKELETON_COUNT }).map((_, i) => <JobSkeleton key={i} />)}
      </div>
      {/* Recently Viewed */}
      <div className="mt-8">
        <div className="text-xs text-gray-400 mb-1">Zuletzt angesehen:</div>
        <div className="flex flex-wrap gap-2">
          {(JSON.parse(localStorage.getItem("recentlyViewedJobs") || "[]") as string[]).map(id => (
            <span key={id} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{id}</span>
          ))}
        </div>
      </div>
    </div>
  )
} 