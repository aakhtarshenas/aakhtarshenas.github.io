# azimakhtarshenas.github.io

A plain HTML/CSS/JS academic site — no build step, no framework, works directly on GitHub Pages.

## 1. Preview locally

```bash
cd azimakhtarshenas-site
python3 -m http.server 8000
# open http://localhost:8000
```

(Publications won't load if you just double-click index.html, because `fetch()` needs a real
server — even the simple one above is enough.)

## 2. What to replace before publishing

| What | Where |
|---|---|
| Your photo | `assets/img/profile.jpg` (falls back to a placeholder until you add this) |
| Project photos | `assets/img/projects/*.jpg` |
| CV PDF | `assets/cv/CV_Azim_Akhtarshenas.pdf` |
| Publications | `data/publications.json` — one object per paper, no HTML editing needed |
| Google Scholar / GitHub / LinkedIn links | search-and-replace `YOUR_ID`, `YOUR_LINKEDIN`, and `azimakhtarshenas` (GitHub) across the `.html` files |
| Email | `contact.html` — replace the placeholder mailto address |
| Bio text on Home | `index.html`, the `.bio` section |
| Research card text | `research.html` |
| Teaching entries | `teaching.html` |
| News entries | `news.html` |
| Project descriptions | `projects.html` |
| Map embed | `contact.html`, the `.map-frame` iframe `src` (get the exact embed URL from Google Maps → Share → Embed a map, for your actual building) |

Every placeholder is plain text or a plain `<a href="...">` — there's no templating engine, so
Ctrl/Cmd+F for the strings above works fine.

## 3. Publications data format

Edit `data/publications.json`:

```json
{
  "year": 2026,
  "title": "Paper title",
  "authors": "A. Akhtarshenas, et al.",
  "venue": "Conference or journal name",
  "topics": ["Signal Processing", "Wireless Communications"],
  "pdf": "https://.../paper.pdf",
  "code": "https://github.com/...",
  "bibtex": "assets/bib/paper.bib",
  "doi": "https://doi.org/..."
}
```

`topics` drives the filter buttons on the Publications page automatically — add a new topic
string and a new filter button appears, no code changes needed. Leave any link field as `""`
to hide that button for a given paper.

To pull real data from Google Scholar: Scholar doesn't offer a public export API, but you can
export your BibTeX library (Scholar profile → checkboxes → Export → BibTeX) and convert it to
this JSON format — ask an LLM to do the conversion for you if you'd like, it's a quick task.

## 4. Deploy to GitHub Pages

1. Create a repo named exactly `azimakhtarshenas.github.io` under your GitHub account.
2. Push these files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/azimakhtarshenas/azimakhtarshenas.github.io.git
   git push -u origin main
   ```
3. In the repo Settings → Pages, source should already default to the `main` branch root for a
   `username.github.io` repo. Your site will be live at `https://azimakhtarshenas.github.io`
   within a minute or two.
4. Later, buy `azimakhtarshenas.com` and point it at GitHub Pages: add a `CNAME` file containing
   just the domain name to the repo root, then configure your registrar's DNS per
   [GitHub's custom domain docs](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).

## 5. Notes on the two features you asked about but that aren't included yet

- **Contact form**: a static site can't process form submissions itself. The simplest
  no-backend options are [Formspree](https://formspree.io) or [Getform](https://getform.io) —
  free tiers exist; you'd add a `<form action="https://formspree.io/f/yourID" method="POST">`
  in `contact.html`. Say the word and I can wire this in once you've picked a provider.
- **Privacy-friendly analytics**: [Plausible](https://plausible.io) or
  [GoatCounter](https://goatcounter.com) both work by dropping one `<script>` tag in each page's
  `<head>` — GoatCounter has a free tier for personal sites. I left this out since it needs an
  account first; happy to add the snippet once you have one.

## Design notes

- Palette: white/near-white backgrounds, deep academic blue (`#1e4d8b`) accents, dark
  slate-navy text — no black. Full dark mode via the toggle in the nav (persisted in
  `localStorage`, respects OS preference on first visit).
- Type: Source Serif 4 for headings (academic gravitas without being a cliché slab serif),
  Inter for body text, JetBrains Mono for tags/dates/metadata — a small nod to the
  signal-processing/DSP side of your work.
- Signature element: the thin waveform trace used as a section divider on every page is
  generated in `assets/js/main.js` (`renderWaveforms`) rather than being a static image —
  a nod to RF/signal work rather than a generic `<hr>`.
