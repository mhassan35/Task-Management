"use client"

import { useEffect, useState, useCallback } from "react"
import type { Task } from "@/types/TaskType"
import { apiRequest } from "@/lib/api"

const API_BASE = "http://localhost:3000/fakedata"

const globalState = {
  tasks: [] as Task[],
  selectedTaskIds: [] as number[],
  loading: true,
  error: null as string | null,
  listeners: new Set<() => void>(),
}

// Notify all subscribers of state change
const notifyListeners = () => {
  globalState.listeners.forEach((listener) => listener())
}

export default function useTaskManager() {
  const [updateTrigger, setUpdateTrigger] = useState(0)

  const triggerUpdate = useCallback(() => {
    setUpdateTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    globalState.listeners.add(triggerUpdate)
    return () => {
      globalState.listeners.delete(triggerUpdate)
    }
  }, [triggerUpdate])

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      globalState.loading = true
      globalState.error = null
      notifyListeners()

      const data = await apiRequest<Task[]>(API_BASE)
      globalState.tasks = Array.isArray(data) ? data : []
    } catch (err) {
      globalState.error =
        err instanceof Error ? err.message : "Failed to fetch tasks"
      globalState.tasks = []
    } finally {
      globalState.loading = false
      notifyListeners()
    }
  }, [])

  useEffect(() => {
    if (globalState.tasks.length === 0 && !globalState.error && globalState.loading) {
      fetchTasks()
    }
  }, [fetchTasks])

  // Add new task
  const handleAddTask = useCallback(async (task: Omit<Task, "id">) => {
    try {
      const newTask = await apiRequest<Task>(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      })
      globalState.tasks.push(newTask)
      globalState.error = null
      notifyListeners()
      return newTask
    } catch (err) {
      globalState.error = err instanceof Error ? err.message : "Failed to add task"
      notifyListeners()
      throw err
    }
  }, [])

  // Edit task
  const handleEditTask = useCallback(async (id: number, updatedTask: Partial<Task>) => {
    try {
      const updated = await apiRequest<Task>(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      })
      globalState.tasks = globalState.tasks.map((task) =>
        task.id === id ? updated : task,
      )
      globalState.error = null
      notifyListeners()
      return updated
    } catch (err) {
      globalState.error = err instanceof Error ? err.message : "Failed to update task"
      notifyListeners()
      throw err
    }
  }, [])

  // Delete task by ID
  const handleDeleteTask = useCallback(async (id: number) => {
    try {
      await apiRequest(`${API_BASE}/${id}`, { method: "DELETE" })
      globalState.tasks = globalState.tasks.filter((task) => task.id !== id)
      globalState.selectedTaskIds = globalState.selectedTaskIds.filter((taskId) => taskId !== id)
      globalState.error = null
      notifyListeners()
    } catch (err) {
      globalState.error = err instanceof Error ? err.message : "Failed to delete task"
      notifyListeners()
      throw err
    }
  }, [])

  // Delete all selected tasks
  const handleDeleteSelectedTasks = useCallback(async () => {
    try {
      const ids = [...globalState.selectedTaskIds]
      await Promise.all(
        ids.map((id) =>
          apiRequest(`${API_BASE}/${id}`, { method: "DELETE" }),
        ),
      )
      globalState.tasks = globalState.tasks.filter((task) => !ids.includes(task.id))
      globalState.selectedTaskIds = []
      globalState.error = null
      notifyListeners()
    } catch (err) {
      globalState.error = err instanceof Error ? err.message : "Failed to delete selected tasks"
      notifyListeners()
      throw err
    }
  }, [])

  // Drag and drop update
  const handleDragEnd = useCallback(
    async (taskId: number, newPriority: string) => {
      try {
        // Optimistic update
        globalState.tasks = globalState.tasks.map((task) =>
          task.id === taskId ? { ...task, priority: newPriority } : task,
        )
        notifyListeners()

        await apiRequest(`${API_BASE}/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priority: newPriority }),
        })

        globalState.error = null
        notifyListeners()
      } catch (err) {
        globalState.error = "Failed to update task priority"
        notifyListeners()
        await fetchTasks()
      }
    },
    [fetchTasks],
  )

  // Select task IDs
  const setSelectedTaskIds = useCallback((updater: React.SetStateAction<number[]>) => {
    globalState.selectedTaskIds =
      typeof updater === "function"
        ? updater(globalState.selectedTaskIds)
        : updater
    notifyListeners()
  }, [])

  return {
    tasks: globalState.tasks,
    selectedTaskIds: globalState.selectedTaskIds,
    loading: globalState.loading,
    error: globalState.error,
    setSelectedTaskIds,
    handleAddTask,
    handleEditTask,
    handleDeleteTask,
    handleDeleteSelectedTasks,
    handleDragEnd,
    refetch: fetchTasks,
  }
}
