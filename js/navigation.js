/* Cabecera y navegación: menú generado desde los datos, hamburguesa y desplegables accesibles. */
(function () {
  'use strict';
  var IFT = window.IFT, h = IFT.h, cfg = IFT.cfg;

  function marca() {
    var contenido = cfg.logo
      ? h('img', { src: IFT.url(cfg.logo), alt: 'Logotipo de ' + cfg.nombre })
      : [h('span', { class: 'brand-mark', 'aria-hidden': 'true', text: cfg.siglas || 'H' }), h('span', { class: 'brand-text', text: cfg.nombre })];
    return h('a', { class: 'brand', href: IFT.url(''), 'aria-label': cfg.nombre + ' — ir al inicio' }, contenido);
  }

  /* Ítems del submenú "Áreas de negocios" */
  function itemsNegocios(activo) {
    var li = [h('li', {}, h('a', { href: IFT.url('negocios/') }, h('span', {}, [h('span', { class: 'sub-title', text: 'Ver todas las áreas de negocios' }), h('span', { class: 'sub-meta', text: 'Panorama completo del grupo' })])))];
    if (IFT.empresas.length) li.push(h('li', { class: 'sub-sep', role: 'separator' }));
    IFT.empresas.forEach(function (e) {
      var ext = /^https?:/i.test(e.url || '');
      li.push(h('li', {}, h('a', { href: IFT.empresaHref(e), 'aria-current': activo === e.slug ? 'page' : null, target: ext ? '_blank' : null, rel: ext ? 'noopener noreferrer' : null }, [
        IFT.icon(e.icono || 'briefcase', 22),
        h('span', {}, [h('span', { class: 'sub-title', text: e.nombre }), h('span', { class: 'sub-meta', text: e.area || '' })])
      ])));
    });
    return li;
  }

  /* Ítems del submenú "Contacto": solo se enlazan datos válidos; los marcadores no son enlaces */
  function itemsContacto() {
    var li = [];
    function fila(icono, etiqueta, valor, href) {
      var cuerpo = [IFT.icon(icono, 22), h('span', {}, [h('span', { class: 'sub-title', text: etiqueta }), h('span', { class: 'sub-meta', text: href ? valor : (valor || '[PENDIENTE]') + ' (pendiente de configurar)' })])];
      li.push(h('li', {}, href ? h('a', { href: href }, cuerpo) : h('span', { class: 'sub-text' }, cuerpo)));
    }
    (cfg.telefonos || []).forEach(function (t) {
      var href = IFT.telHref(t.numero);
      fila('phone', t.etiqueta || 'Teléfono', t.numero, href);
    });
    var wa = IFT.waHref(cfg.whatsapp && cfg.whatsapp.numero, cfg.whatsapp && cfg.whatsapp.mensaje);
    fila('whatsapp', 'WhatsApp', cfg.whatsapp && cfg.whatsapp.numero, wa);
    fila('mail', 'Correo electrónico', cfg.email, IFT.mailHref(cfg.email));
    li.push(h('li', { class: 'sub-sep', role: 'separator' }));
    li.push(h('li', {}, h('a', { href: IFT.url('contacto/'), 'aria-current': document.body.getAttribute('data-page') === 'contacto' ? 'page' : null }, h('span', {}, h('span', { class: 'sub-title', text: 'Página de contacto y formulario' })))));
    return li;
  }

  function desplegable(id, texto, items, activa) {
    var btn = h('button', { type: 'button', class: 'nav-btn' + (activa ? ' is-active' : ''), 'aria-expanded': 'false', 'aria-controls': id }, [texto, IFT.icon('chevron', 16)]);
    var ul = h('ul', { class: 'submenu', id: id }, items);
    return h('li', { class: 'has-sub' }, [btn, ul]);
  }

  IFT.renderHeader = function (mount) {
    var pagina = document.body.getAttribute('data-page') || '';
    var slug = document.body.getAttribute('data-slug') || '';
    var nav = h('nav', { class: 'main-nav', id: 'menu-principal', 'aria-label': 'Navegación principal' }, h('ul', { class: 'nav-list' }, [
      h('li', {}, h('a', { class: 'nav-link', href: IFT.url(''), 'aria-current': pagina === 'inicio' ? 'page' : null, text: 'Inicio' })),
      h('li', {}, h('a', { class: 'nav-link', href: IFT.url('nosotros/'), 'aria-current': pagina === 'nosotros' ? 'page' : null, text: 'Nosotros' })),
      desplegable('submenu-negocios', 'Áreas de negocios', itemsNegocios(slug), pagina === 'negocios'),
      desplegable('submenu-contacto', 'Contacto', itemsContacto(), pagina === 'contacto')
    ]));
    var toggle = h('button', { type: 'button', class: 'nav-toggle', 'aria-expanded': 'false', 'aria-controls': 'menu-principal', 'aria-label': 'Abrir menú' }, [IFT.icon('menu', 24)]);
    mount.appendChild(h('header', { class: 'site-header' }, h('div', { class: 'container header-inner' }, [marca(), toggle, nav])));
    comportamiento(mount, toggle, nav);
  };

  function comportamiento(mount, toggle, nav) {
    var subs = Array.prototype.slice.call(mount.querySelectorAll('.has-sub'));
    var movil = window.matchMedia('(max-width: 920px)');
    var puedeHover = window.matchMedia('(hover: hover)');

    function cerrarSubs(excepto) {
      subs.forEach(function (li) { if (li !== excepto) abrir(li, false); });
    }
    function abrir(li, estado) {
      li.classList.toggle('is-open', estado);
      li.querySelector('.nav-btn').setAttribute('aria-expanded', String(estado));
    }
    function menuMovil(estado) {
      nav.classList.toggle('is-open', estado);
      toggle.setAttribute('aria-expanded', String(estado));
      toggle.setAttribute('aria-label', estado ? 'Cerrar menú' : 'Abrir menú');
      toggle.replaceChild(IFT.icon(estado ? 'close' : 'menu', 24), toggle.firstChild);
      if (!estado) cerrarSubs();
    }

    toggle.addEventListener('click', function () { menuMovil(!nav.classList.contains('is-open')); });

    subs.forEach(function (li) {
      var btn = li.querySelector('.nav-btn');
      var enlaces = function () { return Array.prototype.slice.call(li.querySelectorAll('.submenu a')); };
      btn.addEventListener('click', function () {
        var estado = !li.classList.contains('is-open');
        cerrarSubs(li); abrir(li, estado);
      });
      btn.addEventListener('keydown', function (ev) {
        if (ev.key === 'ArrowDown') { ev.preventDefault(); abrir(li, true); var l = enlaces(); if (l[0]) l[0].focus(); }
      });
      li.addEventListener('keydown', function (ev) {
        var l = enlaces(), i = l.indexOf(document.activeElement);
        if (ev.key === 'Escape') { abrir(li, false); btn.focus(); ev.stopPropagation(); }
        else if (ev.key === 'ArrowDown' && i > -1) { ev.preventDefault(); l[(i + 1) % l.length].focus(); }
        else if (ev.key === 'ArrowUp' && i > -1) { ev.preventDefault(); (i === 0 ? btn : l[i - 1]).focus(); }
      });
      li.addEventListener('focusout', function (ev) {
        if (ev.relatedTarget && !li.contains(ev.relatedTarget)) abrir(li, false);
      });
      // Hover solo con ratón en escritorio (táctil y teclado usan clic)
      li.addEventListener('mouseenter', function () { if (puedeHover.matches && !movil.matches) { cerrarSubs(li); abrir(li, true); } });
      li.addEventListener('mouseleave', function () { if (puedeHover.matches && !movil.matches) abrir(li, false); });
    });

    document.addEventListener('click', function (ev) {
      if (!mount.contains(ev.target)) { cerrarSubs(); if (nav.classList.contains('is-open')) menuMovil(false); }
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && nav.classList.contains('is-open')) { menuMovil(false); toggle.focus(); }
    });
    nav.addEventListener('click', function (ev) {
      if (ev.target.closest && ev.target.closest('a') && nav.classList.contains('is-open')) menuMovil(false);
    });
    var alCambiar = function () { if (!movil.matches) menuMovil(false); };
    if (movil.addEventListener) movil.addEventListener('change', alCambiar); else movil.addListener(alCambiar);
  }
})();
