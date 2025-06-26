"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { IoSearchSharp } from "react-icons/io5"
import { CiFilter } from "react-icons/ci"
import { useState } from "react"

const SearchFilters = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [statusFilterOpen, setStatusFilterOpen] = useState(false)
  const [priorityFilterOpen, setPriorityFilterOpen] = useState(false)

  const searchQuery = searchParams.get("search") || ""
  const selectedStatus = searchParams.get("status") || ""
  const selectedPriority = searchParams.get("priority") || ""

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`?${params.toString()}`)
  }

  const handleStatusFilterClick = () => {
    setStatusFilterOpen((prev) => !prev)
    setPriorityFilterOpen(false)
  }

  const handlePriorityFilterClick = () => {
    setPriorityFilterOpen((prev) => !prev)
    setStatusFilterOpen(false)
  }

  return (
    <div className="px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <div className="relative w-full sm:w-[40%]">
        <span className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <IoSearchSharp size={22} className="w-4 h-4 text-gray-500" />
        </span>
        <input type="text" className="block w-full py-2 ps-8 text-md outline-none text-gray-900 border  border-gray-400 rounded-md" placeholder="Search Task..."
          value={searchQuery} onChange={(e) => updateSearchParam("search", e.target.value)} />
      </div>

      <div className="relative">
        <button type="button" onClick={handleStatusFilterClick} className="cursor-pointer inline-flex text-gray-800 border border-gray-300 rounded-md items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-md font-medium" >
          <CiFilter size={20} />
          Status Filter
        </button>

        {statusFilterOpen && (
          <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded shadow z-10">
            {["", "Active", "In Progress", "Completed"].map((status) => (
              <div
                key={status}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedStatus === status ? "font-bold" : ""}`}
                onClick={() => {
                  updateSearchParam("status", status)
                  setStatusFilterOpen(false)
                }}
              >
                {status === "" ? "All Status" : status}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button type="button" onClick={handlePriorityFilterClick} className="cursor-pointer inline-flex text-gray-800 border border-gray-300 rounded-md items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-md font-medium">
          <CiFilter size={20} />
          Priority Filter
        </button>

        {priorityFilterOpen && (
          <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded shadow z-10">
            {["", "High", "Medium", "Low"].map((priority) => (
              <div key={priority} className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  selectedPriority === priority ? "font-bold" : ""
                }`}
                onClick={() => {
                  updateSearchParam("priority", priority)
                  setPriorityFilterOpen(false)
                }}
              >
                {priority === "" ? "All Priority" : priority}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchFilters
