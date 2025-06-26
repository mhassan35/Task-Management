"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { RiDeleteBin6Line, RiKanbanView2 } from "react-icons/ri"
import { FaListUl } from "react-icons/fa"
import TaskForm from "@/app/form/page"
import Link from "next/link"
import useTaskManager from "@/hooks/UseTaskManager"

const NavBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { handleDeleteSelectedTasks, handleAddTask, selectedTaskIds } = useTaskManager()

  const isFormOpen = searchParams.get("form") === "open"
  const activeView = searchParams.get("view") || "list"

  const openForm = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("form", "open")
    router.push(`?${params.toString()}`)
  }

  const closeForm = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("form")
    router.push(`?${params.toString()}`)
  }

  const setActiveView = (view: "list" | "kanban") => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("view", view)
    router.push(`?${params.toString()}`)
  }

  const handleDeleteClick = async () => {
    console.log("Delete button clicked, selected task IDs:", selectedTaskIds)

    if (!selectedTaskIds || selectedTaskIds.length === 0) {
      console.log("No tasks selected for deletion")
      return
    }

    try {
      await handleDeleteSelectedTasks()
      console.log("Delete operation completed successfully")
    } catch (error) {
      console.error("Delete operation failed:", error)
    }
  }

  return (
    <nav className="bg-white relative">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <Link href="/" className="cursor-default">
          <h1 className="text-3xl font-bold text-gray-800">Task</h1>
          <p className="text-sm text-gray-500">Manage all tasks.</p>
        </Link>

        <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-4">
          <button
            onClick={handleDeleteClick}
            className={`p-3 rounded-full text-white transition-colors duration-300 ${
              selectedTaskIds && selectedTaskIds.length > 0
                ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            title={`Delete ${selectedTaskIds?.length || 0} selected task(s)`}
            disabled={!selectedTaskIds || selectedTaskIds.length === 0}
          >
            <RiDeleteBin6Line size={20} />
          </button>
          <button
            onClick={openForm}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300 cursor-pointer"
          >
            Create Task
          </button>
        </div>
      </div>

      <div className="ml-4 px-2 py-2 flex gap-4">
        <button
          onClick={() => setActiveView("list")}
          className={`flex items-center p-2 rounded-md transition-all duration-300 ${
            activeView === "list" ? "bg-gray-100" : "text-gray-700"
          }`}
        >
          <FaListUl className="mr-2" />
          <span className="font-medium cursor-pointer text-lg">List view</span>
        </button>

        <button onClick={() => setActiveView("kanban")}
          className={`flex items-center p-2 rounded-md transition-all duration-300 ${
            activeView === "kanban" ? "bg-gray-100" : "text-gray-700"
          }`}
        >
          <RiKanbanView2 size={20} className="mr-2" />
          <span className="font-medium cursor-pointer text-lg">Kanban View</span>
        </button>
      </div>

      {isFormOpen && <TaskForm onClose={closeForm} onSubmit={handleAddTask} />}
    </nav>
  )
}

export default NavBar
