import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import Home from './pages/Home'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import RecruiterDashboard from './pages/RecruiterDashboard'
import Register from './pages/Register'
import Candidates from './pages/Candidates'
import Users from './pages/users'

function App() {
  return (
    <>
      <Routes>

        <Route path='/' element={<Home />}/>

        <Route path='/login' element={<Login/>} />

        <Route path='/register' element={<Register/>} />

        <Route 
          path='/account/candidates' 
          element={<Candidates/>}
        />

        <Route 
          path='/account/users' 
          element={<Users/>}
        />

        <Route 
          path='/account/dashboard'
          element={<RecruiterDashboard/>}
        />

      </Routes>
    </>
  )
}

export default App
