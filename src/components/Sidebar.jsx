import { NavLink } from 'react-router-dom'
import useStore from '../store/useStore'
import { sections } from '../data/questions'

function getSectionStats(section, completedQuestions) {
  let total = 0
  let completed = 0
  for (const file of section.files) {
    for (const q of file.questions) {
      total++
      if (completedQuestions.has(q.id)) completed++
    }
  }
  return { total, completed }
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, completedQuestions } = useStore()

  const navContent = (
    <nav className="flex flex-col gap-1 p-3">
      <NavLink
        to="/bookmarks"
        onClick={() => setSidebarOpen(false)}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`
        }
      >
        <span className="text-base">⭐</span>
        <span>Bookmarks</span>
      </NavLink>

      <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />

      {sections.map(section => {
        const { total, completed } = getSectionStats(section, completedQuestions)
        const pct = total > 0 ? (completed / total) * 100 : 0

        return (
          <NavLink
            key={section.id}
            to={`/section/${section.id}`}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <span className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
              {section.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="truncate">{section.title}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-2 shrink-0">{completed}/{total}</span>
              </div>
              {/* Progress bar */}
              <div className="mt-1 h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </NavLink>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-14 left-0 bottom-0 w-64 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-y-auto">
        {navContent}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute top-0 left-0 bottom-0 w-64 bg-white dark:bg-slate-900 shadow-xl overflow-y-auto animate-slide-in">
            <div className="h-14 flex items-center px-4 border-b border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-800 dark:text-slate-100">Menu</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-auto p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {navContent}
          </aside>
        </div>
      )}
    </>
  )
}
