import type { ApiPromise } from '@polkadot/api'
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'

export interface SubstrateState {
  socket: string
  jsonrpc: Record<string, any>
  keyring: any | null
  keyringState: string | null
  api: ApiPromise | null
  apiError: Error | null
  apiState: string | null
  currentAccount: InjectedAccountWithMeta | null
  currentIdentity: {
    name: string | null
    email: string | null
  }
  hasConnectedBefore: boolean
}

export type SubstrateAction =
  | { type: 'CONNECT_INIT' }
  | { type: 'CONNECT'; payload: ApiPromise }
  | { type: 'CONNECT_SUCCESS' }
  | { type: 'CONNECT_ERROR'; payload: Error }
  | { type: 'LOAD_KEYRING' }
  | { type: 'SET_KEYRING'; payload: any }
  | { type: 'KEYRING_ERROR' }
  | { type: 'SET_CURRENT_ACCOUNT'; payload: InjectedAccountWithMeta | null }
  | { type: 'SET_CURRENT_IDENTITY'; payload: { name: string | null; email: string | null } }
  | { type: 'SET_HAS_CONNECTED_BEFORE' }
  | { type: 'RESET_HAS_CONNECTED_BEFORE' }

export interface SubstrateContextValue {
  state: SubstrateState
  setCurrentAccount: (account: InjectedAccountWithMeta | null) => void
  loadAccounts: () => Promise<void>
}

export interface UseGen6Return extends SubstrateState {
  setCurrentAccount: (account: InjectedAccountWithMeta | null) => void
  loadAccounts: () => Promise<void>
}