import React from "react"
import TaskModal from "@/Components/ui/taskModel/TaskModel"
import type { TaskFormProps } from "@/types/TaskType"

const TaskForm: React.FC<TaskFormProps> = ({ onClose, onSubmit }) => {
  return (
    <TaskModal
      mode="create"
      onSubmit={onSubmit}
      onClose={onClose}
    />
  )
}

export default TaskForm
