"use client"

import React, { useState } from "react"
import { Task, ListViewProps } from "@/types/Type"
import TaskModal from "@/Components/Ui/TaskModel/TaskModel"
import StatusBadge from "@/Components/Ui/StatusAndPriority/StatusBadge"
import PriorityBadge from "@/Components/Ui/StatusAndPriority/PriorityBadge"
import TaskActionsMenu from "@/Components/Ui/ActionsButton/ActionButton"
import useTaskManager from "@/hooks/UseTaskManager"


const ListView: React.FC<Omit<ListViewProps, "selectedTaskIds" | "setSelectedTaskIds" | "handleDeleteTask">> = ({
  filteredTasks,
  handleEditTask,
}) => {
  const { selectedTaskIds, setSelectedTaskIds, handleDeleteTask } = useTaskManager()
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const safeFilteredTasks = Array.isArray(filteredTasks) ? filteredTasks : []

  const isAllSelected =
    safeFilteredTasks.length > 0 &&
    safeFilteredTasks.every((task) => task?.id && selectedTaskIds.includes(task.id))

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allFilteredTaskIds = safeFilteredTasks.filter((task) => task?.id).map((task) => task.id)
    setSelectedTaskIds(
      e.target.checked
        ? allFilteredTaskIds
        : selectedTaskIds.filter((id) => !allFilteredTaskIds.includes(id))
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
    } catch (err) {
      console.error("Failed to delete task:", err)
    }
  }

  return (
    <section className="py-4 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-medium text-gray-800 mb-2">Task List</h2>

        {safeFilteredTasks.length === 0 ? (
          <div className="text-center text-gray-800 py-10">
            No tasks found. Create your first task to get started!
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg relative z-0">
            <table className="min-w-full text-md font-medium">
              <thead className="text-left text-gray-800 tracking-wider">
                <tr className="divide-y divide-gray-100 bg-gray-50 shadow">
                  <th className="px-4 py-1 w-1/2">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAllChange}
                        className="form-checkbox cursor-pointer h-4 w-4 text-blue-600"
                      />
                      <span>Title</span>
                    </label>
                  </th>
                  <th className="px-3 py-1 w-1/5">Status</th>
                  <th className="px-3 py-1 w-1/4">Priority</th>
                  <th className="px-3 py-1 w-1/2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {safeFilteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center ">
                      <input
                        type="checkbox"
                        checked={selectedTaskIds.includes(task.id)}
                        onChange={() => handleItemChange(task)}
                        className="form-checkbox cursor-pointer h-4 w-4 text-blue-600"
                      />

                      <span className="px-3 py-1 text-gray-900">{task.title || ""}</span>
                    </td>
                    <td className="px-[10px] py-1">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-3 py-1">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-3 py-1">
                      <TaskActionsMenu task={task} onEdit={(task) => setEditingTask(task)} onDelete={handleDelete}/>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingTask && (
          <TaskModal mode="edit" initialData={editingTask} onSubmit={async (formData) => {
            await handleEditTask(editingTask.id, formData)
            setEditingTask(null)}}
            onClose={() => setEditingTask(null)}/>
        )}
      </div>
    </section>
  )
}

export default ListView
