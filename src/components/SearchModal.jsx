import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { sections } from '../data/questions'

export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const debounceRef = useRef(null)

  const search = useCallback((q) => {
    if (!q.trim()) { setResults([]); return }
    const lower = q.toLowerCase()
    const grouped = []

    for (const section of sections) {
      const matches = []
      for (const file of section.files) {
        for (const question of file.questions) {
          if (question.title.toLowerCase().includes(lower)) {
            matches.push(question)
          }
        }
      }
      if (matches.length > 0) {
        grouped.push({ section, matches: matches.slice(0, 5) })
      }
    }
    setResults(grouped)
  }, [])

  useEffect(() => {
    if (searchOpen) {
      setQuery('')
      setResults([])
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [searchOpen])

  const handleInput = (e) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 300)
  }

  const handleSelect = (sectionId, questionId) => {
    setSearchOpen(false)
    navigate(`/section/${sectionId}?q=${questionId}`)
  }

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    if (searchOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [searchOpen, setSearchOpen])

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]" onClick={() => setSearchOpen(false)}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-700">
          <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={handleInput}
            placeholder="Search questions..."
            className="flex-1 py-3 bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none"
          />
          <kbd className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              No questions found for "{query}"
            </div>
          )}
          {results.map(({ section, matches }) => (
            <div key={section.id}>
              <div className="px-4 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50">
                {section.icon} {section.title}
              </div>
              {matches.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSelect(section.id, q.id)}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center gap-2"
                >
                  <span className="flex-1 truncate">{q.title}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${
                    q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' :
                    q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                  }`}>{q.difficulty}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
