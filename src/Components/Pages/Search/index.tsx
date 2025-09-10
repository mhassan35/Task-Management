"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { IoSearchSharp } from "react-icons/io5"
import { CiFilter } from "react-icons/ci"
import { useState, useEffect } from "react"

const SearchFilters = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [statusFilterOpen, setStatusFilterOpen] = useState(false)
  const [priorityFilterOpen, setPriorityFilterOpen] = useState(false)

  const searchQuery = searchParams.get("search") || ""
  const selectedStatus = searchParams.get("status") || ""
  const selectedPriority = searchParams.get("priority") || ""

  const [inputValue, setInputValue] = useState(searchQuery)

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (inputValue.trim()) {
        params.set("search", inputValue)
      } else {
        params.delete("search")
      }
      router.push(`?${params.toString()}`)
    }, 500)

    return () => clearTimeout(handler)
  }, [inputValue, router, searchParams])

  const handleStatusFilterClick = () => {
    setStatusFilterOpen((prev) => !prev)
    setPriorityFilterOpen(false)
  }

  const handlePriorityFilterClick = () => {
    setPriorityFilterOpen((prev) => !prev)
    setStatusFilterOpen(false)
  }

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    value ? params.set(key, value) : params.delete(key)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap"> 
      <div className="relative w-full sm:max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <IoSearchSharp size={20} className="text-gray-500" />
        </span>
        <input type="text" placeholder="Search Task..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300" />
      </div>

      <div className="relative">
        <button onClick={handleStatusFilterClick} className="inline-flex items-center px-4 py-2 text-sm sm:text-base text-gray-800 bg-gray-50 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-100 transition">
          <CiFilter size={20} className="mr-2" />
          Status Filter
        </button>

        {statusFilterOpen && (
          <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow z-10">
            {["", "Active", "In Progress", "Completed"].map((status) => (
              <div
                key={status}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  selectedStatus === status ? "font-semibold text-blue-600" : ""
                }`}
                onClick={() => {
                  updateSearchParam("status", status)
                  setStatusFilterOpen(false)
                }}>
                {status === "" ? "All Status" : status}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={handlePriorityFilterClick}
          className="inline-flex items-center px-4 py-2 text-sm sm:text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition">
          <CiFilter size={20} className="mr-2" />
          Priority Filter
        </button>

        {priorityFilterOpen && (
          <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow z-10">
            {["", "High", "Medium", "Low"].map((priority) => (
              <div
                key={priority}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  selectedPriority === priority ? "font-semibold text-blue-600" : ""
                }`}
                onClick={() => {
                  updateSearchParam("priority", priority)
                  setPriorityFilterOpen(false)
                }}>
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
