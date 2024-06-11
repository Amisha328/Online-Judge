import './App.css';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Dashboard from './components/Users Dashboard/Dashboard';
import ForgotPassword from './components/Reset Password/ForgotPassword';
import ResetPassword from './components/Reset Password/ResetPassword';
import PracticeProblem from './components/Practice Problems/PracticeProblem';
import CreateProblem from './components/Practice Problems/CreateProblem';
import UpdateProblem from './components/Practice Problems/UpdateProblem';
import Home from './components/Home Page/Home';
import ProblemDetail from './components/Problems Page/ProbelmDetails';
import CompetitionPage from './components/Contest Page/CompetitionPage';
import ContestProblemsPage from './components/Contest Page/ContestProblemsPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HostContest from './components/Contest Page/HostContest';

function App() {
  return (
   <>
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/signup' element={<SignUp/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
          <Route path="/reset-password/:id/:token" element={<ResetPassword/>}></Route>
          <Route path="/problems" element={<PracticeProblem/>}></Route>
          <Route path="/problems/create" element={<CreateProblem />} />
          <Route path="/problems/edit/:id" element={<UpdateProblem />} />
          <Route path="/problems/:id" element={<ProblemDetail />} />
          <Route path="/compete" element={<CompetitionPage/>}/>
          <Route path="/competitions/:contestId/problems" element={<ContestProblemsPage/>} />
          <Route path="/competitions/:contestId/problems/:id" element={<ProblemDetail/>} />
          <Route path="/host-contest" element={<HostContest/>}/>
        </Routes>
    </BrowserRouter>
   </>
  );
}

export default App;
