import { useState } from 'react'
import './App.css'
import AccountInfo from './components/AccountInfo'
import Login from './components/LoginForm'
import RegisterForm from './components/RegisterForm'

function App() {
  const [account, setAccount] = useState(null);
  const [authMode, setAuthMode] = useState('login');

  return (
    <main className="app-shell">
      {account ? (
        <AccountInfo
          account={account}
          onLogout={() => setAccount(null)}
        />
      ) : authMode === 'register' ? (
        <RegisterForm
          onRegisterSuccess={() => setAuthMode('login')}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      ) : (
        <Login
          onLogin={(account) => setAccount(account)}
          onSwitchToRegister={() => setAuthMode('register')}
        />
      )}
    </main>
  )
}

export default App
