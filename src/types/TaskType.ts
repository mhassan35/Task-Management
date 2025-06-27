export interface Task {
  id: number
  title: string
  status: string
  priority: string
}

export interface KanbanViewProps {
  filteredTasks: Task[]
  handleEditTask: (task: Task) => void
  handleDeleteTask: (id: number) => Promise<void>
}

export interface ListViewProps {
  tasks: Task[]
  filteredTasks: Task[]
  selectedTaskIds: number[]
  setSelectedTaskIds: React.Dispatch<React.SetStateAction<number[]>>
  handleDeleteTask: (id: number) => Promise<void>
  handleEditTask: (id: number, updatedTask: Partial<Task>) => Promise<Task>
}

export interface TaskFormProps {
  onClose: () => void
  onSubmit: (task: Omit<Task, "id">) => Promise<any>
}


export interface TaskModalProps {
  mode: "create" | "edit"
  initialData?: Partial<Task>
  onSubmit: (data: Omit<Task, "id">) => Promise<void>
  onClose: () => void
}




