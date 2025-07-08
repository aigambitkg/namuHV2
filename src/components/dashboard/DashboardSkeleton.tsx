import React from "react"

export const DashboardSkeleton: React.FC = () => (
  <div className="grid grid-cols-12 gap-4 auto-rows-[minmax(120px,auto)] p-2 md:p-6 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="col-span-12 md:col-span-6 h-32 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-inner"
      />
    ))}
  </div>
) 