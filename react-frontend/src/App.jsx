import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import Home from './pages/Home'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import UserDashboard from './pages/userdashboard/UserDashboard'
import Register from './pages/Register'
import Candidates from './pages/candidate/Candidates'
import Applications from './pages/application/applications'
import Users from './pages/user/users'
import Jobs from './pages/job/jobs'
import Interviews from './pages/interview/interviews'

function App() {
  return (
    <>
      <Routes>

        <Route path='/' element={<Home />}/>

        <Route path='/login' element={<Login/>} />

        <Route path='/register' element={<Register/>} />

        <Route path='/account/candidates' element={<Candidates/>} />

        <Route path='/account/users' element={<Users/>} />

        <Route path='/account/jobs' element={<Jobs/>} />

        <Route path='/account/applications' element={<Applications/>} />

        <Route path='/account/dashboard' element={<UserDashboard/>} />

        <Route path='/account/interviews' element={<Interviews/>} />

      </Routes>
    </>
  )
}

export default App
