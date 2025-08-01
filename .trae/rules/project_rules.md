# WeMake AI Raycast Extensions - Project Rules

## 1. Project Overview & Mission

### Project Context

- **Repository**: WeMake AI Raycast Extensions Monorepo
- **Mission**: Create high-quality Raycast extensions showcasing WeMake AI capabilities
- **Architecture**: Nx-based monorepo with Bun package management
- **Target Audience**: Raycast community and WeMake AI users

### Core Technologies

- **Runtime**: Node.js 22.14+ with Bun package manager
- **Framework**: Raycast API with React and TypeScript
- **Build System**: Nx workspace with custom generators
- **Testing**: Vitest with React Testing Library
- **AI Integration**: AI SDK 5 with MCP (Model Context Protocol)
- **Analytics**: PostHog for user behavior tracking
- **CI/CD**: GitHub Actions with automated publishing

## 2. Development Environment Setup

### System Requirements

- **OS**: macOS (required for Raycast development)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 5GB free space minimum
- **Node.js**: Version 22.14 or higher
- **Bun**: Latest stable version
- **Raycast**: Latest version installed

### Required Tools

```sh
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
node --version
```

### VS Code Extensions (Required)

- TypeScript and JavaScript Language Features
- ESLint
- Prettier - Code formatter
- Raycast Extension
- GitLens
- Error Lens

### Workspace Setup

```sh
# Clone repository
git clone https://github.com/WeMake-AI/raycast-extensions.git
cd raycast-extensions

# Install dependencies
bun install

# Verify setup
bun run check
```

## 3. Extension Development Workflow

### Extension Structure

```sh
src/[extension-name]/
├── package.json          # Extension manifest
├── README.md            # Extension documentation
├── src/
│   ├── index.tsx        # Main command entry
│   ├── components/      # Reusable components
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript definitions
├── assets/             # Icons and images
└── __tests__/          # Test files
```

### Development Commands

```sh
# Start development
bun run dev [extension-name]

# Run tests
bun run test [extension-name]

# Build extension
bun run build [extension-name]

# Lint and format
bun run lint
bun run format

# Type checking
bun run type-check
```

### Extension Creation Process

1. **Planning**: Define extension purpose and commands
2. **Setup**: Create extension structure using Nx generators
3. **Development**: Implement features following Raycast patterns
4. **Testing**: Write comprehensive tests (80% coverage minimum)
5. **Documentation**: Update README and inline documentation
6. **Review**: Code review and quality checks
7. **Publishing**: Submit to Raycast Store via CI/CD

## 4. Testing Strategy & Implementation

### Testing Philosophy

- **Test Pyramid**: Unit tests (70%), Integration tests (20%), E2E tests (10%)
- **Coverage Requirement**: Minimum 80% for branches, functions, lines, and statements
- **Fast Feedback**: Tests should run quickly (<30 seconds per extension)
- **Reliability**: Tests must be deterministic and stable

### Vitest Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    coverage: {
      provider: "v8",
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  }
});
```

### Required Mocks

```typescript
// Mock Raycast API
vi.mock("@raycast/api", () => ({
  showToast: vi.fn(),
  getPreferenceValues: vi.fn(() => ({})),
  LocalStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn()
  },
  Icon: {},
  Color: {},
  List: { Item: vi.fn(), Section: vi.fn() },
  Detail: { Metadata: { Label: vi.fn() } },
  ActionPanel: { Action: vi.fn() }
}));
```

### Testing Patterns

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions and API calls
- **Snapshot Tests**: Ensure UI consistency
- **Error Handling**: Test error boundaries and edge cases

## 5. CI/CD Pipeline & Deployment

### GitHub Actions Workflow

- **Triggers**: Push to main/develop, pull requests, manual dispatch
- **Jobs**: Setup, lint, test, build, publish
- **Nx Integration**: Only test and build affected extensions
- **Automated Publishing**: Deploy to Raycast Store on main branch

### Workflow Steps

1. **Setup**: Install Bun and dependencies
2. **Quality Checks**: ESLint, Prettier, TypeScript
3. **Testing**: Run tests with coverage reporting
4. **Building**: Build affected extensions
5. **Publishing**: Submit to Raycast Store (main branch only)

### Environment Variables

```sh
# Required for CI/CD
RAYCAST_API_TOKEN=xxx
POSTHOG_API_KEY=xxx
GITHUB_TOKEN=xxx
```

## 6. Monitoring & Analytics

### PostHog Integration

```typescript
// Analytics service
import { PostHog } from "posthog-node";

const analytics = new PostHog(process.env.POSTHOG_API_KEY!, {
  host: "https://app.posthog.com"
});

// Track events
analytics.capture({
  distinctId: userId,
  event: "command_executed",
  properties: {
    command: "search",
    extension: "ai-assistant",
    duration: 150
  }
});
```

### Key Metrics

- **Usage**: Command executions, active users, session duration
- **Performance**: Load times, API response times, error rates
- **AI Operations**: Request counts, success rates, token usage
- **Errors**: Exception tracking, crash reports, user feedback

## 7. DevOps Best Practices & Maintenance

### Code Quality Standards

```json
// .eslintrc.json
{
  "extends": ["@raycast", "@typescript-eslint/recommended", "prettier"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### TypeScript Configuration

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Security Practices

- **No Secrets in Code**: Use environment variables and Raycast preferences
- **Input Validation**: Sanitize all user inputs
- **Dependency Security**: Regular security audits with `bun audit`
- **API Security**: Secure API key storage and transmission

### Performance Targets

- **Load Time**: <200ms for extension startup
- **Bundle Size**: <1MB per extension
- **Memory Usage**: <50MB per extension
- **API Response**: <2s for external API calls

## 8. AI Agent Collaboration Guidelines

### Context Understanding Requirements

- **Project Awareness**: Always understand the full monorepo structure
- **Technology Stack**: Comprehend Raycast API, Bun, Nx, and TypeScript patterns
- **Existing Code**: Review existing extensions for patterns and conventions
- **Documentation**: Reference project docs before making assumptions

### Development Principles for AI Agents

#### 1. Context-First Approach

```typescript
// Always understand the context before coding
// 1. Check existing similar extensions
// 2. Review shared utilities and components
// 3. Understand the specific Raycast API patterns used
// 4. Consider the user experience flow
```

#### 2. Quality-First Development

- **Never compromise on testing**: Always write tests with 80%+ coverage
- **Type Safety**: Use strict TypeScript with proper type definitions
- **Code Review**: Follow established patterns and conventions
- **Performance**: Consider load times and bundle sizes

#### 3. Raycast API Best Practices

```typescript
// Proper component usage
import { List, ActionPanel, Action, showToast, Toast } from "@raycast/api";

// Error handling
try {
  const result = await apiCall();
  // Handle success
} catch (error) {
  await showToast({
    style: Toast.Style.Failure,
    title: "Error",
    message: error.message
  });
}

// Preferences integration
const preferences = getPreferenceValues<Preferences>();
```

#### 4. Bun Integration Patterns

```sh
# Always use Bun for package management
bun add package-name
bun remove package-name
bun install

# Use Bun scripts
bun run dev
bun run test
bun run build
```

#### 5. Nx Workspace Collaboration

```sh
# Check affected projects
nx affected:test
nx affected:build

# Generate new extension
nx generate @nx/react:application extension-name

# Run specific extension
nx dev extension-name
```

#### 6. AI & MCP Integration

```typescript
// AI SDK 5 usage
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai("gpt-4"),
  prompt: "Your prompt here",
  maxTokens: 1000
});

// MCP client integration
import { MCPClient } from "@modelcontextprotocol/sdk";

const client = new MCPClient({
  serverUrl: preferences.mcpServerUrl,
  apiKey: preferences.apiKey
});
```

### Error Handling & Self-Correction

#### 1. Comprehensive Error Boundaries

```typescript
// Always wrap components in error boundaries
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<Detail markdown="An error occurred. Please try again." />}
    >
      {children}
    </ErrorBoundary>
  );
}
```

#### 2. Graceful Degradation

```typescript
// Provide fallbacks for failed operations
const data = await fetchData().catch(() => {
  showToast({
    style: Toast.Style.Failure,
    title: "Failed to fetch data",
    message: "Using cached data instead"
  });
  return getCachedData();
});
```

#### 3. User-Friendly Messages

```typescript
// Always provide clear, actionable error messages
if (!apiKey) {
  return (
    <Detail
      markdown="## API Key Required\n\nPlease configure your API key in the extension preferences."
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            title="Open Preferences"
            url="raycast://extensions/preferences"
          />
        </ActionPanel>
      }
    />
  );
}
```

### Documentation & Communication Standards

#### 1. Code Documentation

```typescript
/**
 * Searches for AI-powered content using the configured provider
 * @param query - The search query from the user
 * @param options - Additional search options
 * @returns Promise resolving to search results
 */
export async function searchContent(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
  // Implementation
}
```

#### 2. README Requirements

```markdown
# Extension Name

## Description

Brief description of what the extension does.

## Features

- Feature 1
- Feature 2

## Setup

1. Install the extension
2. Configure preferences
3. Use the commands

## Commands

- `command-name`: Description

## Preferences

- `api-key`: Your API key
- `setting`: Setting description
```

#### 3. Commit Message Standards

```sh
# Format: type(scope): description
feat(ai-assistant): add semantic search functionality
fix(weather): handle API timeout errors
docs(readme): update installation instructions
test(utils): add unit tests for date helpers
```

### Collaboration Workflow

#### 1. Before Starting Development

- [ ] Understand the project structure and existing patterns
- [ ] Review similar extensions for consistency
- [ ] Check shared utilities and components
- [ ] Understand the target user experience

#### 2. During Development

- [ ] Follow established coding patterns
- [ ] Write tests as you develop
- [ ] Use proper TypeScript types
- [ ] Handle errors gracefully
- [ ] Consider performance implications

#### 3. Before Completion

- [ ] Run all quality checks (`bun run check`)
- [ ] Ensure 80%+ test coverage
- [ ] Update documentation
- [ ] Test the extension manually
- [ ] Verify no security issues

### Self-Approval Criteria

AI agents can self-approve task completion when ALL criteria are met:

1. **Functionality**: All requirements implemented and working
2. **Quality**: Code passes all linting, formatting, and type checks
3. **Testing**: 80%+ test coverage with passing tests
4. **Performance**: Meets performance targets (<200ms load, <1MB bundle)
5. **Security**: No exposed secrets or security vulnerabilities
6. **Documentation**: Complete README and inline documentation
7. **Integration**: Works seamlessly with existing codebase
8. **User Experience**: Follows Raycast design patterns and conventions

---

## Quick Reference

### Essential Commands

```sh
# Development
bun install                 # Install dependencies
bun run dev [extension]     # Start development
bun run test [extension]    # Run tests
bun run build [extension]   # Build extension
bun run check              # Run all quality checks

# Quality
bun run lint               # Lint code
bun run format             # Format code
bun run type-check         # TypeScript checking

# Nx Commands
nx affected:test           # Test affected projects
nx affected:build          # Build affected projects
nx graph                   # View dependency graph
```

### Key File Locations

- **Extension Source**: `src/[extension-name]/`
- **Shared Code**: `src/shared/`
- **Documentation**: `docs/`
- **Configuration**: Root level config files
- **Tests**: `__tests__/` or `.test.ts` files

### Support Resources

- **Raycast API Docs**: <https://developers.raycast.com/>
- **Bun Documentation**: <https://bun.sh/docs>
- **Nx Documentation**: <https://nx.dev/>
- **Project Documentation**: `docs/` directory

---

_This document is the authoritative guide for AI agent collaboration within the WeMake AI Raycast Extensions project.
All development should follow these guidelines to ensure consistency, quality, and maintainability._
