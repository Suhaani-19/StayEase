# StayEase Design Guidelines

## Design Approach
**Reference-Based: Airbnb-Inspired Booking Experience**

StayEase draws from Airbnb's proven design patterns for accommodation booking platforms, emphasizing trust, visual storytelling, and seamless booking flows. The design prioritizes large imagery, clean card layouts, and intuitive search experiences that make finding and booking accommodations effortless.

## Typography System

**Font Family**: Inter (Google Fonts) for UI, Merriweather for listing titles
- **Headings**: Inter Bold (text-4xl to text-6xl for hero, text-2xl to text-3xl for sections)
- **Listing Titles**: Merriweather Semi-Bold (text-xl to text-2xl)
- **Body Text**: Inter Regular (text-base, text-sm for metadata)
- **Price Display**: Inter Semi-Bold (text-2xl for primary, text-lg for secondary)
- **Buttons/CTAs**: Inter Medium (text-base to text-lg)

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8 for consistency
- Component padding: p-4, p-6, p-8
- Section spacing: py-12 (mobile), py-20 (desktop)
- Card gaps: gap-6 (grid layouts)
- Container max-width: max-w-7xl with px-4 (mobile), px-8 (desktop)

**Grid Systems**:
- Listing Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Featured Listings: grid-cols-1 md:grid-cols-2 (larger cards)
- Filters/Search Results: 70/30 sidebar split on desktop, stacked on mobile

## Component Library

### Navigation
- Sticky header with logo, search bar (desktop), login/signup CTAs
- Mobile: Collapsible menu with search prominence
- User menu dropdown (avatar, profile, bookings, logout)

### Hero Section
- Full-width image with overlay gradient
- Centered search interface with location input, date pickers, guest selector
- Headline: "Find your perfect stay" style messaging (text-5xl, bold)
- Background blur on search form (backdrop-blur-md, bg-white/20)

### Listing Cards
- Aspect ratio 4:3 image with rounded corners (rounded-xl)
- Image carousel with dot indicators
- Wishlist heart icon (top-right overlay)
- Title, location, price per night, rating (stars + count)
- Hover: Subtle lift effect (shadow-lg)

### Search & Filters
- Sidebar filters: Price range slider, property type checkboxes, amenities multi-select
- Active filter pills with remove icons
- Sort dropdown (Price, Rating, Popularity)
- Results count display

### Booking Flow
- Listing detail page: Large photo gallery (grid with featured main image)
- Sticky booking card (date selection, guest count, price breakdown, "Reserve" CTA)
- Host profile section with avatar, bio, response rate
- Reviews section with ratings breakdown, user testimonials
- Amenities grid with icons
- Location map embed

### Dashboard Components
- User stats cards (Total Bookings, Upcoming Stays, Saved Listings)
- Tabbed interface (My Bookings, My Listings, Profile Settings)
- Booking cards with status badges, dates, quick actions
- Listing management table with edit/delete actions

### Forms
- Consistent input styling: rounded-lg, border focus states
- Multi-step listing creation (Details → Photos → Pricing → Amenities)
- Drag-and-drop photo upload zone
- Inline validation feedback

### Trust Signals
- Verified badge icons
- Star ratings with review counts
- "Superhost" or premium badges
- Cancellation policy indicators

## Images

**Hero Section**: 
- Full-width hero image (1920×800px) showing inviting accommodation interior or scenic property exterior
- Warm, welcoming atmosphere (living room with natural light, poolside villa, cozy cabin)
- Subtle gradient overlay (dark to transparent, bottom to top) for text readability

**Listing Cards**: 
- High-quality property photos (400×300px minimum)
- Multiple images per listing (3-5 images in carousel)
- Mix of exterior, interior, amenities shots

**Listing Details Page**:
- Featured image (1200×800px) at top
- Gallery grid: 1 large + 4 smaller images (mosaic layout)
- Click to expand full-screen gallery

**Dashboard**:
- Property thumbnails (150×150px) in booking history
- Host avatars (circular, 48×48px)

**Placeholders**: Use subtle patterns/illustrations when no user photo exists

## Animations

**Minimal & Purposeful**:
- Card hover: Gentle scale (scale-105) and shadow transition
- Image carousel: Smooth fade transitions
- Filter application: Brief loading skeleton
- Form submission: Button loading spinner
- **No** scroll-triggered animations or parallax effects

## Key Interactions

- Search autocomplete with location suggestions
- Date picker with unavailable dates disabled
- Live price calculation as booking details change
- Instant filter application (no "Apply" button needed)
- Photo gallery with keyboard navigation
- Responsive image loading (blur-up technique)

---

**Design Philosophy**: Prioritize trust through imagery, clarity in pricing, and friction-free booking. Every element serves the goal of converting browsers into bookers while maintaining a premium, aspirational feel.