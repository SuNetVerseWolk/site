import { Route, Routes, json } from 'react-router-dom'
import Materials from './pages/Materials'
import Login from './pages/Login'
import { useState } from 'react'

function App() {
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('info')));
  console.log(localStorage.getItem('info'))

  return (
    <Routes>
      <Route path='' element={userInfo ? <Materials userInfo={userInfo} setUserInfo={setUserInfo} /> : <Login setUserInfo={setUserInfo} />} >
        <Route path=':id' element={<></>} />
      </Route>
    </Routes>
  )
}

export default App
