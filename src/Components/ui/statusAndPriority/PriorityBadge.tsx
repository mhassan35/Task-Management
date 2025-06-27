"use client"

import React from "react"

interface PriorityBadgeProps {
  priority?: string
}

const priorityStyles: Record<string, string> = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  urgent: "bg-red-100 text-red-800 border-red-200",
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority = "" }) => {
  const lower = priority.toLowerCase()
  const classes = priorityStyles[lower] || "bg-gray-100 text-gray-800 border-gray-200"
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${classes}`}>
      {priority || "None"}
    </span>
  )
}

export default PriorityBadge
