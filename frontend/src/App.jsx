import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Materials from './pages/Materials'
import Login from './pages/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="materials" element={<Materials />} >
        <Route path=':title' element={<></>} />
      </Route>
      <Route path='' element={<Login />} />
    </Routes>
  )
}

export default App
