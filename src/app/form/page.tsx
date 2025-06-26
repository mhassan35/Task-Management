"use client"
import type React from "react"
import { useState } from "react"
import  { TaskFormProps } from "@/types/TaskType"



const TaskForm: React.FC<TaskFormProps> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({ title: "", status: "Not Started", priority: "Low" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const statusOptions = ["Not Started", "Active", "In Progress", "Completed"]
  const priorityOptions = ["Low", "Medium", "High", "Urgent"]

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError("Task title is required")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(form)
      setForm({ title: "", status: "Not Started", priority: "Low" })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Create New Task</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Task Title</label>
            <input type="text" value={form.title} onChange={handleChange("title")}
              placeholder="Enter task title..." className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required disabled={isSubmitting} />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Status</label>
            <select value={form.status} onChange={handleChange("status")}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isSubmitting}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Priority</label>
            <select value={form.priority} onChange={handleChange("priority")}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isSubmitting}>
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
