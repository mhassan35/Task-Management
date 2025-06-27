export interface Task {
  id: number
  title: string
  status: string
  priority: string
  tasks: string
}

export interface KanbanViewProps {
  filteredTasks: Task[]
  handleEditTask: (task: Task) => void
  handleDeleteTask: (id: number) => Promise<void>
}

export interface ListViewProps {
  filteredTasks: Task[]
  selectedTaskIds: number[]
  setSelectedTaskIds: React.Dispatch<React.SetStateAction<number[]>>
  handleDeleteTask: (id: number) => Promise<void> | void
  handleEditTask: (id: number, data: Partial<Task>) => void | Promise<Task>
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




