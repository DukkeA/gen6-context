import React from 'react'
import { Gen6ContextProvider, useGen6 } from 'gen6-context'

// Example with custom WebSocket configuration
function CustomWebSocketExample() {
  const { api, apiState, socket } = useGen6()

  return (
    <div>
      <h2>Custom WebSocket Connection</h2>
      <p>Connected to: {socket}</p>
      <p>Status: {apiState}</p>
      {api && (
        <div>
          <p>Chain: {api.runtimeChain?.toString()}</p>
          <p>Version: {api.runtimeVersion?.toString()}</p>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <Gen6ContextProvider socket="wss://custom-node.example.com">
      <div>
        <h1>Custom WebSocket Example</h1>
        <CustomWebSocketExample />
      </div>
    </Gen6ContextProvider>
  )
}

export default App