"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { RiDeleteBin6Line, RiKanbanView2 } from "react-icons/ri"
import { FaListUl } from "react-icons/fa"
import TaskForm from "@/Components/Pages/Form/TaskForm"
import Link from "next/link"
import useTaskManager from "@/hooks/UseTaskManager"
import { toast } from "react-toastify"

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
  if (!selectedTaskIds || selectedTaskIds.length === 0) {
    toast.error("Please select at least one task to delete.")
    return
  }

  try {
    await handleDeleteSelectedTasks()
  } catch (error) {
    toast.error("Failed to delete selected tasks.")
  }
}


  return (
    <nav className="sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/" className="block">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Task</h1>
            <p className="text-sm text-gray-500">Manage all tasks.</p>
          </div>
        </Link>


        <div className="flex flex-wrap gap-3">
          <button onClick={handleDeleteClick} className="p-3 rounded-full bg-red-500 text-white transition-colors duration-300 cursor-pointer" 
            title={`Delete ${selectedTaskIds?.length || 0} selected task(s)`}>
            <RiDeleteBin6Line size={20} />
          </button>

          <button onClick={openForm} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition cursor-pointer duration-300">
            Create Task
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="flex flex-wrap gap-5">
          <div className="p-2 gap-3 rounded-lg flex bg-gray-100" >
          <button onClick={() => setActiveView("list")} className={`flex items-center font-medium cursor-pointer px-4 py-2 rounded-md transition ${
              activeView === "list"
                ? "bg-white"
                : ""
            }`}>
            <FaListUl className="mr-2" />
            List View
          </button>
          <button  onClick={() => setActiveView("kanban")} className={`flex font-medium items-center cursor-pointer px-4 py-2 rounded-md transition ${
              activeView === "kanban"
                ? "bg-white"
                : ""
            }`}>
            <RiKanbanView2 className="mr-2" />
            Kanban View
          </button>
          </div>
        </div>
      </div>
      {isFormOpen && <TaskForm onClose={closeForm} onSubmit={handleAddTask} />}
    </nav>
  )
}

export default NavBar
