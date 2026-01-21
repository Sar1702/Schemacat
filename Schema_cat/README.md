# SchemaCat - MongoDB Query Assistant

A production-ready React frontend application for a chat-based LLM assistant that helps with MongoDB queries. Built with React, React Router, and Tailwind CSS.

## 🚀 Features

- **Modern SaaS UI** - Dark/Light theme support with smooth transitions
- **Fully Routed** - React Router v6 with clean page separation
- **Responsive Design** - Works on all screen sizes
- **Production Ready** - Clean, scalable code architecture
- **No External UI Libraries** - Pure Tailwind CSS implementation

## 📁 Project Structure

```
Schema_cat/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.jsx       # Customizable button component
│   │   ├── Input.jsx        # Form input component
│   │   ├── Card.jsx         # Container card component
│   │   ├── ThemeToggle.jsx  # Theme switcher component
│   │   ├── ChatBubble.jsx   # Chat message bubble
│   │   ├── CodeBlock.jsx    # Code syntax display
│   │   └── Sidebar.jsx      # Navigation sidebar
│   │
│   ├── pages/               # Route pages
│   │   ├── Landing.jsx      # Homepage (/)
│   │   ├── Login.jsx        # Login page (/login)
│   │   ├── Signup.jsx       # Signup page (/signup)
│   │   ├── Connect.jsx      # MongoDB connection (/connect)
│   │   ├── Chat.jsx         # Main chat interface (/chat)
│   │   ├── SchemaInfo.jsx   # Database schema view (/schema)
│   │   └── Settings.jsx     # User settings (/settings)
│   │
│   ├── context/
│   │   └── ThemeContext.jsx # Theme state management
│   │
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind imports
│
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── package.json
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server

## 🎨 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero page with product features |
| `/login` | Login | Sign in with email/Google/GitHub |
| `/signup` | Signup | Create new account |
| `/connect` | Connect | Configure MongoDB connection |
| `/chat` | Chat | Main chat interface with AI assistant |
| `/schema` | Schema Info | View database structure |
| `/settings` | Settings | App preferences |

## 🎯 Components

### Reusable Components

- **Button** - Multiple variants (primary, secondary, outline, google, github)
- **Input** - Form inputs with labels and dark mode support
- **Card** - Container with shadow and border
- **ThemeToggle** - Sun/moon icon toggle for theme switching
- **ChatBubble** - Message bubbles for user and assistant
- **CodeBlock** - Syntax-highlighted code display
- **Sidebar** - Navigation sidebar with active state

### Context

- **ThemeContext** - Global theme state with localStorage persistence

## 🌙 Theme System

The app supports both light and dark themes:

- Default theme: **Dark**
- Theme persists in `localStorage`
- Uses Tailwind's `class` strategy for dark mode
- Toggle available on all pages

## 🚦 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173` (or next available port)

## 🔑 Key Features by Page

### Landing Page
- Animated hero section
- Feature highlights with checkmarks
- MongoDB branding
- CTA button to login

### Login/Signup
- Email/password authentication UI
- OAuth buttons (Google, GitHub)
- Form validation
- Consistent card layout

### Connect
- MongoDB URI input
- Database name input
- Test connection functionality
- Success/error states
- Help text with example URI

### Chat Dashboard
- Sidebar navigation
- Chat message history
- Code block rendering
- Real-time message input
- Database icon and branding
- Theme toggle in header

## 📝 Notes

- This is a **UI-only** implementation (no backend)
- Authentication and database connections are mocked
- All interactions are client-side only
- Ready for integration with real backend APIs

## 🎨 Design Philosophy

The UI follows modern SaaS design patterns:
- Clean, minimal interface
- Consistent spacing and shadows
- Professional color palette
- Smooth transitions and hover states
- Accessible contrast ratios
- Mobile-first responsive design

## 📦 Production Deployment

Build the app for production:

```bash
npm run build
```

The `dist` folder will contain the optimized static files ready for deployment to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

---

Built with ❤️ using React + Tailwind CSS


The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
