# Project Overview & Architecture

## 🎯 Project Mission

The WeMake AI Raycast Extensions monorepo serves as the central development hub for creating, testing, and deploying
public Raycast extensions that showcase WeMake AI's capabilities and provide value to the broader Raycast community.

## 🏗️ Monorepo Architecture

### Repository Structure

```sh
raycast-extensions/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD pipelines
├── .nx/                     # Nx cache and workspace data
├── .vscode/                 # VS Code workspace configuration
├── docs/                    # Technical documentation (this folder)
├── scripts/                 # Build and deployment scripts
├── src/                     # Extension source code
│   ├── getting-started/     # Example/template extension
│   └── [extension-name]/    # Individual extension packages
├── assets/                  # Shared assets and resources
├── data/                    # Shared data files
├── package.json             # Root workspace configuration
├── nx.json                  # Nx workspace configuration
├── tsconfig.json            # TypeScript configuration
├── eslint.config.js         # ESLint configuration
└── bun.lock                 # Bun lockfile
```

### Technology Stack

#### Core Technologies

- **[Bun](https://bun.sh/)** - Ultra-fast JavaScript runtime and package manager
  - Replaces Node.js for development and package management
  - Provides native TypeScript support
  - Significantly faster than npm/yarn

- **[Nx](https://nx.dev/)** - Monorepo build system and development tools
  - Manages multiple extension packages
  - Provides caching and incremental builds
  - Enables code sharing between extensions
  - Integrated with Nx Cloud for distributed caching

- **[Raycast API](https://developers.raycast.com/)** - Extension development framework
  - React-based UI components
  - TypeScript-first development
  - Built-in utilities and hooks
  - Native macOS integration

#### Testing & Quality

- **[Vitest](https://vitest.dev/)** - Fast unit testing framework
  - Native TypeScript support
  - Jest-compatible API
  - Built-in code coverage
  - Watch mode for development

- **[ESLint](https://eslint.org/)** - Code linting and formatting
  - Raycast-specific rules via `@raycast/eslint-config`
  - TypeScript integration
  - Prettier integration for formatting

#### AI & Integration Technologies

- **[MCP (Model Context Protocol)](https://modelcontextprotocol.io/)** - AI model integration
  - Standardized AI model communication
  - Context-aware AI interactions
  - Extensible provider system

- **[AI SDK 5](https://sdk.vercel.ai/)** - AI capabilities framework
  - Multi-provider AI integration
  - Streaming responses
  - Tool calling capabilities
  - Type-safe AI interactions

#### Analytics & Monitoring

- **[PostHog](https://posthog.com/)** - Product analytics and monitoring
  - User behavior tracking
  - Feature flag management
  - Error monitoring
  - Performance metrics

#### DevOps & Deployment

- **[GitHub Actions](https://github.com/features/actions)** - CI/CD automation
  - Automated testing
  - Extension building
  - Raycast Store publishing
  - Quality gates

## 🎨 Architectural Patterns

### Workspace Organization

```typescript
// Workspace structure follows Nx conventions
workspaces: [
  "src/*" // Each extension is a separate workspace package
];
```

### Extension Structure

Each extension follows the standard Raycast extension structure:

```sh
src/[extension-name]/
├── package.json         # Extension manifest and dependencies
├── tsconfig.json        # TypeScript configuration
├── src/
│   ├── index.tsx        # Main command entry point
│   ├── components/      # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript type definitions
├── assets/              # Extension-specific assets
│   ├── icon.png         # Extension icon
│   └── [command-icon].png
└── README.md            # Extension documentation
```

### Shared Code Architecture

```sh
shared/
├── components/          # Reusable UI components
├── hooks/               # Common React hooks
├── utils/               # Utility functions
├── types/               # Shared TypeScript types
├── constants/           # Application constants
└── services/            # External service integrations
```

## 🔧 Development Principles

### Code Organization

1. **Separation of Concerns**: Each extension is self-contained with clear boundaries
2. **Shared Libraries**: Common functionality is extracted to shared packages
3. **Type Safety**: Comprehensive TypeScript usage throughout
4. **Component Reusability**: UI components are designed for reuse across extensions

### Performance Considerations

1. **Lazy Loading**: Extensions load only required components
2. **Caching**: Nx provides intelligent caching for builds and tests
3. **Bundle Optimization**: Raycast CLI optimizes extension bundles
4. **Memory Management**: Proper cleanup of resources and subscriptions

### Security Practices

1. **API Key Management**: Secure handling of external service credentials
2. **Input Validation**: All user inputs are validated and sanitized
3. **Dependency Scanning**: Regular security audits of dependencies
4. **Minimal Permissions**: Extensions request only necessary permissions

## 📊 Quality Metrics

### Code Quality

- **TypeScript Coverage**: 100% TypeScript usage
- **ESLint Compliance**: Zero linting errors
- **Test Coverage**: Minimum 80% code coverage
- **Bundle Size**: Optimized for fast loading

### Performance Targets

- **Extension Load Time**: < 200ms
- **Search Response Time**: < 100ms
- **Memory Usage**: < 50MB per extension
- **Bundle Size**: < 1MB per extension

## 🔄 Development Lifecycle

### Extension Development Flow

1. **Planning**: Define extension requirements and scope
2. **Scaffolding**: Create extension structure using templates
3. **Development**: Implement features using Raycast API
4. **Testing**: Unit and integration testing with Vitest
5. **Quality Assurance**: Linting, formatting, and code review
6. **Integration**: AI and analytics integration
7. **Deployment**: Automated publishing to Raycast Store
8. **Monitoring**: PostHog analytics and error tracking

### Release Strategy

- **Semantic Versioning**: All extensions follow semver
- **Feature Flags**: PostHog feature flags for gradual rollouts
- **Rollback Capability**: Quick rollback for critical issues
- **Documentation**: Comprehensive changelog and migration guides

## 🎯 Strategic Goals

### Short-term (3 months)

- Establish robust development workflow
- Create 3-5 high-quality public extensions
- Implement comprehensive testing strategy
- Set up monitoring and analytics

### Medium-term (6 months)

- Build extension ecosystem with 10+ extensions
- Establish WeMake AI brand presence in Raycast community
- Optimize development velocity and quality
- Implement advanced AI features across extensions

### Long-term (12 months)

- Become a recognized contributor to Raycast ecosystem
- Open-source selected extensions for community contribution
- Establish best practices for AI-powered Raycast extensions
- Scale development team and processes

---

**Next**: [Development Environment Setup](./02-development-setup.md)
