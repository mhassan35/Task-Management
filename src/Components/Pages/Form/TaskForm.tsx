import React from "react"
import TaskModal from "@/Components/Ui/TaskModel/TaskModel"
import type { TaskFormProps } from "@/types/Type"

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
