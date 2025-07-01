"use client"

import React, { useState, useRef, useEffect } from "react"
import { HiDotsVertical } from "react-icons/hi"
import { Task } from "@/types/Type"

interface TaskActionsMenuProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const TaskActionsMenu: React.FC<TaskActionsMenuProps> = ({ task, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setOpen(!open)} className="p-2 cursor-pointer rounded-md hover:bg-gray-100 text-gray-800"
        aria-haspopup="true" aria-expanded={open}>
        <HiDotsVertical size={20} />
      </button>

      {open && (
        <div className="absolute right-0 w-32 bg-white rounded shadow-lg z-50">
          <button
            onClick={() => {
              onEdit(task)
              setOpen(false)
            }}
            className="block w-full cursor-pointer text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Edit Task
          </button>
          <button
            onClick={() => {
              onDelete(task)
              setOpen(false)
            }}
            className="block w-full cursor-pointer text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default TaskActionsMenu

