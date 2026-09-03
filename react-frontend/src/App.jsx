import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import Home from './pages/Home'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import RecruiterDashboard from './pages/RecruiterDashboard'
import Register from './pages/Register'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Home />}/>

          <Route path='/login' element={<Login/>} />

          <Route path='/register' element={<Register/>} />

          <Route 
            path='/recruiter/dashboard'
            element={<RecruiterDashboard/>}
          />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
