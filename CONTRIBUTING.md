# Contributing to Gen6 Context

Thank you for your interest in contributing to Gen6 Context! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/gen6-context.git
   cd gen6-context
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Run type checking:
   ```bash
   npm run typecheck
   ```

## Development Workflow

### Scripts

- `npm run build` - Build the library for production
- `npm run dev` - Build in watch mode for development
- `npm run typecheck` - Run TypeScript type checking
- `npm run validate` - Run type checking and build
- `npm run clean` - Clean build artifacts

### Project Structure

```
src/
├── gen6Context.tsx    # Main context provider and hook
├── index.ts          # Public API exports
├── types/
│   └── substrate.ts  # TypeScript type definitions
└── vite-env.d.ts    # Vite type definitions
```

## Contribution Guidelines

### Code Style

- Use TypeScript for all code
- Follow existing code formatting and style
- Use meaningful variable and function names
- Add type definitions for all public APIs

### Commit Messages

Use conventional commit format:
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `refactor: improve code structure`
- `test: add or update tests`
- `chore: maintenance tasks`

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with appropriate commits
3. Update documentation if needed
4. Ensure all checks pass:
   ```bash
   npm run validate
   ```
5. Create a pull request with a clear description

### Testing

While we don't have automated tests yet, please:
- Test your changes manually with the examples
- Ensure TypeScript compilation succeeds
- Verify the built package works correctly

## Reporting Issues

When reporting issues, please include:
- Node.js and npm versions
- React version being used
- Steps to reproduce the issue
- Expected vs actual behavior
- Any relevant error messages or logs

## Feature Requests

Before submitting a feature request:
- Check if it already exists in issues
- Consider if it fits the library's scope
- Provide a clear use case and rationale

## Questions

For questions about usage or development:
- Check the README.md documentation
- Look through existing issues
- Create a new issue with the "question" label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
