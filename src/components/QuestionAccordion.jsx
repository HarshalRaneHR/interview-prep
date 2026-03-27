import useStore from '../store/useStore'
import MarkdownRenderer from './MarkdownRenderer'

const difficultyColors = {
  Easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

export default function QuestionAccordion({ question, index, isOpen, onToggle }) {
  const { completedQuestions, toggleComplete, bookmarks, toggleBookmark, language } = useStore()
  const isCompleted = completedQuestions.has(question.id)
  const isBookmarked = bookmarks.has(question.id)

  return (
    <div className={`border rounded-lg transition-colors ${isOpen ? 'border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50'}`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        {/* Expand icon */}
        <svg
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>

        {/* Question number */}
        <span className="text-xs font-mono text-slate-400 dark:text-slate-500 shrink-0">
          Q{index}
        </span>

        {/* Title */}
        <span className={`flex-1 text-sm font-medium ${isCompleted ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
          {question.title}
        </span>

        {/* Difficulty badge */}
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${difficultyColors[question.difficulty] || ''}`}>
          {question.difficulty}
        </span>

        {/* Bookmark */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleBookmark(question.id) }}
          className="p-1 shrink-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          aria-label="Toggle bookmark"
        >
          {isBookmarked ? (
            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          )}
        </button>

        {/* Done checkbox */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleComplete(question.id) }}
          className="p-1 shrink-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          aria-label="Toggle complete"
        >
          {isCompleted ? (
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="9.75" />
            </svg>
          )}
        </button>
      </button>

      {/* Accordion content */}
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <div className="accordion-inner">
          <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800">
            {(language === 'english' || language === 'both') && (
              <div className={language === 'both' ? 'mb-6' : ''}>
                {language === 'both' && (
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-3">English</h4>
                )}
                <MarkdownRenderer content={question.englishAnswer} />
              </div>
            )}
            {(language === 'hinglish' || language === 'both') && (
              <div>
                {language === 'both' && (
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-3">Hinglish</h4>
                )}
                <MarkdownRenderer content={question.hinglishAnswer} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
