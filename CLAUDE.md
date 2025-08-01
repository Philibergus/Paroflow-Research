# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm i          # Install dependencies
npm run dev    # Start development server on port 8080
npm run build  # Build for production
npm run lint   # Run ESLint
npm run preview # Preview production build
```

## Architecture Overview

This is a dental practice management application built with React, TypeScript, and Vite. The application follows a standard React SPA architecture with client-side routing.

### Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom medical theme
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Flow Diagrams**: XYFlow React

### Project Structure

The application is organized around pages representing different sections of the dental practice:

- **Command Center** (`/`) - Main dashboard with statistics and quick actions
- **Patients** (`/patients`) - Patient management
- **Comptes Rendus** (`/reports`) - Medical reports and documentation
- **Correspondants** (`/correspondants`) - Referral contacts management
- **To-Do List** (`/todo`) - Task management
- **Stock** (`/stock`) - Inventory management

### Key Architectural Patterns

1. **Component Organization**: 
   - Page components in `src/pages/`
   - Reusable UI components in `src/components/ui/` (shadcn/ui)
   - Custom components in `src/components/`

2. **Routing**: Centralized in `src/App.tsx` with a consistent Layout wrapper providing navigation sidebar

3. **Styling**: Tailwind CSS with custom configuration for medical-themed colors and components

4. **Path Aliases**: `@/` is configured to resolve to `src/` directory

5. **Development Server**: Configured to run on port 8080 with IPv6 support

## Project Origin

This project was initially generated using Lovable.dev and has been customized for a dental practice management system focused on periodontics.