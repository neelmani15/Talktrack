import './App.css';
import AuthPage from './component/AuthPage';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './component/Home';
import UserDummyComponent from './component/Dummy';
import MeetingDetails from './component/MeetingDetails';
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/login/success" element={<UserDummyComponent />} />
          <Route path="/user" element={<Home />} />
          <Route path="/meetingdetails" element={<MeetingDetails/>} />
        </Routes>
      </Router>
  );
}

export default App;
