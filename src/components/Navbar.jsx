import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useStore from '../store/useStore'

const languages = [
  { value: 'english', label: 'EN' },
  { value: 'hinglish', label: 'HI' },
  { value: 'both', label: 'Both' },
]

export default function Navbar() {
  const { darkMode, toggleDarkMode, language, setLanguage, setSearchOpen, setSidebarOpen } = useStore()
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [setSearchOpen])

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center px-4 gap-3">
      {/* Hamburger - mobile only */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Open sidebar"
      >
        <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Title */}
      <Link to="/" className="font-semibold text-lg text-slate-800 dark:text-slate-100 tracking-tight mr-auto">
        Interview Prep
      </Link>

      {/* Search button */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">⌘K</kbd>
      </button>

      {/* Language toggle */}
      <div className="relative" ref={langRef}>
        <button
          onClick={() => setLangOpen(!langOpen)}
          className="px-2.5 py-1.5 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          {languages.find(l => l.value === language)?.label}
        </button>
        {langOpen && (
          <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-50">
            {languages.map(l => (
              <button
                key={l.value}
                onClick={() => { setLanguage(l.value); setLangOpen(false) }}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${language === l.value ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-600 dark:text-slate-300'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.752 15.002A9.718 9.718 0 0112.002 21c-5.385 0-9.75-4.365-9.75-9.75 0-4.27 2.748-7.893 6.57-9.192a.75.75 0 01.932.926 8.25 8.25 0 0011.264 11.264.75.75 0 01.926.932z" />
          </svg>
        )}
      </button>
    </header>
  )
}
