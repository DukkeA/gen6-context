import React from 'react'
import { Gen6ContextProvider, useGen6 } from 'gen6-context'

// Example component that uses the context
function WalletConnector() {
  const { 
    api, 
    apiState, 
    currentAccount, 
    keyring,
    setCurrentAccount,
    loadAccounts 
  } = useGen6()

  const handleConnect = async () => {
    try {
      await loadAccounts()
    } catch (error) {
      console.error('Failed to load accounts:', error)
    }
  }

  const handleDisconnect = () => {
    setCurrentAccount(null)
  }

  if (apiState === 'CONNECTING') {
    return <div>Connecting to blockchain...</div>
  }

  if (apiState === 'ERROR') {
    return <div>Failed to connect to blockchain</div>
  }

  return (
    <div>
      <h2>Wallet Connection</h2>
      
      {!currentAccount ? (
        <button onClick={handleConnect}>
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Connected: {currentAccount.meta.name}</p>
          <p>Address: {currentAccount.address}</p>
          <button onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>
      )}

      {keyring && (
        <div>
          <h3>Available Accounts</h3>
          {keyring.getAccounts().map((account: any) => (
            <div key={account.address}>
              <button 
                onClick={() => setCurrentAccount(account)}
                disabled={currentAccount?.address === account.address}
              >
                {account.meta.name} - {account.address.slice(0, 8)}...
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Main app component
function App() {
  return (
    <Gen6ContextProvider>
      <div>
        <h1>Gen6 Context Example</h1>
        <WalletConnector />
      </div>
    </Gen6ContextProvider>
  )
}

export default App