# Extension Development Workflow Documentation

## 🎯 Overview

This guide provides a comprehensive workflow for developing Raycast extensions within the WeMake AI monorepo, covering
everything from project structure to advanced integrations with MCP and AI SDK 5.

## 📁 Extension Structure

### Standard Extension Layout

```
src/my-extension/
├── assets/
│   ├── icon.png              # Extension icon (512x512px)
│   ├── command-icon.png       # Command-specific icons
│   └── screenshots/           # Store screenshots
├── src/
│   ├── index.tsx             # Main command entry point
│   ├── components/           # Reusable React components
│   │   ├── ListItem.tsx
│   │   └── DetailView.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAPI.ts
│   │   └── useStorage.ts
│   ├── utils/               # Utility functions
│   │   ├── api.ts
│   │   └── helpers.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   └── constants/           # Application constants
│       └── index.ts
├── package.json             # Extension configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Extension documentation
```

### Package.json Configuration

```json
{
  "$schema": "https://www.raycast.com/schemas/extension.json",
  "name": "my-extension",
  "title": "My Extension",
  "description": "Brief description of what the extension does",
  "icon": "icon.png",
  "author": "your-github-username",
  "owner": "wemake",
  "categories": ["Productivity"],
  "license": "MIT",
  "commands": [
    {
      "name": "index",
      "title": "Main Command",
      "description": "Primary command description",
      "mode": "view",
      "keywords": ["search", "find"]
    },
    {
      "name": "settings",
      "title": "Settings",
      "description": "Configure extension settings",
      "mode": "view"
    }
  ],
  "preferences": [
    {
      "name": "apiKey",
      "title": "API Key",
      "description": "Your API key",
      "type": "password",
      "required": true
    }
  ],
  "dependencies": {
    "@raycast/api": "^1.102.3",
    "@ai-sdk/openai": "^1.0.0",
    "ai": "^5.0.0"
  },
  "devDependencies": {
    "@raycast/eslint-config": "^1.0.11",
    "@types/node": "20.8.10",
    "@types/react": "18.3.3",
    "eslint": "^8.57.0",
    "prettier": "^3.0.0",
    "typescript": "^5.4.5"
  },
  "scripts": {
    "build": "ray build -e dist",
    "dev": "ray develop",
    "fix-lint": "ray lint --fix",
    "lint": "ray lint",
    "prepublishOnly": "echo \"\\n\\n🚨 Cannot publish extension to npm\\n\\n\" && exit 1",
    "publish": "npx @raycast/api@latest publish"
  }
}
```

## 🚀 Development Workflow

### 1. Creating a New Extension

```bash
# Navigate to src directory
cd src

# Create extension directory
mkdir my-new-extension
cd my-new-extension

# Initialize with Raycast CLI
bunx @raycast/api@latest init

# Or use Nx generator (if available)
bunx nx generate @nx/js:library my-new-extension --directory=src
```

### 2. Development Cycle

```bash
# Start development mode
bun run dev

# This will:
# 1. Build the extension
# 2. Import it into Raycast
# 3. Enable hot reloading
# 4. Show in Development section
```

### 3. Code Quality Checks

```bash
# Run linting
bun run lint

# Fix linting issues
bun run fix-lint

# Type checking
bun run tsc

# Format code
bun run prettier
```

## 🧩 Raycast API Patterns

### Basic Command Structure

```tsx
// src/index.tsx
import { ActionPanel, Action, List, Icon } from "@raycast/api";
import { useState, useEffect } from "react";

export default function Command() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch your data
        const data = await fetchItems();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search items...">
      {items.map((item) => (
        <List.Item
          key={item.id}
          title={item.title}
          subtitle={item.subtitle}
          icon={Icon.Document}
          accessories={[{ text: item.status }]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={item.url} />
              <Action.CopyToClipboard content={item.content} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

interface Item {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  content: string;
  status: string;
}

async function fetchItems(): Promise<Item[]> {
  // Implementation
  return [];
}
```

### Form-based Commands

```tsx
// src/create-item.tsx
import { ActionPanel, Action, Form, showToast, Toast } from "@raycast/api";
import { useState } from "react";

export default function CreateItem() {
  const [nameError, setNameError] = useState<string | undefined>();
  const [descriptionError, setDescriptionError] = useState<string | undefined>();

  function dropNameErrorIfNeeded() {
    if (nameError && nameError.length > 0) {
      setNameError(undefined);
    }
  }

  function dropDescriptionErrorIfNeeded() {
    if (descriptionError && descriptionError.length > 0) {
      setDescriptionError(undefined);
    }
  }

  async function handleSubmit(values: FormValues) {
    if (values.name.length === 0) {
      setNameError("Name is required");
      return;
    }

    try {
      await createItem(values);
      await showToast({
        style: Toast.Style.Success,
        title: "Item created successfully"
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to create item",
        message: String(error)
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Item" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="name"
        title="Name"
        placeholder="Enter item name"
        error={nameError}
        onChange={dropNameErrorIfNeeded}
        onBlur={(event) => {
          if (event.target.value?.length === 0) {
            setNameError("Name is required");
          } else {
            dropNameErrorIfNeeded();
          }
        }}
      />
      <Form.TextArea
        id="description"
        title="Description"
        placeholder="Enter description"
        error={descriptionError}
        onChange={dropDescriptionErrorIfNeeded}
      />
      <Form.Dropdown id="category" title="Category">
        <Form.Dropdown.Item value="work" title="Work" />
        <Form.Dropdown.Item value="personal" title="Personal" />
      </Form.Dropdown>
    </Form>
  );
}

interface FormValues {
  name: string;
  description: string;
  category: string;
}

async function createItem(values: FormValues): Promise<void> {
  // Implementation
}
```

### Detail Views

```tsx
// src/components/DetailView.tsx
import { Detail, ActionPanel, Action } from "@raycast/api";

interface DetailViewProps {
  item: Item;
}

export function DetailView({ item }: DetailViewProps) {
  const markdown = `
# ${item.title}

${item.description}

## Details

- **Status**: ${item.status}
- **Created**: ${item.createdAt}
- **Updated**: ${item.updatedAt}

## Actions

Use the actions panel to interact with this item.
  `;

  return (
    <Detail
      markdown={markdown}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="ID" text={item.id} />
          <Detail.Metadata.Label title="Status" text={item.status} />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label title="Created" text={item.createdAt} />
          <Detail.Metadata.Label title="Updated" text={item.updatedAt} />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url={item.url} />
          <Action.CopyToClipboard content={item.content} />
        </ActionPanel>
      }
    />
  );
}
```

## 🔧 Custom Hooks

### API Integration Hook

```tsx
// src/hooks/useAPI.ts
import { useState, useEffect } from "react";
import { showToast, Toast } from "@raycast/api";

export function useAPI<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const result = await fetcher();
        setData(result);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        await showToast({
          style: Toast.Style.Failure,
          title: "API Error",
          message: error.message
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, isLoading, error, refetch: () => fetchData() };
}
```

### Local Storage Hook

```tsx
// src/hooks/useStorage.ts
import { LocalStorage } from "@raycast/api";
import { useState, useEffect } from "react";

export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadValue() {
      try {
        const stored = await LocalStorage.getItem<string>(key);
        if (stored) {
          setValue(JSON.parse(stored));
        }
      } catch (error) {
        console.error(`Failed to load ${key} from storage:`, error);
      } finally {
        setIsLoading(false);
      }
    }

    loadValue();
  }, [key]);

  const updateValue = async (newValue: T) => {
    try {
      setValue(newValue);
      await LocalStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Failed to save ${key} to storage:`, error);
    }
  };

  return { value, updateValue, isLoading };
}
```

## 🤖 AI SDK 5 Integration

### Basic AI Integration

```tsx
// src/utils/ai.ts
import { openai } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  openaiApiKey: string;
  model: string;
}

export async function generateResponse(prompt: string): Promise<string> {
  const preferences = getPreferenceValues<Preferences>();

  try {
    const { text } = await generateText({
      model: openai(preferences.model || "gpt-4"),
      prompt,
      apiKey: preferences.openaiApiKey
    });

    return text;
  } catch (error) {
    throw new Error(`AI generation failed: ${error}`);
  }
}

export async function* streamResponse(prompt: string) {
  const preferences = getPreferenceValues<Preferences>();

  try {
    const { textStream } = await streamText({
      model: openai(preferences.model || "gpt-4"),
      prompt,
      apiKey: preferences.openaiApiKey
    });

    for await (const delta of textStream) {
      yield delta;
    }
  } catch (error) {
    throw new Error(`AI streaming failed: ${error}`);
  }
}
```

### AI-Powered Command

```tsx
// src/ai-command.tsx
import { ActionPanel, Action, Detail, Form, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { generateResponse } from "./utils/ai";

export default function AICommand() {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: { prompt: string }) {
    if (!values.prompt.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Please enter a prompt"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateResponse(values.prompt);
      setResponse(result);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "AI Error",
        message: String(error)
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (response) {
    return (
      <Detail
        markdown={response}
        actions={
          <ActionPanel>
            <Action.CopyToClipboard content={response} />
            <Action title="New Query" onAction={() => setResponse("")} />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Generate" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea id="prompt" title="Prompt" placeholder="Enter your AI prompt here..." />
    </Form>
  );
}
```

## 🔌 MCP Integration

### MCP Client Setup

```tsx
// src/utils/mcp.ts
import { getPreferenceValues } from "@raycast/api";

interface MCPPreferences {
  mcpServerUrl: string;
  mcpApiKey: string;
}

export class MCPClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    const preferences = getPreferenceValues<MCPPreferences>();
    this.baseUrl = preferences.mcpServerUrl;
    this.apiKey = preferences.mcpApiKey;
  }

  async callTool(toolName: string, args: Record<string, any>) {
    try {
      const response = await fetch(`${this.baseUrl}/tools/${toolName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ args })
      });

      if (!response.ok) {
        throw new Error(`MCP call failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`MCP error: ${error}`);
    }
  }

  async listTools() {
    try {
      const response = await fetch(`${this.baseUrl}/tools`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to list tools: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`MCP error: ${error}`);
    }
  }
}
```

### MCP-Powered Command

```tsx
// src/mcp-command.tsx
import { ActionPanel, Action, List, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import { MCPClient } from "./utils/mcp";

export default function MCPCommand() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mcpClient = new MCPClient();

  useEffect(() => {
    async function loadTools() {
      try {
        const toolList = await mcpClient.listTools();
        setTools(toolList);
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to load MCP tools",
          message: String(error)
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadTools();
  }, []);

  async function executeTool(toolName: string, args: Record<string, any>) {
    try {
      const result = await mcpClient.callTool(toolName, args);
      await showToast({
        style: Toast.Style.Success,
        title: "Tool executed successfully",
        message: JSON.stringify(result)
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Tool execution failed",
        message: String(error)
      });
    }
  }

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search MCP tools...">
      {tools.map((tool) => (
        <List.Item
          key={tool.name}
          title={tool.name}
          subtitle={tool.description}
          actions={
            <ActionPanel>
              <Action title="Execute Tool" onAction={() => executeTool(tool.name, {})} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
}
```

## 🎨 TypeScript Patterns

### Type Definitions

```tsx
// src/types/index.ts
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  avatar?: string;
}

export interface Project extends BaseEntity {
  title: string;
  description: string;
  status: ProjectStatus;
  owner: User;
  members: User[];
}

export enum ProjectStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  COMPLETED = "completed",
  ARCHIVED = "archived"
}

export interface APIResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### Error Handling

```tsx
// src/utils/errors.ts
export class ExtensionError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "ExtensionError";
  }
}

export class APIError extends ExtensionError {
  constructor(message: string, statusCode: number) {
    super(message, "API_ERROR", statusCode);
  }
}

export class ValidationError extends ExtensionError {
  constructor(
    message: string,
    public field: string
  ) {
    super(message, "VALIDATION_ERROR");
  }
}

export function handleError(error: unknown): ExtensionError {
  if (error instanceof ExtensionError) {
    return error;
  }

  if (error instanceof Error) {
    return new ExtensionError(error.message, "UNKNOWN_ERROR");
  }

  return new ExtensionError("An unknown error occurred", "UNKNOWN_ERROR");
}
```

## 🧪 Testing Patterns

### Component Testing

```tsx
// src/__tests__/components/DetailView.test.tsx
import { render } from "@testing-library/react";
import { DetailView } from "../components/DetailView";

const mockItem = {
  id: "1",
  title: "Test Item",
  description: "Test description",
  status: "active",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  url: "https://example.com",
  content: "Test content"
};

describe("DetailView", () => {
  it("renders item details correctly", () => {
    const { getByText } = render(<DetailView item={mockItem} />);

    expect(getByText("Test Item")).toBeInTheDocument();
    expect(getByText("Test description")).toBeInTheDocument();
  });
});
```

### Hook Testing

```tsx
// src/__tests__/hooks/useAPI.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { useAPI } from "../hooks/useAPI";

const mockFetcher = jest.fn();

describe("useAPI", () => {
  beforeEach(() => {
    mockFetcher.mockClear();
  });

  it("fetches data successfully", async () => {
    const testData = { id: 1, name: "Test" };
    mockFetcher.mockResolvedValue(testData);

    const { result } = renderHook(() => useAPI(mockFetcher));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(testData);
    expect(result.current.error).toBe(null);
  });
});
```

## 🚀 Performance Optimization

### Lazy Loading

```tsx
// src/components/LazyDetailView.tsx
import { lazy, Suspense } from "react";
import { Detail } from "@raycast/api";

const DetailView = lazy(() => import("./DetailView"));

export function LazyDetailView(props: any) {
  return (
    <Suspense fallback={<Detail isLoading />}>
      <DetailView {...props} />
    </Suspense>
  );
}
```

### Memoization

```tsx
// src/components/OptimizedList.tsx
import { memo, useMemo } from "react";
import { List } from "@raycast/api";

interface OptimizedListProps {
  items: Item[];
  searchText: string;
}

export const OptimizedList = memo(function OptimizedList({ items, searchText }: OptimizedListProps) {
  const filteredItems = useMemo(() => {
    if (!searchText) return items;

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [items, searchText]);

  return (
    <List>
      {filteredItems.map((item) => (
        <List.Item key={item.id} title={item.title} />
      ))}
    </List>
  );
});
```

## 📝 Best Practices

### 1. Code Organization

- **Separation of Concerns**: Keep UI components, business logic, and data fetching separate
- **Reusable Components**: Create shared components for common UI patterns
- **Custom Hooks**: Extract stateful logic into reusable hooks
- **Type Safety**: Use TypeScript for all code with proper type definitions

### 2. Error Handling

- **Graceful Degradation**: Handle errors without breaking the user experience
- **User Feedback**: Show meaningful error messages using Toast notifications
- **Logging**: Log errors for debugging while respecting user privacy

### 3. Performance

- **Lazy Loading**: Load heavy components only when needed
- **Memoization**: Use React.memo and useMemo for expensive operations
- **Debouncing**: Debounce search inputs and API calls
- **Caching**: Cache API responses using LocalStorage or in-memory caching

### 4. User Experience

- **Loading States**: Always show loading indicators for async operations
- **Empty States**: Provide helpful empty states with actionable guidance
- **Keyboard Navigation**: Ensure all functionality is accessible via keyboard
- **Search**: Implement fuzzy search for better discoverability

### 5. Security

- **API Keys**: Store sensitive data in preferences, never in code
- **Input Validation**: Validate all user inputs
- **HTTPS**: Always use HTTPS for API calls
- **Rate Limiting**: Implement client-side rate limiting for API calls

## 🔄 Development Commands

```bash
# Development workflow
bun run dev          # Start development mode
bun run build        # Build extension
bun run lint         # Run ESLint
bun run fix-lint     # Fix linting issues
bun run test         # Run tests
bun run type-check   # TypeScript type checking

# Nx commands
bunx nx run my-extension:dev     # Run specific extension
bunx nx run my-extension:build   # Build specific extension
bunx nx run my-extension:test    # Test specific extension
bunx nx run-many --target=test --all  # Test all extensions
```

## 📚 Resources

- **Raycast API Documentation**: https://developers.raycast.com
- **AI SDK Documentation**: https://sdk.vercel.ai
- **MCP Protocol**: https://modelcontextprotocol.io
- **TypeScript Handbook**: https://www.typescriptlang.org/docs
- **React Documentation**: https://react.dev

---

**Previous**: [Development Environment Setup](./02-development-setup.md) | **Next**:
[Testing Strategy & Implementation](./04-testing-strategy.md)
