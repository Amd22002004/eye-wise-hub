
## Plan: Increase Font Sizes Across the Site

The user wants all small text enlarged. Currently many elements use `text-xs` (12px), `text-sm` (14px), and `text-[11px]` which are too small.

### Changes

**1. Global base styles (`src/index.css`)**
- Increase body base from 17px to 18px
- Increase `p, li, span, a` from `1rem` (16px) to `1.0625rem` (17px)
- Increase `.prose-medical` from 15px to 17px

**2. CategoryGrid.tsx**
- Subcategory tags: `text-[11px] sm:text-xs` → `text-xs sm:text-sm`
- Article count: `text-[11px] sm:text-xs` → `text-xs sm:text-sm`
- Category name: `text-base sm:text-lg` → `text-lg sm:text-xl`
- Description: `text-sm sm:text-base` → `text-base sm:text-lg`

**3. ArticleCard.tsx**
- Category label: `text-xs sm:text-sm` → `text-sm`
- Excerpt: `text-sm sm:text-base` → `text-base`
- Footer meta: `text-xs` → `text-sm`, author role `text-[11px]` → `text-xs`

**4. Navbar.tsx**
- Nav links: `text-sm` → `text-base`
- Mobile nav links: `text-sm` → `text-base`

**5. Footer.tsx**
- Legal info: `text-xs` → `text-sm`
- Copyright: `text-xs` → `text-sm`

**6. HeroSearch.tsx**
- Search input placeholder and text: ensure `text-base` minimum on mobile
