/* ============================================================
   Nguyen Viet Hoang — Phase 2 interactions
   Publications sourced from public/assets/research/papers/papers-metadata.md
   ============================================================ */

const PUBLICATIONS = [
  {
    title: "A comprehensive analysis of the immune system in healthy Vietnamese people",
    year: 2024, journal: "Heliyon", category: "Immunology & Sepsis", role: "Co-author",
    featured: true,
    desc: "Reference profiling of immune-cell subsets and cytokine parameters in healthy Vietnamese adults, supporting population-specific interpretation of immune biomarkers.",
    links: { Publisher: "https://www.cell.com/heliyon/fulltext/S2405-8440(24)06678-7", DOI: "https://doi.org/10.1016/j.heliyon.2024.e30647", PubMed: "https://pubmed.ncbi.nlm.nih.gov/38765090/", PDF: "public/assets/research/papers/A comprehensive analysis of the immune system in healthy Vietnamese people.pdf" }
  },
  {
    title: "Molecular analysis of immune cell subsets and cytokine profiles in septic Vietnamese patients",
    year: 2026, journal: "Clinical and Experimental Medicine", category: "Immunology & Sepsis", role: "Co-author",
    featured: true,
    desc: "Comprehensive immune profiling of Vietnamese septic patients, highlighting cellular and cytokine signatures associated with survival outcomes.",
    links: { Publisher: "https://link.springer.com/article/10.1007/s10238-025-01862-1", DOI: "https://doi.org/10.1007/s10238-025-01862-1", PubMed: "https://pubmed.ncbi.nlm.nih.gov/41348239/", PDF: "public/assets/research/papers/Molecular analysis of immune cell subsets and cytokine profiles in septic Vietnamese patients.pdf" }
  },
  {
    title: "Suboptimal knee prosthesis design for Vietnamese women: a CT-based arthrometric study",
    year: 2025, journal: "Folia Morphologica", category: "Orthopaedics & 3D Medical Technology", role: "Co-author",
    featured: true,
    desc: "A CT-based analysis of Vietnamese female knee morphology, showing limitations of available knee prosthesis designs and supporting population-adapted implant development.",
    links: { Publisher: "https://journals.viamedica.pl/folia_morphologica/article/view/103066", DOI: "https://doi.org/10.5603/fm.103066", PubMed: "https://pubmed.ncbi.nlm.nih.gov/39927706/", PDF: "public/assets/research/papers/Suboptimal knee prosthesis design for Vietnamese women a computed tomography-based arthrometric study.pdf" }
  },
  {
    title: "Diagnostic accuracy of contrast enema for Hirschsprung disease during COVID-19 service disruption in Vietnam",
    year: 2026, journal: "BMJ Open", category: "Paediatric Surgery & Diagnostic Imaging", role: "Statistical analysis & methodology",
    featured: false,
    desc: "A retrospective diagnostic-accuracy study assessing contrast enema as a pragmatic triage tool for suspected Hirschsprung disease during COVID-19 service disruption.",
    links: { Publisher: "https://bmjopen.bmj.com/content/16/5/e111494", DOI: "https://doi.org/10.1136/bmjopen-2025-111494", PDF: "public/assets/research/papers/What is the diagnostic accuracy of contrast enema for Hirschsprung disease during COVID-19 service disruption in Vietnam - A retrospective study.pdf" }
  },
  {
    title: "Aspirations to study medicine, perceptions of a good doctor, and specialty choice among medical students",
    year: 2025, journal: "PLOS One", category: "Medical Education & Career Development", role: "Co-author",
    featured: false,
    desc: "A mixed-methods study on how medical students' motivations and evolving professional values shape specialty preferences.",
    links: { Publisher: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0326266", DOI: "https://doi.org/10.1371/journal.pone.0326266", PDF: "public/assets/research/papers/Aspirations to study medicine, perceptions of a good doctor, and their influence on specialty choice among medical students.pdf" }
  },
  {
    title: "Do structured career counselling initiatives influence specialty preferences? A longitudinal study",
    year: 2025, journal: "BMJ Open", category: "Medical Education & Career Development", role: "Co-author",
    featured: false,
    desc: "A longitudinal study evaluating how structured career counselling, mentoring, and clinical exposure coincide with changes in specialty preferences.",
    links: { Publisher: "https://bmjopen.bmj.com/content/15/5/e099815", DOI: "https://doi.org/10.1136/bmjopen-2025-099815", PubMed: "https://pubmed.ncbi.nlm.nih.gov/40374226/", PDF: "public/assets/research/papers/Do structured career counselling initiatives influence specialty preferences in medical students - A longitudinal observational survey study.pdf" }
  },
  {
    title: "Faculty development in health professions education: needs, challenges, and opportunities in Vietnam",
    year: 2026, journal: "BMC Medical Education", category: "Faculty Development & Health Professions Education", role: "Co-author",
    featured: false,
    desc: "A needs-assessment study identifying faculty development priorities, implementation barriers, and preferred training formats in a Vietnamese context.",
    links: { Publisher: "https://link.springer.com/article/10.1186/s12909-025-08341-x", DOI: "https://doi.org/10.1186/s12909-025-08341-x", PubMed: "https://pubmed.ncbi.nlm.nih.gov/41331598/", PDF: "public/assets/research/papers/Faculty development in health professions education - exploring need assessment, challenges, and opportunities in Vietnam.pdf" }
  },
  {
    title: "The impact of a longitudinal mentorship program on medical students: a mixed-methods study",
    year: 2025, journal: "PLOS One", category: "Medical Education & Career Development", role: "Co-author",
    featured: false,
    desc: "A mixed-methods evaluation of how sustained mentorship supports career confidence, specialty decision-making, and professional identity formation.",
    links: { Publisher: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0338476", DOI: "https://doi.org/10.1371/journal.pone.0338476", PubMed: "https://pubmed.ncbi.nlm.nih.gov/41348803/", PDF: "public/assets/research/papers/The impact of a longitudinal mentorship program on medical students A mixed-methods study.pdf" }
  }
];

const featureEl = document.getElementById("pubFeature");
const listEl    = document.getElementById("pubList");
const filtersEl = document.getElementById("pubFilters");
const categories = ["All", ...Array.from(new Set(PUBLICATIONS.map(p => p.category)))];

const linksHTML = (links, sep = "") =>
  Object.entries(links)
    .map(([label, url]) => `<a href="${url}" target="_blank" rel="noopener">${label}</a>`)
    .join(sep);

function featureHTML(p) {
  return `<article class="pub-feature">
    <div class="pub-feature__meta">
      <span class="pub-feature__cat">${p.category}</span>
      ${p.featured ? '<span class="tagx">Featured</span>' : ""}
      <span class="pub-feature__yr">${p.year}</span>
    </div>
    <h3>${p.title}</h3>
    <p class="journal">${p.journal}</p>
    <p class="desc">${p.desc}</p>
    <p class="role">Role — ${p.role}</p>
    <div class="linkrow">${linksHTML(p.links)}</div>
  </article>`;
}

function itemHTML(p) {
  return `<div class="pub-item">
    <span class="pub-item__yr">${p.year}</span>
    <div class="pub-item__main">
      <h4>${p.title}</h4>
      <p class="sub">${p.journal} · ${p.role}</p>
    </div>
    <div class="pub-item__links">${linksHTML(p.links)}</div>
  </div>`;
}

function render(cat) {
  const list = cat === "All" ? PUBLICATIONS : PUBLICATIONS.filter(p => p.category === cat);
  const sorted = [...list].sort((a, b) => (b.featured - a.featured) || (b.year - a.year));
  const [feature, ...rest] = sorted;
  featureEl.innerHTML = feature ? featureHTML(feature) : "";
  listEl.innerHTML = rest.map(itemHTML).join("");
}

filtersEl.innerHTML = categories
  .map((c, i) => `<button class="fbtn ${i === 0 ? "active" : ""}" data-cat="${c}">${c}</button>`)
  .join("");
filtersEl.addEventListener("click", e => {
  const btn = e.target.closest(".fbtn");
  if (!btn) return;
  filtersEl.querySelectorAll(".fbtn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  render(btn.dataset.cat);
});
render("All");

/* ---------- Marquee: duplicate track for seamless loop ---------- */
const marquee = document.getElementById("marquee");
if (marquee) marquee.innerHTML += marquee.innerHTML;

/* ---------- Nav: solid on scroll + mobile toggle ---------- */
const nav = document.getElementById("nav");
const menu = document.getElementById("menu");
const toggle = document.getElementById("toggle");
const onScroll = () => nav.classList.toggle("solid", window.scrollY > window.innerHeight * 0.7);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
toggle.addEventListener("click", () => menu.classList.toggle("open"));
menu.addEventListener("click", e => { if (e.target.tagName === "A") menu.classList.remove("open"); });

/* ---------- Reveal on scroll (respects reduced motion) ---------- */
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reveals = document.querySelectorAll("[data-reveal]");
if (reduce) {
  reveals.forEach(el => el.classList.add("in"));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
  reveals.forEach(el => io.observe(el));
}

/* ---------- Timeline coursework: accessible accordion (one open at a time) ---------- */
const cwTriggers = document.querySelectorAll(".timeline__trigger");

function closePanel(btn) {
  const panel = document.getElementById(btn.getAttribute("aria-controls"));
  btn.setAttribute("aria-expanded", "false");
  btn.closest(".timeline__item")?.classList.remove("is-open");
  if (panel) { panel.classList.remove("is-open"); panel.style.maxHeight = "0px"; }
}

function openPanel(btn) {
  const panel = document.getElementById(btn.getAttribute("aria-controls"));
  if (!panel) return;
  btn.setAttribute("aria-expanded", "true");
  btn.closest(".timeline__item")?.classList.add("is-open");
  panel.classList.add("is-open");
  panel.style.maxHeight = panel.scrollHeight + "px";
}

cwTriggers.forEach(btn => {
  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    cwTriggers.forEach(closePanel);
    if (!isOpen) openPanel(btn);
  });
});

/* keep an open panel sized correctly on resize (chip wrapping changes height) */
let cwResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(cwResizeTimer);
  cwResizeTimer = setTimeout(() => {
    document.querySelectorAll(".timeline__trigger[aria-expanded='true']").forEach(btn => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
    });
  }, 150);
});

/* ---------- Year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
