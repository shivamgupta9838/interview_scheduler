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
import InterviewDetails from "./pages/interview/components/InterviewDetails";
import ScheduleInterview from "./pages/interview/components/ScheduleInterview";
import CandidateDetails from "./pages/candidate/components/CandidateDetails.jsx";
import JobDetails from "./pages/job/components/JobDetails.jsx";
import ApplicationDetails from "./pages/application/components/ApplicationDetails.jsx";
import UserDetails from "./pages/user/components/UserDetails.jsx";

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

        <Route path="/account/interviews/:interviewId" element={<InterviewDetails />} />
        <Route path="/account/interviews/schedule/:applicationId" element={<ScheduleInterview />} />

        <Route path="/account/candidate/:candidateId" element={<CandidateDetails />} />

        <Route path="/account/users/:userId" element={<UserDetails />} />

        <Route path="/account/jobs/:jobId" element={<JobDetails />} />

        <Route path="/account/applications/:applicationId" element={<ApplicationDetails />} />

      </Routes>
    </>
  )
}

export default App
