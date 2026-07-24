// ---------- Theme (light/dark) ----------
(function initTheme() {
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
})();

function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

// ---------- Mobile nav ----------
function toggleNav() {
  document.querySelector(".nav-links").classList.toggle("open");
}

// ---------- Highlight active nav link ----------
(function markActive() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });
})();

// ---------- Waveform divider (signature element) ----------
// Renders a small deterministic pseudo-signal trace as an inline SVG path,
// used as a section divider throughout the site.
function renderWaveforms() {
  document.querySelectorAll(".waveform-divider").forEach((el, idx) => {
    const w = 1000;
    const h = 28;
    const mid = h / 2;
    let d = `M0 ${mid}`;
    const points = 48;
    for (let i = 1; i <= points; i++) {
      const x = (w / points) * i;
      const t = i / points;
      // layered sine components for a "signal-like" trace, seeded by idx
      const amp = 9 * Math.exp(-Math.pow((t - 0.5) * 2.2, 2));
      const y =
        mid +
        amp *
          Math.sin(t * 26 + idx) *
          (0.6 + 0.4 * Math.sin(t * 6 + idx * 2));
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    el.setAttribute("viewBox", `0 0 ${w} ${h}`);
    el.setAttribute("preserveAspectRatio", "none");
    el.innerHTML = `
      <defs>
        <linearGradient id="waveform-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="var(--blue)"></stop>
          <stop offset="50%" stop-color="var(--rose)"></stop>
          <stop offset="100%" stop-color="var(--sage)"></stop>
        </linearGradient>
      </defs>
      <path d="${d}"></path>`;
  });
}
document.addEventListener("DOMContentLoaded", renderWaveforms);

// ---------- Publications: load + filter ----------
function initPublications() {
  const list = document.getElementById("pub-list");
  const filterBar = document.getElementById("pub-filter");
  if (!list) return;

  fetch("data/publications.json")
    .then((r) => r.json())
    .then((pubs) => {
      pubs.sort((a, b) => b.year - a.year);

      const topics = new Set();
      pubs.forEach((p) => (p.topics || []).forEach((t) => topics.add(t)));

      function render(filter) {
        list.innerHTML = "";
        pubs
          .filter((p) => filter === "all" || (p.topics || []).includes(filter))
          .forEach((p) => {
            const item = document.createElement("div");
            item.className = "pub-item";
            item.innerHTML = `
              <div class="pub-year">${p.year}</div>
              <div>
                <div class="pub-title">${p.title}</div>
                <div class="pub-authors">${p.authors}</div>
                <div class="pub-venue">${p.venue}</div>
                <div class="pub-links">
                  ${p.pdf ? `<a href="${p.pdf}" target="_blank" rel="noopener">PDF</a>` : ""}
                  ${p.code ? `<a href="${p.code}" target="_blank" rel="noopener">Code</a>` : ""}
                  ${p.bibtex ? `<a href="${p.bibtex}" target="_blank" rel="noopener">BibTeX</a>` : ""}
                  ${p.doi ? `<a href="${p.doi}" target="_blank" rel="noopener">DOI</a>` : ""}
                </div>
              </div>`;
            list.appendChild(item);
          });
      }

      if (filterBar) {
        const allBtn = document.createElement("button");
        allBtn.textContent = "All";
        allBtn.className = "active";
        allBtn.onclick = () => setActive(allBtn, "all");
        filterBar.appendChild(allBtn);

        topics.forEach((t) => {
          const btn = document.createElement("button");
          btn.textContent = t;
          btn.onclick = () => setActive(btn, t);
          filterBar.appendChild(btn);
        });
      }

      function setActive(btn, filter) {
        filterBar.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        render(filter);
      }

      render("all");
    })
    .catch(() => {
      list.innerHTML =
        '<p class="note">Could not load data/publications.json — if you are viewing this file locally (file://), publications will only load once the site is served over http/https (e.g. GitHub Pages, or `python3 -m http.server`).</p>';
    });
}
document.addEventListener("DOMContentLoaded", initPublications);
