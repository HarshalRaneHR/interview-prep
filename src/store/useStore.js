import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // Theme
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),

      // Progress — Set of question IDs marked done
      completedQuestions: new Set(),
      toggleComplete: (questionId) => set(state => {
        const next = new Set(state.completedQuestions)
        next.has(questionId) ? next.delete(questionId) : next.add(questionId)
        return { completedQuestions: next }
      }),
      isCompleted: (questionId) => get().completedQuestions.has(questionId),

      // Bookmarks — Set of question IDs
      bookmarks: new Set(),
      toggleBookmark: (questionId) => set(state => {
        const next = new Set(state.bookmarks)
        next.has(questionId) ? next.delete(questionId) : next.add(questionId)
        return { bookmarks: next }
      }),
      isBookmarked: (questionId) => get().bookmarks.has(questionId),

      // Language preference
      language: 'both', // 'english' | 'hinglish' | 'both'
      setLanguage: (lang) => set({ language: lang }),

      // Search
      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),

      // Sidebar (mobile)
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'interview-prep-storage',
      // Sets don't serialize well, convert to/from arrays
      serialize: (state) => {
        const s = { ...state.state }
        s.completedQuestions = [...s.completedQuestions]
        s.bookmarks = [...s.bookmarks]
        return JSON.stringify({ ...state, state: s })
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str)
        parsed.state.completedQuestions = new Set(parsed.state.completedQuestions)
        parsed.state.bookmarks = new Set(parsed.state.bookmarks)
        return parsed
      },
    }
  )
)

export default useStore
