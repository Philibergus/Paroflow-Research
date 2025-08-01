# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm i          # Install dependencies
npm run dev    # Start development server on port 8080
npm run build  # Build for production
npm run lint   # Run ESLint
npm run typecheck # Run TypeScript type checking (when implemented)
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

## Current Status

This is currently a prototype/MVP with basic routing and UI components. The application needs to be evolved into a full medical practice management system with:
- Backend API development
- Database schema design
- Security implementation
- MCP server integrations
- AI agent implementations

## Project Vision & Goals

**Paroflow** is an ambitious dental practice management system specifically designed for periodontology and implantology practices. The goal is to create a modern, AI-powered solution that can eventually replace or complement existing software like Logosw.

### Primary Objectives
1. **Phase 1**: Complete automation of secretarial tasks and medical report generation
2. **Phase 2**: Advanced patient management with AI-assisted diagnosis and treatment planning
3. **Phase 3**: Integration with imaging systems and multi-location practice management
4. **Phase 4**: Potential replacement of traditional dental software with specialized parodontology/implantology focus

### Target Users
- Dental practices specializing in periodontology and implantology
- Currently using Logosw but needing more specialized and modern features
- Practices wanting to reduce administrative burden through AI automation

## Research Documentation

**Complete analysis available at**: [Paroflow-Research Repository](https://github.com/Philibergus/Paroflow-Research)

This repository contains comprehensive research on:
- MCP servers for medical applications
- AI agents for dental practice automation  
- Logosw competitive analysis
- HIPAA-compliant architecture patterns

## Recommended MCP Servers

Based on the research analysis, prioritize these MCP servers for development:

### High Priority
1. **Healthcare MCP Server** - Medical terminology, coding, clinical workflows
2. **DICOM MCP Server** - Medical imaging integration (X-rays, CT scans)
3. **Database MCP Server** - Patient data management with HIPAA compliance
4. **PDF MCP Server** - Medical report generation and document management
5. **Calendar MCP Server** - Advanced appointment scheduling

### Medium Priority
6. **Email MCP Server** - Patient communication automation
7. **Web Search MCP Server** - Medical literature and drug information
8. **File System MCP Server** - Secure document storage and organization

## Recommended AI Agents

From the [wshobson/agents](https://github.com/wshobson/agents) repository analysis:

### Immediate Implementation
- **Medical Report Generator Agent** - Automated report creation from templates
- **Patient Data Manager Agent** - CRUD operations with validation
- **Appointment Scheduler Agent** - Intelligent scheduling with conflict resolution
- **Document Processor Agent** - OCR and data extraction from forms

### Future Development
- **Treatment Plan Agent** - AI-assisted treatment recommendations
- **Insurance Processor Agent** - Automated claim processing
- **Inventory Manager Agent** - Smart stock management and reordering

## Target Architecture (Long-term)

### Backend Stack
- **Runtime**: Node.js with TypeScript
- **Database**: PostgreSQL with encrypted patient data
- **Cache**: Redis for session management
- **API**: GraphQL with FHIR R4 compliance
- **Authentication**: Multi-factor with role-based access

### Frontend Stack
- **Web**: React 18 + TypeScript (current)
- **Mobile**: React Native for tablet/mobile access
- **UI**: shadcn/ui with medical-specific components
- **State**: React Query + Zustand for complex state

### Infrastructure
- **Cloud**: AWS/Google Cloud with HIPAA compliance
- **Containers**: Kubernetes for scalability
- **Security**: End-to-end encryption, audit logging
- **Backup**: Automated, encrypted backups with disaster recovery

### Integration Capabilities
- **Medical Imaging**: DICOM integration for X-rays, CT scans
- **Lab Systems**: HL7 FHIR for lab result integration
- **Insurance**: Real-time eligibility verification
- **Existing Software**: API bridges for Logosw migration

## Logosw Analysis Summary

**Key features to replicate/improve**:
- Advanced charting for periodontal examinations
- Implant planning and tracking modules
- Comprehensive patient history management
- Multi-practitioner scheduling system
- Financial management and insurance processing

**Competitive advantages over Logosw**:
- AI-powered report generation and analysis
- Modern cloud-native architecture
- Mobile-first design for tablet use during consultations
- Specialized parodontology/implantology workflows
- Real-time collaboration between practitioners

## Development Phases

### Phase 1 (Months 1-6): Foundation
- HIPAA-compliant infrastructure setup
- Basic patient management with secure data storage
- AI-powered report generation system
- Integration with Healthcare and DICOM MCP servers
- Multi-practitioner appointment scheduling

### Phase 2 (Months 7-12): Core Features
- Advanced periodontal charting system
- Treatment plan generation with AI assistance
- Financial management and insurance processing
- Mobile application for tablet use
- Integration with imaging systems

### Phase 3 (Months 13-18): Advanced Features
- Predictive analytics for treatment outcomes
- Multi-location practice management
- Advanced reporting and analytics dashboard
- API integrations with major dental suppliers
- Automated inventory management

### Phase 4 (Months 19-24): Market Ready
- Full Logosw feature parity + AI enhancements
- Migration tools from existing systems
- Advanced AI diagnostic assistance
- Comprehensive training and support system
- Market launch and user acquisition

## Security & Compliance

- **HIPAA Compliance**: All patient data encrypted at rest and in transit
- **Access Control**: Role-based permissions with audit logging
- **Data Backup**: Automated encrypted backups with point-in-time recovery
- **Security Monitoring**: Real-time threat detection and response
- **Compliance Reporting**: Automated compliance reports and audits

## Project Origin

This project was initially generated using Lovable.dev and has been customized for a dental practice management system focused on periodontics and implantology.