import { Route, Routes } from 'react-router-dom'
import Materials from './pages/Materials'
import Login from './pages/Login'
import { useState } from 'react'
import Singup from './pages/Singup';

function App() {
  const [userInfo, setUserInfo] = useState(localStorage.getItem('info') && JSON.parse(localStorage.getItem('info')));

  return (
    <Routes>
      <Route path='' element={userInfo ? <Materials userInfo={userInfo} setUserInfo={setUserInfo} /> : <Login setUserInfo={setUserInfo} />} >
        <Route path=':id' element={<></>} >
          <Route path=':teacherID' element={<></>} />
        </Route>
      </Route>
      <Route path='/singUp' element={<Singup />}></Route>
    </Routes>
  )
}

export default App
