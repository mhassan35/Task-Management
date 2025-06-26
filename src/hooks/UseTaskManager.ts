"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import type { Task } from "@/types/TaskType"

const API_BASE = "http://localhost:3000/fakedata"

// Global state to share across all hook instances
const globalState = {
  tasks: [] as Task[],
  selectedTaskIds: [] as number[],
  loading: true,
  error: null as string | null,
  listeners: new Set<() => void>(),
}

// Function to notify "all listeners of state changes"
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


  // Fetch tasks on first mount


  const fetchTasks = useCallback(async () => {
    try {
      globalState.loading = true
      globalState.error = null
      notifyListeners()

      const response = await fetch(API_BASE)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      globalState.tasks = Array.isArray(data) ? data : []
      globalState.loading = false
      notifyListeners()
    } catch (err) {
      globalState.error = err instanceof Error ? err.message : "Failed to fetch tasks"
      globalState.loading = false
      globalState.tasks = []
      console.error("Error fetching tasks:", err)
      notifyListeners()
    }
  }, [])

  useEffect(() => {
    if (globalState.tasks.length === 0 && !globalState.error && globalState.loading) {
      fetchTasks()
    }
  }, [fetchTasks])

  const handleAddTask = useCallback(async (task: Omit<Task, "id">) => {
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newTask = await response.json()
      globalState.tasks = [...(globalState.tasks || []), newTask]
      globalState.error = null
      notifyListeners()
      return newTask
    } catch (err) {
      globalState.error = err instanceof Error ? err.message : "Failed to add task"
      notifyListeners()
      throw err
    }
  }, [])

  const handleEditTask = useCallback(async (id: number, updatedTask: Partial<Task>) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updated = await response.json()
      globalState.tasks = (globalState.tasks || []).map((task) => (task.id === id ? updated : task))
      globalState.error = null
      notifyListeners()
      return updated
    } catch (err) {
      globalState.error = err instanceof Error ? err.message : "Failed to update task"
      notifyListeners()
      throw err
    }
  }, [])

  const handleDeleteTask = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      globalState.tasks = (globalState.tasks || []).filter((task) => task && task.id !== id)

      globalState.selectedTaskIds = (globalState.selectedTaskIds || []).filter((taskId) => taskId !== id)

      globalState.error = null
      notifyListeners()
    } catch (err) {
      globalState.error = err instanceof Error ? err.message : "Failed to delete task"
      notifyListeners()
      throw err
    }
  }, [])

  const handleDeleteSelectedTasks = useCallback(async () => {
    try {
      console.log("Starting delete operation for selected tasks:", globalState.selectedTaskIds)

      if (!globalState.selectedTaskIds || globalState.selectedTaskIds.length === 0) {
        console.log("No tasks selected for deletion")
        return
      }

      const idsToDelete = [...globalState.selectedTaskIds]
      console.log("IDs to delete:", idsToDelete)

      // Delete all selected task
      const deletePromises = idsToDelete.map(async (id) => {
        const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" })
        if (!response.ok) {
          throw new Error(`Failed to delete task ${id}`)
        }
        return id
      })

      await Promise.all(deletePromises)
      console.log("All delete requests completed successfully")


      globalState.tasks = (globalState.tasks || []).filter((task) => task && !idsToDelete.includes(task.id))
      globalState.selectedTaskIds = []
      globalState.error = null
      notifyListeners()

      console.log("State updated, remaining tasks:", globalState.tasks.length)
    } catch (err) {
      console.error("Error in handleDeleteSelectedTasks:", err)
      globalState.error = err instanceof Error ? err.message : "Failed to delete selected tasks"
      notifyListeners()
      throw err
    }
  }, [])

  const handleDragEnd = useCallback(
    async (taskId: number, newPriority: string) => {
      try {
        if (!globalState.tasks || !Array.isArray(globalState.tasks)) return

        // Phly ui/: "update the UI first"
        globalState.tasks = globalState.tasks.map((task) =>
          task && task.id === taskId ? { ...task, priority: newPriority } : task,
        )
        notifyListeners()

        const response = await fetch(`${API_BASE}/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priority: newPriority }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        globalState.error = null
        notifyListeners()
      } catch (err) {
        console.error("Error updating task priority:", err)
        globalState.error = "Failed to update task priority"
        // Again Refetch: "Refetch to ensure consistency"
        await fetchTasks()
      }
    },
    [fetchTasks],
  )

  const setSelectedTaskIds = useCallback((updater: React.SetStateAction<number[]>) => {
    if (typeof updater === "function") {
      globalState.selectedTaskIds = updater(globalState.selectedTaskIds || [])
    } else {
      globalState.selectedTaskIds = updater || []
    }
    console.log("Selected task IDs updated:", globalState.selectedTaskIds)
    notifyListeners()
  }, [])

  return {
    tasks: globalState.tasks || [],
    selectedTaskIds: globalState.selectedTaskIds || [],
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
