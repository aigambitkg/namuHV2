import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, MapPin, Euro, Clock, BadgeCheck } from "lucide-react"

export interface MatchScoreBreakdownProps {
  open: boolean
  onClose: () => void
  details: {
    skills: { matched: number; total: number }
    erfahrung: boolean
    standort: number // Prozent
    gehalt: boolean
    verfuegbarkeit: boolean
  }
}

export const MatchScoreBreakdown: React.FC<MatchScoreBreakdownProps> = ({ open, onClose, details }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <button className="absolute top-2 right-2 text-gray-400 hover:text-blue-500" onClick={onClose} aria-label="Schließen">×</button>
          <h2 className="text-lg font-semibold mb-4">Match-Score Details</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Skills:</span>
              <span>{details.skills.matched} / {details.skills.total}</span>
            </div>
            <div className="flex items-center gap-2">
              {details.erfahrung ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              <span className="font-medium">Erfahrung:</span>
              <span>{details.erfahrung ? "Erfüllt" : "Nicht erfüllt"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Standort:</span>
              <span>{details.standort}%</span>
            </div>
            <div className="flex items-center gap-2">
              {details.gehalt ? <Euro className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              <span className="font-medium">Gehalt:</span>
              <span>{details.gehalt ? "In Range" : "Nicht passend"}</span>
            </div>
            <div className="flex items-center gap-2">
              {details.verfuegbarkeit ? <Clock className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
              <span className="font-medium">Verfügbarkeit:</span>
              <span>{details.verfuegbarkeit ? "Passt" : "Nicht passend"}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
) 