# Trixenora - GitHub Pages Configuration

This file configures the project for GitHub Pages hosting.

## To Deploy on GitHub Pages:

1. **Enable GitHub Pages in Repository Settings:**
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Select branch: `main`
   - Select folder: `/docs` or `/` (root)
   - Click Save

2. **Build and Deploy:**
   ```bash
   cd client
   npm run build
   ```

3. **Copy build to docs folder:**
   ```bash
   mkdir -p /docs
   cp -r client/build/* docs/
   ```

4. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

5. **Your site will be available at:**
   - https://trixenora-s.github.io/Trixenora/

## Custom Domain (Optional)

To use a custom domain like `trixenora.com`:

1. Create a `CNAME` file in `/docs` with your domain:
   ```
   trixenora.com
   ```

2. Configure DNS records at your domain registrar:
   - Add CNAME record: `www` → `trixenora-s.github.io`
   - Or add A records pointing to GitHub Pages IPs

3. Enable "Enforce HTTPS" in GitHub Pages settings

## SEO Configuration

The project includes:
- ✅ robots.txt for search engine crawling
- ✅ sitemap.xml for indexing
- ✅ Open Graph meta tags for social sharing
- ✅ Structured data (JSON-LD) for rich snippets
- ✅ Meta descriptions and keywords
- ✅ Canonical URLs

## Verify Search Engine Indexing

1. **Google Search Console:**
   - Add property: https://trixenora-s.github.io/Trixenora/
   - Submit sitemap.xml
   - Request indexing

2. **Bing Webmaster Tools:**
   - Add site
   - Submit sitemap

3. **Monitor:**
   - Check coverage in Google Search Console
   - Monitor search performance
   - Track clicks and impressions
