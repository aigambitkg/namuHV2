"use client"
import React, { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Menu, Bell, User, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface NavItem {
  label: string
  href: string
  roles: string[]
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", roles: ["applicant", "recruiter", "hiring_manager"] },
  { label: "Jobs", href: "/jobs", roles: ["applicant", "recruiter"] },
  { label: "Bewerbungen", href: "/applications", roles: ["applicant"] },
  { label: "Kandidaten", href: "/candidates", roles: ["recruiter", "hiring_manager"] },
  { label: "Community", href: "/community", roles: ["applicant", "recruiter", "hiring_manager"] },
]

export const Header: React.FC = () => {
  const { user, loading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  if (loading) {
    return (
      <header className="h-16 flex items-center px-4 bg-white dark:bg-gray-900 border-b">
        <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      </header>
    )
  }

  const role = user?.role || "applicant"
  const navItems = NAV_ITEMS.filter(item => item.roles.includes(role))

  return (
    <header className="h-16 flex items-center justify-between px-4 bg-white dark:bg-gray-900 border-b shadow-sm sticky top-0 z-30">
      {/* Logo & Name */}
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image src="/logo.svg" alt="namuH Logo" width={36} height={36} className="rounded" />
        </Link>
        <span className="font-bold text-xl text-blue-500 tracking-tight hidden sm:block">namuH</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6" aria-label="Hauptnavigation">
        {navItems.map(item => (
          <Link key={item.href} href={item.href} className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button aria-label="Benachrichtigungen" className="relative focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
          <Bell className="w-6 h-6 text-gray-500 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">3</span>
        </button>
        {/* User Dropdown */}
        <div className="relative">
          <button
            aria-label="Benutzermenü"
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            onClick={() => setDropdownOpen(v => !v)}
          >
            <User className="w-7 h-7 text-gray-600 dark:text-gray-200" />
            <span className="hidden md:block font-medium text-gray-700 dark:text-gray-200">{user?.email}</span>
          </button>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded shadow-lg z-50"
              tabIndex={-1}
              aria-label="Benutzermenü"
            >
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Profil</Link>
              <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Einstellungen</Link>
              <button onClick={signOut} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </motion.div>
          )}
        </div>
        {/* Mobile Hamburger */}
        <button className="md:hidden ml-2" aria-label="Menü öffnen" onClick={() => setMobileOpen(true)}>
          <Menu className="w-7 h-7 text-gray-700 dark:text-gray-200" />
        </button>
      </div>
    </header>
  )
} 