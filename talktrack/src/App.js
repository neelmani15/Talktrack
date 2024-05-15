import './App.css';
import AuthPage from './component/AuthPage';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './component/Home';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/login/success" element={<Home />} />
        </Routes>
      </Router>
  );
}

export default App;
