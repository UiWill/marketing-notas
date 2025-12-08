import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage'
import { Dashboard } from '@/pages/Dashboard'
import { Checkout } from '@/pages/Checkout'
import { ThankYou } from '@/pages/ThankYou'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/obrigado" element={<ThankYou />} />
      </Routes>
    </Router>
  )
}

export default App