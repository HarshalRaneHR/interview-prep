import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import SearchModal from './SearchModal'

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <Navbar />
      <Sidebar />
      <SearchModal />
      <main className="lg:ml-64 min-h-[calc(100vh-3.5rem)]">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
