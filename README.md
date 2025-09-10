# Gen6 Context

A React Context Provider for Polkadot/Substrate blockchain applications with connection management and account handling.

## Features

- 🔗 **WebSocket Connection Management**: Automatic connection to Polkadot/Substrate nodes
- 👤 **Account Management**: Integration with browser extensions and keyring management
- 🔄 **State Management**: Centralized state using React Context and useReducer
- 💾 **Persistence**: Remembers user preferences and connection state
- 🔧 **TypeScript Support**: Full TypeScript definitions included

## Installation

```bash
npm install gen6-context
```

## Peer Dependencies

Make sure you have the following peer dependencies installed:

```bash
npm install react react-dom
```

## Usage

### Basic Setup

Wrap your application with the `Gen6ContextProvider`:

```tsx
import React from 'react'
import { Gen6ContextProvider } from 'gen6-context'
import App from './App'

function Root() {
  return (
    <Gen6ContextProvider>
      <App />
    </Gen6ContextProvider>
  )
}

export default Root
```

### Using the Hook

Access the blockchain state and functions using the `useGen6` hook:

```tsx
import React from 'react'
import { useGen6 } from 'gen6-context'

function WalletConnect() {
  const { 
    api, 
    apiState, 
    currentAccount, 
    keyring,
    setCurrentAccount,
    loadAccounts 
  } = useGen6()

  const handleConnect = async () => {
    await loadAccounts()
  }

  const handleAccountChange = (account) => {
    setCurrentAccount(account)
  }

  if (apiState === 'CONNECTING') {
    return <div>Connecting to blockchain...</div>
  }

  if (apiState === 'ERROR') {
    return <div>Failed to connect to blockchain</div>
  }

  return (
    <div>
      <button onClick={handleConnect}>
        Connect Wallet
      </button>
      {currentAccount && (
        <div>Connected: {currentAccount.meta.name}</div>
      )}
    </div>
  )
}
```

### Configuration

You can configure the WebSocket provider URL:

```tsx
<Gen6ContextProvider socket="wss://your-node.com">
  <App />
</Gen6ContextProvider>
```

Or use environment variables:

```bash
VITE_WSS_PROVIDER=wss://your-node.com
```

## API Reference

### useGen6 Hook

Returns an object with the following properties:

#### State Properties

- `api`: ApiPromise instance or null
- `apiState`: Connection state ('CONNECTING' | 'READY' | 'ERROR' | null)
- `apiError`: Connection error if any
- `keyring`: Keyring instance or null
- `keyringState`: Keyring loading state ('LOADING' | 'READY' | 'ERROR' | null)
- `currentAccount`: Currently selected account or null
- `currentIdentity`: User identity information
- `hasConnectedBefore`: Boolean indicating if user has connected before
- `socket`: WebSocket URL being used

#### Methods

- `setCurrentAccount(account)`: Set the current active account
- `loadAccounts()`: Load accounts from browser extensions

### Gen6ContextProvider Props

- `socket` (optional): Custom WebSocket URL for the Polkadot node
- `children`: React children components

## TypeScript Support

The package includes comprehensive TypeScript definitions:

```tsx
import type { 
  SubstrateState, 
  SubstrateAction, 
  SubstrateContextValue, 
  UseGen6Return 
} from 'gen6-context'
```

## Dependencies

- `@polkadot/api`: Core Polkadot API
- `@polkadot/extension-dapp`: Browser extension integration
- `@polkadot/ui-keyring`: Account and keyring management
- `@polkadot/util`: Polkadot utilities
- `@polkadot/types`: Polkadot type definitions

## License

MIT