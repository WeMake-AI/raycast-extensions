# DevOps Best Practices & Maintenance Guide

## 🎯 Overview

This guide establishes comprehensive DevOps practices and maintenance procedures for the WeMake AI Raycast Extensions
monorepo, ensuring code quality, security, reliability, and sustainable development workflows.

## 📋 Code Quality Standards

### Code Style & Formatting

#### ESLint Configuration

```json
// .eslintrc.json
{
  "root": true,
  "ignorePatterns": ["**/*"],
  "plugins": ["@nx"],
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "extends": [
        "@raycast",
        "@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript"
      ],
      "rules": {
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/prefer-const": "error",
        "@typescript-eslint/no-non-null-assertion": "warn",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "import/order": [
          "error",
          {
            "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
            "newlines-between": "always",
            "alphabetize": {
              "order": "asc",
              "caseInsensitive": true
            }
          }
        ],
        "import/no-unresolved": "error",
        "import/no-cycle": "error",
        "prefer-const": "error",
        "no-var": "error",
        "no-console": "warn",
        "no-debugger": "error"
      },
      "settings": {
        "react": {
          "version": "detect"
        },
        "import/resolver": {
          "typescript": {
            "alwaysTryTypes": true,
            "project": "./tsconfig.base.json"
          }
        }
      }
    },
    {
      "files": ["*.ts", "*.tsx"],
      "extends": ["plugin:@nx/typescript"],
      "rules": {
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/explicit-module-boundary-types": "warn",
        "@typescript-eslint/no-inferrable-types": "error",
        "@typescript-eslint/prefer-nullish-coalescing": "error",
        "@typescript-eslint/prefer-optional-chain": "error"
      }
    },
    {
      "files": ["*.js", "*.jsx"],
      "extends": ["plugin:@nx/javascript"],
      "rules": {}
    },
    {
      "files": ["*.spec.ts", "*.spec.tsx", "*.spec.js", "*.spec.jsx"],
      "env": {
        "vitest": true
      },
      "rules": {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
```

#### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "jsxSingleQuote": true,
  "proseWrap": "preserve"
}
```

#### EditorConfig

```ini
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2

[*.json]
indent_size = 2

[Makefile]
indent_style = tab
```

### TypeScript Standards

#### Strict Configuration

```json
// tsconfig.base.json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "es2015",
    "module": "esnext",
    "lib": ["es2020", "dom"],
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@wemake/shared/*": ["libs/shared/src/*"],
      "@wemake/ui/*": ["libs/ui/src/*"],
      "@wemake/utils/*": ["libs/utils/src/*"]
    },
    // Strict Type Checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    // Additional Checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    // Module Resolution
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  },
  "exclude": ["node_modules", "tmp"]
}
```

#### Type Safety Guidelines

```typescript
// types/common.ts

// Use strict typing for all interfaces
export interface StrictUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly preferences?: UserPreferences;
}

// Avoid 'any' - use proper union types
export type APIResponse<T> = { success: true; data: T } | { success: false; error: string; code: number };

// Use branded types for IDs
export type UserId = string & { readonly brand: unique symbol };
export type ExtensionId = string & { readonly brand: unique symbol };

// Utility types for better type safety
export type NonEmptyArray<T> = [T, ...T[]];
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Error handling types
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export type Result<T, E = AppError> = { success: true; data: T } | { success: false; error: E };

// Async result helper
export const asyncResult = async <T>(promise: Promise<T>): Promise<Result<T>> => {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof AppError
          ? error
          : new AppError(error instanceof Error ? error.message : "Unknown error", "UNKNOWN_ERROR")
    };
  }
};
```

### Code Review Standards

#### Pull Request Template

```markdown
<!-- .github/pull_request_template.md -->

## 📝 Description

Brief description of changes and motivation.

## 🔄 Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring
- [ ] Dependency update

## 🧪 Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)
- [ ] Manual testing completed
- [ ] Performance impact assessed

## 📋 Checklist

### Code Quality

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Code is self-documenting or well-commented
- [ ] No console.log or debugging code left
- [ ] Error handling implemented
- [ ] TypeScript strict mode compliance

### Security

- [ ] No sensitive data exposed
- [ ] Input validation implemented
- [ ] Authentication/authorization checked
- [ ] Dependencies security reviewed

### Performance

- [ ] No performance regressions
- [ ] Memory leaks checked
- [ ] Bundle size impact assessed
- [ ] Async operations optimized

### Documentation

- [ ] README updated (if needed)
- [ ] API documentation updated
- [ ] Changelog updated
- [ ] Migration guide provided (for breaking changes)

## 🔗 Related Issues

Fixes #(issue number) Closes #(issue number) Related to #(issue number)

## 📸 Screenshots (if applicable)

## 🚀 Deployment Notes

Any special deployment considerations or environment variable changes.

## 🔄 Rollback Plan

How to rollback this change if issues arise.
```

#### Review Guidelines

```typescript
// scripts/review-checklist.ts

export interface ReviewCriteria {
  codeQuality: {
    readability: boolean;
    maintainability: boolean;
    testability: boolean;
    performance: boolean;
  };
  security: {
    inputValidation: boolean;
    authenticationChecks: boolean;
    dataExposure: boolean;
    dependencyVulnerabilities: boolean;
  };
  functionality: {
    requirementsMet: boolean;
    edgeCasesHandled: boolean;
    errorHandling: boolean;
    backwardCompatibility: boolean;
  };
  testing: {
    unitTestsCoverage: boolean;
    integrationTests: boolean;
    manualTesting: boolean;
    performanceTesting: boolean;
  };
}

export const reviewGuidelines = {
  // Automatic checks
  automated: [
    "ESLint passes without errors",
    "Prettier formatting applied",
    "TypeScript compilation successful",
    "All tests pass",
    "No security vulnerabilities in dependencies",
    "Bundle size within limits"
  ],

  // Manual review points
  manual: [
    "Code is readable and well-structured",
    "Business logic is correct",
    "Error handling is comprehensive",
    "Performance implications considered",
    "Security best practices followed",
    "Documentation is adequate",
    "Breaking changes are justified and documented"
  ],

  // Approval criteria
  approval: {
    requiredApprovals: 2,
    requireCodeOwnerApproval: true,
    dismissStaleReviews: true,
    requireUpToDateBranch: true
  }
};
```

## 🔒 Security Practices

### Security Scanning

#### GitHub Security Configuration

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: "0 2 * * 1" # Weekly on Monday at 2 AM

jobs:
  security-scan:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run security audit
        run: bun audit

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: Run CodeQL analysis
        uses: github/codeql-action/init@v3
        with:
          languages: typescript, javascript

      - name: Perform CodeQL analysis
        uses: github/codeql-action/analyze@v3

      - name: Run Semgrep security scan
        uses: returntocorp/semgrep-action@v1
        with:
          config: auto

      - name: Upload security scan results
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: results.sarif
```

#### Dependency Security

```typescript
// scripts/security-check.ts
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface SecurityReport {
  timestamp: string;
  vulnerabilities: Vulnerability[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

interface Vulnerability {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  package: string;
  version: string;
  fixedIn?: string;
  description: string;
}

class SecurityChecker {
  private reportPath = join(process.cwd(), "security-report.json");

  async runSecurityAudit(): Promise<SecurityReport> {
    console.log("🔍 Running security audit...");

    try {
      // Run bun audit
      const auditOutput = execSync("bun audit --json", { encoding: "utf-8" });
      const auditData = JSON.parse(auditOutput);

      // Process vulnerabilities
      const vulnerabilities = this.processVulnerabilities(auditData);

      const report: SecurityReport = {
        timestamp: new Date().toISOString(),
        vulnerabilities,
        summary: this.generateSummary(vulnerabilities)
      };

      // Save report
      writeFileSync(this.reportPath, JSON.stringify(report, null, 2));

      // Check for critical/high vulnerabilities
      const criticalCount = report.summary.critical + report.summary.high;
      if (criticalCount > 0) {
        console.error(`❌ Found ${criticalCount} critical/high severity vulnerabilities`);
        process.exit(1);
      }

      console.log("✅ Security audit passed");
      return report;
    } catch (error) {
      console.error("❌ Security audit failed:", error);
      throw error;
    }
  }

  private processVulnerabilities(auditData: any): Vulnerability[] {
    // Process audit data and extract vulnerabilities
    // Implementation depends on audit tool output format
    return [];
  }

  private generateSummary(vulnerabilities: Vulnerability[]) {
    return vulnerabilities.reduce(
      (acc, vuln) => {
        acc.total++;
        acc[vuln.severity]++;
        return acc;
      },
      { total: 0, critical: 0, high: 0, medium: 0, low: 0 }
    );
  }

  async checkDependencyLicenses(): Promise<void> {
    console.log("📄 Checking dependency licenses...");

    try {
      // Check for problematic licenses
      const licenseCheck = execSync('npx license-checker --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC"', {
        encoding: "utf-8"
      });

      console.log("✅ All dependencies have approved licenses");
    } catch (error) {
      console.error("❌ Found dependencies with unapproved licenses");
      throw error;
    }
  }

  async updateSecurityAdvisories(): Promise<void> {
    console.log("🔄 Updating security advisories...");

    try {
      execSync("bun update --latest", { stdio: "inherit" });
      console.log("✅ Dependencies updated");
    } catch (error) {
      console.error("❌ Failed to update dependencies:", error);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const checker = new SecurityChecker();

  const command = process.argv[2];

  switch (command) {
    case "audit":
      checker.runSecurityAudit();
      break;
    case "licenses":
      checker.checkDependencyLicenses();
      break;
    case "update":
      checker.updateSecurityAdvisories();
      break;
    default:
      console.log("Usage: bun run security-check.ts [audit|licenses|update]");
  }
}

export { SecurityChecker };
```

### Secrets Management

#### Environment Variables

```typescript
// lib/config/env-validator.ts
import { z } from "zod";

const envSchema = z.object({
  // Required environment variables
  NODE_ENV: z.enum(["development", "staging", "production"]),

  // API Keys (required in production)
  OPENAI_API_KEY: z.string().min(1).optional(),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  POSTHOG_API_KEY: z.string().min(1).optional(),

  // Optional configuration
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  ENABLE_ANALYTICS: z
    .string()
    .transform((val) => val === "true")
    .default("true"),

  // Security
  ENCRYPTION_KEY: z.string().min(32).optional(),
  JWT_SECRET: z.string().min(32).optional()
});

export type Environment = z.infer<typeof envSchema>;

class EnvironmentValidator {
  private static instance: EnvironmentValidator;
  private env: Environment;

  private constructor() {
    this.validateEnvironment();
  }

  static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator();
    }
    return EnvironmentValidator.instance;
  }

  private validateEnvironment(): void {
    try {
      this.env = envSchema.parse(process.env);

      // Additional validation for production
      if (this.env.NODE_ENV === "production") {
        this.validateProductionRequirements();
      }

      console.log("✅ Environment validation passed");
    } catch (error) {
      console.error("❌ Environment validation failed:", error);
      process.exit(1);
    }
  }

  private validateProductionRequirements(): void {
    const requiredInProduction = ["OPENAI_API_KEY", "POSTHOG_API_KEY", "ENCRYPTION_KEY"];

    const missing = requiredInProduction.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables in production: ${missing.join(", ")}`);
    }
  }

  getEnv(): Environment {
    return this.env;
  }

  isProduction(): boolean {
    return this.env.NODE_ENV === "production";
  }

  isDevelopment(): boolean {
    return this.env.NODE_ENV === "development";
  }
}

export const envValidator = EnvironmentValidator.getInstance();
export { EnvironmentValidator };
```

#### Secrets Encryption

```typescript
// lib/security/encryption.ts
import { createCipher, createDecipher, randomBytes } from "crypto";
import { envValidator } from "../config/env-validator";

class EncryptionService {
  private static instance: EncryptionService;
  private encryptionKey: string;

  private constructor() {
    const env = envValidator.getEnv();
    this.encryptionKey = env.ENCRYPTION_KEY || this.generateKey();
  }

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  private generateKey(): string {
    if (envValidator.isProduction()) {
      throw new Error("Encryption key must be provided in production");
    }
    return randomBytes(32).toString("hex");
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(text: string): string {
    try {
      const cipher = createCipher("aes-256-cbc", this.encryptionKey);
      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");
      return encrypted;
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedText: string): string {
    try {
      const decipher = createDecipher("aes-256-cbc", this.encryptionKey);
      let decrypted = decipher.update(encryptedText, "hex", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error}`);
    }
  }

  /**
   * Hash sensitive data (one-way)
   */
  hash(text: string): string {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(text).digest("hex");
  }

  /**
   * Generate secure random token
   */
  generateToken(length: number = 32): string {
    return randomBytes(length).toString("hex");
  }
}

export const encryptionService = EncryptionService.getInstance();
export { EncryptionService };
```

## 📦 Dependency Management

### Dependency Strategy

#### Package.json Management

```json
{
  "name": "@wemake/raycast-extensions",
  "private": true,
  "workspaces": ["apps/*", "libs/*"],
  "engines": {
    "node": ">=18.0.0",
    "bun": ">=1.0.0"
  },
  "packageManager": "bun@1.0.0",
  "scripts": {
    "deps:check": "bun run scripts/check-dependencies.ts",
    "deps:update": "bun run scripts/update-dependencies.ts",
    "deps:audit": "bun audit",
    "deps:outdated": "bun outdated",
    "deps:clean": "bun run scripts/clean-dependencies.ts"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "vitest": "^1.0.0",
    "nx": "^17.0.0"
  },
  "resolutions": {
    "lodash": "^4.17.21",
    "minimist": "^1.2.6"
  }
}
```

#### Dependency Checker

```typescript
// scripts/check-dependencies.ts
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";
import semver from "semver";

interface DependencyInfo {
  name: string;
  current: string;
  wanted: string;
  latest: string;
  location: string;
  type: "dependencies" | "devDependencies" | "peerDependencies";
}

interface SecurityVulnerability {
  name: string;
  severity: "low" | "moderate" | "high" | "critical";
  via: string[];
  effects: string[];
  range: string;
  nodes: string[];
  fixAvailable: boolean | string;
}

class DependencyChecker {
  private rootPath: string;
  private packageJson: any;

  constructor() {
    this.rootPath = process.cwd();
    this.packageJson = JSON.parse(readFileSync(join(this.rootPath, "package.json"), "utf-8"));
  }

  /**
   * Check for outdated dependencies
   */
  async checkOutdated(): Promise<DependencyInfo[]> {
    console.log("🔍 Checking for outdated dependencies...");

    try {
      const output = execSync("bun outdated --json", { encoding: "utf-8" });
      const outdatedData = JSON.parse(output);

      const outdated: DependencyInfo[] = Object.entries(outdatedData).map(([name, info]: [string, any]) => ({
        name,
        current: info.current,
        wanted: info.wanted,
        latest: info.latest,
        location: info.location,
        type: this.getDependencyType(name)
      }));

      if (outdated.length > 0) {
        console.log(`⚠️  Found ${outdated.length} outdated dependencies`);
        this.printOutdatedTable(outdated);
      } else {
        console.log("✅ All dependencies are up to date");
      }

      return outdated;
    } catch (error) {
      console.error("❌ Failed to check outdated dependencies:", error);
      return [];
    }
  }

  /**
   * Check for security vulnerabilities
   */
  async checkSecurity(): Promise<SecurityVulnerability[]> {
    console.log("🔒 Checking for security vulnerabilities...");

    try {
      const output = execSync("bun audit --json", { encoding: "utf-8" });
      const auditData = JSON.parse(output);

      const vulnerabilities: SecurityVulnerability[] = Object.values(auditData.vulnerabilities || {});

      if (vulnerabilities.length > 0) {
        console.log(`⚠️  Found ${vulnerabilities.length} security vulnerabilities`);
        this.printSecurityTable(vulnerabilities);

        const critical = vulnerabilities.filter((v) => v.severity === "critical").length;
        const high = vulnerabilities.filter((v) => v.severity === "high").length;

        if (critical > 0 || high > 0) {
          console.error(`❌ Found ${critical} critical and ${high} high severity vulnerabilities`);
          process.exit(1);
        }
      } else {
        console.log("✅ No security vulnerabilities found");
      }

      return vulnerabilities;
    } catch (error) {
      console.error("❌ Failed to check security vulnerabilities:", error);
      return [];
    }
  }

  /**
   * Check for duplicate dependencies
   */
  async checkDuplicates(): Promise<void> {
    console.log("🔍 Checking for duplicate dependencies...");

    try {
      const output = execSync("bun pm ls --all", { encoding: "utf-8" });

      // Parse output to find duplicates
      const lines = output.split("\n");
      const packages = new Map<string, string[]>();

      lines.forEach((line) => {
        const match = line.match(/^(.+)@(.+)$/);
        if (match) {
          const [, name, version] = match;
          if (!packages.has(name)) {
            packages.set(name, []);
          }
          packages.get(name)!.push(version);
        }
      });

      const duplicates = Array.from(packages.entries())
        .filter(([, versions]) => versions.length > 1)
        .map(([name, versions]) => ({ name, versions: [...new Set(versions)] }));

      if (duplicates.length > 0) {
        console.log(`⚠️  Found ${duplicates.length} packages with multiple versions:`);
        duplicates.forEach(({ name, versions }) => {
          console.log(`  ${name}: ${versions.join(", ")}`);
        });
      } else {
        console.log("✅ No duplicate dependencies found");
      }
    } catch (error) {
      console.error("❌ Failed to check duplicates:", error);
    }
  }

  /**
   * Check dependency licenses
   */
  async checkLicenses(): Promise<void> {
    console.log("📄 Checking dependency licenses...");

    const allowedLicenses = ["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC", "CC0-1.0"];

    try {
      const output = execSync("npx license-checker --json", { encoding: "utf-8" });
      const licenses = JSON.parse(output);

      const problematic = Object.entries(licenses)
        .filter(([, info]: [string, any]) => {
          const license = info.licenses;
          return !allowedLicenses.includes(license);
        })
        .map(([name, info]: [string, any]) => ({
          name,
          license: info.licenses,
          repository: info.repository
        }));

      if (problematic.length > 0) {
        console.log(`⚠️  Found ${problematic.length} dependencies with non-approved licenses:`);
        problematic.forEach(({ name, license }) => {
          console.log(`  ${name}: ${license}`);
        });
      } else {
        console.log("✅ All dependencies have approved licenses");
      }
    } catch (error) {
      console.error("❌ Failed to check licenses:", error);
    }
  }

  private getDependencyType(name: string): "dependencies" | "devDependencies" | "peerDependencies" {
    if (this.packageJson.dependencies?.[name]) return "dependencies";
    if (this.packageJson.devDependencies?.[name]) return "devDependencies";
    if (this.packageJson.peerDependencies?.[name]) return "peerDependencies";
    return "dependencies";
  }

  private printOutdatedTable(outdated: DependencyInfo[]): void {
    console.table(
      outdated.map((dep) => ({
        Package: dep.name,
        Current: dep.current,
        Wanted: dep.wanted,
        Latest: dep.latest,
        Type: dep.type
      }))
    );
  }

  private printSecurityTable(vulnerabilities: SecurityVulnerability[]): void {
    console.table(
      vulnerabilities.map((vuln) => ({
        Package: vuln.name,
        Severity: vuln.severity,
        Via: vuln.via.join(", "),
        "Fix Available": vuln.fixAvailable
      }))
    );
  }
}

// CLI interface
if (require.main === module) {
  const checker = new DependencyChecker();

  async function runChecks() {
    await checker.checkOutdated();
    await checker.checkSecurity();
    await checker.checkDuplicates();
    await checker.checkLicenses();
  }

  runChecks().catch((error) => {
    console.error("❌ Dependency check failed:", error);
    process.exit(1);
  });
}

export { DependencyChecker };
```

### Automated Updates

#### Dependabot Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  # Enable version updates for npm
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 10
    reviewers:
      - "@wemake-ai/core-team"
    assignees:
      - "@wemake-ai/core-team"
    commit-message:
      prefix: "deps"
      include: "scope"
    labels:
      - "dependencies"
      - "automated"

    # Group updates
    groups:
      raycast:
        patterns:
          - "@raycast/*"
      typescript:
        patterns:
          - "typescript"
          - "@types/*"
      testing:
        patterns:
          - "vitest"
          - "@vitest/*"
          - "jsdom"
      linting:
        patterns:
          - "eslint"
          - "@typescript-eslint/*"
          - "prettier"

    # Ignore specific updates
    ignore:
      - dependency-name: "node"
        update-types: ["version-update:semver-major"]
      - dependency-name: "@types/node"
        update-types: ["version-update:semver-major"]

  # Enable version updates for GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "ci"
    labels:
      - "github-actions"
      - "automated"
```

#### Update Automation

```typescript
// scripts/update-dependencies.ts
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import semver from "semver";

interface UpdateStrategy {
  major: "auto" | "manual" | "skip";
  minor: "auto" | "manual";
  patch: "auto";
}

class DependencyUpdater {
  private updateStrategy: UpdateStrategy = {
    major: "manual",
    minor: "auto",
    patch: "auto"
  };

  /**
   * Update dependencies based on strategy
   */
  async updateDependencies(dryRun: boolean = false): Promise<void> {
    console.log("🔄 Updating dependencies...");

    if (dryRun) {
      console.log("🔍 Dry run mode - no changes will be made");
    }

    try {
      // Get outdated packages
      const outdated = await this.getOutdatedPackages();

      // Filter based on update strategy
      const toUpdate = this.filterUpdates(outdated);

      if (toUpdate.length === 0) {
        console.log("✅ No updates needed");
        return;
      }

      console.log(`📦 Updating ${toUpdate.length} packages:`);
      toUpdate.forEach((pkg) => {
        console.log(`  ${pkg.name}: ${pkg.current} → ${pkg.target}`);
      });

      if (!dryRun) {
        // Perform updates
        await this.performUpdates(toUpdate);

        // Run tests after updates
        await this.runTests();

        // Update lockfile
        await this.updateLockfile();

        console.log("✅ Dependencies updated successfully");
      }
    } catch (error) {
      console.error("❌ Failed to update dependencies:", error);
      throw error;
    }
  }

  private async getOutdatedPackages(): Promise<any[]> {
    const output = execSync("bun outdated --json", { encoding: "utf-8" });
    return JSON.parse(output);
  }

  private filterUpdates(outdated: any[]): any[] {
    return outdated
      .filter((pkg) => {
        const currentVersion = pkg.current;
        const latestVersion = pkg.latest;

        const diff = semver.diff(currentVersion, latestVersion);

        switch (diff) {
          case "major":
            return this.updateStrategy.major === "auto";
          case "minor":
            return this.updateStrategy.minor === "auto";
          case "patch":
            return this.updateStrategy.patch === "auto";
          default:
            return false;
        }
      })
      .map((pkg) => ({
        ...pkg,
        target: this.getTargetVersion(pkg)
      }));
  }

  private getTargetVersion(pkg: any): string {
    const currentVersion = pkg.current;
    const latestVersion = pkg.latest;

    const diff = semver.diff(currentVersion, latestVersion);

    switch (diff) {
      case "major":
        return this.updateStrategy.major === "auto" ? latestVersion : pkg.wanted;
      case "minor":
        return this.updateStrategy.minor === "auto" ? latestVersion : pkg.wanted;
      case "patch":
        return latestVersion;
      default:
        return currentVersion;
    }
  }

  private async performUpdates(packages: any[]): Promise<void> {
    for (const pkg of packages) {
      console.log(`📦 Updating ${pkg.name} to ${pkg.target}`);
      execSync(`bun add ${pkg.name}@${pkg.target}`, { stdio: "inherit" });
    }
  }

  private async runTests(): Promise<void> {
    console.log("🧪 Running tests after updates...");
    try {
      execSync("bun test", { stdio: "inherit" });
      console.log("✅ Tests passed");
    } catch (error) {
      console.error("❌ Tests failed after updates");
      throw error;
    }
  }

  private async updateLockfile(): Promise<void> {
    console.log("🔒 Updating lockfile...");
    execSync("bun install", { stdio: "inherit" });
  }

  /**
   * Create update report
   */
  async createUpdateReport(): Promise<void> {
    const outdated = await this.getOutdatedPackages();
    const toUpdate = this.filterUpdates(outdated);

    const report = {
      timestamp: new Date().toISOString(),
      total: outdated.length,
      autoUpdate: toUpdate.length,
      manualReview: outdated.length - toUpdate.length,
      packages: {
        autoUpdate: toUpdate,
        manualReview: outdated.filter((pkg) => !toUpdate.includes(pkg))
      }
    };

    writeFileSync(join(process.cwd(), "dependency-update-report.json"), JSON.stringify(report, null, 2));

    console.log("📊 Update report created: dependency-update-report.json");
  }
}

// CLI interface
if (require.main === module) {
  const updater = new DependencyUpdater();

  const command = process.argv[2];
  const dryRun = process.argv.includes("--dry-run");

  switch (command) {
    case "update":
      updater.updateDependencies(dryRun);
      break;
    case "report":
      updater.createUpdateReport();
      break;
    default:
      console.log("Usage: bun run update-dependencies.ts [update|report] [--dry-run]");
  }
}

export { DependencyUpdater };
```

## 🔄 Version Control Workflows

### Git Configuration

#### Git Hooks

```sh
#!/bin/sh
# .husky/pre-commit
. "$(dirname "$0")/_/husky.sh"

# Run linting and formatting
bun run lint:fix
bun run format

# Run type checking
bun run type-check

# Run tests on staged files
bun run test:staged

# Check for secrets
bun run security:check-secrets

# Add formatted files back to staging
git add .
```

```sh
#!/bin/sh
# .husky/commit-msg
. "$(dirname "$0")/_/husky.sh"

# Validate commit message format
bun run scripts/validate-commit-msg.ts "$1"
```

```sh
#!/bin/sh
# .husky/pre-push
. "$(dirname "$0")/_/husky.sh"

# Run full test suite
bun run test

# Run security audit
bun run security:audit

# Check bundle size
bun run build:check-size
```

#### Commit Message Validation

```typescript
// scripts/validate-commit-msg.ts
import { readFileSync } from "fs";

interface CommitMessageConfig {
  types: string[];
  scopes: string[];
  maxLength: number;
  minLength: number;
}

const config: CommitMessageConfig = {
  types: [
    "feat", // New feature
    "fix", // Bug fix
    "docs", // Documentation
    "style", // Formatting, missing semi colons, etc
    "refactor", // Code change that neither fixes a bug nor adds a feature
    "perf", // Performance improvement
    "test", // Adding missing tests
    "chore", // Maintain
    "ci", // CI/CD changes
    "build", // Build system changes
    "revert" // Revert previous commit
  ],
  scopes: ["core", "ui", "api", "auth", "config", "deps", "docs", "test", "ci", "release"],
  maxLength: 100,
  minLength: 10
};

class CommitMessageValidator {
  private commitMsgPattern = /^(\w+)(\(([\w-]+)\))?: (.{1,})$/;
  private breakingChangePattern = /^(\w+)(\(([\w-]+)\))?!: (.{1,})$/;

  validate(message: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const trimmedMessage = message.trim();

    // Check length
    if (trimmedMessage.length < config.minLength) {
      errors.push(`Commit message too short (minimum ${config.minLength} characters)`);
    }

    if (trimmedMessage.length > config.maxLength) {
      errors.push(`Commit message too long (maximum ${config.maxLength} characters)`);
    }

    // Check format
    const isBreakingChange = this.breakingChangePattern.test(trimmedMessage);
    const isNormalCommit = this.commitMsgPattern.test(trimmedMessage);

    if (!isBreakingChange && !isNormalCommit) {
      errors.push(
        "Commit message format is invalid. Expected: type(scope): description or type!: description for breaking changes"
      );
      return { valid: false, errors };
    }

    // Extract parts
    const match = trimmedMessage.match(isBreakingChange ? this.breakingChangePattern : this.commitMsgPattern);
    if (!match) {
      errors.push("Failed to parse commit message");
      return { valid: false, errors };
    }

    const [, type, , scope, description] = match;

    // Validate type
    if (!config.types.includes(type)) {
      errors.push(`Invalid commit type '${type}'. Allowed types: ${config.types.join(", ")}`);
    }

    // Validate scope (if provided)
    if (scope && !config.scopes.includes(scope)) {
      errors.push(`Invalid scope '${scope}'. Allowed scopes: ${config.scopes.join(", ")}`);
    }

    // Validate description
    if (!description || description.trim().length === 0) {
      errors.push("Commit description is required");
    } else {
      // Description should start with lowercase
      if (description[0] !== description[0].toLowerCase()) {
        errors.push("Commit description should start with lowercase letter");
      }

      // Description should not end with period
      if (description.endsWith(".")) {
        errors.push("Commit description should not end with period");
      }
    }

    return { valid: errors.length === 0, errors };
  }

  getExamples(): string[] {
    return [
      "feat(auth): add OAuth2 authentication",
      "fix(api): resolve timeout issue in user endpoint",
      "docs(readme): update installation instructions",
      "style(ui): fix button alignment",
      "refactor(core): simplify error handling logic",
      "perf(api): optimize database queries",
      "test(auth): add unit tests for login flow",
      "chore(deps): update dependencies",
      "ci(github): add automated testing workflow",
      "feat!: remove deprecated API endpoints"
    ];
  }
}

// CLI interface
if (require.main === module) {
  const commitMsgFile = process.argv[2];

  if (!commitMsgFile) {
    console.error("Usage: validate-commit-msg.ts <commit-msg-file>");
    process.exit(1);
  }

  try {
    const commitMessage = readFileSync(commitMsgFile, "utf-8");
    const validator = new CommitMessageValidator();
    const result = validator.validate(commitMessage);

    if (result.valid) {
      console.log("✅ Commit message is valid");
      process.exit(0);
    } else {
      console.error("❌ Commit message validation failed:");
      result.errors.forEach((error) => console.error(`  - ${error}`));

      console.log("\n📝 Examples of valid commit messages:");
      validator.getExamples().forEach((example) => console.log(`  ${example}`));

      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Failed to validate commit message:", error);
    process.exit(1);
  }
}

export { CommitMessageValidator };
```

### Branch Protection

#### GitHub Branch Protection Rules

```typescript
// scripts/setup-branch-protection.ts
import { Octokit } from "@octokit/rest";

interface BranchProtectionConfig {
  branch: string;
  protection: {
    required_status_checks: {
      strict: boolean;
      contexts: string[];
    };
    enforce_admins: boolean;
    required_pull_request_reviews: {
      required_approving_review_count: number;
      dismiss_stale_reviews: boolean;
      require_code_owner_reviews: boolean;
      require_last_push_approval: boolean;
    };
    restrictions: {
      users: string[];
      teams: string[];
      apps: string[];
    } | null;
    allow_force_pushes: boolean;
    allow_deletions: boolean;
    block_creations: boolean;
  };
}

class BranchProtectionManager {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(token: string, owner: string, repo: string) {
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.repo = repo;
  }

  async setupBranchProtection(): Promise<void> {
    const configs: BranchProtectionConfig[] = [
      {
        branch: "main",
        protection: {
          required_status_checks: {
            strict: true,
            contexts: ["ci/lint", "ci/test", "ci/build", "ci/security-scan", "ci/type-check"]
          },
          enforce_admins: true,
          required_pull_request_reviews: {
            required_approving_review_count: 2,
            dismiss_stale_reviews: true,
            require_code_owner_reviews: true,
            require_last_push_approval: true
          },
          restrictions: null,
          allow_force_pushes: false,
          allow_deletions: false,
          block_creations: false
        }
      },
      {
        branch: "develop",
        protection: {
          required_status_checks: {
            strict: true,
            contexts: ["ci/lint", "ci/test", "ci/build"]
          },
          enforce_admins: false,
          required_pull_request_reviews: {
            required_approving_review_count: 1,
            dismiss_stale_reviews: true,
            require_code_owner_reviews: false,
            require_last_push_approval: false
          },
          restrictions: null,
          allow_force_pushes: false,
          allow_deletions: false,
          block_creations: false
        }
      }
    ];

    for (const config of configs) {
      await this.protectBranch(config);
    }
  }

  private async protectBranch(config: BranchProtectionConfig): Promise<void> {
    try {
      console.log(`🔒 Setting up protection for branch: ${config.branch}`);

      await this.octokit.repos.updateBranchProtection({
        owner: this.owner,
        repo: this.repo,
        branch: config.branch,
        ...config.protection
      });

      console.log(`✅ Branch protection set up for: ${config.branch}`);
    } catch (error) {
      console.error(`❌ Failed to protect branch ${config.branch}:`, error);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || "wemake-ai";
  const repo = process.env.GITHUB_REPO || "raycast-extensions";

  if (!token) {
    console.error("GITHUB_TOKEN environment variable is required");
    process.exit(1);
  }

  const manager = new BranchProtectionManager(token, owner, repo);

  manager
    .setupBranchProtection()
    .then(() => console.log("✅ Branch protection setup completed"))
    .catch((error) => {
      console.error("❌ Branch protection setup failed:", error);
      process.exit(1);
    });
}

export { BranchProtectionManager };
```

## 🔧 Maintenance Procedures

### Regular Maintenance Tasks

#### Maintenance Scheduler

```typescript
// scripts/maintenance-scheduler.ts
import { CronJob } from "cron";
import { DependencyChecker } from "./check-dependencies";
import { SecurityChecker } from "./security-check";
import { PerformanceMonitor } from "./performance-monitor";

interface MaintenanceTask {
  name: string;
  description: string;
  schedule: string; // Cron expression
  handler: () => Promise<void>;
  enabled: boolean;
}

class MaintenanceScheduler {
  private tasks: MaintenanceTask[] = [];
  private jobs: CronJob[] = [];

  constructor() {
    this.setupTasks();
  }

  private setupTasks(): void {
    this.tasks = [
      {
        name: "dependency-check",
        description: "Check for outdated and vulnerable dependencies",
        schedule: "0 9 * * 1", // Every Monday at 9 AM
        handler: this.checkDependencies.bind(this),
        enabled: true
      },
      {
        name: "security-scan",
        description: "Run security vulnerability scan",
        schedule: "0 2 * * *", // Daily at 2 AM
        handler: this.runSecurityScan.bind(this),
        enabled: true
      },
      {
        name: "performance-check",
        description: "Monitor performance metrics",
        schedule: "0 */6 * * *", // Every 6 hours
        handler: this.checkPerformance.bind(this),
        enabled: true
      },
      {
        name: "cleanup-logs",
        description: "Clean up old log files",
        schedule: "0 1 * * 0", // Every Sunday at 1 AM
        handler: this.cleanupLogs.bind(this),
        enabled: true
      },
      {
        name: "backup-data",
        description: "Backup important data",
        schedule: "0 3 * * 0", // Every Sunday at 3 AM
        handler: this.backupData.bind(this),
        enabled: true
      },
      {
        name: "update-docs",
        description: "Check for documentation updates needed",
        schedule: "0 10 * * 5", // Every Friday at 10 AM
        handler: this.checkDocumentation.bind(this),
        enabled: true
      }
    ];
  }

  start(): void {
    console.log("🚀 Starting maintenance scheduler...");

    this.tasks
      .filter((task) => task.enabled)
      .forEach((task) => {
        const job = new CronJob(
          task.schedule,
          async () => {
            console.log(`🔧 Running maintenance task: ${task.name}`);
            try {
              await task.handler();
              console.log(`✅ Completed maintenance task: ${task.name}`);
            } catch (error) {
              console.error(`❌ Failed maintenance task: ${task.name}`, error);
            }
          },
          null,
          true,
          "UTC"
        );

        this.jobs.push(job);
        console.log(`📅 Scheduled task: ${task.name} (${task.schedule})`);
      });

    console.log(`✅ Maintenance scheduler started with ${this.jobs.length} tasks`);
  }

  stop(): void {
    console.log("🛑 Stopping maintenance scheduler...");
    this.jobs.forEach((job) => job.stop());
    this.jobs = [];
    console.log("✅ Maintenance scheduler stopped");
  }

  private async checkDependencies(): Promise<void> {
    const checker = new DependencyChecker();
    await checker.checkOutdated();
    await checker.checkSecurity();
    await checker.checkDuplicates();
  }

  private async runSecurityScan(): Promise<void> {
    const checker = new SecurityChecker();
    await checker.runSecurityAudit();
  }

  private async checkPerformance(): Promise<void> {
    const monitor = new PerformanceMonitor();
    await monitor.collectMetrics();
    await monitor.analyzePerformance();
  }

  private async cleanupLogs(): Promise<void> {
    console.log("🧹 Cleaning up old log files...");
    // Implementation for log cleanup
  }

  private async backupData(): Promise<void> {
    console.log("💾 Backing up important data...");
    // Implementation for data backup
  }

  private async checkDocumentation(): Promise<void> {
    console.log("📚 Checking documentation updates...");
    // Implementation for documentation checks
  }

  listTasks(): void {
    console.log("📋 Scheduled maintenance tasks:");
    this.tasks.forEach((task) => {
      const status = task.enabled ? "✅" : "❌";
      console.log(`  ${status} ${task.name}: ${task.description} (${task.schedule})`);
    });
  }
}

// CLI interface
if (require.main === module) {
  const scheduler = new MaintenanceScheduler();

  const command = process.argv[2];

  switch (command) {
    case "start":
      scheduler.start();
      break;
    case "list":
      scheduler.listTasks();
      break;
    default:
      console.log("Usage: bun run maintenance-scheduler.ts [start|list]");
  }
}

export { MaintenanceScheduler };
```

### Health Monitoring

#### System Health Checker

```typescript
// scripts/health-check.ts
import { execSync } from "child_process";
import { readFileSync, statSync } from "fs";
import { join } from "path";

interface HealthMetric {
  name: string;
  status: "healthy" | "warning" | "critical";
  value?: string | number;
  message?: string;
  threshold?: {
    warning: number;
    critical: number;
  };
}

interface HealthReport {
  timestamp: string;
  overall: "healthy" | "warning" | "critical";
  metrics: HealthMetric[];
  summary: {
    healthy: number;
    warning: number;
    critical: number;
  };
}

class HealthChecker {
  private metrics: HealthMetric[] = [];

  async checkHealth(): Promise<HealthReport> {
    console.log("🏥 Running health check...");

    this.metrics = [];

    // Check various system aspects
    await this.checkDiskSpace();
    await this.checkMemoryUsage();
    await this.checkDependencies();
    await this.checkBuildStatus();
    await this.checkTestStatus();
    await this.checkSecurityStatus();
    await this.checkPerformance();

    const summary = this.generateSummary();
    const overall = this.determineOverallHealth(summary);

    const report: HealthReport = {
      timestamp: new Date().toISOString(),
      overall,
      metrics: this.metrics,
      summary
    };

    this.printReport(report);
    return report;
  }

  private async checkDiskSpace(): Promise<void> {
    try {
      const output = execSync("df -h .", { encoding: "utf-8" });
      const lines = output.split("\n");
      const dataLine = lines[1];
      const usage = parseInt(dataLine.split(/\s+/)[4].replace("%", ""));

      this.metrics.push({
        name: "Disk Space",
        status: usage > 90 ? "critical" : usage > 80 ? "warning" : "healthy",
        value: `${usage}%`,
        threshold: { warning: 80, critical: 90 }
      });
    } catch (error) {
      this.metrics.push({
        name: "Disk Space",
        status: "critical",
        message: "Failed to check disk space"
      });
    }
  }

  private async checkMemoryUsage(): Promise<void> {
    try {
      const output = execSync("free -m", { encoding: "utf-8" });
      const lines = output.split("\n");
      const memLine = lines[1];
      const [, total, used] = memLine.split(/\s+/).map(Number);
      const usage = Math.round((used / total) * 100);

      this.metrics.push({
        name: "Memory Usage",
        status: usage > 90 ? "critical" : usage > 80 ? "warning" : "healthy",
        value: `${usage}%`,
        threshold: { warning: 80, critical: 90 }
      });
    } catch (error) {
      // Memory check might not work on all systems
      this.metrics.push({
        name: "Memory Usage",
        status: "warning",
        message: "Memory check not available on this system"
      });
    }
  }

  private async checkDependencies(): Promise<void> {
    try {
      execSync("bun audit --audit-level moderate", { stdio: "pipe" });
      this.metrics.push({
        name: "Dependencies Security",
        status: "healthy",
        message: "No security vulnerabilities found"
      });
    } catch (error) {
      this.metrics.push({
        name: "Dependencies Security",
        status: "critical",
        message: "Security vulnerabilities detected"
      });
    }
  }

  private async checkBuildStatus(): Promise<void> {
    try {
      execSync("bun run build", { stdio: "pipe" });
      this.metrics.push({
        name: "Build Status",
        status: "healthy",
        message: "Build successful"
      });
    } catch (error) {
      this.metrics.push({
        name: "Build Status",
        status: "critical",
        message: "Build failed"
      });
    }
  }

  private async checkTestStatus(): Promise<void> {
    try {
      const output = execSync("bun test --reporter=json", { encoding: "utf-8" });
      const results = JSON.parse(output);

      if (results.success) {
        this.metrics.push({
          name: "Test Status",
          status: "healthy",
          value: `${results.numPassedTests}/${results.numTotalTests} passed`
        });
      } else {
        this.metrics.push({
          name: "Test Status",
          status: "critical",
          value: `${results.numFailedTests} failed`
        });
      }
    } catch (error) {
      this.metrics.push({
        name: "Test Status",
        status: "critical",
        message: "Tests failed to run"
      });
    }
  }

  private async checkSecurityStatus(): Promise<void> {
    try {
      // Check for common security files
      const securityFiles = [".github/dependabot.yml", ".github/workflows/security.yml", ".eslintrc.json"];

      const missingFiles = securityFiles.filter((file) => {
        try {
          statSync(join(process.cwd(), file));
          return false;
        } catch {
          return true;
        }
      });

      if (missingFiles.length === 0) {
        this.metrics.push({
          name: "Security Configuration",
          status: "healthy",
          message: "All security files present"
        });
      } else {
        this.metrics.push({
          name: "Security Configuration",
          status: "warning",
          message: `Missing files: ${missingFiles.join(", ")}`
        });
      }
    } catch (error) {
      this.metrics.push({
        name: "Security Configuration",
        status: "warning",
        message: "Could not verify security configuration"
      });
    }
  }

  private async checkPerformance(): Promise<void> {
    try {
      const startTime = Date.now();
      execSync("bun run type-check", { stdio: "pipe" });
      const duration = Date.now() - startTime;

      this.metrics.push({
        name: "Type Check Performance",
        status: duration > 30000 ? "warning" : "healthy",
        value: `${duration}ms`,
        threshold: { warning: 30000, critical: 60000 }
      });
    } catch (error) {
      this.metrics.push({
        name: "Type Check Performance",
        status: "critical",
        message: "Type check failed"
      });
    }
  }

  private generateSummary() {
    return this.metrics.reduce(
      (acc, metric) => {
        acc[metric.status]++;
        return acc;
      },
      { healthy: 0, warning: 0, critical: 0 }
    );
  }

  private determineOverallHealth(summary: { healthy: number; warning: number; critical: number }) {
    if (summary.critical > 0) return "critical";
    if (summary.warning > 0) return "warning";
    return "healthy";
  }

  private printReport(report: HealthReport): void {
    const statusIcon = {
      healthy: "✅",
      warning: "⚠️",
      critical: "❌"
    };

    console.log(`\n${statusIcon[report.overall]} Overall Health: ${report.overall.toUpperCase()}`);
    console.log(
      `📊 Summary: ${report.summary.healthy} healthy, ${report.summary.warning} warnings, ${report.summary.critical} critical\n`
    );

    report.metrics.forEach((metric) => {
      const icon = statusIcon[metric.status];
      const value = metric.value ? ` (${metric.value})` : "";
      const message = metric.message ? ` - ${metric.message}` : "";
      console.log(`${icon} ${metric.name}${value}${message}`);
    });
  }
}

// CLI interface
if (require.main === module) {
  const checker = new HealthChecker();

  checker
    .checkHealth()
    .then((report) => {
      if (report.overall === "critical") {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("❌ Health check failed:", error);
      process.exit(1);
    });
}

export { HealthChecker };
```

### Performance Monitoring

```typescript
// scripts/performance-monitor.ts
import { execSync } from "child_process";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  threshold?: {
    warning: number;
    critical: number;
  };
}

interface PerformanceReport {
  timestamp: string;
  metrics: PerformanceMetric[];
  trends: {
    improving: string[];
    degrading: string[];
    stable: string[];
  };
}

class PerformanceMonitor {
  private metricsFile = join(process.cwd(), "performance-metrics.json");
  private currentMetrics: PerformanceMetric[] = [];

  async collectMetrics(): Promise<PerformanceMetric[]> {
    console.log("📊 Collecting performance metrics...");

    this.currentMetrics = [];

    await this.measureBuildTime();
    await this.measureTestTime();
    await this.measureLintTime();
    await this.measureBundleSize();
    await this.measureTypeCheckTime();

    return this.currentMetrics;
  }

  private async measureBuildTime(): Promise<void> {
    const startTime = Date.now();
    try {
      execSync("bun run build", { stdio: "pipe" });
      const duration = Date.now() - startTime;

      this.currentMetrics.push({
        name: "Build Time",
        value: duration,
        unit: "ms",
        timestamp: new Date().toISOString(),
        threshold: { warning: 60000, critical: 120000 }
      });
    } catch (error) {
      console.error("❌ Build failed during performance measurement");
    }
  }

  private async measureTestTime(): Promise<void> {
    const startTime = Date.now();
    try {
      execSync("bun test", { stdio: "pipe" });
      const duration = Date.now() - startTime;

      this.currentMetrics.push({
        name: "Test Time",
        value: duration,
        unit: "ms",
        timestamp: new Date().toISOString(),
        threshold: { warning: 30000, critical: 60000 }
      });
    } catch (error) {
      console.error("❌ Tests failed during performance measurement");
    }
  }

  private async measureLintTime(): Promise<void> {
    const startTime = Date.now();
    try {
      execSync("bun run lint", { stdio: "pipe" });
      const duration = Date.now() - startTime;

      this.currentMetrics.push({
        name: "Lint Time",
        value: duration,
        unit: "ms",
        timestamp: new Date().toISOString(),
        threshold: { warning: 15000, critical: 30000 }
      });
    } catch (error) {
      console.error("❌ Linting failed during performance measurement");
    }
  }

  private async measureBundleSize(): Promise<void> {
    try {
      // Measure bundle sizes for each app
      const apps = ["ai-assistant", "productivity-tools", "developer-utils"];

      for (const app of apps) {
        try {
          const bundlePath = join(process.cwd(), "dist", "apps", app);
          const output = execSync(`du -sb ${bundlePath}`, { encoding: "utf-8" });
          const size = parseInt(output.split("\t")[0]);

          this.currentMetrics.push({
            name: `Bundle Size (${app})`,
            value: size,
            unit: "bytes",
            timestamp: new Date().toISOString(),
            threshold: { warning: 5000000, critical: 10000000 } // 5MB warning, 10MB critical
          });
        } catch (error) {
          console.warn(`⚠️  Could not measure bundle size for ${app}`);
        }
      }
    } catch (error) {
      console.error("❌ Failed to measure bundle sizes");
    }
  }

  private async measureTypeCheckTime(): Promise<void> {
    const startTime = Date.now();
    try {
      execSync("bun run type-check", { stdio: "pipe" });
      const duration = Date.now() - startTime;

      this.currentMetrics.push({
        name: "Type Check Time",
        value: duration,
        unit: "ms",
        timestamp: new Date().toISOString(),
        threshold: { warning: 20000, critical: 40000 }
      });
    } catch (error) {
      console.error("❌ Type check failed during performance measurement");
    }
  }

  async analyzePerformance(): Promise<PerformanceReport> {
    console.log("📈 Analyzing performance trends...");

    const historicalData = this.loadHistoricalData();
    const trends = this.analyzeTrends(historicalData, this.currentMetrics);

    const report: PerformanceReport = {
      timestamp: new Date().toISOString(),
      metrics: this.currentMetrics,
      trends
    };

    // Save current metrics to historical data
    this.saveMetrics([...historicalData, ...this.currentMetrics]);

    this.printPerformanceReport(report);
    return report;
  }

  private loadHistoricalData(): PerformanceMetric[] {
    try {
      const data = readFileSync(this.metricsFile, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private saveMetrics(metrics: PerformanceMetric[]): void {
    // Keep only last 100 measurements per metric
    const grouped = metrics.reduce(
      (acc, metric) => {
        if (!acc[metric.name]) acc[metric.name] = [];
        acc[metric.name].push(metric);
        return acc;
      },
      {} as Record<string, PerformanceMetric[]>
    );

    const trimmed = Object.values(grouped)
      .map((group) => group.slice(-100))
      .flat();

    writeFileSync(this.metricsFile, JSON.stringify(trimmed, null, 2));
  }

  private analyzeTrends(historical: PerformanceMetric[], current: PerformanceMetric[]) {
    const trends = {
      improving: [] as string[],
      degrading: [] as string[],
      stable: [] as string[]
    };

    current.forEach((currentMetric) => {
      const historicalForMetric = historical.filter((m) => m.name === currentMetric.name).slice(-10); // Last 10 measurements

      if (historicalForMetric.length < 3) {
        trends.stable.push(currentMetric.name);
        return;
      }

      const average = historicalForMetric.reduce((sum, m) => sum + m.value, 0) / historicalForMetric.length;
      const changePercent = ((currentMetric.value - average) / average) * 100;

      if (changePercent > 10) {
        trends.degrading.push(currentMetric.name);
      } else if (changePercent < -10) {
        trends.improving.push(currentMetric.name);
      } else {
        trends.stable.push(currentMetric.name);
      }
    });

    return trends;
  }

  private printPerformanceReport(report: PerformanceReport): void {
    console.log("\n📊 Performance Report");
    console.log("=".repeat(50));

    report.metrics.forEach((metric) => {
      const value = metric.unit === "bytes" ? this.formatBytes(metric.value) : `${metric.value}${metric.unit}`;

      let status = "✅";
      if (metric.threshold) {
        if (metric.value > metric.threshold.critical) status = "❌";
        else if (metric.value > metric.threshold.warning) status = "⚠️";
      }

      console.log(`${status} ${metric.name}: ${value}`);
    });

    console.log("\n📈 Trends:");
    if (report.trends.improving.length > 0) {
      console.log(`📈 Improving: ${report.trends.improving.join(", ")}`);
    }
    if (report.trends.degrading.length > 0) {
      console.log(`📉 Degrading: ${report.trends.degrading.join(", ")}`);
    }
    if (report.trends.stable.length > 0) {
      console.log(`➡️  Stable: ${report.trends.stable.join(", ")}`);
    }
  }

  private formatBytes(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  }
}

// CLI interface
if (require.main === module) {
  const monitor = new PerformanceMonitor();

  async function runMonitoring() {
    await monitor.collectMetrics();
    await monitor.analyzePerformance();
  }

  runMonitoring().catch((error) => {
    console.error("❌ Performance monitoring failed:", error);
    process.exit(1);
  });
}

export { PerformanceMonitor };
```

## 🚀 Quick Commands

### Development Commands

```sh
# Code Quality
bun run lint              # Run ESLint
bun run lint:fix          # Fix ESLint issues
bun run format            # Format with Prettier
bun run type-check        # TypeScript type checking

# Testing
bun test                  # Run all tests
bun test:watch            # Run tests in watch mode
bun test:coverage         # Run tests with coverage
bun test:e2e              # Run end-to-end tests

# Building
bun run build             # Build all projects
bun run build:affected    # Build affected projects
bun run build:prod        # Production build

# Security
bun run security:audit    # Security audit
bun run security:check    # Check for vulnerabilities
bun run deps:check        # Check dependencies

# Maintenance
bun run health:check      # System health check
bun run perf:monitor      # Performance monitoring
bun run maintenance:run   # Run maintenance tasks

# Documentation
bun run docs:build        # Build documentation
bun run docs:serve        # Serve documentation locally
bun run docs:deploy       # Deploy documentation
```

### CI/CD Commands

```sh
# CI Pipeline
bun run ci:lint           # CI linting
bun run ci:test           # CI testing
bun run ci:build          # CI building
bun run ci:security       # CI security scan

# Deployment
bun run deploy:staging    # Deploy to staging
bun run deploy:prod       # Deploy to production
bun run deploy:rollback   # Rollback deployment

# Release
bun run release:prepare   # Prepare release
bun run release:publish   # Publish release
bun run release:notes     # Generate release notes
```

## 📚 Resources

### Documentation Links

- [Raycast Extensions API](https://developers.raycast.com/)
- [Nx Monorepo Guide](https://nx.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Testing Framework](https://vitest.dev/)
- [ESLint Configuration](https://eslint.org/docs/)
- [Prettier Code Formatting](https://prettier.io/docs/)

### Best Practices

1. **Code Quality**: Maintain high code quality standards with automated linting, formatting, and type checking
2. **Security**: Implement comprehensive security practices including dependency scanning and secrets management
3. **Testing**: Ensure thorough test coverage with unit, integration, and end-to-end tests
4. **Performance**: Monitor and optimize performance regularly
5. **Documentation**: Keep documentation up-to-date and comprehensive
6. **Automation**: Automate repetitive tasks and maintenance procedures
7. **Monitoring**: Implement continuous monitoring and alerting
8. **Collaboration**: Use proper version control workflows and code review processes

---

_This guide provides comprehensive DevOps practices and maintenance procedures for the WeMake AI Raycast Extensions
monorepo. Regular updates and improvements to these practices ensure sustainable development and high-quality
deliverables._
