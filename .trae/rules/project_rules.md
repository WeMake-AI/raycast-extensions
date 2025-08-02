# Raycast Extensions Monorepo Project Rules

## Introduction

These rules customize Trae IDE AI Agent behavior for the Raycast Extensions monorepo, ensuring adherence to project
conventions, best practices, and DevOps standards.

## Code Style and Conventions

- Use TypeScript with strict typing.
- Enforce ESLint and Prettier for code quality and formatting.
- Naming: camelCase for variables/functions, PascalCase for components/classes.
- Consistent imports: Prefer absolute paths for shared modules.
- Avoid abbreviations; use descriptive names.

## Architecture and Best Practices

- Manage monorepo with Nx for workspace and extensions.
- Separation of concerns: UI, logic, data layers.
- Shared code in workspace libraries.
- Performance: Lazy loading, minimal dependencies, <200ms load time.
- Modular code, robust error handling, accessibility compliance.

## Testing Requirements

- Use Vitest for unit and integration tests.
- Minimum 80% code coverage.
- Mock Raycast API for extension tests.
- Focus on fast feedback, reliability, and maintainability.

## Security Practices

- Validate all inputs to prevent injection attacks.
- Scan dependencies regularly for vulnerabilities.
- Secure API calls with authentication.
- Never hardcode secrets; use environment variables.

## DevOps Guidelines

- CI/CD via GitHub Actions: Automate linting, testing, building, deployment.
- Triggers: Push to main/develop, PRs, manual, scheduled.
- Monitoring: PostHog for user metrics, errors, performance tracking.
- IaC for infrastructure, RBAC for access control.

## AI Agent Specific Rules

- When generating code, follow Raycast API patterns.
- Integrate MCP and AI SDK 5 conventions.
- Ensure edits maintain semantic versioning and quality metrics.
