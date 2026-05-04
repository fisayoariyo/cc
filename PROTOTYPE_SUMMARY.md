# DotCharis Consult - Complete Interactive Prototype

## Overview
A premium, multi-screen interactive prototype for DotCharis Consult featuring:
- **Real Estate Landing Page** - Cinematic hero with auto-transitions, Ken Burns effects, and luxury property showcase
- **Main Landing Page** - Google-style motion with smooth animations and engaging interactions
- **Properties Listing Page** - Filterable property grid with advanced search
- **Travel Services Page** - Comprehensive travel and mobility services showcase
- **About Page** - Company information, team, and values
- **Contact Page** - Full contact form with map integration placeholder

## Key Features Implemented

### 🎬 Cinematic Motion Effects
- **Auto-transitioning hero sections** (7-8 second intervals)
- **Ken Burns zoom effect** on background images (slow, elegant scale from 1 to 1.1)
- **Smooth fade transitions** between slides with 1.5s duration
- **Parallax text overlay** with staggered word animations
- **Subtle gradient overlays** for premium depth
- **Scroll indicators** with animated breathing effect

### 🎨 Premium Design System
- **Tailwind CSS v4** for styling
- **Motion (Framer Motion)** for all animations
- **Custom color palette**: Amber/Gold primary, Gray neutrals
- **Responsive breakpoints**: Mobile-first design
- **Lucide React** icons throughout

### 📱 Full Routing Structure
```
/ - Homepage with service overview
/real-estate - Real estate landing with cinematic hero
/real-estate/properties - Filterable properties listing
/travels - Travel services showcase
/about - Company information
/contact - Contact form and information
```

### 🧩 Components Created

1. **Navigation.tsx**
   - Sticky header with scroll-based transparency
   - Mobile responsive with hamburger menu
   - Active route highlighting with animated underline

2. **CinematicHero.tsx** ⭐
   - Auto-playing slide show
   - Ken Burns zoom effect
   - Fade transitions
   - Parallax content animation
   - Slide indicators
   - Scroll down prompt

3. **PropertyCard.tsx**
   - Hover effects with scale and zoom
   - Property details display
   - Call-to-action button
   - Responsive grid layout

4. **Footer.tsx**
   - Multi-column layout
   - Social media links
   - Quick navigation
   - Contact information

5. **ImageWithFallback.tsx**
   - Graceful image loading
   - Fallback placeholder SVG
   - Error handling

### 🎭 Motion & Animation Highlights

#### Homepage
- **Hero section**: Floating particle background with 20 animated dots
- **Service cards**: Staggered entrance animations (0.2s delays)
- **Hover effects**: Scale 1.02, subtle glow overlays
- **Stats counter**: Fade-in with scale animation
- **Scroll-triggered reveals**: All sections animate on viewport entry

#### Real Estate Page
- **Cinematic hero**: 3-slide carousel with auto-play
- **Featured properties**: Cascade animation (0.2s stagger)
- **City explorer**: Scale on hover (1.05)
- **Type cards**: Hover lift (-10px translate)

#### Travel Page
- **Service grid**: 6 cards with gradient backgrounds
- **Icon animations**: Scale 1.1 on card hover
- **Destination cards**: Ken Burns effect on background images
- **Process steps**: Sequential reveal with delays

#### Properties Listing
- **Filter panel**: Smooth height animation
- **Grid layout**: AnimatePresence for smooth item transitions
- **Pagination**: Scale buttons on hover/tap

### 📊 Mock Data Included
- 6 featured properties with realistic details
- 4 major cities (Ibadan, Lagos, Abuja, Ogun)
- 6 travel services with features
- 4 global destinations
- Team members with roles

### 🖼️ Images from Unsplash
All premium images sourced from Unsplash API:
- Luxury waterfront properties
- Modern architecture
- Dubai skyline
- International destinations
- Professional headshots

## Technical Stack

```json
{
  "framework": "React 18.3.1",
  "routing": "react-router 7.13.0",
  "styling": "Tailwind CSS 4.1.12",
  "animations": "motion (Framer Motion) 12.23.24",
  "icons": "lucide-react 0.487.0",
  "build": "Vite 6.3.5"
}
```

## Motion Timing Reference

| Element | Duration | Easing | Delay |
|---------|----------|--------|-------|
| Hero slide transition | 1.5s | easeInOut | - |
| Ken Burns zoom | 6-8s | linear | - |
| Text word reveal | 0.5s | easeOut | 0.1s stagger |
| Card entrance | 0.6s | easeOut | 0.1-0.2s |
| Hover lift | 0.4s | easeOut | - |
| Scroll indicator | 2s | - | Infinite loop |

## Responsive Breakpoints

- **Mobile**: < 768px (single column, hamburger menu)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3-4 columns)

## Color System

```css
Primary: Amber-600 (#D97706)
Hover: Amber-700 (#B45309)
Dark: Gray-900 (#111827)
Light: Gray-50 (#F9FAFB)
Text: Gray-700 (#374151)
```

## Next Steps for Development

1. **Supabase Integration**
   - Set up database schema
   - Implement authentication
   - Add real property data

2. **Additional Pages**
   - Individual property detail pages
   - Agent portal
   - Client dashboard
   - Admin dashboard

3. **Forms**
   - Property inquiry forms
   - Travel application forms
   - Construction brief submissions

4. **Performance**
   - Image optimization
   - Lazy loading
   - Code splitting

5. **SEO**
   - Meta tags
   - Sitemap
   - Structured data

## Usage

```bash
# Install dependencies
pnpm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Notes

- All animations are smooth and performant (60fps target)
- Mobile-first responsive design
- Accessibility considerations (ARIA labels, keyboard navigation)
- No external API calls (all data is mocked for prototype)
- Images use Unsplash CDN with optimized parameters

---

**Built with ❤️ for DotCharis Consult**
*Your Property. Your Journey. One Consultant.*
