# Contributing to BINPROFKES

## Development Setup

1. **Clone and Install**
```bash
git clone <repository-url>
cd binprofkes-admin
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Build for Production**
```bash
npm run build
```

## Code Style Guidelines

### TypeScript
- Use strict TypeScript mode
- Define interfaces for all data structures
- Avoid `any` types unless absolutely necessary
- Use descriptive variable and function names

### React Components
- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use proper prop typing with TypeScript interfaces

### File Organization
```
src/
├── components/     # Reusable UI components
│   ├── ui/        # Base UI primitives (Button, Card, etc.)
│   └── layout/    # Layout components (Sidebar, Topbar)
├── pages/         # Route-level components
├── services/      # Business logic & data access
├── store/         # Zustand state management
├── types/         # TypeScript type definitions
├── lib/           # Utility functions
└── data/          # Seed/mock data
```

### Naming Conventions
- **Components**: PascalCase (`UserCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`User`, `Personel`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)

### Component Structure
```tsx
import { useState } from 'react';
import { Component } from '@/components/ui/component';
import { useStore } from '@/store/store';
import type { Props } from '@/types/models';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  const [state, setState] = useState('');
  const { data } = useStore();

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

## State Management

### Zustand Store Pattern
```typescript
import { create } from 'zustand';

interface Store {
  data: Data[];
  addData: (item: Data) => void;
  removeData: (id: string) => void;
}

export const useStore = create<Store>((set) => ({
  data: [],
  addData: (item) => set((state) => ({ 
    data: [...state.data, item] 
  })),
  removeData: (id) => set((state) => ({ 
    data: state.data.filter(d => d.id !== id) 
  })),
}));
```

## Adding New Features

### 1. Add New Data Model
```typescript
// src/types/models.ts
export interface NewModel {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

### 2. Create Repository
```typescript
// src/services/newModelRepository.ts
import { Repository } from './repository';
import { NewModel } from '@/types/models';

export const newModelRepo = new Repository<NewModel>('newModel', 'NewModel');
```

### 3. Add Page Component
```tsx
// src/pages/NewModelPage.tsx
export function NewModelPage() {
  // Implementation
}
```

### 4. Add Route
```tsx
// src/App.tsx
<Route path="new-model" element={<NewModelPage />} />
```

### 5. Add Navigation Item
```tsx
// src/components/layout/Sidebar.tsx
const navigation = [
  // ... existing items
  { 
    name: 'New Model', 
    href: '/app/new-model', 
    icon: Icon, 
    roles: ['SuperAdmin'] 
  },
];
```

## RBAC Implementation

### Checking Permissions in Components
```tsx
import { useAuthStore } from '@/store/authStore';
import { RequireRole } from '@/components/RequireRole';

function MyComponent() {
  const { user } = useAuthStore();
  
  // Method 1: Conditional rendering
  const canEdit = user?.role === 'SuperAdmin' || user?.role === 'AdminSatuan';
  
  return (
    <div>
      {canEdit && <Button>Edit</Button>}
      
      {/* Method 2: RequireRole component */}
      <RequireRole roles={['SuperAdmin', 'AdminSatuan']}>
        <Button>Edit</Button>
      </RequireRole>
    </div>
  );
}
```

### Protected Routes
```tsx
<Route
  path="sensitive-page"
  element={
    <ProtectedRoute allowedRoles={['SuperAdmin']}>
      <SensitivePage />
    </ProtectedRoute>
  }
/>
```

## Data Export

### Using ExportService
```typescript
import { ExportService } from '@/services/export';

// CSV Export
ExportService.exportToCSV(
  data,
  'filename',
  ['column1', 'column2'] // optional column filter
);

// Excel Export
ExportService.exportToExcel(data, 'filename', columns);

// PDF Export
ExportService.exportToPDF(
  data,
  'Report Title',
  [
    { header: 'Column 1', dataKey: 'key1' },
    { header: 'Column 2', dataKey: 'key2' },
  ]
);
```

## Testing

### Component Testing (Future)
```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Git Workflow

1. Create feature branch from `main`
```bash
git checkout -b feature/new-feature
```

2. Make changes and commit
```bash
git add .
git commit -m "feat: add new feature"
```

3. Push and create PR
```bash
git push origin feature/new-feature
```

### Commit Message Convention
```
feat: add new feature
fix: fix bug in component
docs: update documentation
style: format code
refactor: refactor component
test: add tests
chore: update dependencies
```

## Performance Best Practices

1. **Use React.memo for expensive components**
2. **Lazy load routes and heavy components**
3. **Optimize images and assets**
4. **Use proper keys in lists**
5. **Avoid inline function definitions in JSX**
6. **Use useMemo and useCallback appropriately**

## Accessibility (A11y)

1. Use semantic HTML elements
2. Add proper ARIA labels
3. Ensure keyboard navigation works
4. Maintain sufficient color contrast
5. Provide alt text for images

## Security Considerations

1. **Never store sensitive data in LocalStorage**
2. **Sanitize user inputs**
3. **Validate all data before processing**
4. **Use HTTPS in production**
5. **Implement proper authentication when adding backend**

## Future Backend Integration

When adding REST API:

1. Create API service layer
```typescript
// src/services/api.ts
export class ApiService {
  private baseUrl = import.meta.env.VITE_API_URL;
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}
```

2. Replace Repository with API calls
3. Add proper error handling
4. Implement authentication tokens
5. Add loading states

## Questions?

Contact the development team for any questions or clarifications.
