/* Punto de entrada: pie de página compartido y páginas Inicio / Nosotros / Áreas / Filial / Mapa. */
(function () {
  'use strict';
  var IFT = window.IFT, h = IFT.h, cfg = IFT.cfg, C = IFT.contenido;

  /* ---------- Pie de página (único, compartido) ---------- */
  IFT.renderFooter = function (mount) {
    var wa = IFT.waHref(cfg.whatsapp && cfg.whatsapp.numero, cfg.whatsapp && cfg.whatsapp.mensaje);
    function contacto(icono, valor, href, etiqueta) {
      return h('li', {}, [IFT.icon(icono, 18), href ? h('a', { href: href, text: valor }) : h('span', { class: 'pendiente', text: etiqueta })]);
    }
    var tels = (cfg.telefonos || []).slice(0, 1).map(function (t) { return contacto('phone', t.numero, IFT.telHref(t.numero), '[TELÉFONO]'); });
    var legal = [cfg.razonSocial ? 'Razón social: ' + cfg.razonSocial : null, cfg.ruc ? 'RUC: ' + cfg.ruc : null].filter(Boolean).join(' · ');
    var anio = h('span', { id: 'anio-actual', text: String(new Date().getFullYear()) });
    var privacidad = cfg.politicaPrivacidadUrl ? h('a', { href: cfg.politicaPrivacidadUrl, text: 'Política de privacidad' }) : null;

    mount.appendChild(h('footer', { class: 'site-footer' }, [
      h('div', { class: 'container footer-grid' }, [
        h('div', { class: 'footer-brand' }, [
          h('a', { class: 'brand', href: IFT.url(''), 'aria-label': cfg.nombre + ' — ir al inicio' }, cfg.logo
            ? h('img', { src: IFT.url(cfg.logo), alt: 'Logotipo de ' + cfg.nombre })
            : [h('span', { class: 'brand-mark', 'aria-hidden': 'true', text: cfg.siglas || 'H' }), h('span', { class: 'brand-text', text: cfg.nombre })]),
          h('p', { text: cfg.descripcion }),
          IFT.redes(cfg.redesSociales)
        ]),
        h('div', {}, [h('h2', { text: 'Contacto' }), h('ul', { class: 'footer-contacto' }, [
          contacto('pin', [cfg.direccion, cfg.ciudad, cfg.pais].filter(Boolean).join(', '), '', '[DIRECCIÓN]'),
          tels,
          wa ? contacto('whatsapp', 'WhatsApp', wa, '') : null,
          contacto('mail', cfg.email, IFT.mailHref(cfg.email), '[CORREO ELECTRÓNICO]')
        ])]),
        h('nav', { 'aria-label': 'Navegación del pie de página' }, [h('h2', { text: 'Navegación' }), h('ul', {}, [
          h('li', {}, h('a', { href: IFT.url(''), text: 'Inicio' })),
          h('li', {}, h('a', { href: IFT.url('nosotros/'), text: 'Nosotros' })),
          h('li', {}, h('a', { href: IFT.url('negocios/'), text: 'Áreas de negocios' })),
          h('li', {}, h('a', { href: IFT.url('contacto/'), text: 'Contacto' })),
          h('li', {}, h('a', { href: IFT.url('mapa-del-sitio/'), text: 'Mapa del sitio' }))
        ])]),
        h('nav', { 'aria-label': 'Empresas del grupo' }, [h('h2', { text: 'Empresas del grupo' }), h('ul', {}, IFT.empresas.map(function (e) {
          return h('li', {}, h('a', { href: IFT.empresaHref(e), text: e.nombre }));
        }))])
      ]),
      h('div', { class: 'container footer-legal' }, [
        h('p', {}, ['© ', anio, ' ', cfg.nombre, '. Todos los derechos reservados.', legal ? ' ' + legal : '']),
        privacidad ? h('p', {}, privacidad) : null
      ])
    ]));
  };

  /* ---------- Secciones reutilizables ---------- */
  function seccion(clase, hijos, id) { return h('section', { class: 'section ' + clase, id: id || null }, h('div', { class: 'container' }, hijos)); }
  function valores(items) {
    return h('div', { class: 'valores' }, items.map(function (v) {
      return h('div', { class: 'valor' }, [IFT.icon(v.icono, 30), h('h3', { text: v.titulo }), h('p', { text: v.texto })]);
    }));
  }

  /* ---------- Inicio ---------- */
  function pageInicio(main) {
    var c = C.inicio;
    var org = h('aside', { class: 'hero-org', 'aria-label': 'Estructura del grupo' }, [
      h('h2', { text: 'Estructura del grupo' }),
      h('div', { class: 'org-raiz', text: cfg.nombre }),
      IFT.empresas.length ? h('ul', { class: 'org-lista' }, IFT.empresas.map(function (e) {
        return h('li', {}, h('a', { href: IFT.empresaHref(e) }, [e.nombre, h('small', { text: e.area || '' })]));
      })) : null
    ]);
    main.appendChild(h('section', { class: 'hero' }, h('div', { class: 'container hero-inner' }, [
      h('div', {}, [
        h('p', { class: 'hero-nombre', text: cfg.nombre }),
        h('h1', { text: c.hero.titulo }),
        h('p', { class: 'hero-texto', text: c.hero.texto }),
        h('div', { class: 'hero-acciones' }, [
          h('a', { class: 'btn btn--acento', href: IFT.url('nosotros/'), text: c.hero.botonPrimario }),
          h('a', { class: 'btn btn--claro', href: '#areas', text: c.hero.botonSecundario })
        ])
      ]), org
    ])));

    main.appendChild(seccion('', h('div', { class: 'split' }, [
      h('div', {}, [h('h2', { text: c.presentacion.titulo })].concat(c.presentacion.parrafos.map(function (p) { return h('p', { text: p }); }), [
        h('a', { class: 'enlace-flecha', href: IFT.url('nosotros/') }, [c.presentacion.enlace, IFT.icon('arrow', 18)])
      ])),
      h('img', { src: IFT.url(c.presentacion.imagen), alt: c.presentacion.imagenAlt, width: 800, height: 560, loading: 'lazy' })
    ])));

    main.appendChild(seccion('section--alt', [
      h('div', { class: 'section-head' }, [h('h2', { text: c.negocios.titulo }), h('p', { text: c.negocios.texto })]),
      IFT.gridEmpresas(),
      h('p', { style: 'margin-top:2rem' }, h('a', { class: 'btn btn--borde', href: IFT.url('negocios/'), text: 'Ver todas las áreas de negocios' }))
    ], 'areas'));

    main.appendChild(seccion('section--dark', [
      h('div', { class: 'section-head' }, [h('h2', { text: c.mensaje.titulo }), h('p', { text: c.mensaje.texto })]),
      valores(c.mensaje.items)
    ]));

    /* Resumen: cifras calculadas + las que tengan valor real en config */
    var sectores = {};
    IFT.empresas.forEach(function (e) { if (e.area) sectores[e.area] = true; });
    var cifras = [];
    if (IFT.empresas.length) cifras.push({ valor: String(IFT.empresas.length), etiqueta: IFT.empresas.length === 1 ? 'Empresa' : 'Empresas' });
    var ns = Object.keys(sectores).length;
    if (ns) cifras.push({ valor: String(ns), etiqueta: ns === 1 ? 'Sector de actividad' : 'Sectores de actividad' });
    (cfg.estadisticas || []).forEach(function (s) { if (s.valor && !IFT.esPlaceholder(s.valor)) cifras.push(s); });
    if (cifras.length) {
      main.appendChild(seccion('', [
        h('h2', { text: c.resumen.titulo }),
        h('div', { class: 'stats' }, cifras.map(function (s) { return h('div', {}, [h('span', { class: 'stat-valor', text: s.valor }), h('span', { class: 'stat-etiqueta', text: s.etiqueta })]); })),
        IFT.empresas.some(function (e) { return e.demo; }) ? h('p', { class: 'nota-datos', text: 'Cifras calculadas con empresas de demostración. ' + c.resumen.nota }) : null
      ]));
    }

    main.appendChild(h('section', { class: 'section cta' }, h('div', { class: 'container cta-inner' }, [
      h('div', {}, [h('h2', { text: c.cta.titulo }), h('p', { text: c.cta.texto })]),
      h('a', { class: 'btn btn--acento', href: IFT.url('contacto/'), text: c.cta.boton })
    ])));
  }

  /* ---------- Nosotros ---------- */
  function pageNosotros(main) {
    var n = C.nosotros;
    main.appendChild(IFT.pageHero(n.titulo, n.bajada, [{ texto: 'Inicio', href: IFT.url('') }, { texto: 'Nosotros' }]));
    main.appendChild(seccion('', [
      h('p', { class: 'aviso', text: n.aviso }),
      h('div', { class: 'split split--top' }, [
        h('div', { id: 'historia' }, [h('h2', { text: n.historia.titulo }), h('ol', { class: 'timeline' }, n.historia.etapas.map(function (e) {
          return h('li', {}, [h('strong', { text: e.titulo }), h('p', { text: e.texto })]);
        }))]),
        h('div', { id: 'quienes-somos' }, [h('h2', { text: n.quienes.titulo })].concat(n.quienes.parrafos.map(function (p) { return h('p', { text: p }); })))
      ])
    ]));
    function mv(x, id) { return h('div', { class: 'mv', id: id }, [IFT.icon(x.icono, 32), h('h2', { style: 'font-size:1.6rem', text: x.titulo }), h('p', { style: 'margin:0', text: x.texto })]); }
    main.appendChild(seccion('section--alt', h('div', { class: 'grid grid--2' }, [mv(n.mision, 'mision'), mv(n.vision, 'vision')])));
    main.appendChild(seccion('', [h('h2', { id: 'valores', text: n.valores.titulo, style: 'margin-bottom:2rem' }), valores(n.valores.items)]));
    main.appendChild(seccion('section--alt', [
      h('div', { class: 'section-head' }, [h('h2', { text: n.grupo.titulo }), h('p', { text: n.grupo.texto })]),
      IFT.gridEmpresas()
    ], 'grupo'));
  }

  /* ---------- Arranque ---------- */
  function init() {
    var hd = document.getElementById('site-header'); if (hd) IFT.renderHeader(hd);
    var main = document.getElementById('contenido');
    var pagina = document.body.getAttribute('data-page');
    var vista = document.body.getAttribute('data-vista') || pagina;
    if (main) {
      var mapa = { inicio: pageInicio, nosotros: pageNosotros, negocios: IFT.pageNegocios, filial: IFT.pageFilial, mapa: IFT.pageMapa };
      if (mapa[vista]) mapa[vista](main);
    }
    var ft = document.getElementById('site-footer'); if (ft) IFT.renderFooter(ft);
    if (window.IFT.iniciarContacto) window.IFT.iniciarContacto();
    if (window.IFT.iniciarInscripciones) window.IFT.iniciarInscripciones();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
