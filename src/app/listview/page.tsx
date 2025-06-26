"use client"

import type React from "react"
import { useState } from "react"
import { HiDotsVertical } from "react-icons/hi"
import type { Task, ListViewProps } from "@/types/task"

const getStatusClasses = (status = "") => {
  switch (status.toLowerCase()) {
    case "in progress":
      return "bg-blue-100 text-blue-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "not started":
      return "bg-gray-100 text-gray-800"
    case "active":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityClasses = (priority = "") => {
  switch (priority.toLowerCase()) {
    case "low":
      return "bg-green-100 text-green-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "high":
      return "bg-orange-100 text-orange-800"
    case "urgent":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const statusOptions = ["Not Started", "Active", "In Progress", "Completed"]
const priorityOptions = ["Low", "Medium", "High", "Urgent"]

const ListView: React.FC<ListViewProps> = ({
  filteredTasks,
  selectedTaskIds,
  setSelectedTaskIds,
  handleDeleteTask,
  handleEditTask,
}) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editForm, setEditForm] = useState({ title: "", status: "", priority: "" })

  const safeFilteredTasks = Array.isArray(filteredTasks) ? filteredTasks : []
  const safeSelectedTaskIds = Array.isArray(selectedTaskIds) ? selectedTaskIds : []

  const isAllSelected =
    safeFilteredTasks.length > 0 &&
    safeFilteredTasks.every((task) => task && task.id && safeSelectedTaskIds.includes(task.id))

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allFilteredTaskIds = safeFilteredTasks.filter((task) => task && task.id).map((task) => task.id)
      setSelectedTaskIds((prev) => [...new Set([...(prev || []), ...allFilteredTaskIds])])
    } else {
      const filteredTaskIds = safeFilteredTasks.filter((task) => task && task.id).map((task) => task.id)
      setSelectedTaskIds((prev) => (prev || []).filter((id) => !filteredTaskIds.includes(id)))
    }
  }

  const handleItemChange = (task: Task) => {
    if (!task || !task.id) return
    setSelectedTaskIds((prev) => {
      const safePrev = prev || []
      return safePrev.includes(task.id)
        ? safePrev.filter((id) => id !== task.id)
        : [...safePrev, task.id]
    })
  }

  const handleDelete = async (task: Task) => {
    if (!task || !task.id) return
    try {
      await handleDeleteTask(task.id)
      setOpenDropdownIndex(null)
    } catch (err) {
      console.error("Failed to delete task:", err)
    }
  }

  const startEdit = (task: Task) => {
    if (!task) return
    setEditingTask(task)
    setEditForm({
      title: task.title || "",
      status: task.status || "",
      priority: task.priority || "",
    })
    setOpenDropdownIndex(null)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTask || !editingTask.id || !editForm.title.trim()) return
    try {
      await handleEditTask(editingTask.id, editForm)
      setEditingTask(null)
      setEditForm({ title: "", status: "", priority: "" })
    } catch (err) {
      console.error("Failed to update task:", err)
    }
  }

  const cancelEdit = () => {
    setEditingTask(null)
    setEditForm({ title: "", status: "", priority: "" })
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-4">
      <h2 className="text-2xl font-bold mb-4">Task List</h2>

      {safeFilteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No tasks found. Create your first task to get started!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">
                  <input type="checkbox" className="mr-3 w-4 h-4 cursor-pointer" checked={isAllSelected}
                    onChange={handleSelectAllChange}
                  />
                  Title
                </th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Priority</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {safeFilteredTasks.map((task, filteredIndex) => {
                if (!task || !task.id) return null

                return (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 w-4 h-4 cursor-pointer"
                          checked={safeSelectedTaskIds.includes(task.id)}
                          onChange={() => handleItemChange(task)}
                        />
                        <span className="font-medium text-gray-900">{task.title || ""}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(task.status)}`}>
                        {task.status || ""}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityClasses(task.priority)}`}
                      >
                        {task.priority || ""}
                      </span>
                    </td>
                    <td className="p-4 relative">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setOpenDropdownIndex(openDropdownIndex === filteredIndex ? null : filteredIndex)} className="p-2 text-gray-600 hover:bg-gray-50 cursor-pointer rounded-md transition-colors">
                          <HiDotsVertical size={20} />
                        </button>
                      </div>

                      {openDropdownIndex === filteredIndex && (
                        <div className="absolute w-32 bg-white rounded-md shadow-lg border border-gray-300 z-10">
                          <button onClick={() => startEdit(task)} className="block w-full text-left px-2 py-2 text-shadow-cyan-900 hover:bg-red-50 rounded-md cursor-pointer" title="Edit Task">
                            Edit Task
                          </button>
                          <button onClick={() => handleDelete(task)}className="block w-full cursor-pointer text-left px-2 py-2 text-red-600 hover:bg-red-50 rounded-md">
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {editingTask && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Task</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Task Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Priority</label>
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, priority: e.target.value }))}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 text-gray-600 cursor-pointer border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-md bg-green-600 text-white  hover:bg-green-700 transition-colors duration-300 cursor-pointer">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default ListView
