# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional landing page project for Dnotas company designed to convert visitors into clients through optimized video content and lead capture. The project includes advanced tracking and analytics capabilities.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run typecheck
```

## Project Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **React Router** for client-side routing
- **React Hook Form** for form management
- **React Player** for video playback with custom controls

### Backend Integration
- **Supabase** for database and real-time features
- Database tables: `leads`, `video_events`
- Configuration in `src/lib/supabase.ts`

### Key Features
1. **Landing Page** (`/`): Conversion-optimized with video player and lead capture
2. **Dashboard** (`/dashboard`): Marketing analytics and lead management
3. **Video Tracking**: Detailed engagement analytics with drop-off detection
4. **Lead Capture**: Multi-step form with validation and UTM tracking
5. **Analytics Integration**: Facebook Pixel and Google Analytics

## Architecture Patterns

### Hooks Pattern
- `useVideoTracking`: Manages video engagement tracking
- `useLeadCapture`: Handles form submission and lead creation
- Custom hooks centralize business logic and state management

### Component Structure
- `VideoPlayer`: Custom video player with controlled playback and tracking
- `LeadForm`: Multi-step lead capture with validation and formatting
- Pages use composition pattern with reusable components

### Data Flow
1. User interacts with landing page
2. Video events tracked in real-time to Supabase
3. Lead form captures contact info and revenue data
4. Dashboard provides real-time analytics and lead management
5. External analytics (Facebook/Google) track conversion events

## Important Implementation Details

### Video Player Behavior
- Controls are initially hidden until specific timestamp
- Progress tracking every 10% completion
- Drop-off detection when user leaves page
- Integration with external analytics for campaign optimization

### Lead Capture Strategy
- CTA button appears at video timestamp (configurable)
- Form validates phone and revenue formatting
- UTM parameters automatically captured
- Lead stages: lead → qualified → converted

### Database Schema
Run `supabase-setup.sql` to create required tables and indexes. Key tables:
- `leads`: Contact info, revenue, video progress, conversion stage
- `video_events`: Detailed interaction tracking for analytics

### Analytics Integration
Configure in `index.html`:
- Facebook Pixel: Replace `YOUR_PIXEL_ID`
- Google Analytics: Replace `GA_MEASUREMENT_ID`

## Configuration Notes

### Supabase Setup
- Project configured with credentials in `src/lib/supabase.ts`
- Run SQL setup script for database schema
- RLS policies can be enabled for security (currently disabled for demo)

### Video Configuration
- Replace placeholder video URL in `LandingPage.tsx`
- Configure timing for controls appearance based on video content
- Video player blocks scrubbing for controlled viewing experience

### Environment Variables
For production deployment, consider moving sensitive config to environment variables:
- Supabase URL and keys
- Analytics tracking IDs
- Video URLs

## Conversion Optimization Features

### Landing Page Design
- Headline optimized for Facebook Ads compliance
- Video-first approach with controlled progression
- Progressive disclosure of content based on engagement
- Mobile-responsive design with touch-optimized controls

### Analytics & Tracking
- Real-time lead capture and video engagement data
- UTM parameter tracking for campaign attribution
- Conversion funnel analysis with drop-off points
- Revenue potential tracking by lead segment

## Marketing Team Dashboard

Access at `/dashboard` for:
- Lead management and contact details
- Video engagement analytics and drop-off analysis
- Conversion funnel performance
- Revenue potential by segment and source
- Real-time campaign performance metrics