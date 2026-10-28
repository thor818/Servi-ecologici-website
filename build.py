#!/usr/bin/env python3
"""Genera il sito statico del giornale in docs/ a partire da articoli/*.md.

Uso:  python3 build.py
Nessuna dipendenza esterna: solo la libreria standard di Python.
"""
import html
import json
import re
import shutil
from datetime import date, datetime, timezone
from pathlib import Path

ROOT = Path(__file__).parent
ART_DIR = ROOT / "articoli"
OUT = ROOT / "docs"
CONFIG = json.loads((ROOT / "config.json").read_text(encoding="utf-8"))

CATEGORIE = CONFIG["categorie"]
MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio",
        "agosto", "settembre", "ottobre", "novembre", "dicembre"]
GIORNI = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"]


# ---------------------------------------------------------------- lettura

def leggi_articolo(path):
    testo = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", testo, re.S)
    if not m:
        raise SystemExit(f"{path.name}: manca l'intestazione --- ... ---")
    meta, corpo = {}, m.group(2).strip()
    fonti = []
    for riga in m.group(1).splitlines():
        if not riga.strip():
            continue
        if riga.startswith("  - ") or riga.startswith("- "):
            voce = riga.split("- ", 1)[1].strip()
            nome, _, url = voce.partition("|")
            fonti.append({"nome": nome.strip(), "url": url.strip()})
            continue
        chiave, _, valore = riga.partition(":")
        meta[chiave.strip()] = valore.strip().strip('"')
    for campo in ("titolo", "data", "categoria", "sommario"):
        if not meta.get(campo):
            raise SystemExit(f"{path.name}: campo obbligatorio mancante: {campo}")
    if meta["categoria"] not in CATEGORIE:
        raise SystemExit(f"{path.name}: categoria sconosciuta '{meta['categoria']}'. "
                         f"Valide: {', '.join(CATEGORIE)}")
    if not fonti:
        raise SystemExit(f"{path.name}: serve almeno una fonte")
    meta["fonti"] = fonti
    meta["data_obj"] = date.fromisoformat(meta["data"])
    meta["slug"] = path.stem
    meta["corpo"] = corpo
    meta["luogo"] = meta.get("luogo", "Mondo")
    meta["parole"] = len(corpo.split())
    return meta


def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)",
               lambda m: f'<a href="{html.escape(m.group(2))}" rel="noopener" target="_blank">{m.group(1)}</a>', t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<!\*)\*(?!\*)(.+?)\*", r"<em>\1</em>", t)
    return t


def markdown(md):
    out = []
    for blocco in re.split(r"\n\s*\n", md.strip()):
        righe = blocco.strip().splitlines()
        if blocco.startswith("## "):
            out.append(f"<h2>{inline(blocco[3:].strip())}</h2>")
        elif blocco.startswith("> "):
            out.append("<blockquote>" + inline(" ".join(r.lstrip("> ") for r in righe)) + "</blockquote>")
        elif all(r.lstrip().startswith(("- ", "* ")) for r in righe):
            out.append("<ul>" + "".join(f"<li>{inline(r.lstrip()[2:])}</li>" for r in righe) + "</ul>")
        else:
            out.append("<p>" + inline(" ".join(righe)) + "</p>")
    return "\n".join(out)


# ---------------------------------------------------------------- formati

def data_lunga(d):
    return f"{d.day} {MESI[d.month - 1]} {d.year}"


def data_testata(d):
    return f"{GIORNI[d.weekday()].capitalize()} {data_lunga(d)}"


def minuti(parole):
    return max(1, round(parole / 200))


def esc(t):
    return html.escape(t, quote=True)


# ---------------------------------------------------------------- template

def pagina(titolo, corpo, rel="", descrizione=None, canonical="", og_tipo="website"):
    desc = esc(descrizione or CONFIG["descrizione"])
    url_sito = CONFIG["url"].rstrip("/")
    nav = "".join(
        f'<a href="{rel}categoria/{k}.html">{esc(v["nome"])}</a>' for k, v in CATEGORIE.items())
    titolo_completo = esc(titolo + " · " + CONFIG["nome"]) if titolo else esc(CONFIG["nome"] + " · " + CONFIG["motto"])
    oggi = data_testata(date.today())
    contatto = (f' Segnalazioni e correzioni: <a href="mailto:{esc(CONFIG["email"])}">{esc(CONFIG["email"])}</a>.'
                if CONFIG.get("email") else "")
    return f"""<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titolo_completo}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{esc(titolo or CONFIG['nome'])}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="{og_tipo}">
<meta property="og:url" content="{url_sito}/{canonical}">
<meta property="og:site_name" content="{esc(CONFIG['nome'])}">
<link rel="canonical" href="{url_sito}/{canonical}">
<link rel="alternate" type="application/rss+xml" title="{esc(CONFIG['nome'])}" href="{rel}feed.xml">
<link rel="icon" href="{rel}static/logo.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{rel}static/style.css">
</head>
<body>
<div class="topbar"><div class="wrap">
  <span>{oggi}</span>
  <span class="topbar-r"><a href="{rel}chi-siamo.html">Chi siamo</a><a href="{rel}feed.xml">RSS</a></span>
</div></div>
<header class="masthead"><div class="wrap">
  <a class="brand" href="{rel}index.html">
    <img src="{rel}static/logo.svg" alt="" width="56" height="56">
    <span><span class="brand-name">{esc(CONFIG['nome'])}</span>
    <span class="brand-motto">{esc(CONFIG['motto'])}</span></span>
  </a>
</div>
<nav class="nav"><div class="wrap">
  <a href="{rel}index.html">Prima pagina</a>{nav}<a href="{rel}archivio.html">Archivio</a>
</div></nav>
</header>
<main class="wrap">
{corpo}
</main>
<footer class="footer"><div class="wrap">
  <div class="footer-brand"><img src="{rel}static/logo.svg" alt="" width="40" height="40">
    <div><strong>{esc(CONFIG['nome'])}</strong><br>{esc(CONFIG['footer'])}</div></div>
  <p class="footer-note">Gli articoli sono sintesi originali scritte dalla redazione a partire dalle fonti citate in fondo a ogni pezzo,
  a cui rimandiamo per approfondire.{contatto}</p>
  <p class="footer-note">© {date.today().year} {esc(CONFIG['editore'])}</p>
</div></footer>
</body>
</html>
"""


def copertina(a, rel, grande=False):
    cat = CATEGORIE[a["categoria"]]
    return (f'<div class="cover cover-{a["categoria"]}{" cover-xl" if grande else ""}" aria-hidden="true">'
            f'<img src="{rel}static/icone/{a["categoria"]}.svg" alt=""><span>{esc(cat["nome"])}</span></div>')


def meta_riga(a):
    return (f'<span class="kicker kicker-{a["categoria"]}">{esc(CATEGORIE[a["categoria"]]["nome"])}</span>'
            f'<span class="dot">·</span><span>{esc(a["luogo"])}</span>'
            f'<span class="dot">·</span><time datetime="{a["data"]}">{data_lunga(a["data_obj"])}</time>')


def scheda(a, rel, classe="card"):
    return f"""<article class="{classe}">
  <a href="{rel}articoli/{a['slug']}.html" class="card-link">
    {copertina(a, rel)}
    <div class="card-body">
      <div class="meta">{meta_riga(a)}</div>
      <h3>{esc(a['titolo'])}</h3>
      <p>{esc(a['sommario'])}</p>
    </div>
  </a>
</article>"""


def riga_lista(a, rel):
    return f"""<li><a href="{rel}articoli/{a['slug']}.html">
  <div class="meta">{meta_riga(a)}</div>
  <h3>{esc(a['titolo'])}</h3><p>{esc(a['sommario'])}</p></a></li>"""


# ---------------------------------------------------------------- pagine

def home(articoli):
    if not articoli:
        return pagina("", "<p>Nessun articolo ancora.</p>")
    rel = ""
    primo, *resto = articoli
    secondari, altri = resto[:4], resto[4:16]
    lati = "".join(f"""<li><a href="articoli/{a['slug']}.html"><div class="meta">{meta_riga(a)}</div>
      <h3>{esc(a['titolo'])}</h3></a></li>""" for a in secondari)
    corpo = f"""
<section class="lead">
  <article class="lead-main">
    <a href="articoli/{primo['slug']}.html" class="card-link">
      {copertina(primo, rel, grande=True)}
      <div class="meta">{meta_riga(primo)}</div>
      <h1>{esc(primo['titolo'])}</h1>
      <p class="standfirst">{esc(primo['sommario'])}</p>
    </a>
  </article>
  <aside class="lead-side">
    <h2 class="section-label">In evidenza</h2>
    <ol class="side-list">{lati}</ol>
  </aside>
</section>
"""
    if altri:
        corpo += f"""<section><h2 class="section-label">Ultime notizie</h2>
<div class="grid">{''.join(scheda(a, rel) for a in altri)}</div></section>"""
    blocchi = []
    for k, c in CATEGORIE.items():
        n = sum(1 for a in articoli if a["categoria"] == k)
        if n:
            blocchi.append(f'<a class="cat-chip cat-chip-{k}" href="categoria/{k}.html">'
                           f'<img src="static/icone/{k}.svg" alt=""><span>{esc(c["nome"])}</span><em>{n}</em></a>')
    corpo += f"""<section class="newsletter">
  <div><h2>Il pianeta, ogni mattina</h2>
  <p>Ogni giorno la redazione di {esc(CONFIG['editore'])} seleziona le notizie ambientali più importanti dal mondo e le racconta in italiano, con le fonti originali sempre citate.</p></div>
  <a class="btn" href="feed.xml">Segui con RSS</a>
</section>
<section><h2 class="section-label">Sezioni</h2><div class="cat-chips">{''.join(blocchi)}</div></section>"""
    return pagina("", corpo, canonical="")


def pagina_articolo(a, correlati):
    rel = "../"
    fonti = "".join(f'<li><a href="{esc(f["url"])}" rel="noopener" target="_blank">{esc(f["nome"])}</a></li>'
                    for f in a["fonti"])
    corr = "".join(scheda(c, rel) for c in correlati)
    ld = json.dumps({
        "@context": "https://schema.org", "@type": "NewsArticle",
        "headline": a["titolo"], "description": a["sommario"],
        "datePublished": a["data"], "inLanguage": "it",
        "publisher": {"@type": "Organization", "name": CONFIG["editore"]},
        "mainEntityOfPage": f'{CONFIG["url"].rstrip("/")}/articoli/{a["slug"]}.html',
    }, ensure_ascii=False)
    corpo = f"""
<article class="article">
  <header class="article-head">
    <div class="meta">{meta_riga(a)}<span class="dot">·</span><span>{minuti(a['parole'])} min di lettura</span></div>
    <h1>{esc(a['titolo'])}</h1>
    <p class="standfirst">{esc(a['sommario'])}</p>
  </header>
  {copertina(a, rel, grande=True)}
  <div class="article-body">
{markdown(a['corpo'])}
  </div>
  <aside class="sources">
    <h2>Fonti</h2>
    <ul>{fonti}</ul>
    <p>Questo articolo è una sintesi originale della redazione. Per i dettagli completi consulta le fonti indicate.</p>
  </aside>
  <div class="share">
    <span>Condividi</span>
    <a href="https://wa.me/?text={esc(a['titolo'])}%20{CONFIG['url'].rstrip('/')}/articoli/{a['slug']}.html" target="_blank" rel="noopener">WhatsApp</a>
    <a href="https://www.facebook.com/sharer/sharer.php?u={CONFIG['url'].rstrip('/')}/articoli/{a['slug']}.html" target="_blank" rel="noopener">Facebook</a>
    <a href="https://www.linkedin.com/sharing/share-offsite/?url={CONFIG['url'].rstrip('/')}/articoli/{a['slug']}.html" target="_blank" rel="noopener">LinkedIn</a>
  </div>
</article>
<script type="application/ld+json">{ld}</script>
"""
    if corr:
        corpo += f'<section><h2 class="section-label">Leggi anche</h2><div class="grid">{corr}</div></section>'
    return pagina(a["titolo"], corpo, rel=rel, descrizione=a["sommario"],
                  canonical=f"articoli/{a['slug']}.html", og_tipo="article")


def pagina_categoria(k, articoli):
    rel = "../"
    c = CATEGORIE[k]
    lista = [a for a in articoli if a["categoria"] == k]
    righe = "".join(riga_lista(a, rel) for a in lista) or "<li class='empty'>Nessun articolo in questa sezione per ora.</li>"
    corpo = f"""<header class="page-head page-head-{k}">
  <img src="{rel}static/icone/{k}.svg" alt="" width="48" height="48">
  <div><h1>{esc(c['nome'])}</h1><p>{esc(c['descrizione'])}</p></div>
</header>
<ul class="list">{righe}</ul>"""
    return pagina(c["nome"], corpo, rel=rel, descrizione=c["descrizione"], canonical=f"categoria/{k}.html")


def pagina_archivio(articoli):
    gruppi = {}
    for a in articoli:
        gruppi.setdefault((a["data_obj"].year, a["data_obj"].month), []).append(a)
    sezioni = "".join(
        f'<h2 class="section-label">{MESI[m - 1].capitalize()} {y}</h2><ul class="list">'
        + "".join(riga_lista(a, "") for a in lst) + "</ul>"
        for (y, m), lst in gruppi.items())
    corpo = f'<header class="page-head"><div><h1>Archivio</h1><p>Tutti gli articoli pubblicati, dal più recente.</p></div></header>{sezioni}'
    return pagina("Archivio", corpo, canonical="archivio.html")


def pagina_chi_siamo():
    corpo = f"""<article class="article">
<header class="article-head"><h1>Chi siamo</h1>
<p class="standfirst">{esc(CONFIG['descrizione'])}</p></header>
<div class="article-body">{markdown((ROOT / 'chi-siamo.md').read_text(encoding='utf-8'))}</div>
</article>"""
    return pagina("Chi siamo", corpo, canonical="chi-siamo.html")


def feed(articoli):
    url = CONFIG["url"].rstrip("/")
    voci = []
    for a in articoli[:30]:
        pub = datetime(a["data_obj"].year, a["data_obj"].month, a["data_obj"].day, 7, 0, tzinfo=timezone.utc)
        voci.append(f"""<item><title>{esc(a['titolo'])}</title>
<link>{url}/articoli/{a['slug']}.html</link><guid>{url}/articoli/{a['slug']}.html</guid>
<pubDate>{pub.strftime('%a, %d %b %Y %H:%M:%S +0000')}</pubDate>
<category>{esc(CATEGORIE[a['categoria']]['nome'])}</category>
<description>{esc(a['sommario'])}</description></item>""")
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>{esc(CONFIG['nome'])}</title><link>{url}/</link>
<description>{esc(CONFIG['descrizione'])}</description><language>it</language>
{''.join(voci)}
</channel></rss>
"""


def sitemap(articoli):
    url = CONFIG["url"].rstrip("/")
    pagine = ["", "archivio.html", "chi-siamo.html"] + [f"categoria/{k}.html" for k in CATEGORIE]
    pagine += [f"articoli/{a['slug']}.html" for a in articoli]
    return ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            + "".join(f"<url><loc>{url}/{p}</loc></url>\n" for p in pagine) + "</urlset>\n")


# ---------------------------------------------------------------- main

def main():
    articoli = sorted((leggi_articolo(p) for p in ART_DIR.glob("*.md")),
                      key=lambda a: (a["data"], a.get("ordine", "5"), a["slug"]), reverse=True)
    articoli = [a for a in articoli if a["data_obj"] <= date.today()]

    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "articoli").mkdir(parents=True)
    (OUT / "categoria").mkdir()
    shutil.copytree(ROOT / "static", OUT / "static")

    scrivi = lambda p, t: (OUT / p).write_text(t, encoding="utf-8")
    scrivi("index.html", home(articoli))
    scrivi("archivio.html", pagina_archivio(articoli))
    scrivi("chi-siamo.html", pagina_chi_siamo())
    scrivi("feed.xml", feed(articoli))
    scrivi("sitemap.xml", sitemap(articoli))
    scrivi(".nojekyll", "")
    for k in CATEGORIE:
        scrivi(f"categoria/{k}.html", pagina_categoria(k, articoli))
    for a in articoli:
        stessi = [x for x in articoli if x is not a and x["categoria"] == a["categoria"]]
        altri = [x for x in articoli if x is not a and x not in stessi]
        scrivi(f"articoli/{a['slug']}.html", pagina_articolo(a, (stessi + altri)[:3]))
    print(f"Generati {len(articoli)} articoli in {OUT.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
