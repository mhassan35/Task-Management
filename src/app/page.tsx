"use client"

import MainSection from "@/Components/layoutPage/MainSection"
import NavBar from "@/Components/navigation/NavBar"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header>
        <NavBar />
      </header>

      <section className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <MainSection />
        </div>
      </section>
    </main>
  )
}
