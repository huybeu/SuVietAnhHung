import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dang-nhap" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/ho-so" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
