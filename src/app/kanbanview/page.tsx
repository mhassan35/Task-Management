"use client"

import type React from "react"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { KanbanViewProps, getStatusClasses, getPriorityClasses } from "@/types/TaskType"

const priorities = ["Low", "Medium", "High", "Urgent"]

const KanbanView: React.FC<KanbanViewProps> = ({ filteredTasks }) => (
  <section className="p-4">
    <h2 className="text-2xl font-bold mb-6">Kanban View</h2>

    {filteredTasks.length === 0 ? (
      <div className="text-center py-8 border">No tasks found. Create your first task to get started!</div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {priorities.map((priority) => {
          const priorityTasks = filteredTasks.filter(
            (task) => (task.priority || "").toLowerCase() === priority.toLowerCase(),
          )

          return (
            <Droppable droppableId={priority} key={priority}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-white border border-gray-300 p-4 rounded-lg min-h-[500px] transition-colors ${
                    snapshot.isDraggingOver ? "bg-blue-100 " : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{priority}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClasses(priority)}`}>
                      {priorityTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {priorityTasks.map((task, index) => (
                      <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-4 rounded-lg shadow-sm border border-gray-300 transition-all cursor-grab active:cursor-grabbing ${
                              snapshot.isDragging
                                ? "shadow-lg ring-2 ring-blue-200 rotate-2 scale-105"
                                : "hover:shadow-md"
                            }`}
                          >
                            <h4 className="font-semibold text-gray-900 mb-3 line-clamp-2">{task.title}</h4>

                            <div className="flex flex-col gap-2">
                              <div className="flex items-center">
                                <span className="text-xs mr-2">Status:</span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(task.status)}`}
                                >
                                  {task.status}
                                </span>
                              </div>

                              <div className="flex items-center">
                                <span className="text-xs  mr-2">Priority:</span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClasses(task.priority)}`}
                                >
                                  {task.priority}
                                </span>
                              </div>
                            </div>

                           
                            <div className="mt-3 flex justify-center">
                              <div className="w-8 h-1 rounded-full"></div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>

                  {provided.placeholder}

                  {priorityTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">Drop tasks here</div>
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

export default KanbanView
