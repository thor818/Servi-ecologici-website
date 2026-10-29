(function () {
  "use strict";

  var D = window.BRIZON;
  var C = D.contact;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Languages: EN · FR · IT · PT ----------
   * English text is the key; translations live in js/i18n.js.
   */
  var LANGS = ["en", "fr", "it", "pt"];
  var LOCALES = { en: "en-GB", fr: "fr-FR", it: "it-IT", pt: "pt-PT" };
  var T = window.BRIZON_I18N || {};
  var LANG = "en";
  try { LANG = localStorage.getItem("brizon-lang") || ""; } catch (err) { LANG = ""; }
  if (LANGS.indexOf(LANG) === -1) {
    var nav0 = (navigator.language || "en").slice(0, 2).toLowerCase();
    LANG = LANGS.indexOf(nav0) !== -1 ? nav0 : "en";
  }
  function norm(s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); }
  function t(s) {
    if (LANG === "en" || !s) return s;
    var e = T[norm(s)];
    if (e && e[LANG]) return e[LANG];
    if (window.__i18nMiss) window.__i18nMiss[norm(s)] = 1;
    return s;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // "This week" when the course is within 7 days, otherwise "Next course"
  function badge(iso) {
    if (!iso) return t("Next course");
    var days = (new Date(iso + "T23:59:59") - new Date()) / 86400000;
    return t(days >= 0 && days <= 7 ? "This week" : "Next course");
  }

  function formatDate(iso) {
    if (!iso) return t("To be announced");
    var d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString(LOCALES[LANG], { weekday: "long", day: "numeric", month: "long" });
  }

  function price(p) {
    return p.price == null ? "Price on request" : "€ " + Number(p.price).toFixed(2);
  }

  /* Send a message: WhatsApp if configured, else email, else tell the visitor how to reach us. */
  function send(subject, body, note) {
    if (C.whatsapp) {
      window.open("https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(subject + "\n\n" + body), "_blank");
      note.textContent = t("WhatsApp opened with your message. Just press send!");
      return true;
    }
    if (C.email) {
      window.location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      note.textContent = t("Your email app opened with the message ready. Just press send!");
      return true;
    }
    note.textContent = C.instagram
      ? t("Online sending isn't set up yet. Please message us on Instagram:") + " @" + C.instagram
      : t("Online sending isn't set up yet. Please contact us at the gym.");
    return false;
  }

  /* ---------- Nav ---------- */
  var toggle = $(".nav-toggle"), links = $(".nav-links");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  $$(".nav-links a").forEach(function (a) {
    a.addEventListener("click", function () { links.classList.remove("open"); });
  });

  /* ---------- Courses ---------- */
  function renderCourses() {
    var featured = D.courses.filter(function (c) { return c.featured; })[0];
    if (featured) {
      $("#featured-course").innerHTML =
        '<div class="featured">' +
          '<div class="featured-img"><span class="featured-badge">' + esc(badge(featured.date)) + '</span></div>' +
          '<div class="featured-body">' +
            '<p class="eyebrow">' + esc(featured.discipline) + '</p>' +
            '<h3>' + esc(featured.title) + '</h3>' +
            (featured.subtitle ? '<p class="subtitle">' + esc(featured.subtitle) + '</p>' : '') +
            '<p>' + esc(t(featured.description)) + '</p>' +
            '<ul class="meta">' +
              '<li><b>' + esc(t("Date")) + '</b>' + esc(formatDate(featured.date)) + '</li>' +
              '<li><b>' + esc(t("Time")) + '</b>' + esc(t(featured.time)) + '</li>' +
              '<li><b>' + esc(t("Place")) + '</b>' + esc(featured.place) + '</li>' +
              '<li><b>' + esc(t("Level")) + '</b>' + esc(t(featured.level)) + '</li>' +
            '</ul>' +
            (featured.spots ? '<p class="spots">' + esc(t(featured.spots)) + '</p>' : '') +
            '<a href="#contact" class="btn btn-red" data-book="' + esc(featured.title) + '">' + esc(t("Book a place")) + '</a> ' +
            (C.instagram ? '<a class="btn btn-ghost" target="_blank" rel="noopener" href="https://instagram.com/' + esc(C.instagram) + '">' + esc(t("See on Instagram")) + '</a>' : '') +
          '</div>' +
        '</div>';
    }
    $("#course-list").innerHTML = D.courses.filter(function (c) { return !c.featured; }).map(function (c) {
      return '<div class="course">' +
        '<span class="tag">' + esc(t(c.discipline)) + '</span>' +
        '<h4>' + esc(t(c.title)) + '</h4>' +
        '<p>' + esc(t(c.description)) + '</p>' +
        '<small>' + esc(t(c.time)) + ' · ' + esc(t(c.level)) + '</small>' +
      '</div>';
    }).join("");

    if (D.pastCourses && D.pastCourses.length) {
      $("#past-courses").innerHTML = '<h3>' + esc(t("Past seminars")) + '</h3><ul>' + D.pastCourses.map(function (c) {
        return '<li><span>' + esc(t(c.when)) + '</span><b>' + esc(t(c.title)) + '</b> · ' + esc(t(c.place)) + '</li>';
      }).join("") + '</ul>';
    }
  }

  // "Book a place" pre-fills the contact form
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-book]");
    if (!b) return;
    var f = $("#contact-form");
    f.subject.value = "Course booking";
    f.message.value = t("Hello, I would like to book a place for:") + " " + b.getAttribute("data-book");
  });

  /* ---------- Gallery ---------- */
  function figures(list) {
    return list.map(function (g) {
      var cap = t(g.caption);
      return '<figure data-zoom="' + esc(g.src) + '" data-caption="' + esc(cap) + '">' +
        '<img src="' + esc(g.src) + '" alt="' + esc(cap) + '" loading="lazy">' +
        '<figcaption>' + esc(cap) + '</figcaption></figure>';
    }).join("");
  }
  function renderPeople() {
    if ($("#fighters-grid") && D.fighters) $("#fighters-grid").innerHTML = figures(D.fighters);
    if ($("#portrait-strip") && D.portraits) $("#portrait-strip").innerHTML = figures(D.portraits);
  }
  function renderGallery() {
    $("#gallery-grid").innerHTML = D.gallery.map(function (g) {
      var cap = t(g.caption);
      return '<figure data-zoom="' + esc(g.src) + '" data-caption="' + esc(cap) + '">' +
        '<img src="' + esc(g.src) + '" alt="' + esc(cap) + '" loading="lazy">' +
        '<figcaption>' + esc(cap) + '</figcaption></figure>';
    }).join("");
  }

  /* ---------- Home slideshow ---------- */
  (function heroSlideshow() {
    var box = $("#hero-slides"), dots = $("#hero-dots");
    if (!box || !D.hero || D.hero.length < 2) return;
    box.innerHTML = D.hero.map(function (h, i) {
      return '<div class="hero-slide' + (h.vintage ? " vintage" : "") + (i ? "" : " on") + '" style="background-image:url(\'' + esc(h.src) + '\')"></div>';
    }).join("");
    dots.innerHTML = D.hero.map(function (h, i) { return '<span' + (i ? "" : ' class="on"') + '></span>'; }).join("");
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var slides = $$(".hero-slide", box), bars = $$("span", dots), cur = 0;
    D.hero.forEach(function (h) { var im = new Image(); im.src = h.src; });
    setInterval(function () {
      slides[cur].classList.remove("on"); bars[cur].classList.remove("on");
      cur = (cur + 1) % slides.length;
      void slides[cur].offsetWidth;
      slides[cur].classList.add("on"); bars[cur].classList.add("on");
    }, 6500);
  })();

  /* ---------- Training carousel ---------- */
  function renderTraining() {
    var track = $("#training-track");
    if (!track || !D.training) return;
    track.innerHTML = D.training.map(function (p, i) {
      var parts = t(p.caption).split(" · ");
      return '<figure data-zoom="' + esc(p.src) + '" data-caption="' + esc(parts.join(" · ")) + '">' +
        '<img src="' + esc(p.src) + '" alt="' + esc(parts[0]) + '" loading="lazy">' +
        '<span class="idx">' + (i < 9 ? "0" : "") + (i + 1) + '</span>' +
        '<figcaption><b>' + esc(parts[0]) + '</b>' + (parts[1] ? '<small>' + esc(parts[1]) + '</small>' : '') + '</figcaption></figure>';
    }).join("");
    updateCount();
  }
  function updateCount() {
    var track = $("#training-track"), first = $("figure", track);
    if (!first) return;
    var step = first.getBoundingClientRect().width + 18;
    var n = Math.min(D.training.length, Math.round(track.scrollLeft / step) + 1);
    var pad = function (x) { return (x < 10 ? "0" : "") + x; };
    $("#training-count").textContent = pad(n) + " / " + pad(D.training.length);
  }
  if ($("#training-track")) {
    $("#training-track").addEventListener("scroll", function () { window.requestAnimationFrame(updateCount); }, { passive: true });
    [["#training-prev", -1], ["#training-next", 1]].forEach(function (b) {
      $(b[0]).addEventListener("click", function () {
        var track = $("#training-track"), first = $("figure", track);
        track.scrollBy({ left: b[1] * (first.getBoundingClientRect().width + 18), behavior: "smooth" });
      });
    });
  }

  /* ---------- Videos (YouTube, loaded only when tapped) ---------- */
  var videoCat = "All", currentVideo = null;
  function thumb(id) { return "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg"; }
  function showPlayer(v, autoplay) {
    currentVideo = v;
    var box = $("#video-player");
    if (!box) return;
    if (autoplay) {
      box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(v.id) + '?autoplay=1&rel=0" title="' + esc(v.title) +
        '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    } else {
      box.innerHTML = '<button type="button" class="player-facade" data-play="' + esc(v.id) + '" style="background-image:url(\'' + thumb(v.id) + '\')">' +
        '<span class="play-icon" aria-hidden="true">▶</span><span class="player-info"><small>' + esc(t(v.category)) + '</small><b>' + esc(v.title) + '</b></span>' +
        '<span class="sr-only">' + esc(t("Play video")) + '</span></button>';
    }
    $$("#video-grid .video-card").forEach(function (c) { c.classList.toggle("active", c.getAttribute("data-video") === v.id); });
  }
  var igShown = 0;
  function renderInstagram() {
    var box = $("#ig-strip");
    if (!box || !D.instagram) return;
    if (!igShown) igShown = Math.min(6, D.instagram.length);
    var have = box.children.length;
    box.insertAdjacentHTML("beforeend", D.instagram.slice(have, igShown).map(function (c) {
      return '<div class="ig-card"><iframe src="https://www.instagram.com/' + esc(c) + '/embed/" loading="lazy" title="Instagram @didierleborgne" scrolling="no" allowtransparency="true"></iframe></div>';
    }).join(""));
    var more = $("#ig-more"), left = D.instagram.length - igShown;
    if (more) {
      more.hidden = left <= 0;
      more.textContent = t("Show more videos") + " (" + left + ")";
    }
  }
  function renderVideos() {
    renderInstagram();
    if (!D.videos || !$("#video-grid")) return;
    var cats = ["All"].concat(D.videos.map(function (v) { return v.category; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
    $("#video-filter").innerHTML = cats.map(function (c) {
      return '<button class="chip' + (c === videoCat ? " active" : "") + '" data-vcat="' + esc(c) + '">' + esc(t(c)) + '</button>';
    }).join("");
    $("#video-grid").innerHTML = D.videos.filter(function (v) { return videoCat === "All" || v.category === videoCat; }).map(function (v) {
      return '<button type="button" class="video-card" data-video="' + esc(v.id) + '">' +
        '<span class="vthumb"><img src="' + thumb(v.id) + '" alt="" loading="lazy"><span class="mini-play" aria-hidden="true">▶</span></span>' +
        '<span class="vtext"><small>' + esc(t(v.category)) + '</small><b>' + esc(v.title) + '</b></span></button>';
    }).join("");
    if (!currentVideo || !$("#video-player iframe")) showPlayer(currentVideo || D.videos[0], false);
    else showPlayer(currentVideo, true);
  }
  if ($("#ig-more")) {
    $("#ig-more").addEventListener("click", function () {
      igShown = Math.min(D.instagram.length, igShown + 6);
      renderInstagram();
    });
  }
  if ($("#videos")) {
    $("#video-filter").addEventListener("click", function (e) {
      var b = e.target.closest("[data-vcat]"); if (!b) return;
      videoCat = b.getAttribute("data-vcat"); renderVideos();
    });
    $("#video-grid").addEventListener("click", function (e) {
      var c = e.target.closest("[data-video]"); if (!c) return;
      var v = D.videos.filter(function (x) { return x.id === c.getAttribute("data-video"); })[0];
      showPlayer(v, true);
      $("#video-player").scrollIntoView({ behavior: "smooth", block: "center" });
    });
    $("#video-player").addEventListener("click", function (e) {
      if (e.target.closest("[data-play]") && currentVideo) showPlayer(currentVideo, true);
    });
  }

  /* ---------- Lightbox (gallery + history photos) ---------- */
  var lb = $("#lightbox");
  document.addEventListener("click", function (e) {
    var fig = e.target.closest("[data-zoom]");
    var img = !fig && e.target.closest(".photo-strip img, .press img, .feature-photo img");
    if (!fig && !img) return;
    $("img", lb).src = fig ? fig.getAttribute("data-zoom") : img.src;
    $("p", lb).textContent = fig ? fig.getAttribute("data-caption") : img.alt;
    lb.classList.add("open");
  });
  lb.addEventListener("click", function () { lb.classList.remove("open"); });

  /* ---------- Technique sheets ---------- */
  function renderTechniques() {
    if (!$("#tech-grid") || !D.techniques) return;
    $("#tech-grid").innerHTML = D.techniques.map(function (tq, n) {
      return '<article class="tech">' +
        '<div class="tech-head"><span class="tech-num">' + ("0" + (n + 1)).slice(-2) + '</span>' +
        '<div><span class="tag">' + esc(t(tq.tag)) + '</span><h3>' + esc(t(tq.title)) + '</h3></div>' +
        '<a class="tech-src" target="_blank" rel="noopener" href="' + esc(tq.source) + '">' + esc(t("Watch the video")) + ' ↗</a></div>' +
        '<ol class="tech-steps">' + tq.steps.map(function (st, i) {
          return '<li><div class="tech-img"><img src="' + esc(st.image) + '" alt="" loading="lazy"><span>' + (i + 1) + '</span></div>' +
            '<p>' + esc(t(st.text)) + '</p></li>';
        }).join("") + '</ol></article>';
    }).join("");
  }

  /* ---------- Advice ---------- */
  function renderAdvice() {
    $("#advice-grid").innerHTML = D.advice.map(function (a) {
      return '<div class="advice' + (a.image ? ' has-img' : '') + '">' +
        (a.image ? '<div class="advice-img"><img src="' + esc(a.image) + '" alt="" loading="lazy"></div>' : '') +
        '<span class="tag">' + esc(t(a.tag)) + '</span>' +
        '<h4>' + esc(t(a.title)) + '</h4><p>' + esc(t(a.text)) + '</p></div>';
    }).join("");
  }

  /* ---------- Shop ---------- */
  var cats = ["All"].concat(D.products.map(function (p) { return p.category; })
    .filter(function (c, i, a) { return a.indexOf(c) === i; }));
  var current = "All";

  function renderFilter() {
    $("#shop-filter").innerHTML = cats.map(function (c) {
      return '<button class="chip' + (c === current ? " active" : "") + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
    }).join("");
  }

  function options(list) {
    return list.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join("");
  }

  function renderProducts() {
    $("#product-grid").innerHTML = D.products.filter(function (p) {
      return current === "All" || p.category === current;
    }).map(function (p) {
      var colors = p.colors.map(function (c) { return c.name; });
      return '<div class="product" data-id="' + esc(p.id) + '">' +
        '<div class="product-img">' +
          '<img src="' + esc(p.colors[0].image) + '" alt="' + esc(p.name) + '" loading="lazy">' +
          (p.comingSoon ? '<span class="soon">Coming soon</span>' : '') +
        '</div>' +
        '<div class="product-body">' +
          '<span class="tag">' + esc(p.category) + '</span>' +
          '<h4>' + esc(p.name) + '</h4>' +
          '<p>' + esc(p.description) + '</p>' +
          '<p class="price">' + esc(price(p)) + '</p>' +
          (colors.length > 1
            ? '<div class="swatches">' + p.colors.map(function (c, i) {
                return '<button type="button" class="swatch' + (i ? "" : " active") + '" data-color="' + i + '">' + esc(c.name) + '</button>';
              }).join("") + '</div>'
            : '<p class="color-name">' + esc(colors[0]) + '</p>') +
          '<select name="size" aria-label="Size">' + options(p.sizes) + '</select>' +
          (p.personalize ? '<input name="custom" maxlength="24" placeholder="' + esc(p.personalize) + '" aria-label="' + esc(p.personalize) + '">' : '') +
          '<button class="btn btn-red" data-add>' + (p.comingSoon ? "Pre-order" : "Add to cart") + '</button>' +
        '</div>' +
      '</div>';
    }).join("");
  }

  // Colour swatches swap the product picture
  $("#product-grid").addEventListener("click", function (e) {
    var sw = e.target.closest("[data-color]");
    if (!sw) return;
    var card = sw.closest(".product");
    var p = find(card.getAttribute("data-id"));
    $$(".swatch", card).forEach(function (b) { b.classList.toggle("active", b === sw); });
    $(".product-img img", card).src = p.colors[+sw.getAttribute("data-color")].image;
  });

  $("#shop-filter").addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]");
    if (!b) return;
    current = b.getAttribute("data-cat");
    renderFilter();
    renderProducts();
    $$(".product").forEach(function (el) { el.classList.add("in"); });
  });

  /* ---------- Cart ---------- */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem("brizon-cart")) || []; } catch (err) { cart = []; }

  function save() {
    try { localStorage.setItem("brizon-cart", JSON.stringify(cart)); } catch (err) { /* private mode */ }
  }
  function find(id) { return D.products.filter(function (p) { return p.id === id; })[0]; }
  function colorOf(p, name) {
    return (p.colors || []).filter(function (c) { return c.name === name; })[0] || (p.colors || [{}])[0];
  }
  function details(i) {
    return [i.color, i.size, i.custom ? "name: " + i.custom : ""].filter(Boolean).join(" · ");
  }

  // Drop items from older versions of the shop that no longer exist
  cart = cart.filter(function (i) { return find(i.id); });

  function renderCart() {
    var count = cart.reduce(function (n, i) { return n + i.qty; }, 0);
    $(".cart-count").textContent = count;
    var box = $("#cart-items");
    if (!cart.length) {
      box.innerHTML = '<p class="cart-empty">' + esc(t("Your cart is empty.")) + '</p>';
      return;
    }
    box.innerHTML = cart.map(function (i, idx) {
      var p = find(i.id) || {};
      return '<div class="cart-item">' +
        '<img src="' + esc(colorOf(p, i.color).image) + '" alt="">' +
        '<div><b>' + esc(p.name) + '</b><small>' + esc(details(i)) + ' · ' + esc(price(p)) + '</small></div>' +
        '<div class="qty"><button data-dec="' + idx + '" aria-label="Less">−</button>' + i.qty +
        '<button data-inc="' + idx + '" aria-label="More">+</button></div>' +
      '</div>';
    }).join("");
  }

  $("#product-grid").addEventListener("click", function (e) {
    var b = e.target.closest("[data-add]");
    if (!b) return;
    var card = b.closest(".product");
    var id = card.getAttribute("data-id");
    var p = find(id);
    var size = $("select[name=size]", card).value;
    var active = $(".swatch.active", card);
    var color = p.colors[active ? +active.getAttribute("data-color") : 0].name;
    var customEl = $("input[name=custom]", card);
    var custom = customEl ? customEl.value.trim() : "";
    var existing = cart.filter(function (i) { return i.id === id && i.size === size && i.color === color && i.custom === custom; })[0];
    if (existing) existing.qty++;
    else cart.push({ id: id, size: size, color: color, custom: custom, qty: 1 });
    save();
    renderCart();
    b.textContent = "Added ✓";
    setTimeout(function () { b.textContent = find(id).comingSoon ? "Pre-order" : "Add to cart"; }, 1200);
  });

  $("#cart-items").addEventListener("click", function (e) {
    var inc = e.target.getAttribute("data-inc"), dec = e.target.getAttribute("data-dec");
    if (inc != null) cart[inc].qty++;
    if (dec != null) { cart[dec].qty--; if (cart[dec].qty <= 0) cart.splice(dec, 1); }
    save();
    renderCart();
  });

  function openCart(open) {
    $("#cart").classList.toggle("open", open);
    $("#cart").setAttribute("aria-hidden", !open);
    $(".overlay").classList.toggle("show", open);
  }
  $(".cart-btn").addEventListener("click", function () { links.classList.remove("open"); openCart(true); });
  $$("[data-close-cart]").forEach(function (el) { el.addEventListener("click", function () { openCart(false); }); });

  $("#order-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var note = $("#order-note");
    if (!cart.length) { note.textContent = "Your cart is empty."; return; }
    var f = e.target;
    var lines = cart.map(function (i) {
      var p = find(i.id) || {};
      return "- " + i.qty + " × " + p.name + " (" + details(i) + ") — " + price(p);
    });
    var body = "NEW ORDER — Brizon Gym shop\n\n" + lines.join("\n") +
      "\n\nName: " + f.name.value + "\nContact: " + f.reply.value +
      "\nDelivery: " + f.address.value + (f.notes.value ? "\nNotes: " + f.notes.value : "");
    if (send("Brizon Gym order — " + f.name.value, body, note)) {
      cart = [];
      save();
      renderCart();
      f.reset();
    }
  });

  /* ---------- Contact ---------- */
  function renderContact() {
  $("#contact-location").textContent = t(C.location);
  var social = [];
  if (C.instagram) social.push('<a class="btn btn-dark" target="_blank" rel="noopener" href="https://instagram.com/' + esc(C.instagram) + '">Instagram @' + esc(C.instagram) + '</a>');
  if (C.facebook) social.push('<a class="btn btn-dark" target="_blank" rel="noopener" href="https://www.facebook.com/' + esc(C.facebook) + '">Facebook</a>');
  if (C.whatsapp) social.push('<a class="btn btn-dark" target="_blank" rel="noopener" href="https://wa.me/' + esc(C.whatsapp) + '">WhatsApp</a>');
  if (C.email) social.push('<a class="btn btn-dark" href="mailto:' + esc(C.email) + '">' + esc(C.email) + '</a>');
  $("#social-links").innerHTML = social.join("") || '<p class="form-note">' + esc(t("Instagram and contact details coming soon.")) + '</p>';
  }

  $("#contact-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    var body = f.message.value + "\n\n— " + f.name.value + " (" + f.reply.value + ")";
    if (send("Brizon Gym — " + f.subject.value, body, $("#contact-note"))) f.reset();
  });

  /* ---------- Chat ---------- */
  var chat = $("#chat"), chatBody = $("#chat-body");

  function say(text, who) {
    var m = document.createElement("div");
    m.className = "msg " + who;
    m.textContent = text;
    chatBody.appendChild(m);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function answer(q) {
    var q2 = " " + q.toLowerCase().replace(/[^a-z0-9àáâãçéèêëíîïóôõúûùüÿœ]+/g, " ") + " ";
    for (var i = 0; i < D.faq.length; i++) {
      for (var k = 0; k < D.faq[i].keys.length; k++) {
        if (q2.indexOf(" " + D.faq[i].keys[k]) !== -1) return t(D.faq[i].answer);
      }
    }
    return t("Good question! I don't have the answer here. Send it through the Contact form, on Instagram @didierleborgne or on Facebook, and Didier's team will reply.");
  }

  function ask(q) {
    if (!q.trim()) return;
    say(q, "user");
    setTimeout(function () { say(answer(q), "bot"); }, 350);
  }

  function openChat(open) {
    chat.classList.toggle("open", open);
    chat.setAttribute("aria-hidden", !open);
    if (open && !chatBody.children.length) {
      say(t("Hi! 👊 Welcome to Brizon Gym. Ask me about courses, the shop, Didier or our history."), "bot");
    }
    if (open) $("#chat-text").focus();
  }
  $("#chat-open").addEventListener("click", function () { openChat(!chat.classList.contains("open")); });
  $("#chat-close").addEventListener("click", function () { openChat(false); });
  $("#chat-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var input = $("#chat-text");
    ask(input.value);
    input.value = "";
  });
  function renderChatQuick() {
    $("#chat-quick").innerHTML = ["Next course", "How do I order?", "Who is Didier?", "I'm a beginner"]
      .map(function (q) { return '<button type="button">' + esc(t(q)) + '</button>'; }).join("");
    $("#chat-text").placeholder = t("Type a question…");
  }
  $("#chat-quick").addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") ask(e.target.textContent);
  });

  /* ---------- Modern touches: solid nav on scroll, reveal on scroll ---------- */
  var nav = $(".nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function revealAll() {
    var els = $$(".section h2, .section .lead, .quote-band blockquote, .chapter, .feature-photo, .timeline li, .photo-strip figure, .didier-grid, .press, .featured, .course, .past, .gallery figure, .advice, .product, .contact-grid > *");
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el, i) {
      if (el.classList.contains("in")) return;
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  }

  /* ---------- Static page text ---------- */
  var STATIC = ".nav-links a, .cart-label, .hero-title, .hero-tag, .hero-cta a, .stats span, .marquee span, " +
    ".section .eyebrow, .section h2, .section .lead:not(#contact-location), .chapter-text h3, .chapter-text p, " +
    ".feature-photo figcaption, .timeline-title, .timeline li, .photo-strip figcaption, .didier-text p, .record span, " +
    ".shop-soon-tag, #shop-soon h3, #shop-soon p, .form-label, #contact-form option, .form .btn, .footer p:last-child, " +
    ".drawer-head h3, .chat-head span, .quote-band p, .training-hint, .strip-title, .tested figcaption, .yt-all, .ig-follow";
  var staticEls = $$(STATIC).map(function (el) { return { el: el, en: el.innerHTML }; });

  function applyLang(lang) {
    LANG = lang;
    try { localStorage.setItem("brizon-lang", lang); } catch (err) { /* private mode */ }
    document.documentElement.lang = lang;
    staticEls.forEach(function (s) { s.el.innerHTML = lang === "en" ? s.en : t(s.en); });
    $$("[data-lang]").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-lang") === lang); b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang); });
    renderCourses();
    renderGallery();
    renderPeople();
    renderVideos();
    renderTraining();
    renderTechniques();
    renderAdvice();
    renderContact();
    renderChatQuick();
    renderCart();
    $$(".course, .featured, .past, .gallery figure, .portrait-strip figure, .advice").forEach(function (el) { el.classList.add("in"); });
  }
  $$("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); links.classList.remove("open"); });
  });

  /* ---------- Init ---------- */
  if (D.shopOpen === false) {
    // Shop closed: show "coming soon", hide products, cart and ordering
    $("#shop-soon").hidden = false;
    $("#shop .lead").hidden = true;
    $("#shop-filter").hidden = true;
    $("#product-grid").hidden = true;
    $(".cart-btn").hidden = true;
    D.faq.forEach(function (f) {
      if (f.keys.indexOf("order") !== -1) f.answer = "The Brizon Gym shop opens soon, with fight gear, robes and clothing. Follow @didierleborgne on Instagram to know when.";
    });
  }
  renderFilter();
  renderProducts();
  applyLang(LANG);
  revealAll();
})();
