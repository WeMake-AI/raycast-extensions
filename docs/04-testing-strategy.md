# Testing Strategy & Implementation Guide

## 🎯 Overview

This guide outlines our comprehensive testing strategy for WeMake AI Raycast extensions, covering unit testing,
integration testing, extension-specific testing patterns, and automated testing within our Nx workspace using Vitest.

## 🧪 Testing Philosophy

### Core Principles

1. **Test Pyramid**: Focus on unit tests, supported by integration tests, with minimal E2E tests
2. **Fast Feedback**: Tests should run quickly to enable rapid development cycles
3. **Reliable**: Tests should be deterministic and not flaky
4. **Maintainable**: Tests should be easy to read, write, and maintain
5. **Comprehensive**: Critical paths and edge cases should be covered

### Testing Levels

```
    /\     E2E Tests (Few)
   /  \    - Extension workflows
  /    \   - User journeys
 /______\
/        \ Integration Tests (Some)
\        / - API integrations
 \______/  - Component interactions
  \    /
   \  /    Unit Tests (Many)
    \/     - Functions, hooks, utilities
           - Component logic
```

## ⚙️ Vitest Configuration

### Workspace Configuration

```typescript
// vitest.config.ts (root)
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test-setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "**/*.d.ts", "**/*.config.*", "**/coverage/**"],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    testTimeout: 10000,
    hookTimeout: 10000
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@raycast/api": path.resolve(__dirname, "./test/mocks/raycast-api.ts")
    }
  }
});
```

### Test Setup

```typescript
// test-setup.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Raycast API
vi.mock("@raycast/api", () => ({
  ActionPanel: ({ children }: any) => children,
  Action: ({ title, onAction }: any) => ({ title, onAction }),
  List: ({ children, isLoading }: any) => ({ children, isLoading }),
  Detail: ({ markdown, metadata }: any) => ({ markdown, metadata }),
  Form: ({ children, actions }: any) => ({ children, actions }),
  showToast: vi.fn(),
  Toast: {
    Style: {
      Success: "success",
      Failure: "failure",
      Animated: "animated"
    }
  },
  LocalStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  getPreferenceValues: vi.fn(() => ({
    apiKey: "test-api-key",
    model: "gpt-4"
  })),
  Icon: {
    Document: "document",
    Link: "link",
    Plus: "plus",
    Trash: "trash"
  }
}));

// Mock fetch globally
global.fetch = vi.fn();

// Setup console mocks
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn()
};
```

### Extension-Specific Configuration

```typescript
// src/my-extension/vitest.config.ts
import { defineConfig } from "vitest/config";
import baseConfig from "../../vitest.config";

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    include: ["src/**/*.{test,spec}.{js,ts,tsx}"],
    exclude: ["node_modules/", "dist/"]
  }
});
```

## 🔧 Testing Utilities

### Raycast API Mocks

```typescript
// test/mocks/raycast-api.ts
import { vi } from "vitest";

export const mockShowToast = vi.fn();
export const mockGetPreferenceValues = vi.fn();
export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

export const ActionPanel = ({ children }: any) => children;
export const Action = {
  OpenInBrowser: ({ url }: any) => ({ type: "open-browser", url }),
  CopyToClipboard: ({ content }: any) => ({ type: "copy", content }),
  SubmitForm: ({ onSubmit }: any) => ({ type: "submit", onSubmit })
};

export const List = ({ children, isLoading, searchBarPlaceholder }: any) => ({
  type: "list",
  children,
  isLoading,
  searchBarPlaceholder
});

List.Item = ({ title, subtitle, icon, accessories, actions }: any) => ({
  type: "list-item",
  title,
  subtitle,
  icon,
  accessories,
  actions
});

List.Section = ({ title, children }: any) => ({
  type: "list-section",
  title,
  children
});

export const Detail = ({ markdown, metadata, actions }: any) => ({
  type: "detail",
  markdown,
  metadata,
  actions
});

Detail.Metadata = ({ children }: any) => ({ type: "metadata", children });
Detail.Metadata.Label = ({ title, text }: any) => ({ type: "label", title, text });
Detail.Metadata.Separator = () => ({ type: "separator" });

export const Form = ({ children, actions, isLoading }: any) => ({
  type: "form",
  children,
  actions,
  isLoading
});

Form.TextField = ({ id, title, placeholder, error, onChange, onBlur }: any) => ({
  type: "text-field",
  id,
  title,
  placeholder,
  error,
  onChange,
  onBlur
});

Form.TextArea = ({ id, title, placeholder, error, onChange }: any) => ({
  type: "text-area",
  id,
  title,
  placeholder,
  error,
  onChange
});

Form.Dropdown = ({ id, title, children }: any) => ({
  type: "dropdown",
  id,
  title,
  children
});

Form.Dropdown.Item = ({ value, title }: any) => ({
  type: "dropdown-item",
  value,
  title
});

export const showToast = mockShowToast;
export const getPreferenceValues = mockGetPreferenceValues;
export const LocalStorage = mockLocalStorage;

export const Toast = {
  Style: {
    Success: "success",
    Failure: "failure",
    Animated: "animated"
  }
};

export const Icon = {
  Document: "document",
  Link: "link",
  Plus: "plus",
  Trash: "trash",
  Settings: "settings",
  Star: "star",
  Heart: "heart"
};
```

### Test Helpers

```typescript
// test/helpers/index.ts
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import { vi } from "vitest";

// Custom render function
export function renderComponent(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, {
    ...options
  });
}

// Mock API response helper
export function mockApiResponse<T>(data: T, delay = 0) {
  return vi.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        setTimeout(() => resolve({ ok: true, json: () => Promise.resolve(data) }), delay);
      })
  );
}

// Mock API error helper
export function mockApiError(message: string, status = 500) {
  return vi.fn().mockRejectedValue(new Error(message));
}

// Create mock preferences
export function createMockPreferences(overrides = {}) {
  return {
    apiKey: "test-api-key",
    model: "gpt-4",
    timeout: 5000,
    ...overrides
  };
}

// Wait for async operations
export function waitForAsync(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Mock localStorage
export function createMockLocalStorage() {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    })
  };
}
```

## 🧩 Unit Testing Patterns

### Testing Utility Functions

```typescript
// src/utils/__tests__/helpers.test.ts
import { describe, it, expect } from "vitest";
import { formatDate, validateEmail, debounce } from "../helpers";

describe("helpers", () => {
  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      expect(formatDate(date)).toBe("Jan 15, 2024");
    });

    it("handles invalid date", () => {
      expect(formatDate(new Date("invalid"))).toBe("Invalid Date");
    });
  });

  describe("validateEmail", () => {
    it("validates correct email", () => {
      expect(validateEmail("test@example.com")).toBe(true);
    });

    it("rejects invalid email", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });
  });

  describe("debounce", () => {
    it("debounces function calls", async () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(fn).not.toHaveBeenCalled();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
```

### Testing Custom Hooks

```typescript
// src/hooks/__tests__/useAPI.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAPI } from "../useAPI";
import { mockApiResponse, mockApiError } from "../../../test/helpers";

describe("useAPI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches data successfully", async () => {
    const testData = { id: 1, name: "Test Item" };
    const mockFetcher = mockApiResponse(testData);

    const { result } = renderHook(() => useAPI(mockFetcher));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(testData);
    expect(result.current.error).toBe(null);
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  it("handles API errors", async () => {
    const errorMessage = "API Error";
    const mockFetcher = mockApiError(errorMessage);

    const { result } = renderHook(() => useAPI(mockFetcher));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
  });

  it("refetches data when refetch is called", async () => {
    const testData = { id: 1, name: "Test Item" };
    const mockFetcher = mockApiResponse(testData);

    const { result } = renderHook(() => useAPI(mockFetcher));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetcher).toHaveBeenCalledTimes(1);

    // Trigger refetch
    result.current.refetch();

    await waitFor(() => {
      expect(mockFetcher).toHaveBeenCalledTimes(2);
    });
  });
});
```

### Testing Local Storage Hook

```typescript
// src/hooks/__tests__/useStorage.test.ts
import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useStorage } from "../useStorage";
import { createMockLocalStorage } from "../../../test/helpers";

const mockLocalStorage = createMockLocalStorage();

vi.mock("@raycast/api", () => ({
  LocalStorage: mockLocalStorage
}));

describe("useStorage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads initial value from storage", async () => {
    const testData = { name: "Test" };
    mockLocalStorage.getItem.mockResolvedValue(JSON.stringify(testData));

    const { result } = renderHook(() => useStorage("test-key", {}));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.value).toEqual(testData);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("test-key");
  });

  it("uses default value when storage is empty", async () => {
    const defaultValue = { name: "Default" };
    mockLocalStorage.getItem.mockResolvedValue(null);

    const { result } = renderHook(() => useStorage("test-key", defaultValue));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.value).toEqual(defaultValue);
  });

  it("updates value and saves to storage", async () => {
    const initialValue = { name: "Initial" };
    const newValue = { name: "Updated" };

    mockLocalStorage.getItem.mockResolvedValue(JSON.stringify(initialValue));

    const { result } = renderHook(() => useStorage("test-key", {}));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateValue(newValue);
    });

    expect(result.current.value).toEqual(newValue);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("test-key", JSON.stringify(newValue));
  });
});
```

## 🧱 Component Testing

### Testing List Components

```typescript
// src/components/__tests__/ItemList.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ItemList } from '../ItemList';
import { renderComponent } from '../../../test/helpers';

const mockItems = [
  {
    id: '1',
    title: 'Item 1',
    subtitle: 'Subtitle 1',
    url: 'https://example.com/1',
  },
  {
    id: '2',
    title: 'Item 2',
    subtitle: 'Subtitle 2',
    url: 'https://example.com/2',
  },
];

describe('ItemList', () => {
  it('renders items correctly', () => {
    const { container } = renderComponent(
      <ItemList items={mockItems} isLoading={false} />
    );

    expect(container).toMatchSnapshot();
  });

  it('shows loading state', () => {
    const { container } = renderComponent(
      <ItemList items={[]} isLoading={true} />
    );

    expect(container.firstChild).toHaveProperty('isLoading', true);
  });

  it('handles empty state', () => {
    const { container } = renderComponent(
      <ItemList items={[]} isLoading={false} />
    );

    expect(container.firstChild).toHaveProperty('children', []);
  });

  it('filters items based on search', () => {
    const onSearchChange = vi.fn();

    renderComponent(
      <ItemList
        items={mockItems}
        isLoading={false}
        onSearchChange={onSearchChange}
      />
    );

    // Simulate search input change
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'Item 1' },
    });

    expect(onSearchChange).toHaveBeenCalledWith('Item 1');
  });
});
```

### Testing Form Components

```typescript
// src/components/__tests__/CreateItemForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateItemForm } from '../CreateItemForm';
import { renderComponent } from '../../../test/helpers';

describe('CreateItemForm', () => {
  it('renders form fields correctly', () => {
    const onSubmit = vi.fn();

    renderComponent(<CreateItemForm onSubmit={onSubmit} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const onSubmit = vi.fn();

    renderComponent(<CreateItemForm onSubmit={onSubmit} />);

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const onSubmit = vi.fn();

    renderComponent(<CreateItemForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test Item' },
    });

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test Description' },
    });

    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'work' },
    });

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Test Item',
        description: 'Test Description',
        category: 'work',
      });
    });
  });
});
```

## 🔗 Integration Testing

### API Integration Tests

```typescript
// src/api/__tests__/client.integration.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { APIClient } from "../client";
import { createMockPreferences } from "../../../test/helpers";

// Mock fetch for integration tests
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("APIClient Integration", () => {
  let client: APIClient;

  beforeEach(() => {
    const preferences = createMockPreferences();
    client = new APIClient(preferences.apiKey);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getItems", () => {
    it("fetches items successfully", async () => {
      const mockResponse = {
        data: [
          { id: "1", title: "Item 1" },
          { id: "2", title: "Item 2" }
        ],
        success: true
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.getItems();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/items"),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer test-api-key"
          })
        })
      );

      expect(result).toEqual(mockResponse.data);
    });

    it("handles API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized"
      });

      await expect(client.getItems()).rejects.toThrow("API Error: 401 Unauthorized");
    });

    it("handles network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(client.getItems()).rejects.toThrow("Network error");
    });
  });

  describe("createItem", () => {
    it("creates item successfully", async () => {
      const newItem = {
        title: "New Item",
        description: "New Description"
      };

      const mockResponse = {
        data: { id: "3", ...newItem },
        success: true
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.createItem(newItem);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/items"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer test-api-key"
          }),
          body: JSON.stringify(newItem)
        })
      );

      expect(result).toEqual(mockResponse.data);
    });
  });
});
```

### AI SDK Integration Tests

```typescript
// src/ai/__tests__/client.integration.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateResponse, streamResponse } from "../client";
import { createMockPreferences } from "../../../test/helpers";

// Mock AI SDK
vi.mock("@ai-sdk/openai", () => ({
  openai: vi.fn(() => "mocked-model")
}));

vi.mock("ai", () => ({
  generateText: vi.fn(),
  streamText: vi.fn()
}));

vi.mock("@raycast/api", () => ({
  getPreferenceValues: vi.fn()
}));

import { generateText, streamText } from "ai";
import { getPreferenceValues } from "@raycast/api";

describe("AI Client Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getPreferenceValues as any).mockReturnValue(createMockPreferences());
  });

  describe("generateResponse", () => {
    it("generates text successfully", async () => {
      const mockResponse = "Generated response";
      (generateText as any).mockResolvedValue({ text: mockResponse });

      const result = await generateResponse("Test prompt");

      expect(generateText).toHaveBeenCalledWith({
        model: "mocked-model",
        prompt: "Test prompt",
        apiKey: "test-api-key"
      });

      expect(result).toBe(mockResponse);
    });

    it("handles AI generation errors", async () => {
      (generateText as any).mockRejectedValue(new Error("AI Error"));

      await expect(generateResponse("Test prompt")).rejects.toThrow("AI generation failed: Error: AI Error");
    });
  });

  describe("streamResponse", () => {
    it("streams text successfully", async () => {
      const mockStream = ["Hello", " ", "World"];
      const mockTextStream = {
        [Symbol.asyncIterator]: async function* () {
          for (const chunk of mockStream) {
            yield chunk;
          }
        }
      };

      (streamText as any).mockResolvedValue({ textStream: mockTextStream });

      const result = [];
      for await (const chunk of streamResponse("Test prompt")) {
        result.push(chunk);
      }

      expect(result).toEqual(mockStream);
    });
  });
});
```

## 🎭 Extension Testing Patterns

### Command Testing

```typescript
// src/__tests__/index.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import Command from '../index';
import { renderComponent, mockApiResponse } from '../../test/helpers';

// Mock the API module
vi.mock('../utils/api', () => ({
  fetchItems: vi.fn(),
}));

import { fetchItems } from '../utils/api';

describe('Main Command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (fetchItems as any).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { container } = renderComponent(<Command />);

    expect(container.firstChild).toHaveProperty('isLoading', true);
  });

  it('renders items after loading', async () => {
    const mockItems = [
      { id: '1', title: 'Item 1', subtitle: 'Subtitle 1' },
      { id: '2', title: 'Item 2', subtitle: 'Subtitle 2' },
    ];

    (fetchItems as any).mockResolvedValue(mockItems);

    const { container } = renderComponent(<Command />);

    // Wait for loading to complete
    await vi.waitFor(() => {
      expect(container.firstChild).toHaveProperty('isLoading', false);
    });

    expect(container.firstChild).toHaveProperty('children');
    expect(container.firstChild.children).toHaveLength(mockItems.length);
  });

  it('handles API errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    (fetchItems as any).mockRejectedValue(new Error('API Error'));

    const { container } = renderComponent(<Command />);

    await vi.waitFor(() => {
      expect(container.firstChild).toHaveProperty('isLoading', false);
    });

    expect(consoleError).toHaveBeenCalledWith(
      'Failed to fetch data:',
      expect.any(Error)
    );

    consoleError.mockRestore();
  });
});
```

### Preference Testing

```typescript
// src/__tests__/preferences.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { validatePreferences, getAPIConfig } from "../utils/preferences";
import { createMockPreferences } from "../../test/helpers";

vi.mock("@raycast/api", () => ({
  getPreferenceValues: vi.fn()
}));

import { getPreferenceValues } from "@raycast/api";

describe("Preferences", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validatePreferences", () => {
    it("validates correct preferences", () => {
      const preferences = createMockPreferences();

      expect(() => validatePreferences(preferences)).not.toThrow();
    });

    it("throws error for missing API key", () => {
      const preferences = createMockPreferences({ apiKey: "" });

      expect(() => validatePreferences(preferences)).toThrow("API key is required");
    });

    it("throws error for invalid model", () => {
      const preferences = createMockPreferences({ model: "invalid-model" });

      expect(() => validatePreferences(preferences)).toThrow("Invalid model selected");
    });
  });

  describe("getAPIConfig", () => {
    it("returns API configuration", () => {
      const preferences = createMockPreferences();
      (getPreferenceValues as any).mockReturnValue(preferences);

      const config = getAPIConfig();

      expect(config).toEqual({
        apiKey: preferences.apiKey,
        model: preferences.model,
        timeout: preferences.timeout,
        baseUrl: expect.any(String)
      });
    });
  });
});
```

## 🤖 Automated Testing

### Nx Test Configuration

```json
// nx.json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "lint", "test", "e2e"]
      }
    }
  },
  "targetDefaults": {
    "test": {
      "executor": "@nx/vite:test",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"]
    }
  }
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "nx run-many --target=test --all",
    "test:watch": "nx run-many --target=test --all --watch",
    "test:coverage": "nx run-many --target=test --all --coverage",
    "test:extension": "nx run",
    "test:ci": "nx run-many --target=test --all --ci --coverage --watchAll=false"
  }
}
```

### GitHub Actions Integration

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Run tests
        run: bun run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: ./coverage
          flags: unittests
          name: codecov-umbrella
```

## 📊 Coverage and Quality

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/coverage/**",
        "**/__tests__/**",
        "**/test/**"
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        // Per-file thresholds
        "src/utils/": {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  }
});
```

### Quality Gates

```sh
#!/bin/bash
# scripts/quality-gate.sh

echo "🔍 Running quality checks..."

# Run tests with coverage
echo "Running tests..."
bun run test:coverage

if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

# Check coverage thresholds
echo "Checking coverage thresholds..."
bun run coverage:check

if [ $? -ne 0 ]; then
  echo "❌ Coverage below threshold"
  exit 1
fi

# Run linting
echo "Running linting..."
bun run lint

if [ $? -ne 0 ]; then
  echo "❌ Linting failed"
  exit 1
fi

# Run type checking
echo "Running type checking..."
bun run type-check

if [ $? -ne 0 ]; then
  echo "❌ Type checking failed"
  exit 1
fi

echo "✅ All quality checks passed!"
```

## 🐛 Debugging Tests

### VS Code Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "name": "Debug Current Test File",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "${relativeFile}"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
```

### Test Debugging Utilities

```typescript
// test/debug.ts
import { vi } from "vitest";

// Debug helper for async operations
export function debugAsync(label: string) {
  return {
    start: () => console.log(`🚀 ${label} started`),
    end: () => console.log(`✅ ${label} completed`),
    error: (error: any) => console.log(`❌ ${label} failed:`, error)
  };
}

// Mock function call tracker
export function createCallTracker() {
  const calls: any[] = [];

  return {
    track: (fn: any) => {
      return vi.fn((...args) => {
        calls.push({ args, timestamp: Date.now() });
        return fn(...args);
      });
    },
    getCalls: () => calls,
    getCallCount: () => calls.length,
    getLastCall: () => calls[calls.length - 1],
    clear: () => calls.splice(0, calls.length)
  };
}

// Test data factory
export function createTestData() {
  return {
    user: (overrides = {}) => ({
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      ...overrides
    }),
    item: (overrides = {}) => ({
      id: "item-1",
      title: "Test Item",
      description: "Test Description",
      status: "active",
      createdAt: "2024-01-01T00:00:00Z",
      ...overrides
    })
  };
}
```

## 📝 Best Practices

### 1. Test Organization

- **Co-location**: Keep tests close to the code they test
- **Descriptive Names**: Use clear, descriptive test names
- **Arrange-Act-Assert**: Structure tests with clear sections
- **Single Responsibility**: Each test should verify one behavior

### 2. Mock Strategy

- **Mock External Dependencies**: Always mock API calls, file system, etc.
- **Minimal Mocking**: Only mock what's necessary for the test
- **Realistic Mocks**: Ensure mocks behave like real implementations
- **Mock Cleanup**: Clear mocks between tests

### 3. Test Data

- **Factories**: Use factory functions for test data creation
- **Minimal Data**: Include only data relevant to the test
- **Realistic Data**: Use realistic but safe test data
- **Data Isolation**: Each test should use independent data

### 4. Async Testing

- **Proper Waiting**: Use proper async/await patterns
- **Timeout Handling**: Set appropriate timeouts for async operations
- **Error Testing**: Test both success and failure scenarios
- **Race Conditions**: Be aware of potential race conditions

### 5. Performance

- **Fast Tests**: Keep tests fast and focused
- **Parallel Execution**: Leverage parallel test execution
- **Resource Cleanup**: Clean up resources after tests
- **Selective Running**: Use test filtering for development

## 🚀 Running Tests

```sh
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage

# Run specific extension tests
bun run test src/my-extension

# Run specific test file
bun run test src/utils/__tests__/helpers.test.ts

# Run tests matching pattern
bun run test --grep="API"

# Run tests in CI mode
bun run test:ci
```

---

**Previous**: [Extension Development Workflow](./03-development-workflow.md) | **Next**:
[CI/CD Pipeline & Deployment](./05-cicd-deployment.md)
