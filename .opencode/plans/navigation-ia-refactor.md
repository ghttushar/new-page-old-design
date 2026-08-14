# Navigation IA Refactor — Enterprise SaaS Structure

Status: APPROVED (user: "Include Careers", "Internal, new tab", "/products")
Repo: ghttushar/anarix-website-final-state @ clone `C:\Users\ghttu\AppData\Local\Temp\opencode\view-inspect`

## Target primary navigation (spec order)
Home · Products ▼ · Case Studies · Company ▼ · Pricing · Contact Us

## Routes (`frontend/src/App.tsx`)
- `/products` → NEW Product Overview page (`pages/Products.tsx`)
- `/products/platform` → existing `WebsiteProduct` (Product.tsx content, unchanged)
- `/products/aan-ai` → existing `WebsiteAan`
- `/products/signals` → existing `WebsiteSignals`
- `/products/mcp` → existing `WebsiteMcp`
- REMOVE `<Route path="/products/*" element={<Navigate to="/product" replace />} />` (line 40 — would swallow new routes)
- Legacy redirects (keep backlinks working): `/product` → `/products/platform`, `/aan-ai` → `/products/aan-ai`, `/signals` → `/products/signals`, `/mcp` → `/products/mcp`

## New page: Product Overview (`frontend/src/website/pages/Products.tsx`)
- Hero: eyebrow "Products", h1 "Everything Anarix offers." + sub + CTA → /demo
- One premium section per product (Platform, AAN, Signals, MCP):
  - Platform: "Every signal, one platform." — reuse `DashboardPreview` + capability chips from CapabilityGrid data
  - AAN: "Because our AI glows." — compact chat-mock visual + 3 capability chips
  - Signals: "Three things deserve your attention." — compact signal-card mock + chips
  - MCP: "Your marketplace data. AI-ready." — compact tool-row mock + chips
- Each section: overview line, what-it-solves line, 3–4 capability chips, visual, "Learn more →" to its /products/* page
- NO Documentation section (spec: stays separate in menu only)
- Standard CTA section → /demo
- Follows PageLayout + existing Eyebrow/SectionHeading/gradient-headline patterns; reveal animations

## Navbar (`frontend/src/website/components/Navbar.tsx`)
- navItems reordered: Home(/) · Products(mega) · Case Studies(/case-studies) · Company(dropdown) · Pricing(/pricing) · Contact Us(/company/contact)
- Products mega menu (keeps panel styling/animations — bg-surface-elevated, rounded-2xl, border, shadow-strong, 0.15s motion):
  - Header: "PRODUCTS" + tagline "Build. Measure. Scale."
  - 2-col list, 5 items with title + description:
    - Product Overview → /products
    - Insight Engine Platform → /products/platform
    - AAN AI → /products/aan-ai
    - Signals → /products/signals
    - MCP → /products/mcp
  - Documentation ↗ → /documentation (internal, new tab, desc "Developer guides & APIs.")
  - Footer: "View Product Overview →" → /products (replaces "View all product features")
  - `NavItem` item type gains optional `desc?: string` and `external?: boolean`
- Company dropdown: About (/company/about), Careers (/company/career), Contact (/company/contact) — extensible type unchanged
- Active page highlighting: useLocation-based helper; active top-level item keeps the underline visible (scale-x-100 + text-foreground) + aria-current; active sub-items get text-foreground + bg-accent
- Keyboard/a11y: dropdown opens on focus-within (in addition to hover), Escape closes, aria-expanded/aria-haspopup on triggers, focus-visible rings
- Mobile drawer: same structure, product items show descriptions, same expand/collapse animations

## Link sweep
- `Footer.tsx`: productHref → "/products/platform", aanHref → "/products/aan-ai", signalsHref → "/products/signals", mcpHref → "/products/mcp"; add "Product Overview" → /products to Product column; keep About/Careers/Contact
- `Home.tsx:63`, `case-studies/primitives.tsx:280`, `AanPage.tsx:196`, `SignalsPage.tsx:320`, `McpPage.tsx:233`: "Explore the Platform" → /products/platform
- `AanWebsitePanel.tsx` PAGE_LABELS: add `/products` → "Product Overview", `/products/platform` → "Anarix Insight Engine", `/products/aan-ai` → "AAN AI", `/products/signals` → "Signals", `/products/mcp` → "Anarix MCP"
- `frontend/src/website/README.md`: refresh route table

## Case Studies
Already a single top-level link, no dropdown — unchanged.

## Verification
`npx tsc -b` → `npm run build` → commit ("website: enterprise IA navigation refactor — /products/* routes, mega menu, product overview") → push → verify live bundle hash + `/products` and `/products/platform` return 200 on the production URL.

## Out of scope
Content redesign of the 4 product pages; new Blog page; no vercel.json change needed (SPA rewrite already covers new paths).
