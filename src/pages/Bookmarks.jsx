import { useState } from 'react'
import useStore from '../store/useStore'
import { sections } from '../data/questions'
import QuestionAccordion from '../components/QuestionAccordion'

export default function Bookmarks() {
  const { bookmarks } = useStore()
  const [openId, setOpenId] = useState(null)

  // Group bookmarked questions by section
  const grouped = []
  let globalIndex = 0

  for (const section of sections) {
    const questions = []
    for (const file of section.files) {
      for (const q of file.questions) {
        if (bookmarks.has(q.id)) {
          questions.push(q)
        }
      }
    }
    if (questions.length > 0) {
      grouped.push({ section, questions })
    }
  }

  if (grouped.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-5xl mb-4">⭐</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Bookmarks Yet</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Star questions while practicing to save them here for quick review.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Bookmarks</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {Array.from(bookmarks).length} bookmarked questions
      </p>

      {grouped.map(({ section, questions }) => (
        <div key={section.id} className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-md bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {section.icon}
            </span>
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {section.title}
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {questions.map(q => {
              globalIndex++
              return (
                <QuestionAccordion
                  key={q.id}
                  question={q}
                  index={globalIndex}
                  isOpen={openId === q.id}
                  onToggle={() => setOpenId(openId === q.id ? null : q.id)}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
