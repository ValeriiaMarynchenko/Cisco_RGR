import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register  from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { dashboard, login, register } from './pages/routes';

function App() {
  
    const isAuthenticated = () => {
      return localStorage.getItem('token');
    };
    return (      
        <Router>
          <Routes>
            <Route 
              path="/" 
              element={<Navigate to={isAuthenticated() ? {dashboard} : {login}} />} 
            />
            <Route path={login} element={<Login />} />
            <Route path={register} element={<Register />} />
            <Route 
              path={dashboard} 
              element={
                isAuthenticated() ? <Dashboard /> : <Navigate to={login} />
              } 
            />
          </Routes>
        </Router>      
    );
}

export default App;
