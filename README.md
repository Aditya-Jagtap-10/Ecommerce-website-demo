# Nettocart Global Enterprises — demo storefront

A static, front-end-only demo you can build on. No backend, no database,
no payment processing — just enough working UI (catalog, filtering,
search, cart) to give you a real starting point.

## Files

- `index.html` — page structure
- `styles.css` — all styling (custom properties at the top of the file
  control the palette/fonts — change those first before touching
  anything else)
- `script.js` — product data + cart logic, plain JavaScript, no framework

## How to run it locally

No build step needed. Either:
- Open `index.html` directly in a browser, or
- Serve it (recommended, avoids some browser file:// quirks):
  ```
  python3 -m http.server 8000
  ```
  then visit `http://localhost:8000`

## What's real vs. placeholder

**Working:** category filtering, live search, add/remove from cart,
quantity controls, running total, responsive layout down to mobile.

**Placeholder, by design:**
- `PRODUCTS` in `script.js` is a hardcoded array — swap it for a
  `fetch()` call to a real product API/database.
- The cart lives in a plain JS object in memory — it resets on page
  reload. A real store needs either a backend session/cart service,
  or persisted client-side state (with the user's consent, e.g. a
  cookie-based cart merged server-side at login).
- The "Checkout" button just shows a toast. Wire it to a real payment
  provider (see below).

## Suggested path to a real site

1. **Pick a stack.** For a small-to-mid catalog, a reasonable path:
   - Frontend: keep it simple (Next.js/Astro) or go framework-free like
     this demo, if the catalog stays small.
   - Backend/data: a managed Postgres (Supabase/Neon) or a headless
     commerce platform (Shopify, Medusa, Saleor) if you don't want to
     build order/inventory management yourself.
   - Payments: Stripe or Razorpay (Razorpay if you're accepting INR
     payments in India) both have hosted checkout you can integrate
     in an afternoon.
2. **Replace the product array** with a real data source once you have
   one — the render functions already expect the same shape
   (`id, name, desc, price, category, origin, emoji`), so swapping the
   emoji placeholder for a real image field is a one-line change in
   `script.js` and the `.product-media` CSS.
3. **Add auth + persistent cart** once you have a backend, so carts
   survive reloads and logins.
4. **Domain, hosting, and legal.** See the note on domain names below —
   run an actual trademark and registrar check before you commit to a
   name, since I can't verify real-time availability.

## On the domain name

I can't check live domain registration or trademark databases in real
time, so treat any name suggestion as a starting point, not a
clearance. Before you commit:
- Check registration status on a registrar (Namecheap, GoDaddy, Google
  Domains successor, etc.)
- Run a trademark search — for India, the IP India public search
  (ipindiaonline.gov.in); if you'll sell in the US too, USPTO's TESS
  (tmsearch.uspto.gov)
- Search the name + "ecommerce"/"store" to catch unregistered-but-active
  businesses trademark law also protects
