/* =========================================================
   大魚山野人 · 書法個人站 交互腳本(原生 JS,零依賴)
   1) 三語切換  2) 導航  3) 滾動出現  4) 類目切換
   5) Lightbox 彈圖  6) 墨暈染 Canvas  7) 背景字視差
   ========================================================= */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= 1) 三語切換 ================= */
  (function initLang() {
    window.I18N.apply(window.I18N.detect());
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.I18N.apply(btn.getAttribute("data-lang"));
      });
    });
  })();

  /* ================= 2) 導航 ================= */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  var ticking = false;

  function onScrollNav() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScrollNav); }
  }, { passive: true });

  /* 返回頂部按鈕 */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { navLinks.classList.remove("open"); });
    });
  }

  /* ================= 3) 滾動出現 ================= */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ================= 4) 類目切換(四類服務) ================= */
  var tabs = document.querySelectorAll(".cat-tab");
  var panels = document.querySelectorAll(".cat-panel");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var cat = tab.getAttribute("data-cat");
      tabs.forEach(function (t) {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });
      panels.forEach(function (p) {
        p.classList.toggle("active", p.getAttribute("data-panel") === cat);
      });
    });
  });

  /* ================= 5) Lightbox 彈圖 ================= */
  var lb = document.getElementById("lightbox");
  var lbTile = document.getElementById("lbTile");
  var lbCap = document.getElementById("lbCap");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var tiles = Array.prototype.slice.call(document.querySelectorAll(".work-tile"));
  var current = -1;

  function renderLb() {
    if (current < 0 || current >= tiles.length) return;
    var t = tiles[current];
    // 複用來源字卡的底色類,並放大顯示
    var cls = t.className.split(" ").filter(function (c) { return c.indexOf("tile-") === 0; }).join(" ");
    lbTile.className = "lb-tile " + cls;
    lbTile.textContent = "";
    var img = t.getAttribute("data-img");
    if (img) {
      var im = document.createElement("img");
      im.src = img;
      im.alt = t.getAttribute("data-title") || "";
      lbTile.appendChild(im);
    } else {
      lbTile.textContent = t.getAttribute("data-char") || "";
    }
    lbCap.innerHTML = "<b>" + (t.getAttribute("data-title") || "") + "</b>" +
      (t.getAttribute("data-desc") ? "<span>" + t.getAttribute("data-desc") + "</span>" : "");
  }
  function openLb(i) { current = i; lb.hidden = false; renderLb(); document.body.style.overflow = "hidden"; }
  function closeLb() { lb.hidden = true; current = -1; document.body.style.overflow = ""; }
  function step(d) {
    if (tiles.length === 0) return;
    current = (current + d + tiles.length) % tiles.length;
    renderLb();
  }

  tiles.forEach(function (t, i) {
    t.addEventListener("click", function () { openLb(i); });
  });
  if (lbClose) lbClose.addEventListener("click", closeLb);
  if (lbPrev) lbPrev.addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
  if (lbNext) lbNext.addEventListener("click", function (e) { e.stopPropagation(); step(1); });
  if (lb) lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ================= 6) 墨暈染 Canvas(隨滾動) ================= */
  var canvas = document.getElementById("inkCanvas");
  if (canvas && !reduced) {
    (function () {
      var ctx = canvas.getContext("2d");
      var W, H, DPR;
      var blobs = [];
      var MAX = 36;
      var lastScrollY = window.scrollY;
      var INK = "34,28,18";

      function resize() {
        DPR = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W * DPR; canvas.height = H * DPR;
        canvas.style.width = W + "px"; canvas.style.height = H + "px";
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      }

      function spawn(x, y, energy) {
        if (blobs.length >= MAX) blobs.shift();
        var r = 6 + Math.random() * 26;
        blobs.push({
          x: x !== undefined ? x : Math.random() * W,
          y: y !== undefined ? y : Math.random() * H,
          r: r * 0.3,
          maxR: r * (0.8 + energy * 1.6 + Math.random()),
          alpha: 0.04 + Math.random() * 0.06 + energy * 0.05,
          growth: 0.12 + Math.random() * 0.3 + energy * 0.35
        });
      }

      function draw() {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < blobs.length; i++) {
          var b = blobs[i];
          b.r += b.growth;
          var g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, Math.max(b.r, 1));
          g.addColorStop(0, "rgba(" + INK + "," + b.alpha + ")");
          g.addColorStop(1, "rgba(" + INK + ",0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(b.x, b.y, Math.max(b.r, 1), 0, Math.PI * 2);
          ctx.fill();
          if (b.r >= b.maxR) { blobs.splice(i, 1); i--; }
        }
      }

      function loop() { draw(); requestAnimationFrame(loop); }

      // 初始散佈一些墨點
      for (var s = 0; s < 14; s++) spawn(Math.random() * (window.innerWidth || 1200), Math.random() * (window.innerHeight || 800), 0.3);

      // 滾動越快,暈染越濃
      window.addEventListener("scroll", function () {
        var delta = Math.abs(window.scrollY - lastScrollY);
        lastScrollY = window.scrollY;
        if (delta > 4) {
          var energy = Math.min(delta / 60, 1);
          spawn(undefined, undefined, energy);
          if (energy > 0.4) spawn(undefined, undefined, energy * 0.7);
        }
      }, { passive: true });

      window.addEventListener("resize", resize);
      resize();
      loop();
    })();
  }

  /* ================= 7) 背景書法字視差 ================= */
  if (!reduced) {
    var chars = Array.prototype.slice.call(document.querySelectorAll(".bg-char"));
    var cyc = false;
    function parallax() {
      var y = window.scrollY;
      chars.forEach(function (c) {
        var sp = parseFloat(c.getAttribute("data-speed")) || -0.1;
        c.style.transform = "translate3d(0," + (y * sp).toFixed(1) + "px,0)";
      });
      cyc = false;
    }
    window.addEventListener("scroll", function () {
      if (!cyc) { cyc = true; requestAnimationFrame(parallax); }
    }, { passive: true });
    parallax();
  }
})();
