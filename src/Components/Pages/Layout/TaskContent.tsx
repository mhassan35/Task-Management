"use client"

import { useSearchParams } from "next/navigation"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import KanbanView from "@/Components/Pages/KanbanView"
import ListView from "@/Components/Pages/ListView"
import useTaskManager from "@/hooks/UseTaskManager"
import type { Task } from "@/types/Type"
import TaskModal from "@/Components/ui/taskModel"
import { useState } from "react"

const TaskContent = () => {
  const searchParams = useSearchParams()
  const { tasks, loading, error, handleDragEnd, handleEditTask } = useTaskManager()

  const activeView = searchParams.get("view") || "list"
  const searchQuery = searchParams.get("search") || ""
  const selectedStatus = searchParams.get("status") || ""
  const selectedPriority = searchParams.get("priority") || ""

  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const filteredTasks = tasks.filter((task) => {
    const title = task.title || ""
    const priority = task.priority || ""
    const status = task.status || ""
    const matchesSearch = !searchQuery || title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !selectedStatus || status === selectedStatus
    const matchesPriority = !selectedPriority || priority === selectedPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const destPriority = result.destination.droppableId
    const sourceTasks = filteredTasks.filter(
      (task) => (task.priority || "").toLowerCase() === result.source.droppableId.toLowerCase(),
    )
    const draggedTask = sourceTasks[result.source.index]

    if (!draggedTask || draggedTask.priority === destPriority) return

    await handleDragEnd(draggedTask.id, destPriority)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  const handleModalSubmit = async (formData: Partial<Task>) => {
    if (editingTask) {
      await handleEditTask(editingTask.id, formData)
      setEditingTask(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div className="ml-3 text-lg text-gray-600">Loading tasks...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <>
      {activeView === "kanban" ? (
        <DragDropContext onDragEnd={onDragEnd}>
          
          <KanbanView filteredTasks={filteredTasks} onEditTask={handleEdit} />
        </DragDropContext>
      ) : (
      <ListView filteredTasks={filteredTasks} handleEditTask={handleEditTask}  />

      )}

      {editingTask && (
        <TaskModal
          mode="edit"
          initialData={editingTask}
          onSubmit={handleModalSubmit}
          onClose={() => setEditingTask(null)}
        />
      )}
    </>
  )
}

export default TaskContent
