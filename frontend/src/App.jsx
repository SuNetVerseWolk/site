import { Route, Routes } from 'react-router-dom'
import Materials from './pages/Materials'
import Login from './pages/Login'
import { useState } from 'react'

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('id'));
  console.log(localStorage.getItem('id'))

  return (
    <Routes>
      <Route path='' element={userId ? <Materials setUserId={setUserId} /> : <Login setUserId={setUserId} />} >
        <Route path=':title' element={<></>} />
      </Route>
    </Routes>
  )
}

export default App
