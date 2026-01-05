# WebUtilsPro - Free Developer Tools

A production-ready developer tools website built with Next.js, featuring 5 powerful tools optimized for Google AdSense approval and SEO.

## 🚀 Features

### Tools
1. **Regex Tester** - Test and debug regular expressions with real-time matching
2. **JSON ↔ CSV Converter** - Bidirectional JSON and CSV conversion
3. **Markdown → HTML** - Convert Markdown to HTML with live preview
4. **AI Error Explainer** - Get AI-powered explanations for programming errors
5. **Prompt Optimizer** - Optimize AI prompts for better results

### Technical Features
- ⚡ Next.js 14+ with App Router
- 🎨 Tailwind CSS for styling
- 📱 Fully responsive design
- 🔍 SEO optimized (600+ words per tool page)
- 🤖 AI-powered tools with rate limiting
- 💰 AdSense-ready ad placements
- 🔒 Privacy-focused (client-side processing for non-AI tools)
- ♿ Accessible and semantic HTML
- 📊 Structured data (JSON-LD) for rich results

## 📦 Installation

```bash
# Install dependencies (requires Node.js 18+ and npm)
npm install

# Copy environment variables
cp .env.example .env.local

# Add your AI API key to .env.local (optional, placeholder AI works without it)
# GEMINI_API_KEY=your_api_key_here
# or
# OPENAI_API_KEY=your_api_key_here

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 🛠️ Project Structure

```
dev-tools-website/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with SEO
│   ├── page.tsx                 # Home page
│   ├── about/                   # About page
│   ├── contact/                 # Contact page
│   ├── privacy/                 # Privacy policy
│   ├── terms/                   # Terms of service
│   ├── tools/                   # Tool pages
│   │   ├── regex-tester/
│   │   ├── json-to-csv/
│   │   ├── markdown-to-html/
│   │   ├── ai-error-explainer/
│   │   └── prompt-optimizer/
│   └── api/                     # API routes for AI tools
│       ├── ai-error/
│       └── optimize-prompt/
├── components/                   # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ToolLayout.tsx

│   └── tools/                   # Tool-specific components
│       ├── RegexTester.tsx
│       ├── JsonCsvConverter.tsx
│       ├── MarkdownConverter.tsx
│       ├── AiErrorExplainer.tsx
│       └── PromptOptimizer.tsx
├── lib/                         # Utility functions
│   ├── seo.ts                  # SEO helpers
│   └── rateLimit.ts            # Rate limiting
└── public/                      # Static files
    ├── robots.txt
    └── sitemap.xml
```

## 🎯 SEO Optimization

Each tool page includes:
- ✅ 600+ words of unique, helpful content
- ✅ Proper H1 with primary keyword
- ✅ Meta title and description
- ✅ "What this tool does" section
- ✅ "How to use" section with steps
- ✅ Example input/output
- ✅ FAQ section (5 questions)
- ✅ Internal linking to related tools
- ✅ Structured data (JSON-LD)
- ✅ Clean URLs and breadcrumbs

## 💰 AdSense Integration

Ad placements are ready but use placeholders. After AdSense approval:


2. Replace the placeholder div with actual AdSense code
3. Add your AdSense client ID
4. Configure ad slots and formats

Example:
```tsx
<ins className="adsbygoogle"
     style={{ display: 'block' }}
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
```

Add the AdSense script to `app/layout.tsx`:
```tsx
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossOrigin="anonymous"></script>
```

## 🤖 AI Tool Configuration

The AI tools (Error Explainer and Prompt Optimizer) currently use placeholder responses. To enable real AI:

### Option 1: Google Gemini
1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env.local`: `GEMINI_API_KEY=your_key_here`
3. Update API routes to use Gemini SDK

### Option 2: OpenAI
1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env.local`: `OPENAI_API_KEY=your_key_here`
3. Update API routes to use OpenAI SDK

The placeholder implementation shows exactly where to add your AI API calls.

## 🚀 Deployment to Hostinger

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload files:**
   - Upload the entire project to your Hostinger Node.js app directory
   - Ensure `.next`, `node_modules`, `public`, and all config files are included

3. **Configure Node.js:**
   - Set Node.js version to 18.x or higher
   - Entry point: `node_modules/next/dist/bin/next`
   - Arguments: `start`
   - Or use: `npm start`

4. **Set environment variables:**
   - Add `NEXT_PUBLIC_SITE_URL` with your domain
   - Add AI API keys if using real AI functionality

5. **Configure domain:**
   - Point your domain to the Node.js app
   - Update `NEXT_PUBLIC_SITE_URL` in environment variables

## 📝 Customization

### Change Site Name/Branding
- Update `app/layout.tsx` for site metadata
- Update `components/Header.tsx` and `components/Footer.tsx` for branding
- Update `public/sitemap.xml` with your domain

### Add More Tools
1. Create a new component in `components/tools/`
2. Create a new page in `app/tools/your-tool/page.tsx`
3. Add SEO content following the existing tool pages
4. Update navigation in Header and Footer
5. Add to sitemap.xml

### Modify Styling
- Colors: Edit `tailwind.config.ts`
- Global styles: Edit `app/globals.css`
- Component styles: Use Tailwind classes

## 🔒 Privacy & Security

- Non-AI tools process data entirely in the browser
- AI tools process data server-side but don't store it
- Rate limiting prevents abuse (10 requests/day per IP)
- No user tracking or data collection
- GDPR and privacy-compliant

## 📊 Performance

- Built-in Next.js optimizations
- Lazy loading of components
- Optimized images and fonts
- Fast client-side processing
- Minimal external dependencies

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues, visit the Contact page on the website.

---

Built with ❤️ using Next.js and Tailwind CSS
