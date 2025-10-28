import React, { useContext, useEffect, useReducer, useRef } from 'react'
import jsonrpc from '@polkadot/types/interfaces/jsonrpc'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import keyring from '@polkadot/ui-keyring'
import { isTestChain } from '@polkadot/util'
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import type {
  SubstrateAction,
  SubstrateContextValue,
  SubstrateState,
  UseGen6Return
} from './types/substrate'

// Default Gen6 WSS endpoint
const wsProvider = `wss://gen6.app/node`

const initialState: SubstrateState = {
  socket: wsProvider,
  jsonrpc: { ...jsonrpc },
  keyring: null,
  keyringState: null,
  api: null,
  apiError: null,
  apiState: null,
  currentAccount: null,
  currentIdentity: { name: null, email: null },
  hasConnectedBefore: localStorage.getItem('hasConnectedBefore') === 'true'
}

const reducer = (
  state: SubstrateState,
  action: SubstrateAction
): SubstrateState => {
  switch (action.type) {
    case 'CONNECT_INIT':
      return { ...state, apiState: 'CONNECT_INIT' }
    case 'CONNECT':
      return { ...state, api: action.payload, apiState: 'CONNECTING' }
    case 'CONNECT_SUCCESS':
      return { ...state, apiState: 'READY' }
    case 'CONNECT_ERROR':
      return { ...state, apiState: 'ERROR', apiError: action.payload }
    case 'DISCONNECT':
      return { ...state, api: null, apiState: null, apiError: null }
    case 'UPDATE_SOCKET':
      return { ...state, socket: action.payload }
    case 'LOAD_KEYRING':
      return { ...state, keyringState: 'LOADING' }
    case 'SET_KEYRING':
      return { ...state, keyring: action.payload, keyringState: 'READY' }
    case 'KEYRING_ERROR':
      return { ...state, keyring: null, keyringState: 'ERROR' }
    case 'SET_CURRENT_ACCOUNT':
      return { ...state, currentAccount: action.payload }
    case 'SET_CURRENT_IDENTITY':
      return { ...state, currentIdentity: action.payload }
    case 'SET_HAS_CONNECTED_BEFORE':
      return { ...state, hasConnectedBefore: true }
    case 'RESET_HAS_CONNECTED_BEFORE':
      return { ...state, hasConnectedBefore: false }
    default:
      // This should never happen with proper typing
      return state
  }
}

const connect = (
  state: SubstrateState,
  dispatch: React.Dispatch<SubstrateAction>
) => {
  const { apiState, socket, jsonrpc: rpc } = state
  if (apiState) return null

  dispatch({ type: 'CONNECT_INIT' })

  const provider = new WsProvider(socket)
  const api = new ApiPromise({ provider, rpc })

  api.on('connected', () => {
    dispatch({ type: 'CONNECT', payload: api })
    api.isReady.then(() => dispatch({ type: 'CONNECT_SUCCESS' }))
  })
  api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }))
  api.on('error', (err: Error) =>
    dispatch({ type: 'CONNECT_ERROR', payload: err })
  )

  return api
}

const disconnect = async (api: ApiPromise | null) => {
  if (!api) return

  try {
    // Disconnect from the WebSocket provider
    await api.disconnect()
    console.log('Disconnected from node')
  } catch (error) {
    console.error('Error disconnecting from node:', error)
  }
}

const retrieveChainInfo = async (api: ApiPromise) => {
  const [systemChain, systemChainType] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType()
  ])

  return {
    systemChain: systemChain.toString(),
    systemChainType
  }
}

const loadAccounts = async (
  state: SubstrateState,
  dispatch: React.Dispatch<SubstrateAction>
) => {
  const { api } = state

  if (!api) {
    console.error('API not initialized')
    return
  }

  try {
    await web3Enable('G6 Frontend Template')
    let allAccounts = await web3Accounts()

    allAccounts = allAccounts.map(({ address, meta }) => ({
      address,
      meta: { ...meta, name: `${meta.name} (${meta.source})` }
    }))

    const { systemChain, systemChainType } = await retrieveChainInfo(api)
    const isDevelopment =
      (systemChainType as any).isDevelopment ||
      (systemChainType as any).isLocal ||
      isTestChain(systemChain)

    // Load keyring accounts only if not already loaded
    if (state.keyringState !== 'READY') {
      ;(keyring as any).loadAll({ isDevelopment }, allAccounts)
    }

    dispatch({ type: 'SET_KEYRING', payload: keyring as any })

    // Set hasConnectedBefore flag in localStorage
    localStorage.setItem('hasConnectedBefore', 'true')
    dispatch({ type: 'SET_HAS_CONNECTED_BEFORE' })

    const lastUsedAccountAddress = localStorage.getItem('lastUsedAccount')
    const lastUsedAccount = allAccounts.find(
      (acct) => acct.address === lastUsedAccountAddress
    )
    if (lastUsedAccount) {
      dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: lastUsedAccount })
    } else if (!state.currentAccount) {
      const firstInjectedAccount = allAccounts.find(
        (acct) => acct.meta.source !== 'dev'
      )
      if (firstInjectedAccount) {
        dispatch({
          type: 'SET_CURRENT_ACCOUNT',
          payload: firstInjectedAccount
        })
      }
    }
  } catch (e) {
    console.error(e)
    dispatch({ type: 'KEYRING_ERROR' })
  }
}

const Gen6Context = React.createContext<SubstrateContextValue | null>(null)

export interface Gen6ContextProviderProps {
  socket?: string
  children: React.ReactNode
}

const Gen6ContextProvider: React.FC<Gen6ContextProviderProps> = (props) => {
  const neededPropNames = ['socket']
  neededPropNames.forEach((key) => {
    ;(initialState as any)[key] =
      typeof (props as any)[key] === 'undefined'
        ? (initialState as any)[key]
        : (props as any)[key]
  })

  const [state, dispatch] = useReducer(reducer, initialState)
  const apiRef = useRef<ApiPromise | null>(null)
  const socketRef = useRef<string>(props.socket || wsProvider)

  // Initial connection
  useEffect(() => {
    if (!state.apiState) {
      const api = connect(state, dispatch)
      if (api) {
        apiRef.current = api
      }
    }
  }, [])

  // Watch for socket prop changes
  useEffect(() => {
    const newSocket = props.socket || wsProvider

    // Only reconnect if socket actually changed
    if (newSocket !== socketRef.current && state.apiState) {
      console.log(`Switching node from ${socketRef.current} to ${newSocket}`)
      socketRef.current = newSocket

      // Disconnect from old node
      const oldApi = apiRef.current
      disconnect(oldApi).then(() => {
        // Reset state
        dispatch({ type: 'DISCONNECT' })

        // Update socket in state
        dispatch({ type: 'UPDATE_SOCKET', payload: newSocket })

        // Connect to new node
        const newState = { ...state, socket: newSocket, apiState: null }
        const newApi = connect(newState, dispatch)
        if (newApi) {
          apiRef.current = newApi
        }
      })
    }
  }, [props.socket])

  // Auto-load accounts if user has connected before
  useEffect(() => {
    if (
      state.hasConnectedBefore &&
      state.apiState === 'READY' &&
      !state.keyring
    ) {
      loadAccounts(state, dispatch)
    }
  }, [state.apiState, state.hasConnectedBefore])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (apiRef.current) {
        disconnect(apiRef.current)
      }
    }
  }, [])

  // Function to set the current account in the state
  function setCurrentAccount(acct: InjectedAccountWithMeta | null) {
    if (acct) {
      dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: acct })
      localStorage.setItem('lastUsedAccount', acct.address)
    } else {
      dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: null })
      dispatch({ type: 'RESET_HAS_CONNECTED_BEFORE' })
    }
  }

  // Function to manually switch nodes
  async function switchNode(newSocket: string) {
    console.log(`Manually switching node to ${newSocket}`)
    socketRef.current = newSocket

    // Disconnect from old node
    const oldApi = apiRef.current
    await disconnect(oldApi)

    // Reset state
    dispatch({ type: 'DISCONNECT' })

    // Update socket in state
    dispatch({ type: 'UPDATE_SOCKET', payload: newSocket })

    // Connect to new node
    const newState = { ...state, socket: newSocket, apiState: null }
    const newApi = connect(newState, dispatch)
    if (newApi) {
      apiRef.current = newApi
    }
  }

  return (
    <Gen6Context.Provider
      value={{
        state,
        setCurrentAccount,
        loadAccounts: () => loadAccounts(state, dispatch),
        switchNode
      }}
    >
      {props.children}
    </Gen6Context.Provider>
  )
}

// Hook to use the context state and functions
const useGen6 = (): UseGen6Return => {
  const context = useContext(Gen6Context)
  if (!context) {
    throw new Error('useGen6 must be used within a Gen6ContextProvider')
  }

  // Return both the state properties and the functions
  return {
    ...context.state,
    setCurrentAccount: context.setCurrentAccount,
    loadAccounts: context.loadAccounts,
    switchNode: context.switchNode
  }
}

export { Gen6ContextProvider, useGen6 }
