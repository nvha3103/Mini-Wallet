import { useState } from 'react'
import './App.css'
import AccountInfo from './components/AccountInfo'
import Login from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import WalletHome from './components/WalletHome'
import { Route, Routes, useNavigate } from 'react-router'
import Transfer from './components/Transfer'
function App() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  return (
    <main className="app-shell">
      <Routes>
        <Route
          path="/"
          element={
            <Login
              onLogin={(account) => setAccount(account)}
              onSwitchToRegister={() => navigate('/register')}
            />
          }
        />
        <Route
          path="/register"
          element={
            <RegisterForm
              onRegisterSuccess={() => navigate('/')}
              onSwitchToLogin={() => navigate('/')}
            />
          }
        />
        <Route path="/wallet" element={<WalletHome account={account} onLogout={() => setAccount(null)} />} />
        <Route path="/account-info" element={<AccountInfo account={account} onLogout={() => setAccount(null)} />} />
        <Route path="/transfer" element={<Transfer />} />
      </Routes>
    </main>
  )
}

export default App
