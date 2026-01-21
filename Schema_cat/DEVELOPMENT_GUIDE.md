# 🚀 Development Guide

## Quick Start

```bash
# Navigate to project
cd Schema_cat

# Install dependencies (if not done)
npm install

# Start development server
npm run dev

# Access the app
# http://localhost:5173 or http://localhost:5174
```

## Project Structure

```
Schema_cat/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Route page components
│   ├── context/         # React context (theme)
│   ├── App.jsx          # Router setup
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind imports
├── public/              # Static assets
├── tailwind.config.js   # Tailwind configuration
└── package.json         # Dependencies
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## Component Usage Examples

### Button Component

```jsx
import Button from './components/Button';

// Primary button (default)
<Button onClick={handleClick}>Click Me</Button>

// Secondary button
<Button variant="secondary">Secondary</Button>

// Outline button
<Button variant="outline">Outline</Button>

// Google OAuth styled
<Button variant="google">Sign in with Google</Button>

// GitHub OAuth styled
<Button variant="github">Sign in with GitHub</Button>

// Full width
<Button fullWidth>Full Width Button</Button>

// Disabled
<Button disabled>Disabled</Button>
```

### Input Component

```jsx
import Input from './components/Input';

<Input
  type="email"
  id="email"
  label="Email Address"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
```

### Card Component

```jsx
import Card from './components/Card';

<Card className="p-6">
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>
```

### Theme Toggle

```jsx
import ThemeToggle from './components/ThemeToggle';

// Just add it anywhere
<ThemeToggle />
```

### Using Theme Context

```jsx
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

## Adding New Pages

1. **Create page component** in `src/pages/`:

```jsx
// src/pages/NewPage.jsx
import React from 'react';

const NewPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold">New Page</h1>
    </div>
  );
};

export default NewPage;
```

2. **Add route** in `src/App.jsx`:

```jsx
import NewPage from './pages/NewPage';

<Routes>
  {/* ... existing routes */}
  <Route path="/new" element={<NewPage />} />
</Routes>
```

3. **Add to sidebar** (if needed) in `src/components/Sidebar.jsx`:

```jsx
const navItems = [
  // ... existing items
  { name: 'New Page', path: '/new', icon: '🆕' },
];
```

## Styling Guidelines

### Use Tailwind Classes

```jsx
// Good ✅
<div className="px-4 py-2 bg-blue-600 text-white rounded-lg">
  Content
</div>

// Avoid ❌
<div style={{ padding: '8px', background: 'blue' }}>
  Content
</div>
```

### Dark Mode Support

Always add dark mode variants:

```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  This works in both themes
</div>
```

### Common Patterns

```jsx
// Container with padding
<div className="max-w-7xl mx-auto px-4 py-8">

// Centered card
<div className="min-h-screen flex items-center justify-center">
  <Card className="w-full max-w-md p-8">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Hover effects
<button className="bg-blue-600 hover:bg-blue-700 transition-colors">

// Focus rings
<input className="focus:ring-2 focus:ring-blue-500 focus:outline-none">
```

## Common Tailwind Classes

### Spacing
- `p-4` = padding 1rem
- `px-6` = horizontal padding 1.5rem
- `py-3` = vertical padding 0.75rem
- `m-4` = margin 1rem
- `space-x-4` = gap between children

### Colors
- `bg-blue-600` = blue background
- `text-white` = white text
- `border-gray-300` = gray border
- `dark:bg-gray-900` = dark mode background

### Layout
- `flex` = flexbox
- `flex-col` = column direction
- `items-center` = center align items
- `justify-between` = space between
- `grid` = CSS grid
- `gap-4` = grid/flex gap

### Typography
- `text-xl` = 1.25rem font size
- `font-bold` = bold weight
- `text-center` = center align
- `leading-relaxed` = line height

### Borders & Shadows
- `rounded-lg` = 0.5rem border radius
- `border` = 1px border
- `shadow-lg` = large shadow
- `ring-2` = 2px focus ring

## Environment Variables

Create `.env` file for environment-specific config:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=SchemaCat
```

Access in code:

```jsx
const apiUrl = import.meta.env.VITE_API_URL;
```

## Building for Production

```bash
# Build optimized bundle
npm run build

# Output in dist/ folder
# Deploy dist/ to:
# - Vercel
# - Netlify
# - GitHub Pages
# - Any static host
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Deploy dist/ folder via Netlify UI
```

### GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Deploy
npm run build
npm run deploy
```

## Troubleshooting

### Tailwind styles not working
- Check `tailwind.config.js` content paths
- Verify `@tailwind` directives in `index.css`
- Restart dev server

### Dark mode not working
- Verify `darkMode: 'class'` in `tailwind.config.js`
- Check ThemeContext is wrapping app
- Verify `dark:` prefixes on classes

### Routes not working
- Check BrowserRouter is wrapping Routes
- Verify exact path names
- Check component imports

### Build errors
- Run `npm install` to ensure all deps installed
- Clear `node_modules` and reinstall
- Check for console errors

## Best Practices

1. **Component Organization**: Keep components small and focused
2. **State Management**: Use local state unless truly global
3. **Dark Mode**: Always include dark variants
4. **Accessibility**: Include aria-labels and proper semantics
5. **Performance**: Lazy load pages if app grows large
6. **Type Safety**: Consider TypeScript for larger projects

## Next Steps

### Backend Integration

When ready to add a backend:

1. Create API service layer:
```jsx
// src/services/api.js
export const loginUser = async (credentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return response.json();
};
```

2. Use in components:
```jsx
import { loginUser } from '../services/api';

const handleLogin = async () => {
  const result = await loginUser({ email, password });
};
```

### State Management

For complex state, add:
- **Context API** (already set up for theme)
- **Zustand** (lightweight)
- **Redux Toolkit** (enterprise)

### Authentication

Add authentication context:
```jsx
// src/context/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // ... auth logic
};
```

---

## Resources

- [React Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev)

Happy coding! 🚀
