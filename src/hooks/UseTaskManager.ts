"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import type { Task } from "@/types/Type";
import { apiRequest } from "@/lib/api";

const API_BASE = "http://localhost:3000/fakedata";

const globalState = {
  tasks: [] as Task[],
  selectedTaskIds: [] as number[],
  loading: true,
  error: null as string | null,
  listeners: new Set<() => void>(),
};

const notifyListeners = () => {
  globalState.listeners.forEach((listener) => listener());
};

const useTaskManager = () => {
  const [, forceUpdate] = useState(0);
  const triggerUIUpdate = useCallback(() => forceUpdate((n) => n + 1), []);

  useEffect(() => {
    globalState.listeners.add(triggerUIUpdate);
    return () => {
      globalState.listeners.delete(triggerUIUpdate);
    };
  }, [triggerUIUpdate]);

  const fetchTasks = useCallback(async () => {
    globalState.loading = true;
    globalState.error = null;
    notifyListeners();

    try {
      const fetchedTasks = await apiRequest<Task[]>(API_BASE);
      globalState.tasks = Array.isArray(fetchedTasks) ? fetchedTasks : [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch tasks";
      globalState.error = errorMessage;
      globalState.tasks = [];
      toast.error(errorMessage);
    } finally {
      globalState.loading = false;
      notifyListeners();
    }
  }, []);

  useEffect(() => {
    if (!globalState.tasks.length && !globalState.error && globalState.loading) {
      fetchTasks();
    }
  }, [fetchTasks]);

  const executeApiAction = async <T>(
    action: () => Promise<T>,
    successMessage: string
  ): Promise<T> => {
    try {
      const result = await action();
      globalState.error = null;
      toast.success(successMessage);
      notifyListeners();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Operation failed";
      globalState.error = errorMessage;
      toast.error(errorMessage);
      notifyListeners();
      throw error;
    }
  };

  const handleAddTask = useCallback((newTask: Omit<Task, "id">) =>
    executeApiAction(async () => {
      const createdTask = await apiRequest<Task>(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      globalState.tasks.push(createdTask);
      return createdTask;
    }, "Task created successfully!")
  , []);

  const handleEditTask = useCallback((taskId: number, updatedFields: Partial<Task>) =>
    executeApiAction(async () => {
      const updatedTask = await apiRequest<Task>(`${API_BASE}/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      globalState.tasks = globalState.tasks.map((task) =>
        task.id === taskId ? updatedTask : task
      );
      return updatedTask;
    }, "Task updated successfully!")
  , []);

  const handleDeleteTask = useCallback((taskId: number) =>
    executeApiAction(async () => {
      await apiRequest(`${API_BASE}/${taskId}`, { method: "DELETE" });
      globalState.tasks = globalState.tasks.filter((task) => task.id !== taskId);
      globalState.selectedTaskIds = globalState.selectedTaskIds.filter((id) => id !== taskId);
    }, "Task deleted successfully!")
  , []);

  const handleDeleteSelectedTasks = useCallback(() =>
    executeApiAction(async () => {
      const idsToDelete = [...globalState.selectedTaskIds];
      await Promise.all(idsToDelete.map((id) =>
        apiRequest(`${API_BASE}/${id}`, { method: "DELETE" })
      ));
      globalState.tasks = globalState.tasks.filter((task) => !idsToDelete.includes(task.id));
      globalState.selectedTaskIds = [];
    }, "Selected tasks deleted successfully!")
  , []);

  const handleDragEnd = useCallback(async (taskId: number, newPriority: string) => {
    globalState.tasks = globalState.tasks.map((task) =>
      task.id === taskId ? { ...task, priority: newPriority } : task
    );
    notifyListeners();

    try {
      await apiRequest(`${API_BASE}/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      });
      globalState.error = null;
      toast.success("Task priority updated successfully!");
    } catch {
      globalState.error = "Failed to update task priority";
      toast.error(globalState.error);
      await fetchTasks();
    } finally {
      notifyListeners();
    }
  }, [fetchTasks]);

  const setSelectedTaskIds = useCallback((updater: React.SetStateAction<number[]>) => {
    globalState.selectedTaskIds = typeof updater === "function"
      ? updater(globalState.selectedTaskIds)
      : updater;
    notifyListeners();
  }, []);

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
  };
};

export default useTaskManager;
