# Pondok Pesantren Minnatul Huda - Website

## Overview

This is a modern, responsive website for Pondok Pesantren Minnatul Huda (an Islamic boarding school). The site provides information about the institution, its educational programs, achievements, facilities, and handles student registration. Built as a static multi-page website with dynamic content loading from JSON configuration, it emphasizes modern design with a green and teal color scheme, smooth animations, and mobile-first responsiveness.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Multi-Page Static Site with Client-Side Rendering**
- **Problem**: Need to present institutional information in an organized, navigable manner while maintaining content flexibility
- **Solution**: Multi-page HTML structure with shared CSS/JS and JSON-based content management
- **Rationale**: Static pages provide fast loading and SEO benefits while JSON configuration allows easy content updates without modifying HTML

**Key Pages**:
- `index.html` - Homepage with hero slider, statistics, programs overview
- `tentang.html` - About page (profile, vision/mission, values, curriculum, team)
- `prestasi.html` - Achievements page
- `unit.html` - Educational units page
- `gallery.html` - Photo gallery with filtering
- `daftar.html` - Registration form
- `login.html` - External portal redirect

### Content Management Strategy

**JSON Configuration File (`package.json`)**
- **Problem**: Need centralized content management without a backend CMS
- **Solution**: Store all site content, configuration, and text in the `content` field of `package.json`
- **Pros**: 
  - Single source of truth for all site content
  - Easy to update text without touching HTML
  - Maintains static site benefits while enabling content flexibility
- **Cons**: 
  - Not ideal for non-technical content editors
  - Limited by JSON structure

**Content Structure** includes:
- Site information (name, contact details, tagline)
- Hero slider content (images, titles, subtitles)
- Statistics data
- Programs, news, testimonials, FAQ entries
- Educational units information
- Gallery items with categorization

### Styling Architecture

**CSS Custom Properties & Component-Based Design**
- **Problem**: Maintain consistent theming across multiple pages with specific color requirements
- **Solution**: CSS custom properties defined in `:root` for colors, shadows, transitions, and spacing
- **Design System**:
  - Primary color: `#2d5f3f` (dark soft green)
  - Accent color: `#4fb3bf` (teal/tosca)
  - Consistent spacing, border radius, and shadow tokens
  - Responsive utilities and component classes

**Responsive Approach**: Mobile-first design with flexible container system

### JavaScript Architecture

**Client-Side Data Loading & DOM Manipulation**
- **Problem**: Populate pages with dynamic content while maintaining static HTML structure
- **Solution**: `script.js` fetches `package.json`, parses content, and dynamically populates page elements
- **Key Functions**:
  - `loadData()` - Fetches JSON configuration
  - `initializePage()` - Routes to appropriate content population based on page
  - Page-specific populate functions (`populateHero()`, `populatePrograms()`, etc.)
  - Interactive features (sliders, modals, mobile menu, scroll effects)

**Interactive Features**:
- Auto-rotating hero slider (5000ms interval)
- Count-up statistics animation
- Modal system for program details
- Gallery filtering
- Mobile hamburger menu
- Smooth scroll navigation
- Sticky header on scroll

### Form Handling & External Integration

**Registration Form with Telegram Integration**
- **Problem**: Collect student registration data without a backend database
- **Solution**: Form submission sends data directly to Telegram bot via API
- **Implementation**: JavaScript captures form data, formats it, and sends via Telegram Bot API
- **Rationale**: No server infrastructure needed, instant notifications to administrators

**Login Redirect**
- External portal login redirects to `portal.minnatulhuda.sch.id/login`
- Uses meta refresh for automatic redirection

## External Dependencies

### Development Tools

**Live Server**
- **Package**: `live-server` v1.2.2
- **Purpose**: Local development server with live reload
- **Usage**: `npm run dev` starts server on port 5000

### Content Delivery Networks

**Image Hosting**
- **Unsplash**: Hero slider and content images via direct URLs
- **Placeholder Service**: Temporary logo placeholder (via.placeholder.com)
- **Rationale**: No asset management infrastructure needed for demonstration

### External Services

**Telegram Bot API**
- **Purpose**: Registration form data submission
- **Integration**: Direct API calls from client-side JavaScript
- **Configuration**: Bot token and chat ID stored in `package.json`

**External Portal**
- **URL**: `portal.minnatulhuda.sch.id/login`
- **Purpose**: Separate authentication system for students/staff
- **Integration**: Simple redirect from `login.html`

### Third-Party Assets

**SVG Icons**
- Custom inline SVG icons for navigation, features, and UI elements
- No external icon library dependency

**Fonts**
- System font stack: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- No external font loading for performance

### Browser APIs Used

- **Fetch API**: Load JSON configuration
- **Intersection Observer**: Scroll-triggered animations (statistics counter)
- **DOM Manipulation APIs**: Dynamic content population
- **LocalStorage/SessionStorage**: Potential for form data persistence (implementation dependent)