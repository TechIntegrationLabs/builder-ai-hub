# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Cornerstone Builders Group (CBG) AI Tools Portal - a React TypeScript application built with Vite and shadcn/ui components. The portal provides AI-powered tools for construction project management and client engagement.

## Common Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

### Tech Stack
- **Build Tool**: Vite
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **UI Components**: shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Styling**: Tailwind CSS with custom configuration
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation

### Project Structure
- `/src/components/` - React components including all shadcn/ui components
- `/src/pages/` - Page components for routing
- `/src/hooks/` - Custom React hooks
- `/src/lib/` - Utility functions

### Key Application Routes
- `/` - Dashboard with list of available AI tools
- `/tool/entitlement-tracker` - Active tool for generating AI agent prompts
- `/tool/:toolId` - Coming soon page for tools in development
- `*` - 404 Not Found page

### Important Patterns

1. **Path Aliases**: Use `@/` for imports from the `src` directory
   ```typescript
   import { Button } from "@/components/ui/button"
   ```

2. **Component Structure**: All UI components follow shadcn/ui patterns with:
   - Radix UI primitives for behavior
   - Tailwind CSS for styling
   - class-variance-authority for variant management

3. **TypeScript Configuration**: The project uses relaxed TypeScript settings:
   - `noImplicitAny: false`
   - `strictNullChecks: false`
   - `noUnusedParameters: false`
   - `noUnusedLocals: false`

4. **Webhook Integration**: The EntitlementTracker component sends data to external webhooks for processing

### Development Notes

- The project is configured with Lovable.dev integration for rapid development
- ESLint is configured but with relaxed rules for unused variables
- The development server binds to all interfaces (`host: "::"`) for network accessibility
- Component tagging is enabled in development mode for Lovable.dev integration