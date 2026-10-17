(function () {
  var C = window.LANDING_CONFIG || {};
  var P = C.pagos || {};
  var T = C.tasa || {};
  var precio = C.precio != null ? C.precio : 40;

  var co = document.getElementById("checkout");
  var panel = co.querySelector(".co__panel");
  var form = document.getElementById("co-form");
  var send = document.getElementById("co-send");
  var err = document.getElementById("co-err");
  var lastFocus = null;
  var closeTimer = null;

  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var fmtBs = new Intl.NumberFormat("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* ---------- Datos de cada método (desde config.js) ---------- */
  // [etiqueta, valor que se muestra, valor que se copia]
  var Z = P.zelle || {}, B = P.binance || {}, M = P.pagoMovil || {};
  function digits(s) { return String(s || "").replace(/\D/g, ""); }
  var DATOS = {
    zelle: [["Correo Zelle", Z.correo, Z.correo], ["Titular", Z.titular, Z.titular]],
    binance: [["Correo Binance Pay", B.correo, B.correo]],
    pagomovil: [
      ["Banco", M.banco + (M.codigoBanco ? " · " + M.codigoBanco : ""), M.codigoBanco || M.banco],
      ["Cédula", M.cedula, digits(M.cedula)],
      ["Teléfono", M.telefono, digits(M.telefono)]
    ]
  };
  var NOMBRES = { zelle: "Zelle", binance: "Binance", pagomovil: "Pago Móvil" };

  $$("[data-co-datos]").forEach(function (dl) {
    var rows = DATOS[dl.getAttribute("data-co-datos")] || [];
    dl.innerHTML = rows.filter(function (r) { return r[1]; }).map(function (r) {
      return '<div class="co__row"><dt>' + esc(r[0]) + "</dt><dd><span>" + esc(r[1]) +
        '</span><button type="button" class="co__copy" data-copy="' + esc(r[2]) + '" aria-label="Copiar ' + esc(r[0]) + '">Copiar</button></dd></div>';
    }).join("");
  });

  $$("[data-co-usd]").forEach(function (el) { el.textContent = "$" + precio.toFixed(2); });

  /* ---------- Copiar ---------- */
  co.addEventListener("click", function (e) {
    var b = e.target.closest(".co__copy");
    if (!b) return;
    var txt = b.getAttribute("data-copy");
    function ok() { b.textContent = "Copiado"; b.classList.add("co__copy--ok"); setTimeout(function () { b.textContent = "Copiar"; b.classList.remove("co__copy--ok"); }, 1600); }
    function fallback() {
      var span = b.previousElementSibling;
      var r = document.createRange(); r.selectNodeContents(span);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    }
    try {
      navigator.clipboard.writeText(txt).then(ok, fallback);
    } catch (x) { fallback(); }
  });

  /* ---------- Tasa del día (Pago Móvil) ---------- */
  var tasa = { valor: Number(T.respaldo) || 0, fuente: "respaldo", fecha: null };
  var bsInput = document.getElementById("co-pm-monto");

  function montoBs() { return tasa.valor ? precio * tasa.valor : 0; }
  function pintarTasa() {
    var bs = montoBs();
    $$("[data-co-bs]").forEach(function (el) { el.textContent = bs ? fmtBs.format(bs) + " Bs" : "Consultar"; });
    var nota = tasa.fuente === "api"
      ? "Tasa paralela del día: " + fmtBs.format(tasa.valor) + " Bs/USD" + (tasa.fecha ? " · actualizada " + tasa.fecha : "")
      : "Tasa de referencia: " + fmtBs.format(tasa.valor) + " Bs/USD";
    $$("[data-co-tasa]").forEach(function (el) { el.textContent = nota; });
    if (bsInput && bsInput.dataset.auto !== "no") bsInput.value = bs ? fmtBs.format(bs) : "";
    update();
  }
  if (bsInput) bsInput.addEventListener("input", function () { bsInput.dataset.auto = "no"; });

  function cargarTasa() {
    if (!T.api || !window.fetch) return;
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 7000);
    fetch(T.api, ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        var v = Number(d.promedio || d.venta || d.compra);
        if (!v || !isFinite(v)) return;
        tasa.valor = v;
        tasa.fuente = "api";
        if (d.fechaActualizacion) {
          var f = new Date(d.fechaActualizacion);
          if (!isNaN(f)) tasa.fecha = f.toLocaleString("es-VE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
        }
        pintarTasa();
      })
      .catch(function () { /* se queda la tasa de respaldo */ })
      .then(function () { clearTimeout(t); });
  }

  /* ---------- Método seleccionado ---------- */
  function metodo() { var r = form.querySelector('input[name="metodo"]:checked'); return r ? r.value : ""; }

  form.addEventListener("change", function (e) {
    if (e.target.name === "metodo") {
      var m = metodo();
      $$("[data-pane]").forEach(function (p) { p.hidden = p.getAttribute("data-pane") !== m; });
      $$("[data-co-sum-bs]").forEach(function (el) { el.hidden = m !== "pagomovil"; });
      err.textContent = "";
    }
    update();
  });

  /* ---------- Validación y mensaje ---------- */
  function campos() {
    var m = metodo();
    var lista = $$("[data-co-contacto] [data-msg]");
    if (m) lista = lista.concat($$('[data-pane="' + m + '"] [data-msg]'));
    return lista;
  }

  function faltantes() {
    var out = [];
    campos().forEach(function (el) {
      var v = el.value.trim();
      var bad = el.required && !v;
      if (!bad && el.type === "email" && v) bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      if (bad) out.push(el);
    });
    return out;
  }

  function mensaje() {
    var m = metodo();
    var F = C.fechas || {};
    var lineas = ["¡Hola! Acabo de pagar mi cupo para *Del miedo al movimiento*" +
      (F.sabado && F.domingo ? " (" + F.sabado + " y " + F.domingo + ")" : "") + ".", ""];
    $$("[data-co-contacto] [data-msg]").forEach(function (el) {
      if (el.value.trim()) lineas.push("*" + el.getAttribute("data-msg") + ":* " + el.value.trim());
    });
    lineas.push("", "*Método de pago:* " + NOMBRES[m]);
    $$('[data-pane="' + m + '"] [data-msg]').forEach(function (el) {
      if (el.value.trim()) lineas.push("*" + el.getAttribute("data-msg") + ":* " + el.value.trim() + (el.getAttribute("data-suffix") || ""));
    });
    if (m === "pagomovil" && tasa.valor) lineas.push("*Tasa usada:* " + fmtBs.format(tasa.valor) + " Bs/USD");
    lineas.push("", "Te adjunto la captura del comprobante.");
    return lineas.join("\n");
  }

  function update() {
    var m = metodo();
    var falta = faltantes();
    var listo = m && !falta.length;
    send.setAttribute("aria-disabled", String(!listo));
    send.classList.toggle("co__send--off", !listo);
    send.textContent = !m ? "Selecciona un método de pago" : "Enviar datos por WhatsApp";
    send.href = listo ? "https://wa.me/" + String(C.whatsapp || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(mensaje()) : "#co-form";
    if (listo) err.textContent = "";
  }

  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") === "true") e.target.removeAttribute("aria-invalid");
    update();
  });
  form.addEventListener("submit", function (e) { e.preventDefault(); });

  send.addEventListener("click", function (e) {
    if (send.getAttribute("aria-disabled") !== "true") return;
    e.preventDefault();
    if (!metodo()) {
      err.textContent = "Elige cómo vas a pagar: Zelle, Binance o Pago Móvil.";
      form.querySelector('input[name="metodo"]').focus();
      return;
    }
    var falta = faltantes();
    falta.forEach(function (el) { el.setAttribute("aria-invalid", "true"); });
    err.textContent = "Completa: " + falta.map(function (el) { return el.getAttribute("data-msg").toLowerCase(); }).join(", ") + ".";
    if (falta[0]) falta[0].focus();
  });

  /* ---------- Abrir y cerrar ---------- */
  function focusables() {
    return $$('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea', panel)
      .filter(function (el) { return el.offsetParent !== null; });
  }
  function open() {
    clearTimeout(closeTimer);
    lastFocus = document.activeElement;
    co.hidden = false;
    document.documentElement.classList.add("co-lock");
    requestAnimationFrame(function () { requestAnimationFrame(function () { co.classList.add("co--open"); }); });
    setTimeout(function () { var f = document.getElementById("co-nombre"); if (f) f.focus({ preventScroll: true }); }, 60);
  }
  function close() {
    co.classList.remove("co--open");
    document.documentElement.classList.remove("co-lock");
    closeTimer = setTimeout(function () { co.hidden = true; }, 450);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $$("[data-co-close]").forEach(function (b) { b.addEventListener("click", close); });
  document.addEventListener("keydown", function (e) {
    if (co.hidden) return;
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab") return;
    var f = focusables(); if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  window.openCheckout = open;
  pintarTasa();
  cargarTasa();
})();
