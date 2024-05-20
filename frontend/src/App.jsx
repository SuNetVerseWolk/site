import { Route, Routes } from 'react-router-dom'
import Materials from './pages/Materials'
import Login from './pages/Login'
import { useState, useMemo } from 'react'
import Singup from './pages/Singup';
import Admin from './pages/Admin';

function App() {
  const [userInfo, setUserInfo] = useState(localStorage.getItem('info') && JSON.parse(localStorage.getItem('info')));
	const main = useMemo(e =>
		userInfo?.id === import.meta.env.VITE_ADMIN_ID ? (
			<Admin />
		) : userInfo ? (
			<Materials userInfo={userInfo} setUserInfo={setUserInfo} />
		) : (
			<Login setUserInfo={setUserInfo} />
		), [userInfo]);

  return (
    <Routes>
			<Route path='' element={main} >
				<Route path=':id' element={<></>} >
					<Route path=':teacherID' element={<></>} />
				</Route>
			</Route>
			<Route path='/singUp' element={<Singup  setUserInfo={setUserInfo} />}></Route>
    </Routes>
  )
}

export default App
