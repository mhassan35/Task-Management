export interface Task {
  id: number
  title: string
  status: string
  priority: string
}
export interface ListViewProps {
  filteredTasks: Task[]
  selectedTaskIds: number[]
  setSelectedTaskIds: React.Dispatch<React.SetStateAction<number[]>>
  handleDeleteTask: (id: number) => Promise<void>
  handleEditTask: (id: number, updatedTask: Partial<Task>) => Promise<Task>
  tasks: Task[]
}

// export interface TaskFormProps {
//   onClose: () => void
//   onSubmit: (task: Omit<Task, "id">) => Promise<any>
// }



export interface KanbanViewProps {
  filteredTasks: Task[]
}


export const getStatusClasses = (status = "") => {
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


export const getPriorityClasses = (priority = "") => {
  switch (priority.toLowerCase()) {
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "urgent":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}