import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import useStore from '../store/useStore'
import { sections } from '../data/questions'
import QuestionAccordion from '../components/QuestionAccordion'

export default function Section() {
  const { sectionId } = useParams()
  const [searchParams] = useSearchParams()
  const highlightId = searchParams.get('q')
  const { completedQuestions, bookmarks } = useStore()

  const section = sections.find(s => s.id === sectionId)
  const [openId, setOpenId] = useState(null)
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [showBookmarked, setShowBookmarked] = useState(false)
  const [showIncomplete, setShowIncomplete] = useState(false)

  // Auto-open highlighted question from search
  useEffect(() => {
    if (highlightId) {
      setOpenId(highlightId)
      setTimeout(() => {
        document.getElementById(highlightId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [highlightId])

  if (!section) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Section not found</h1>
        <p className="text-slate-500 dark:text-slate-400">The section "{sectionId}" does not exist.</p>
      </div>
    )
  }

  // Stats
  let total = 0, completed = 0
  for (const f of section.files) {
    for (const q of f.questions) {
      total++
      if (completedQuestions.has(q.id)) completed++
    }
  }
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  // Filter questions
  const filterQuestion = (q) => {
    if (difficultyFilter !== 'All' && q.difficulty !== difficultyFilter) return false
    if (showBookmarked && !bookmarks.has(q.id)) return false
    if (showIncomplete && completedQuestions.has(q.id)) return false
    return true
  }

  let qIndex = 0

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {section.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{section.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {completed}/{total} completed ({pct}%)
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {['All', 'Easy', 'Medium', 'Hard'].map(d => (
          <button
            key={d}
            onClick={() => setDifficultyFilter(d)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              difficultyFilter === d
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            {d}
          </button>
        ))}
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
        <button
          onClick={() => setShowBookmarked(!showBookmarked)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
            showBookmarked
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-amber-300'
          }`}
        >
          ⭐ Bookmarked
        </button>
        <button
          onClick={() => setShowIncomplete(!showIncomplete)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
            showIncomplete
              ? 'bg-slate-700 text-white border-slate-700 dark:bg-slate-300 dark:text-slate-900 dark:border-slate-300'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
          }`}
        >
          Incomplete
        </button>
      </div>

      {/* Files / Sub-sections */}
      {section.files.map(file => {
        const filtered = file.questions.filter(filterQuestion)
        if (filtered.length === 0) return null

        return (
          <div key={file.id} className="mb-8">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              {file.title}
            </h2>
            <div className="flex flex-col gap-2">
              {filtered.map(q => {
                qIndex++
                return (
                  <div key={q.id} id={q.id}>
                    <QuestionAccordion
                      question={q}
                      index={qIndex}
                      isOpen={openId === q.id}
                      onToggle={() => setOpenId(openId === q.id ? null : q.id)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
