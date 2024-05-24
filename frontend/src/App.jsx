import './App.css';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Dashboard from './components/Users Dashboard/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
   <>
    <BrowserRouter>
        <Routes>
          {/* <Route path='/' element={<Home/>}></Route> */}
          <Route path='/signup' element={<SignUp/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
        </Routes>
    </BrowserRouter>
   </>
  );
}

export default App;
