# Mobile Optimization Guide

This document outlines all mobile-specific optimizations implemented in GHL Hire to ensure an excellent experience on smartphones and tablets.

## Mobile Performance Targets

### Target Metrics
- **Mobile Lighthouse Score**: >90
- **First Contentful Paint (FCP)**: <1.8s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Time to Interactive (TTI)**: <3.8s on 4G
- **Cumulative Layout Shift (CLS)**: <0.1
- **Touch Target Size**: Minimum 44x44px

## Implemented Optimizations

### 1. Responsive Header with Mobile Menu ✅

**Features:**
- Hamburger menu for mobile devices (< 768px)
- Sticky header (stays at top when scrolling)
- Touch-friendly 44x44px minimum tap targets
- Smooth slide-down menu animation
- Prevents scroll when menu is open
- Auto-closes on navigation or outside click
- Separate mobile and desktop navigation states

**Components:**
- `/src/components/Header.tsx` - Full mobile/desktop navigation

### 2. Viewport Configuration ✅

**Meta Tags:**
```typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};
```

**Benefits:**
- Proper scaling on all devices
- Allows user zoom (accessibility)
- Theme color matches system preferences
- Respects device width

### 3. Touch-Friendly Interactions ✅

**Minimum Tap Targets:**
- All buttons: 44x44px minimum
- All links: 44x44px minimum
- Form inputs: 44px minimum height
- Navigation items: 44px minimum height

**Touch Optimizations:**
```css
/* Remove default tap highlight */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Custom blue tap feedback */
button:active,
a:active {
  -webkit-tap-highlight-color: rgba(59, 130, 246, 0.1);
}

/* Smooth scrolling on iOS */
.overflow-scroll,
.overflow-auto {
  -webkit-overflow-scrolling: touch;
}
```

### 4. Typography & Inputs ✅

**Font Sizing:**
- Minimum 16px for inputs (prevents iOS zoom)
- Responsive text sizes (sm:, md:, lg: breakpoints)
- Scalable units for better readability

**Input Optimization:**
```css
@media screen and (max-width: 768px) {
  input, select, textarea {
    font-size: 16px; /* Prevents auto-zoom on iOS */
  }
}
```

### 5. Safe Areas for Notched Devices ✅

**iPhone X+ Support:**
```css
@supports (padding: max(0px)) {
  body {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }
}
```

**Benefits:**
- Content doesn't hide behind notch
- Proper spacing on newer iPhones
- Works on all iOS devices

### 6. Responsive Breakpoints

**Tailwind Breakpoints Used:**
```
sm: 640px   - Small tablets
md: 768px   - Tablets
lg: 1024px  - Small laptops
xl: 1280px  - Desktops
2xl: 1536px - Large desktops
```

**Mobile-First Approach:**
- Base styles target mobile
- Progressive enhancement for larger screens
- `hidden md:flex` pattern for desktop-only features
- `md:hidden` pattern for mobile-only features

### 7. Performance Optimizations ✅

**Mobile-Specific:**
- System fonts (zero download time)
- Optimized images (AVIF/WebP)
- Code splitting per route
- Lazy loading images
- Minimal JavaScript for static pages

**Network Considerations:**
- Gzip compression enabled
- Optimized bundle sizes
- CDN caching for assets
- Reduced motion support

### 8. Accessibility ✅

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Features:**
- Respects user's motion preferences
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly

### 9. Text Size Adjustment ✅

**Prevents Layout Shift:**
```css
html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
```

**Benefits:**
- Consistent text sizing on orientation change
- No unexpected zoom on iOS
- Better control over typography

## Mobile Testing Checklist

### Before Launch
- [ ] Test on iPhone (iOS Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on tablet sizes (iPad, Android tablets)
- [ ] Test portrait and landscape orientations
- [ ] Test on slow 3G network
- [ ] Test touch interactions (tap, swipe, scroll)
- [ ] Test form inputs (no auto-zoom on focus)
- [ ] Test hamburger menu (open, close, navigation)
- [ ] Verify 44x44px minimum touch targets
- [ ] Test safe area insets on notched devices

### Device Testing
**High Priority:**
- iPhone 14/15 (standard size)
- iPhone SE (small screen)
- Samsung Galaxy S23
- iPad Air (tablet)

**Medium Priority:**
- iPhone 14 Pro Max (large screen)
- Google Pixel 7
- Samsung Galaxy Tab

### Browser Testing
- [ ] Safari iOS (latest)
- [ ] Chrome Android (latest)
- [ ] Samsung Internet
- [ ] Firefox Mobile

## Common Mobile Issues & Solutions

### Issue 1: Input Zoom on iOS
**Problem:** iOS automatically zooms when input is focused if font-size < 16px

**Solution:**
```css
@media screen and (max-width: 768px) {
  input {
    font-size: 16px;
  }
}
```

### Issue 2: Menu Not Closing
**Problem:** Mobile menu stays open after navigation

**Solution:** Add `onClick={() => setShowMobileMenu(false)}` to all navigation links

### Issue 3: Scroll Behind Menu
**Problem:** Page scrolls behind open mobile menu

**Solution:**
```typescript
useEffect(() => {
  if (showMobileMenu) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}, [showMobileMenu]);
```

### Issue 4: Small Touch Targets
**Problem:** Buttons/links too small to tap accurately

**Solution:** Use `min-h-[44px] min-w-[44px]` on all interactive elements

### Issue 5: Content Under Notch
**Problem:** Content hidden behind iPhone notch/camera

**Solution:** Use safe area insets (already implemented in globals.css)

## Mobile-Specific CSS Utilities

### Available Classes
```css
.mobile-hidden        /* Hide on mobile (< 640px) */
.mobile-full-width    /* Full width on mobile */
.mobile-stack         /* Stack vertically on mobile */
```

### Usage Examples
```tsx
// Hide element on mobile
<div className="mobile-hidden">Desktop only content</div>

// Full width on mobile, constrained on desktop
<div className="mobile-full-width max-w-md">
  Form or card
</div>

// Horizontal on desktop, vertical on mobile
<div className="flex mobile-stack gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## Responsive Component Examples

### Responsive Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

### Responsive Text
```tsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>
```

### Responsive Spacing
```tsx
<div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
  Content with responsive padding
</div>
```

### Responsive Flex Direction
```tsx
<div className="flex flex-col md:flex-row gap-4">
  {/* Stack on mobile, horizontal on desktop */}
</div>
```

## Performance Best Practices

### Images
```tsx
import Image from 'next/image';

// Mobile-optimized image
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  priority={false} // Lazy load by default
/>
```

### Conditional Rendering
```tsx
// Load heavy component only on desktop
{!isMobile && <HeavyDesktopComponent />}

// Or use media query in CSS
<div className="hidden md:block">
  <HeavyDesktopComponent />
</div>
```

### Mobile Navigation Best Practices
```tsx
// Close menu on navigation
const handleNavClick = () => {
  setShowMobileMenu(false);
};

// Close menu on outside click
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (!element.contains(event.target)) {
      setShowMobileMenu(false);
    }
  };
  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, []);
```

## Tools for Mobile Testing

### Chrome DevTools
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device preset or custom dimensions
4. Test responsive breakpoints
5. Throttle network to simulate 3G/4G

### Real Device Testing
- **BrowserStack**: Test on real devices remotely
- **LambdaTest**: Cross-browser mobile testing
- **Physical Devices**: Best for touch interactions

### Lighthouse Mobile Audit
```bash
# Run Lighthouse mobile audit
npx lighthouse https://ghlhire.com --preset=mobile --view
```

## Future Mobile Enhancements

### Planned Improvements
1. **PWA Support**: Add service worker for offline functionality
2. **Pull to Refresh**: Native-like refresh gesture
3. **Touch Gestures**: Swipe navigation where appropriate
4. **Bottom Navigation**: Consider bottom tab bar for key actions
5. **Haptic Feedback**: Vibration feedback on interactions (PWA)
6. **Install Prompt**: Add to home screen functionality
7. **Mobile-Specific Layouts**: Simplified mobile variants for complex pages

### Advanced Optimizations
- Intersection Observer for lazy loading
- Virtual scrolling for long lists
- Skeleton screens for all loading states
- Optimistic UI updates
- Offline mode with IndexedDB
- Push notifications (PWA)

## Monitoring Mobile Performance

### Metrics to Track
- Mobile vs Desktop traffic split
- Mobile bounce rate
- Mobile conversion rates
- Average load time on mobile
- Mobile error rates
- Touch interaction errors

### Analytics Events
```typescript
// Track mobile-specific events
analytics.track('mobile_menu_opened');
analytics.track('mobile_form_submitted');
analytics.track('mobile_cta_clicked');
```

## Resources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design Mobile Guidelines](https://m3.material.io/)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [MDN Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [iOS Safe Area](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

## Summary

All critical mobile optimizations have been implemented:
✅ Responsive navigation with hamburger menu
✅ Proper viewport configuration
✅ 44x44px minimum touch targets
✅ iOS-specific optimizations (zoom prevention, safe areas)
✅ Touch-friendly interactions
✅ Performance optimizations
✅ Accessibility support
✅ Comprehensive documentation

The app is now fully mobile-optimized and ready for mobile users!
