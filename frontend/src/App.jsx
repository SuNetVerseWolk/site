import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Materials from './pages/Materials'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="materials" element={<Materials />} >

      </Route>
    </Routes>
  )
}

export default App
