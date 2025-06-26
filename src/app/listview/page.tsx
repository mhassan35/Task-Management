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
    safeFilteredTasks.every((task) => task?.id && safeSelectedTaskIds.includes(task.id))

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allFilteredTaskIds = safeFilteredTasks.filter((task) => task?.id).map((task) => task.id)
    setSelectedTaskIds(e.target.checked ? allFilteredTaskIds : safeSelectedTaskIds.filter(id => !allFilteredTaskIds.includes(id)))
  }

  const handleItemChange = (task: Task) => {
    if (!task?.id) return
    setSelectedTaskIds((prev) =>
      prev.includes(task.id) ? prev.filter((id) => id !== task.id) : [...prev, task.id]
    )
  }

  const handleDelete = async (task: Task) => {
    if (!task?.id) return
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
    if (!editingTask?.id || !editForm.title.trim()) return
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
    <section className="py-4">
      <div className="container mx-auto px-2">
        <h2 className="text-2xl font-bold mb-4">Task List</h2>

        {safeFilteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks found. Create your first task to get started!
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-medium text-gray-700">
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 cursor-pointer"
                      checked={isAllSelected}
                      onChange={handleSelectAllChange}
                    />
                    Title
                  </th>
                  <th className="p-4 text-left font-medium text-gray-700">Status</th>
                  <th className="p-4 text-left font-medium text-gray-700">Priority</th>
                  <th className="p-4 text-left font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {safeFilteredTasks.map((task, index) => (
                  <tr key={task.id}>
                    <td className="p-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2 w-4 h-4 cursor-pointer"
                          checked={safeSelectedTaskIds.includes(task.id)}
                          onChange={() => handleItemChange(task)}
                        />
                        <span className="font-medium text-gray-900">{task.title || ""}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusClasses(task.status)}`}>
                        {task.status || ""}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityClasses(task.priority)}`}>
                        {task.priority || ""}
                      </span>
                    </td>
                    <td className="p-4 relative">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setOpenDropdownIndex(openDropdownIndex === index ? null : index)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                        >
                          <HiDotsVertical size={20} />
                        </button>
                      </div>

                      {openDropdownIndex === index && (
                        <div className="absolute right-4 top-12 w-32 bg-white rounded-md shadow-lg z-10">
                          <button
                            onClick={() => startEdit(task)}
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                          >
                            Edit Task
                          </button>
                          <button
                            onClick={() => handleDelete(task)}
                            className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {editingTask && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md sm:max-w-lg">
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
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ListView
