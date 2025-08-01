# Development Environment Setup Guide

## 🎯 Overview

This guide walks you through setting up a complete development environment for WeMake AI Raycast extensions. Follow
these steps to ensure a consistent and optimized development experience.

## 📋 Prerequisites

### System Requirements

- **macOS**: Raycast is macOS-only
- **macOS Version**: 10.15 (Catalina) or later
- **RAM**: Minimum 8GB, recommended 16GB+
- **Storage**: At least 5GB free space

### Required Software

#### 1. Raycast Application

```sh
# Install via Homebrew (recommended)
brew install --cask raycast

# Or download from https://raycast.com
```

**Minimum Version**: Raycast 1.26.0 or higher

**Verification**:

```sh
# Check Raycast version
open -a Raycast
# Go to Raycast Settings > About
```

#### 2. Node.js

**Required Version**: Node.js 22.14 or higher

```sh
# Install via nvm (recommended for version management)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or source profile
source ~/.zshrc

# Install and use Node.js 22.14+
nvm install 22.14
nvm use 22.14
nvm alias default 22.14

# Verify installation
node --version  # Should show v22.14.x or higher
npm --version
```

#### 3. Bun Runtime

**Bun** is our primary JavaScript runtime and package manager for superior performance.

```sh
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Restart terminal or source profile
source ~/.zshrc

# Verify installation
bun --version  # Should show latest version
```

#### 4. Git & GitHub CLI

```sh
# Install Git (if not already installed)
brew install git

# Install GitHub CLI
brew install gh

# Authenticate with GitHub
gh auth login
```

## 🚀 Workspace Setup

### 1. Clone the Repository

```sh
# Clone the monorepo
gh repo clone WeMake-AI/raycast-extensions
cd raycast-extensions

# Or using HTTPS
git clone https://github.com/WeMake-AI/raycast-extensions.git
cd raycast-extensions
```

### 2. Install Dependencies

```sh
# Install all dependencies using Bun
bun install

# This will:
# - Install root workspace dependencies
# - Install dependencies for all extension packages
# - Set up Nx workspace
# - Configure development tools
```

### 3. Verify Installation

```sh
# Run workspace health check
bun run check

# This runs:
# - TypeScript compilation check
# - ESLint linting
# - Prettier formatting check
```

## 🔧 Development Tools Configuration

### VS Code Setup (Recommended)

#### Install VS Code

```sh
brew install --cask visual-studio-code
```

#### Required Extensions

Install these extensions for optimal development experience:

```sh
# Install via command line
code --install-extension tonka3000.raycast
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
code --install-extension nrwl.angular-console
code --install-extension bradlc.vscode-tailwindcss
```

**Essential Extensions**:

- **Raycast Extension** (`tonka3000.raycast`): IntelliSense, debugging, commands
- **TypeScript** (`ms-vscode.vscode-typescript-next`): Enhanced TypeScript support
- **Prettier** (`esbenp.prettier-vscode`): Code formatting
- **ESLint** (`ms-vscode.vscode-eslint`): Code linting
- **Nx Console** (`nrwl.angular-console`): Nx workspace management

#### Workspace Settings

The repository includes pre-configured VS Code settings in `.vscode/settings.json`:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.workingDirectories": ["src"],
  "raycast.extensionPaths": ["src/*"]
}
```

### Terminal Configuration

#### Zsh Setup (macOS default)

Add these aliases to your `~/.zshrc` for faster development:

```sh
# Raycast Extensions aliases
alias re="cd ~/path/to/raycast-extensions"
alias red="bun run dev"
alias reb="bun run build"
alias ret="bun run test"
alias rec="bun run check"

# Nx shortcuts
alias nx="bunx nx"
alias nxg="bunx nx generate"
alias nxr="bunx nx run"
```

## 🏗️ Nx Workspace Configuration

### Understanding the Workspace

Our monorepo uses Nx for:

- **Dependency Management**: Shared dependencies across extensions
- **Build Optimization**: Incremental builds and caching
- **Code Generation**: Scaffolding new extensions
- **Task Running**: Coordinated testing and building

### Nx Commands

```sh
# Generate new extension
bunx nx generate @nx/js:library my-extension --directory=src

# Run specific extension in development
bunx nx run my-extension:dev

# Build specific extension
bunx nx run my-extension:build

# Test specific extension
bunx nx run my-extension:test

# Run command for all extensions
bunx nx run-many --target=test --all

# Show dependency graph
bunx nx graph
```

### Nx Cloud Integration

The workspace is configured with Nx Cloud for distributed caching:

```json
// nx.json
{
  "nxCloudId": "688cc3ab4d01fd00e86e7dfb"
}
```

This provides:

- **Shared Build Cache**: Faster builds across team
- **Distributed Task Execution**: Parallel processing
- **Build Analytics**: Performance insights

## 🎨 Creating Your First Extension

### 1. Generate Extension Structure

```sh
# Navigate to workspace root
cd raycast-extensions

# Create new extension using Raycast CLI
cd src
mkdir my-first-extension
cd my-first-extension

# Initialize Raycast extension
bunx @raycast/api@latest init
```

### 2. Extension Configuration

Update `package.json` with WeMake AI standards:

```json
{
  "$schema": "https://www.raycast.com/schemas/extension.json",
  "name": "my-first-extension",
  "title": "My First Extension",
  "description": "A sample extension for WeMake AI",
  "icon": "icon.png",
  "author": "your-github-username",
  "owner": "wemake",
  "categories": ["Productivity"],
  "license": "MIT",
  "commands": [
    {
      "name": "index",
      "title": "My First Command",
      "description": "Sample command",
      "mode": "view"
    }
  ],
  "dependencies": {
    "@raycast/api": "^1.102.3"
  }
}
```

### 3. Development Workflow

```sh
# Start development mode
bun run dev

# This will:
# - Build the extension
# - Import it into Raycast
# - Enable hot reloading
# - Show in Development section
```

## 🔍 Verification & Testing

### Environment Verification

Run this comprehensive check:

```sh
#!/bin/bash
# save as scripts/verify-setup.sh

echo "🔍 Verifying Development Environment..."

# Check Raycast
echo "\n📱 Raycast:"
if command -v raycast &> /dev/null; then
    echo "✅ Raycast CLI available"
else
    echo "❌ Raycast CLI not found"
fi

# Check Node.js
echo "\n🟢 Node.js:"
node_version=$(node --version)
echo "✅ Node.js version: $node_version"

# Check Bun
echo "\n🥖 Bun:"
bun_version=$(bun --version)
echo "✅ Bun version: $bun_version"

# Check Git
echo "\n📝 Git:"
git_version=$(git --version)
echo "✅ Git version: $git_version"

# Check workspace
echo "\n🏗️ Workspace:"
if [ -f "package.json" ]; then
    echo "✅ Package.json found"
else
    echo "❌ Package.json not found"
fi

if [ -f "nx.json" ]; then
    echo "✅ Nx workspace configured"
else
    echo "❌ Nx workspace not found"
fi

# Check dependencies
echo "\n📦 Dependencies:"
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed - run 'bun install'"
fi

echo "\n🎉 Environment verification complete!"
```

```sh
# Make script executable and run
chmod +x scripts/verify-setup.sh
./scripts/verify-setup.sh
```

### Test Extension Development

```sh
# Navigate to getting-started extension
cd src/getting-started

# Start development
bun run dev

# Verify in Raycast:
# 1. Open Raycast (Cmd+Space)
# 2. Look for "Development" section
# 3. Find "Getting Started" command
# 4. Test the command functionality
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Raycast Not Detecting Extensions

```sh
# Ensure Raycast is running
open -a Raycast

# Restart Raycast development mode
bun run dev

# Check Raycast preferences
# Raycast > Preferences > Advanced > "Auto-reload on save"
```

#### 2. Bun Installation Issues

```sh
# Reinstall Bun
curl -fsSL https://bun.sh/install | bash

# Clear Bun cache
bun pm cache rm

# Reinstall dependencies
rm -rf node_modules bun.lock
bun install
```

#### 3. TypeScript Errors

```sh
# Check TypeScript configuration
bun run tsc

# Update TypeScript
bun add -D typescript@latest

# Restart VS Code TypeScript server
# Cmd+Shift+P > "TypeScript: Restart TS Server"
```

#### 4. Nx Issues

```sh
# Clear Nx cache
bunx nx reset

# Reinstall Nx
bun add -D nx@latest

# Verify Nx installation
bunx nx --version
```

### Getting Help

1. **Internal Documentation**: Check other docs in this folder
2. **Raycast Documentation**: <https://developers.raycast.com>
3. **Nx Documentation**: <https://nx.dev>
4. **Team Slack**: #raycast-extensions channel
5. **GitHub Issues**: Create issue in repository

## 🎯 Next Steps

Once your environment is set up:

1. **Read**: [Extension Development Workflow](./03-development-workflow.md)
2. **Explore**: Examine the `getting-started` extension
3. **Create**: Build your first custom extension
4. **Test**: Follow [Testing Strategy](./04-testing-strategy.md)
5. **Deploy**: Use [CI/CD Pipeline](./05-cicd-deployment.md)

---

**Previous**: [Project Overview & Architecture](./01-project-overview.md) | **Next**:
[Extension Development Workflow](./03-development-workflow.md)
