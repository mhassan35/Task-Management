"use client"

import React, { useState } from "react"
import { HiDotsVertical } from "react-icons/hi"
import type { Task, ListViewProps } from "@/types/TaskType"
import TaskModal from "@/Components/TaskModel/TaskModel"
import StatusBadge from "@/Components/StatusAndPriority/StatusBadge"
import PriorityBadge from "@/Components/StatusAndPriority/PriorityBadge"

const ListView: React.FC<ListViewProps> = ({
  filteredTasks,
  selectedTaskIds,
  setSelectedTaskIds,
  handleDeleteTask,
  handleEditTask,
}) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const safeFilteredTasks = Array.isArray(filteredTasks) ? filteredTasks : []
  const safeSelectedTaskIds = Array.isArray(selectedTaskIds) ? selectedTaskIds : []

  const isAllSelected =
    safeFilteredTasks.length > 0 &&
    safeFilteredTasks.every((task) => task?.id && safeSelectedTaskIds.includes(task.id))

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allFilteredTaskIds = safeFilteredTasks.filter((task) => task?.id).map((task) => task.id)
    setSelectedTaskIds(
      e.target.checked
        ? allFilteredTaskIds
        : safeSelectedTaskIds.filter((id) => !allFilteredTaskIds.includes(id))
    )
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

  return (
    <section className="py-4">
      <div className="container mx-auto px-2 max-w-full">
        <h2 className="text-2xl font-bold mb-4">Task List</h2>

        {safeFilteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks found. Create your first task to get started!
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 w-[40%]">
                    <label className="flex items-center cursor-pointer select-none gap-3">
                      <input type="checkbox" className="w-4 h-4 cursor-pointer"
                        checked={isAllSelected} onChange={handleSelectAllChange}
                        aria-label="Select all tasks"/>
                      Title
                    </label>
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-gray-700 w-[30%]">Status</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-700 w-[30%]">Priority</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-700 w-[30%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeFilteredTasks.map((task, index) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap w-[40%]">
                      <label className="flex items-center cursor-pointer select-none gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                          checked={safeSelectedTaskIds.includes(task.id)}
                          onChange={() => handleItemChange(task)}
                          aria-label={`Select task ${task.title}`}
                        />
                        <span className="font-medium text-gray-900">{task.title || ""}</span>
                      </label>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap w-[20%]">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap w-[20%]">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap w-[20%] relative">
                      <button
                        onClick={() => setOpenDropdownIndex(openDropdownIndex === index ? null : index)}
                        aria-haspopup="true"
                        aria-expanded={openDropdownIndex === index}
                        aria-label="Actions menu"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                      >
                        <HiDotsVertical size={20} />
                      </button>

                      {openDropdownIndex === index && (
                        <div className="absolute right-4 top-12 w-32 bg-white rounded-md shadow-lg z-10">
                          <button
                            onClick={() => {
                              setEditingTask(task)
                              setOpenDropdownIndex(null)
                            }}
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

        {/* Edit Modal using reusable TaskModal */}
        {editingTask && (
          <TaskModal
            mode="edit"
            initialData={editingTask}
            onSubmit={async (formData) => {
              await handleEditTask(editingTask.id, formData)
              setEditingTask(null)
            }}
            onClose={() => setEditingTask(null)}
          />
        )}
      </div>
    </section>
  )
}

export default ListView
