/* Utilidades compartidas: creación segura de DOM, validación de enlaces y rutas relativas. */
(function () {
  'use strict';
  var IFT = (window.IFT = window.IFT || {});
  var body = document.body;

  // Raíz del sitio relativa a la página actual (data-root="../" en <body>). Así funciona bajo /ift/ o en cualquier carpeta.
  IFT.root = (body && body.getAttribute('data-root')) || './';
  IFT.url = function (p) { return IFT.root + String(p || '').replace(/^\/+/, ''); };
  IFT.cfg = window.IFT_CONFIG || {};
  IFT.contenido = window.IFT_CONTENIDO || {};
  IFT.empresas = (Array.isArray(window.IFT_EMPRESAS) ? window.IFT_EMPRESAS : []).filter(function (e) {
    var ok = e && typeof e.nombre === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.slug || '');
    if (!ok && window.console) console.warn('Filial ignorada (slug o nombre inválido):', e);
    return ok;
  });

  IFT.esPlaceholder = function (v) { return !v || /^\s*\[.*\]\s*$/.test(String(v)); };

  /* Enlaces validados ------------------------------------------------ */
  IFT.telHref = function (n) {
    var c = String(n || '').replace(/[\s().-]/g, '');
    return /^\+?\d{6,15}$/.test(c) ? 'tel:' + c : '';
  };
  IFT.waHref = function (n, msg) {
    var d = String(n || '').replace(/\D/g, '');
    if (d.length < 8 || d.length > 15) return '';
    return 'https://wa.me/' + d + (msg ? '?text=' + encodeURIComponent(msg) : '');
  };
  IFT.mailHref = function (e) {
    e = String(e || '').trim();
    return /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(e) ? 'mailto:' + e : '';
  };
  IFT.httpsUrl = function (u) {
    try { var x = new URL(String(u || '').trim()); return x.protocol === 'https:' ? x.href : ''; } catch (e) { return ''; }
  };
  function atributoUrlSeguro(v) {
    v = String(v).trim();
    if (/^(https?:|mailto:|tel:)/i.test(v)) return v;
    if (/^([a-z][a-z0-9+.\-]*:|\/\/)/i.test(v)) return null; // javascript:, data:, etc.
    return v;
  }

  /* Creación de elementos sin innerHTML ------------------------------ */
  function agregar(el, hijos) {
    if (hijos == null || hijos === false) return;
    if (Array.isArray(hijos)) { hijos.forEach(function (h) { agregar(el, h); }); return; }
    el.appendChild(hijos.nodeType ? hijos : document.createTextNode(String(hijos)));
  }
  IFT.h = function (tag, attrs, hijos) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'href' || k === 'src') { var u = atributoUrlSeguro(v); if (u !== null) el.setAttribute(k, u); }
      else el.setAttribute(k, v === true ? '' : v);
    });
    agregar(el, hijos);
    return el;
  };
  IFT.iniciales = function (nombre) {
    return String(nombre || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase();
  };
  IFT.setMeta = function (selector, attr, valor) {
    var m = document.querySelector(selector);
    if (m) m.setAttribute(attr, valor);
  };
})();
