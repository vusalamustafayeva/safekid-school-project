# SafeKid - Child Safety & Emergency Communication System

![SafeKid Logo](https://img.shields.io/badge/SafeKid-Emergency%20System-blue)
![Status](https://img.shields.io/badge/Status-Educational%20Project-green)
![License](https://img.shields.io/badge/License-School%20Project-yellow)

## Overview

SafeKid is a comprehensive child safety and emergency communication system developed as a Fachabitur project in Germany. The system enables children to ask for help quickly and discreetly in situations of bullying, fear, or danger, while enabling parents to react immediately.

**Dieses Projekt wurde speziell für die BBS Cora Berliner konzipiert.**

This project is specifically designed for BBS Cora Berliner (Nußriede 4, 30627 Hannover) and includes intelligent geofencing technology that notifies the school only when emergencies occur within a 1 km radius of the school location. This ensures student safety during school hours while protecting family privacy for incidents outside the school area.

**Important:** SafeKid is NOT a replacement for emergency services (110/112). It is a preventive and supportive safety tool designed to complement, not replace, professional emergency response.

## System Architecture

SafeKid consists of four interconnected components:

1. **Professional Website** - Public-facing information and access portal
2. **Child SOS App** - Simple, child-friendly emergency trigger interface
3. **Parent App** - Emergency monitoring and response dashboard
4. **School App** - Geofenced emergency monitoring for BBS Cora Berliner

All components are connected through a shared Supabase backend with real-time capabilities.

## Features

### Child App
- Large, prominent SOS button
- Silent mode for discreet alerts
- GPS location tracking
- Simple, child-friendly interface
- Minimal text, maximum clarity

### Parent App
- Real-time emergency notifications
- Live location tracking
- Emergency event timeline
- Quick action buttons (call, acknowledge, resolve)
- Clear emergency service reminders

### School App (BBS Cora Berliner)
- Geofenced emergency monitoring (1 km radius)
- Only receives alerts within school safety zone
- Real-time location tracking for nearby incidents
- Same dashboard interface as Parent App
- Privacy protection for incidents outside school area
- Distance calculation from school displayed for each alert

### Website
- Multi-language support (German, English, Turkish)
- Comprehensive product information
- Privacy & GDPR compliance information
- FAQ and contact sections
- Professional, trustworthy design

## Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Context API

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime Subscriptions
- **Security:** Row Level Security (RLS)

### Infrastructure
- **Hosting:** Web-based deployment
- **API:** RESTful with Supabase Client SDK
- **Security:** HTTPS, encrypted connections

## Database Schema

### Tables

#### `profiles`
User profiles linked to Supabase authentication
- `id` (uuid) - Primary key, links to auth.users
- `email` (text) - User email
- `full_name` (text) - User's full name
- `role` (text) - 'parent' or 'child'
- `phone` (text, optional) - Contact number
- `created_at`, `updated_at` - Timestamps

#### `family_links`
Connects parents with children
- `id` (uuid) - Primary key
- `parent_id` (uuid) - References profiles
- `child_id` (uuid) - References profiles
- `status` (text) - 'pending', 'active', or 'revoked'
- `created_at` - Timestamp

#### `emergency_events`
Stores all SOS events
- `id` (uuid) - Primary key
- `child_id` (uuid) - References profiles
- `latitude`, `longitude` (numeric) - GPS coordinates
- `location_accuracy` (numeric, optional) - GPS accuracy
- `silent_mode` (boolean) - Silent alert flag
- `status` (text) - 'active', 'acknowledged', or 'resolved'
- `acknowledged_by` (uuid, optional) - Parent who acknowledged
- `acknowledged_at`, `resolved_at` (timestamptz, optional) - Timestamps
- `notes` (text, optional) - Additional notes
- `created_at` - Timestamp

#### `schools`
School information for geofencing
- `id` (uuid) - Primary key
- `name` (text) - School name (BBS Cora Berliner)
- `latitude`, `longitude` (double precision) - School GPS coordinates
- `geofence_radius_meters` (integer) - Safety zone radius (1000m)
- `created_at` - Timestamp

#### `sos_events`
Demo-mode SOS events
- `id` (uuid) - Primary key
- `child_id` (text) - Child identifier
- `latitude`, `longitude` (double precision) - Event GPS coordinates
- `location_accuracy` (numeric, optional) - GPS accuracy
- `status` (text) - 'active', 'acknowledged', or 'resolved'
- `acknowledged_at`, `resolved_at` (timestamptz, optional) - Timestamps
- `created_at` - Timestamp

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)
- Modern web browser with geolocation support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd safekid
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**

   The `.env` file should contain:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**

   The database schema has been automatically created via Supabase migrations. The following tables are set up:
   - `profiles` - User profiles
   - `family_links` - Parent-child connections
   - `emergency_events` - SOS events

5. **Run Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

6. **Build for Production**
   ```bash
   npm run build
   ```

## Demo Mode

The application includes a built-in demo mode for presentations and testing:

- **Child App:** Simulates SOS button press without creating real database entries
- **Parent App:** Shows example emergency events with mock data
- Demo mode is clearly indicated in the UI
- No actual notifications are sent in demo mode

## Security & Privacy

### Data Protection
- **GDPR Compliant:** All data handling follows European data protection regulations
- **Minimal Data Collection:** Only essential information is stored
- **Encrypted Communication:** All data transmission is encrypted via HTTPS
- **Row Level Security:** Database-level security policies prevent unauthorized access

### Authentication
- Secure password-based authentication via Supabase Auth
- Session management with automatic token refresh
- Role-based access control (parent/child roles)

### Location Data
- GPS coordinates only captured during SOS events
- Location accuracy metadata included for reliability assessment
- Parents can only see locations of their linked children

## Geofencing Technology (BBS Cora Berliner)

SafeKid implements intelligent geofencing specifically for BBS Cora Berliner to balance student safety with privacy protection.

### How Geofencing Works

**School Safety Zone:**
- BBS Cora Berliner location: Nußriede 4, 30627 Hannover
- Coordinates: 52.38875° N, 9.81001° E
- Geofence radius: 1000 meters (1 km)

**Notification Logic:**
- **Parents:** Always receive ALL emergency alerts from their children, regardless of location
- **School (BBS Cora Berliner):** Only receives alerts when the child is within 1 km of the school
- **Outside geofence:** School receives no notification, protecting family privacy

**Distance Calculation:**
- Uses Haversine formula for accurate earth-surface distance
- Accounts for Earth's curvature
- Provides meter-accurate geofence boundaries

### Privacy Protection

The geofencing system ensures:
- Schools only see emergencies in their immediate area
- Family incidents away from school remain private
- No continuous location tracking
- Only emergency-triggered location data
- Clear visual feedback of distance from school

For detailed technical documentation, see [GEOFENCING.md](GEOFENCING.md).

## Usage Guide

### For Parents

1. **Registration**
   - Create an account with role "parent"
   - Verify email address

2. **Link with Child**
   - Add child's account ID
   - Wait for activation (or use demo mode)

3. **Monitoring**
   - Access Parent App
   - View active emergencies in real-time
   - Respond to alerts promptly

### For Children

1. **Setup**
   - Account created by parent/guardian
   - Review app with parent/guardian

2. **Using SOS**
   - Open Child App
   - Toggle silent mode if needed
   - Press large red SOS button
   - Wait for parent response

3. **Important**
   - Only use for real emergencies
   - Call 110/112 for immediate danger

## Project Context

### Educational Purpose
SafeKid is a **Fachabitur project** (advanced school project in Germany) specifically developed for **BBS Cora Berliner**, demonstrating:
- Full-stack web development
- Database design and security
- UX/UI for different user groups
- Real-world problem solving
- Professional software architecture
- Geofencing and location-based services
- Privacy-preserving notification systems

### School Integration
- **Developed for:** BBS Cora Berliner, Nußriede 4, 30627 Hannover
- **Purpose:** Enhance student safety with privacy-respecting technology
- **Geofencing:** School-specific 1 km safety zone implementation
- **Privacy-first:** Protects student privacy outside school area

### Limitations
This is a **prototype** and **demonstration project**:
- Not intended for production use
- Limited testing and validation
- Demo mode for presentation purposes
- Educational context, not commercial product

### Learning Objectives
- Modern web technologies (React, TypeScript, Supabase)
- Responsive design principles
- Security best practices (RLS, authentication)
- Multi-language internationalization
- Real-time data synchronization
- User-centered design

## Multi-Language Support

SafeKid supports three languages:
- **German (Deutsch)** - Primary language
- **English** - International accessibility
- **Turkish (Türkçe)** - Community inclusion

Language can be changed via the globe icon in the navigation bar.

## File Structure

```
safekid/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navigation.tsx  # Main navigation bar
│   │   └── Footer.tsx      # Site footer
│   ├── contexts/           # React context providers
│   │   ├── AuthContext.tsx      # Authentication state
│   │   └── LanguageContext.tsx  # i18n translations
│   ├── lib/                # Utilities and configs
│   │   └── supabase.ts     # Supabase client setup
│   ├── utils/              # Utility functions
│   │   └── geofencing.ts   # Geofence distance calculations
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Landing page
│   │   ├── Product.tsx     # Product information
│   │   ├── HowItWorks.tsx  # Process explanation
│   │   ├── Safety.tsx      # Privacy & security info
│   │   ├── FAQ.tsx         # Frequently asked questions
│   │   ├── Contact.tsx     # Project information
│   │   ├── ChildApp.tsx    # Child SOS interface
│   │   ├── ParentApp.tsx   # Parent dashboard
│   │   └── SchoolApp.tsx   # School dashboard (BBS Cora Berliner)
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── .env                    # Environment variables
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
└── README.md               # This file
```

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

# Run ESLint
npm run lint

# Type checking
npm run typecheck
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with geolocation support

## Contributing

This is an educational project and not open for contributions. However, feel free to:
- Fork for learning purposes
- Use as inspiration for similar projects
- Provide feedback for educational improvement

## Disclaimer

**IMPORTANT:** SafeKid is a school project created for demonstration and educational purposes only.

- This is NOT a production-ready application
- NOT a replacement for emergency services (110, 112)
- NOT intended for real-world emergency use
- Always call proper emergency services in danger situations

## License

Educational Project - Fachabitur 2024/2025

Created as part of a school curriculum. All rights reserved for educational purposes.

## Contact & Support

This is a Fachabitur project specifically developed for BBS Cora Berliner. For questions or information:
- Project Type: Advanced School Project (Fachabitur)
- School: BBS Cora Berliner, Hannover
- Year: 2024/2025
- Location: Hannover, Germany

## Acknowledgments

- **Supabase** - Backend infrastructure and authentication
- **React Team** - Frontend framework
- **Tailwind CSS** - Styling system
- **Lucide Icons** - Icon library
- **Vite** - Build tool and dev server

---

**Emergency Services Reminder:**
In acute danger situations, always call:
- **110** - Police (Polizei)
- **112** - Fire/Ambulance (Feuerwehr/Rettung)

SafeKid is a supportive tool, not a replacement for professional emergency response.
