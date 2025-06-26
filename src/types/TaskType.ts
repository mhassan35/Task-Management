export interface Task {
  status: string
 id: number
  title: string
  description?: string
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

export interface TaskFormProps {
  onClose: () => void
  onSubmit: (task: Omit<Task, "id">) => Promise<any>
}

// Kanban View "(define type)""
export interface KanbanViewProps {
  filteredTasks: Task[]
}

// Model "(i mean create or edit define type)"
export interface TaskModalProps {
  mode: "create" | "edit"
  initialData?: Partial<Task>
  onSubmit: (data: Omit<Task, "id">) => Promise<void>
  onClose: () => void
}