(function () {
  var C = window.LANDING_CONFIG || {};
  var F = C.fechas || {};
  var PEND = '<span class="pend">Por confirmar</span>';

  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function setAll(sel, html) { $$(sel).forEach(function (el) { el.innerHTML = html; }); }

  /* ---------- Datos desde config.js ---------- */
  var precio = "$" + (C.precio != null ? C.precio : 40);
  setAll("[data-precio]", esc(precio));
  setAll("[data-moneda]", esc(C.moneda || "USD"));

  $$("[data-fecha]").forEach(function (el) {
    var v = F[el.getAttribute("data-fecha")];
    el.textContent = v || "";
  });

  var horario = [F.horario, F.zonaHoraria].filter(Boolean).join(", ");
  var dias = [F.sabado, F.domingo].filter(Boolean).join(" y ");
  var cuando = [dias, horario].filter(Boolean).join(" · ");
  var plataforma = C.plataforma || "";

  setAll("[data-cuando]", cuando ? esc(cuando) + (plataforma ? " · " + esc(plataforma) : "") : "");
  setAll("[data-cuando-corto]", dias ? esc(dias) + (horario ? "<br>" + esc(horario) : "") : PEND);
  setAll("[data-plataforma]", plataforma ? esc(plataforma) : PEND);

  if (C.reembolso) {
    setAll("[data-reembolso]", esc(C.reembolso));
    $$("[data-reembolso-row]").forEach(function (el) { el.hidden = false; });
  }

  var recursos = (C.recursos || []).map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("");
  setAll("[data-recursos]", recursos);

  // Grabación: solo se menciona si está confirmada (true/false).
  var grab = C.grabacion;
  $$("[data-grabacion]").forEach(function (el) {
    if (grab === true) { el.textContent = "Incluye grabación." + (C.grabacionDetalle ? " " + C.grabacionDetalle : ""); el.hidden = false; }
  });
  setAll("[data-faq-grabacion]",
    grab === true ? "Sí." + (C.grabacionDetalle ? " " + esc(C.grabacionDetalle) : "") :
    grab === false ? "No. El intensivo es solo en vivo." :
    "Lo confirmaremos pronto. " + PEND);
  setAll("[data-faq-donde]",
    (cuando || plataforma)
      ? "Es online y en vivo. " + esc([cuando, plataforma].filter(Boolean).join(" · ")) + "."
      : "Es online y en vivo. Las fechas, horarios, zona horaria y plataforma se publicarán aquí. " + PEND);

  /* ---------- Botones de inscripción ---------- */
  // Con checkoutUrl los botones van a la pasarela; sin él abren el panel de pago (checkout.js).
  $$(".js-cta").forEach(function (a) {
    if (C.checkoutUrl) {
      a.href = C.checkoutUrl;
      a.target = "_blank";
      a.rel = "noopener";
      return;
    }
    a.setAttribute("aria-haspopup", "dialog");
    a.addEventListener("click", function (e) {
      if (!window.openCheckout) return;
      e.preventDefault();
      window.openCheckout();
    });
  });
  if (!C.checkoutUrl) {
    setAll("[data-micro]", "Pagas por Zelle, Binance o Pago Móvil y nos envías los datos por WhatsApp desde el mismo formulario.");
  }
  setAll("[data-faq-como]",
    C.checkoutUrl
      ? 'Haz clic en el botón de inscripción y completa el pago. <a href="' + esc(C.checkoutUrl) + '" target="_blank" rel="noopener">Ir a la inscripción</a>.'
      : "Toca cualquier botón de inscripción, elige Zelle, Binance o Pago Móvil y haz tu pago. Luego, desde el mismo formulario, nos envías los datos por WhatsApp junto con la captura del comprobante y te confirmamos tu cupo.");

  if (C.instagram) $$("[data-instagram]").forEach(function (a) { a.href = C.instagram; });
  setAll("[data-year]", String(new Date().getFullYear()));

  /* ---------- Menú móvil ---------- */
  var top = document.getElementById("top");
  var toggle = document.getElementById("menu-toggle");
  function closeMenu() { top.classList.remove("top--open"); toggle.setAttribute("aria-expanded", "false"); }
  toggle.addEventListener("click", function () {
    var open = !top.classList.contains("top--open");
    top.classList.toggle("top--open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("#menu a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---------- CTA fijo en móvil ---------- */
  var dock = document.getElementById("dock");
  var dockBtn = dock.querySelector("a");
  var hero = document.getElementById("inicio");
  var price = document.getElementById("precio");
  var pastHero = false, inPrice = false;
  function updateDock() {
    var on = pastHero && !inPrice;
    dock.classList.toggle("dock--on", on);
    dock.setAttribute("aria-hidden", String(!on));
    dockBtn.tabIndex = on ? 0 : -1;
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { pastHero = !es[0].isIntersecting && es[0].boundingClientRect.top < 0; updateDock(); }).observe(hero);
    new IntersectionObserver(function (es) { inPrice = es[0].isIntersecting; updateDock(); }, { threshold: .15 }).observe(price);
  }

  /* ---------- Animaciones de entrada ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("motion");

  $$(".hero .rv").forEach(function (el, i) { el.style.setProperty("--d", (i * 0.08) + "s"); });

  var vh = window.innerHeight || 800;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.remove("rv--wait");
      io.unobserve(e.target);
    });
  }, { threshold: .15, rootMargin: "0px 0px -6% 0px" });

  $$("main .rv").forEach(function (el) {
    if (el.closest(".hero")) return;
    // Solo se oculta lo que está fuera de pantalla al cargar.
    if (el.getBoundingClientRect().top < vh) return;
    var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.setProperty("--d", Math.min(sib, 5) * 0.07 + "s");
    el.classList.add("rv--wait");
    io.observe(el);
  });
})();
