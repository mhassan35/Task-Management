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

const notifyListeners = () => {
  globalState.listeners.forEach((listener) => listener())
}

export default function useTaskManager() {
  const [update, setUpdate] = useState(0)
  const triggerUpdate = useCallback(() => setUpdate((u) => u + 1), [])

 useEffect(() => {
  globalState.listeners.add(triggerUpdate)
  return () => {
    globalState.listeners.delete(triggerUpdate) 
  }
}, [triggerUpdate])


  const fetchTasks = useCallback(async () => {
    globalState.loading = true
    globalState.error = null
    notifyListeners()

    try {
      const data = await apiRequest<Task[]>(API_BASE)
      globalState.tasks = Array.isArray(data) ? data : []
    } catch (err) {
      globalState.error = err instanceof Error ? err.message : "Failed to fetch tasks"
      globalState.tasks = []
    } finally {
      globalState.loading = false
      notifyListeners()
    }
  }, [])

  useEffect(() => {
    if (!globalState.tasks.length && !globalState.error && globalState.loading) {
      fetchTasks()
    }
  }, [fetchTasks])

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

  const handleEditTask = useCallback(async (id: number, updated: Partial<Task>) => {
    try {
      const updatedTask = await apiRequest<Task>(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      })
      globalState.tasks = globalState.tasks.map((t) => t.id === id ? updatedTask : t)
      globalState.error = null
      notifyListeners()
      return updatedTask
    } catch (err) {
      globalState.error = err instanceof Error ? err.message : "Failed to update task"
      notifyListeners()
      throw err
    }
  }, [])

  const handleDeleteTask = useCallback(async (id: number) => {
    try {
      await apiRequest(`${API_BASE}/${id}`, { method: "DELETE" })
      globalState.tasks = globalState.tasks.filter((t) => t.id !== id)
      globalState.selectedTaskIds = globalState.selectedTaskIds.filter((tid) => tid !== id)
      globalState.error = null
      notifyListeners()
    } catch (err) {
      globalState.error = err instanceof Error ? err.message : "Failed to delete task"
      notifyListeners()
      throw err
    }
  }, [])

  const handleDeleteSelectedTasks = useCallback(async () => {
    const ids = [...globalState.selectedTaskIds]
    try {
      await Promise.all(ids.map((id) => apiRequest(`${API_BASE}/${id}`, { method: "DELETE" })))
      globalState.tasks = globalState.tasks.filter((t) => !ids.includes(t.id))
      globalState.selectedTaskIds = []
      globalState.error = null
      notifyListeners()
    } catch (err) {
      globalState.error = err instanceof Error ? err.message : "Failed to delete selected tasks"
      notifyListeners()
      throw err
    }
  }, [])

  const handleDragEnd = useCallback(async (taskId: number, newPriority: string) => {
    globalState.tasks = globalState.tasks.map((t) =>
      t.id === taskId ? { ...t, priority: newPriority } : t,
    )
    notifyListeners()

    try {
      await apiRequest(`${API_BASE}/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      })
      globalState.error = null
      notifyListeners()
    } catch {
      globalState.error = "Failed to update task priority"
      notifyListeners()
      await fetchTasks()
    }
  }, [fetchTasks])

  const setSelectedTaskIds = useCallback((updater: React.SetStateAction<number[]>) => {
    globalState.selectedTaskIds =
      typeof updater === "function" ? updater(globalState.selectedTaskIds) : updater
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
