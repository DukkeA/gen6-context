# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-09

### Added
- Initial release of Gen6 Context
- React Context Provider for Polkadot/Substrate blockchain applications
- WebSocket connection management with automatic reconnection
- Account management with browser extension integration
- Keyring management with persistence
- TypeScript support with comprehensive type definitions
- State management using React Context and useReducer
- Auto-connection for returning users

### Features
- `Gen6ContextProvider` component for wrapping applications
- `useGen6` hook for accessing blockchain state and functions
- Support for custom WebSocket URLs
- Environment variable configuration
- Account switching and persistence
- Connection state management
- Error handling and recovery

### Dependencies
- @polkadot/api ^12.0.0
- @polkadot/extension-dapp ^0.47.0
- @polkadot/ui-keyring ^3.6.0
- @polkadot/util ^12.6.0
- @polkadot/types ^12.0.0

### Peer Dependencies
- react >=16.8.0
- react-dom >=16.8.0
