"use client"

import React from "react"

interface StatusBadgeProps {
  status?: string
}

const statusStyles: Record<string, string> = {
  "in progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  "not started": "bg-gray-100 text-gray-800",
  active: "bg-yellow-100 text-yellow-800",
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status = "" }) => {
  const lower = status.toLowerCase()
  const classes = statusStyles[lower] || "bg-gray-100 text-gray-800"
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${classes}`}>
      {status || "Unknown"}
    </span>
  )
}

export default StatusBadge
