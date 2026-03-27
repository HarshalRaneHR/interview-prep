import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-6xl font-bold text-slate-300 dark:text-slate-700 mb-4">404</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Page not found</p>
      <Link
        to="/"
        className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
      >
        Go home
      </Link>
    </div>
  )
}
