"use client"
import React, { useEffect, useState, Suspense, useCallback, Component, ReactNode } from "react"
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAuth } from "@/hooks/useAuth"
import { motion } from "framer-motion"
import { RefreshCw, Maximize2 } from "lucide-react"

export interface WidgetConfig {
  id: string
  type: string
  x: number
  y: number
  w: number
  h: number
}

interface DashboardGridProps {
  widgets: WidgetConfig[]
  onLayoutChange?: (widgets: WidgetConfig[]) => void
  renderWidget: (widget: WidgetConfig) => React.ReactNode
  dashboardType: "applicant" | "recruiter"
}

// ErrorBoundary für Widgets
interface WidgetErrorBoundaryProps {
  children: ReactNode
}
interface WidgetErrorBoundaryState {
  hasError: boolean
}
class WidgetErrorBoundary extends Component<WidgetErrorBoundaryProps, WidgetErrorBoundaryState> {
  constructor(props: WidgetErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return <div className="p-4 text-red-500">Fehler beim Laden des Widgets.</div>
    return this.props.children
  }
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ widgets, onLayoutChange, renderWidget, dashboardType }) => {
  const [layout, setLayout] = useState<WidgetConfig[]>(widgets)
  const [loading, setLoading] = useState(false)
  const [fullscreen, setFullscreen] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const { user } = useAuth()

  // DnD Kit Setup
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  // Echtzeit-Updates via Supabase
  useEffect(() => {
    const channel = supabase.channel(`${dashboardType}_dashboard_${user?.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: `${dashboardType}_dashboards` }, payload => {
        if (payload.new?.layout) setLayout(payload.new.layout.blocks)
      })
      .subscribe()
    return () => { channel.unsubscribe() }
  }, [supabase, user, dashboardType])

  // Layout speichern (debounced)
  const saveLayout = useCallback(async (newLayout: WidgetConfig[]) => {
    setLoading(true)
    await supabase.from(`${dashboardType}_dashboards`).update({ layout: { blocks: newLayout } }).eq('user_id', user?.id)
    setLoading(false)
    onLayoutChange?.(newLayout)
  }, [supabase, user, dashboardType, onLayoutChange])

  // Drag End Handler
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = layout.findIndex(w => w.id === active.id)
      const newIndex = layout.findIndex(w => w.id === over.id)
      const newLayout = arrayMove(layout, oldIndex, newIndex)
      setLayout(newLayout)
      saveLayout(newLayout)
    }
  }

  // Responsive Grid Classes
  const getGridClass = (w: number, h: number) => {
    // 12 columns, min 1 col, max 12
    return `col-span-${Math.min(Math.max(w,1),12)} row-span-${Math.max(h,1)}`
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={layout.map(w => w.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-12 gap-4 auto-rows-[minmax(120px,auto)] p-2 md:p-6">
          {layout.map(widget => (
            <motion.div
              key={widget.id}
              layout
              className={`relative bg-white dark:bg-gray-900 rounded-lg shadow-md transition-all ${getGridClass(widget.w, widget.h)} ${fullscreen === widget.id ? "fixed inset-0 z-50 p-8 bg-white dark:bg-gray-900" : ""}`}
              tabIndex={0}
              aria-label={widget.type}
            >
              {/* Widget Controls */}
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                <button aria-label="Refresh" className="p-1 rounded hover:bg-blue-50" onClick={() => window.location.reload()}><RefreshCw className="w-4 h-4" /></button>
                <button aria-label="Vollbild" className="p-1 rounded hover:bg-blue-50" onClick={() => setFullscreen(fullscreen === widget.id ? null : widget.id)}><Maximize2 className="w-4 h-4" /></button>
              </div>
              {/* Widget Content */}
              <WidgetErrorBoundary>
                <Suspense fallback={<div className="w-full h-full flex items-center justify-center animate-pulse bg-gray-100 dark:bg-gray-800 rounded">Lädt...</div>}>
                  {renderWidget(widget)}
                </Suspense>
              </WidgetErrorBoundary>
            </motion.div>
          ))}
        </div>
      </SortableContext>
      {loading && <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>}
    </DndContext>
  )
} 