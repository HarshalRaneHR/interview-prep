import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { sections } from '../data/questions'

const difficultyColors = {
  Easy: 'text-emerald-600 dark:text-emerald-400',
  Medium: 'text-amber-600 dark:text-amber-400',
  Hard: 'text-red-600 dark:text-red-400',
}

function getSectionData(section, completedQuestions) {
  let total = 0, completed = 0, easy = 0, medium = 0, hard = 0
  for (const file of section.files) {
    for (const q of file.questions) {
      total++
      if (completedQuestions.has(q.id)) completed++
      if (q.difficulty === 'Easy') easy++
      else if (q.difficulty === 'Medium') medium++
      else if (q.difficulty === 'Hard') hard++
    }
  }
  return { total, completed, easy, medium, hard, fileCount: section.files.length }
}

export default function Home() {
  const navigate = useNavigate()
  const { completedQuestions } = useStore()

  // Overall stats
  let totalAll = 0, completedAll = 0
  for (const s of sections) {
    for (const f of s.files) {
      for (const q of f.questions) {
        totalAll++
        if (completedQuestions.has(q.id)) completedAll++
      }
    }
  }
  const pctAll = totalAll > 0 ? Math.round((completedAll / totalAll) * 100) : 0

  return (
    <div>
      {/* Overall stats */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-5">
          Track your interview preparation progress across {sections.length} topics.
        </p>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">{totalAll}</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Total Questions</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">{completedAll}</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Completed</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">{pctAll}%</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Progress</div>
          </div>
        </div>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(section => {
          const data = getSectionData(section, completedQuestions)
          const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0

          return (
            <button
              key={section.id}
              onClick={() => navigate(`/section/${section.id}`)}
              className="group text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{section.title}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {data.total} questions &middot; {data.fileCount} {data.fileCount === 1 ? 'topic' : 'topics'}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{data.completed}/{data.total} done</span>
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Difficulty breakdown */}
              <div className="flex items-center gap-3 text-xs">
                <span className={difficultyColors.Easy}>{data.easy} Easy</span>
                <span className={difficultyColors.Medium}>{data.medium} Med</span>
                <span className={difficultyColors.Hard}>{data.hard} Hard</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
