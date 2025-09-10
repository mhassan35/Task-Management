"use client"

import React from "react"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { KanbanViewProps } from "@/types/Type"
import StatusBadge from "@/Components/ui/statusBadge"
import PriorityBadge from "@/Components/ui/priorityBadge"
import TaskActionsMenu from "@/Components/ui/actionButton"
import useTaskManager from "@/hooks/UseTaskManager"

const priorities = ["Low", "Medium", "High", "Urgent"]

const KanbanView: React.FC<Omit<KanbanViewProps, "handleDeleteTask" | "handleEditTask"> & { onEditTask: (task: any) => void }> = ({
  filteredTasks,
  onEditTask,
}) => {
  const { handleDeleteTask } = useTaskManager()

  const handleDelete = async (task: any) => {
    if (!task?.id) return
    try {
      await handleDeleteTask(task.id)
    } catch (err) {
      console.error("Failed to delete task:", err)
    }
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-4">
      <h2 className="text-2xl font-medium text-gray-800 mb-2">Kanban View</h2>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-10 border rounded-md text-gray-500">
          No tasks found. Create your first task to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {priorities.map((priority) => {
            const priorityTasks = filteredTasks.filter(
              (task) => (task.priority || "").toLowerCase() === priority.toLowerCase()
            )

            return (
              <Droppable droppableId={priority} key={priority}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-white border border-gray-200 rounded-lg p-4 min-h-[400px] sm:min-h-[500px] transition ${
                      snapshot.isDraggingOver ? "bg-blue-50" : ""
                    }`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-700">{priority}</h3>
                      <span className="text-xs text-gray-500">{priorityTasks.length}</span>
                    </div>

                    <div className="space-y-3">
                      {priorityTasks.map((task, index) => (
                        <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-lg border border-gray-200 shadow-sm transition cursor-grab active:cursor-grabbing ${
                                snapshot.isDragging
                                  ? "shadow-lg ring-2 ring-blue-300 scale-[1.02] rotate-1"
                                  : "hover:shadow-md"
                              }`}>
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-900 line-clamp-2">
                                  {task.title}
                                </h4>
                                <TaskActionsMenu 
                                  task={task} 
                                  onEdit={() => onEditTask(task)}
                                  onDelete={() => handleDelete(task)} />
                              </div>

                              <div className="flex flex-col gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">Status:</span>
                                  <StatusBadge status={task.status} />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">Priority:</span>
                                  <PriorityBadge priority={task.priority} />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>

                    {provided.placeholder}

                    {priorityTasks.length === 0 && (
                      <div className="text-center text-sm text-gray-400 mt-6">
                        Drop tasks here
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default KanbanView
