import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useStore from './store/useStore'
import Layout from './components/Layout'
import Home from './pages/Home'
import Section from './pages/Section'
import Bookmarks from './pages/Bookmarks'
import NotFound from './pages/NotFound'

export default function App() {
  const darkMode = useStore(state => state.darkMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/section/:sectionId" element={<Section />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
