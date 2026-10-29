/* Renderizado de filiales: tarjetas, página de negocios, plantilla de filial y mapa del sitio.
   Todo sale de window.IFT_EMPRESAS (js/data/empresas.js). */
(function () {
  'use strict';
  var IFT = window.IFT, h = IFT.h, cfg = IFT.cfg;

  IFT.empresaHref = function (e) {
    if (/^https:\/\//i.test(e.url || '')) return e.url;
    return IFT.url(((e.url || '').replace(/^\/+/, '')) || 'negocios/' + e.slug + '/');
  };
  IFT.esExterna = function (e) { return /^https:\/\//i.test(e.url || ''); };

  IFT.logoNode = function (e, grande) {
    var caja = h('span', { class: 'logo-box' + (grande ? ' logo-box--grande' : ''), 'aria-hidden': e.logo ? null : 'true' });
    var monograma = function () { caja.textContent = ''; caja.setAttribute('aria-hidden', 'true'); caja.appendChild(h('strong', { text: IFT.iniciales(e.nombre) })); };
    if (e.logo) {
      var img = h('img', { src: IFT.url(e.logo), alt: 'Logotipo de ' + e.nombre, loading: 'lazy' });
      img.addEventListener('error', monograma); // si falta la imagen, se muestra un monograma
      caja.appendChild(img);
    } else monograma();
    return caja;
  };

  IFT.tarjetaEmpresa = function (e) {
    var ext = IFT.esExterna(e);
    var estilo = IFT.colorValido(e.colorAcento) ? '--color-filial:' + e.colorAcento : null;
    return h('article', { class: 'empresa-card', style: estilo }, [
      IFT.logoNode(e),
      h('h3', {}, [e.nombre, e.demo ? h('span', { class: 'badge-demo', text: 'Demo' }) : null]),
      h('p', { class: 'empresa-area', text: e.area || '' }),
      h('p', { class: 'empresa-desc', text: e.descripcion || '' }),
      h('a', { class: 'enlace-flecha', href: IFT.empresaHref(e), target: ext ? '_blank' : null, rel: ext ? 'noopener noreferrer' : null, 'aria-label': 'Conocer más sobre ' + e.nombre }, ['Conocer más', IFT.icon('arrow', 18)])
    ]);
  };
  IFT.colorValido = function (c) { return /^#[0-9a-f]{3,8}$/i.test(c || ''); };

  IFT.gridEmpresas = function () {
    if (!IFT.empresas.length) return h('p', { class: 'aviso', text: 'Todavía no hay empresas cargadas. Agregalas en js/data/empresas.js.' });
    return h('div', { class: 'grid' }, IFT.empresas.map(IFT.tarjetaEmpresa));
  };

  IFT.pageHero = function (titulo, bajada, migas, extra) {
    return h('section', { class: 'page-hero' }, h('div', { class: 'container' }, [
      migas ? h('ol', { class: 'breadcrumb', 'aria-label': 'Ruta de navegación' }, migas.map(function (m) {
        return h('li', {}, m.href ? h('a', { href: m.href, text: m.texto }) : h('span', { 'aria-current': 'page', text: m.texto }));
      })) : null,
      extra || null,
      h('h1', { text: titulo }),
      bajada ? h('p', { text: bajada }) : null
    ]));
  };

  /* Filas de contacto/redes reutilizables (filial y contacto) */
  IFT.filaDato = function (icono, etiqueta, valor, href) {
    return h('li', {}, [IFT.icon(icono, 22), h('div', {}, [
      h('small', { text: etiqueta }),
      href ? h('a', { href: href, text: valor }) : h('span', { class: 'pendiente', text: (valor || '[PENDIENTE]') + ' (pendiente de configurar)' })
    ])]);
  };
  IFT.redes = function (redes, claro) {
    var nombres = { facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn', youtube: 'YouTube' };
    var enlaces = Object.keys(nombres).map(function (k) {
      var u = IFT.httpsUrl(redes && redes[k]);
      return u ? h('a', { href: u, target: '_blank', rel: 'noopener noreferrer', 'aria-label': nombres[k] + ' (se abre en una pestaña nueva)' }, IFT.icon(k, 20)) : null;
    }).filter(Boolean);
    return enlaces.length ? h('div', { class: 'social' }, enlaces) : null;
  };

  /* ---------- Página: Áreas de negocios ---------- */
  IFT.pageNegocios = function (main) {
    main.appendChild(IFT.pageHero('Áreas de negocios', 'Las empresas que integran el grupo y sus áreas de actividad.', [{ texto: 'Inicio', href: IFT.url('') }, { texto: 'Áreas de negocios' }]));
    main.appendChild(h('section', { class: 'section' }, h('div', { class: 'container' }, [
      IFT.empresas.some(function (e) { return e.demo; }) ? h('p', { class: 'aviso', text: 'Empresas de demostración: son datos ficticios que deben reemplazarse antes de publicar.' }) : null,
      IFT.gridEmpresas()
    ])));
  };

  /* ---------- Página: filial individual (plantilla) ---------- */
  function slugActual() {
    var s = document.body.getAttribute('data-slug') || '';
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)) s = new URLSearchParams(location.search).get('slug') || '';
    return s;
  }
  IFT.pageFilial = function (main) {
    var slug = slugActual();
    var e = IFT.empresas.filter(function (x) { return x.slug === slug; })[0];
    var migasBase = [{ texto: 'Inicio', href: IFT.url('') }, { texto: 'Áreas de negocios', href: IFT.url('negocios/') }];
    if (!e) {
      document.title = 'Empresa no encontrada | ' + cfg.nombre;
      main.appendChild(IFT.pageHero('Empresa no encontrada', 'No existe una filial con ese identificador.', migasBase.concat([{ texto: 'No encontrada' }])));
      main.appendChild(h('section', { class: 'section' }, h('div', { class: 'container' }, h('a', { class: 'btn btn--oscuro', href: IFT.url('negocios/'), text: 'Ver todas las áreas de negocios' }))));
      return;
    }
    document.body.setAttribute('data-slug', e.slug);
    if (IFT.colorValido(e.colorAcento)) document.documentElement.style.setProperty('--color-filial', e.colorAcento);
    document.title = e.nombre + ' | ' + cfg.nombre;
    IFT.setMeta('meta[name="description"]', 'content', e.descripcion || '');
    IFT.setMeta('meta[property="og:title"]', 'content', document.title);
    IFT.setMeta('meta[property="og:description"]', 'content', e.descripcion || '');

    main.appendChild(IFT.pageHero(e.nombre, e.area, migasBase.concat([{ texto: e.nombre }]), h('div', { style: 'margin-bottom:1rem' }, IFT.logoNode(e, true))));

    var datos = h('ul', { class: 'lista-datos' }, h('li', {}, [IFT.icon('briefcase', 22), h('div', {}, [h('small', { text: 'Sector o área de actividad' }), h('span', { text: e.area || '[ÁREA]' })])]));
    var tel = IFT.telHref(e.telefono);
    if (tel) datos.appendChild(IFT.filaDato('phone', 'Teléfono', e.telefono, tel));
    var mail = IFT.mailHref(e.email);
    if (mail) datos.appendChild(IFT.filaDato('mail', 'Correo electrónico', e.email, mail));
    var redes = IFT.redes(e.redesSociales);

    main.appendChild(h('section', { class: 'section' }, h('div', { class: 'container split split--top' }, [
      h('div', {}, [
        h('h2', { text: 'Descripción general' }),
        e.demo ? h('p', { class: 'aviso', text: 'Empresa de demostración: datos ficticios que deben reemplazarse antes de publicar.' }) : null,
        h('p', { text: e.descripcionLarga || e.descripcion || '' })
      ]),
      h('aside', { class: 'panel', 'aria-label': 'Datos de la empresa' }, [
        h('h2', { style: 'font-size:1.3rem', text: 'Datos de la empresa' }), datos,
        (!tel && !mail) ? h('p', { class: 'nota-datos', text: 'Esta empresa no tiene datos de contacto propios cargados. Podés escribirle a través del holding.' }) : null,
        redes
      ])
    ])));

    if (Array.isArray(e.disertantes)) {
      var seccionDisertantes = h('section', { class: 'section section--alt' }, h('div', { class: 'container' }, [
        h('div', { class: 'section-head' }, [
          h('h2', { text: 'Nuestros disertantes' }),
          h('p', { text: e.disertantesDescripcion || '' })
        ]),
        e.disertantes.length ? h('div', { class: 'grid disertantes-grid' }, e.disertantes.map(function (disertante) {
          var foto = h('div', { class: 'disertante-foto' });
          var iniciales = h('span', { class: 'disertante-avatar', 'aria-hidden': 'true', text: IFT.iniciales(disertante.nombre) });
          if (disertante.foto) {
            var imagen = h('img', { class: 'disertante-imagen', src: IFT.url(disertante.foto), alt: disertante.demo ? 'Retrato ilustrativo de ejemplo, no corresponde a una persona real' : 'Foto de ' + disertante.nombre, loading: 'lazy' });
            iniciales.hidden = true;
            imagen.addEventListener('error', function () {
              imagen.hidden = true;
              iniciales.hidden = false;
            });
            foto.appendChild(imagen);
          }
          foto.appendChild(iniciales);
          var detallesId = 'disertante-' + e.slug + '-' + IFT.iniciales(disertante.nombre).toLowerCase();
          var volver = h('button', { class: 'disertante-volver', type: 'button', text: 'Volver', disabled: '' });
          var tarjeta = h('details', { class: 'disertante-card' }, [
            h('summary', { class: 'disertante-frente', 'aria-label': 'Ver descripción de ' + disertante.nombre }, [
              foto,
              h('span', { class: 'disertante-meta' }, [
                h('span', { class: 'disertante-nombre' }, [
                  h('span', { class: 'disertante-titulo', text: disertante.nombre }),
                  disertante.demo ? h('span', { class: 'badge-demo', text: 'Ejemplo' }) : null
                ]),
                h('span', { class: 'disertante-especialidad', text: disertante.especialidad }),
                h('span', { class: 'disertante-indicacion', text: 'Ver perfil' })
              ])
            ]),
            h('div', { class: 'disertante-reverso', id: detallesId }, [
              h('p', { class: 'disertante-descripcion', text: disertante.descripcion }),
              volver
            ])
          ]);
          tarjeta.addEventListener('toggle', function () { volver.disabled = !tarjeta.open; });
          return tarjeta;
        })) : h('p', { class: 'catalogo-vacio', text: e.disertantesVacio || 'Próximamente compartiremos información sobre nuestros disertantes.' })
      ]));
      seccionDisertantes.addEventListener('click', function (event) {
        var tarjeta = event.target.closest('.disertante-card');
        if (!tarjeta) return;
        var boton = event.target.closest('.disertante-volver');
        if (!boton && !tarjeta.open) {
          event.preventDefault();
          tarjeta.open = true;
          return;
        }
        if (!boton) return;
        if (tarjeta) {
          tarjeta.open = false;
          tarjeta.querySelector('.disertante-frente').focus();
        }
      });
      main.appendChild(seccionDisertantes);
    }

    if (Array.isArray(e.cursos)) {
      main.appendChild(h('section', { class: 'section section--alt' }, h('div', { class: 'container' }, [
        h('div', { class: 'section-head' }, [
          h('h2', { text: 'Productos y servicios' }),
          h('p', { text: e.cursosDescripcion || '' })
        ]),
        e.cursos.length ? h('div', { class: 'catalogo-cursos' }, e.cursos.map(function (curso) {
          var id = 'inscripcion-' + e.slug + '-' + curso.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          var detalles = [
            curso.modalidad ? h('div', {}, [h('dt', { text: 'Modalidad' }), h('dd', { text: curso.modalidad })]) : null,
            curso.duracion ? h('div', {}, [h('dt', { text: 'Duración' }), h('dd', { text: curso.duracion })]) : null,
            curso.nivel ? h('div', {}, [h('dt', { text: 'Nivel' }), h('dd', { text: curso.nivel })]) : null,
            curso.proximaFecha ? h('div', {}, [h('dt', { text: 'Próxima fecha' }), h('dd', { text: curso.proximaFecha })]) : null,
            curso.requisitos ? h('div', {}, [h('dt', { text: 'Requisitos' }), h('dd', { text: curso.requisitos })]) : null
          ].filter(Boolean);
          return h('details', { class: 'curso-acordeon' }, [
            h('summary', {}, [
              h('span', { class: 'curso-titulo', text: curso.nombre }),
              h('span', { class: 'badge-demo', text: curso.demo ? 'Ejemplo' : 'Ver curso e inscripción' })
            ]),
            h('div', { class: 'curso-contenido' }, [
              curso.descripcion ? h('p', { class: 'curso-descripcion', text: curso.descripcion }) : null,
              detalles.length ? h('dl', { class: 'curso-detalles' }, detalles) : null,
              h('form', { class: 'form form-inscripcion', 'data-course-registration': '', 'data-course': curso.nombre }, [
                h('h3', { text: 'Formulario de inscripción' }),
                h('div', { class: 'form-fila' }, [
                  h('div', { class: 'campo' }, [
                    h('label', { for: id + '-nombre', text: 'Nombre y apellido' }),
                    h('input', { id: id + '-nombre', name: 'nombre', type: 'text', autocomplete: 'name', required: '', minlength: '2' })
                  ]),
                  h('div', { class: 'campo' }, [
                    h('label', { for: id + '-email', text: 'Correo electrónico' }),
                    h('input', { id: id + '-email', name: 'email', type: 'email', autocomplete: 'email', required: '' })
                  ])
                ]),
                h('div', { class: 'campo' }, [
                  h('label', { for: id + '-telefono' }, ['Teléfono ', h('span', { class: 'opcional', text: '(opcional)' })]),
                  h('input', { id: id + '-telefono', name: 'telefono', type: 'tel', autocomplete: 'tel' })
                ]),
                h('div', { class: 'hp', 'aria-hidden': 'true' }, [
                  h('label', { for: id + '-website', text: 'No completar' }),
                  h('input', { id: id + '-website', name: 'website', type: 'text', tabindex: '-1', autocomplete: 'off' })
                ]),
                h('div', { class: 'campo' }, [
                  h('div', { class: 'campo-check' }, [
                    h('input', { id: id + '-privacidad', name: 'privacidad', type: 'checkbox', required: '' }),
                    h('label', { for: id + '-privacidad', text: 'Acepto que mis datos se utilicen para gestionar esta solicitud de inscripción.' })
                  ])
                ]),
                h('p', { class: 'nota-datos', text: 'El envío en línea puede estar pendiente de habilitación. El sitio te indicará si la solicitud fue recibida.' }),
                h('p', { class: 'estado-form', role: 'status', 'aria-live': 'polite', hidden: '' }),
                h('button', { class: 'btn btn--acento', type: 'submit', text: 'Solicitar inscripción' })
              ])
            ])
          ]);
        })) : h('p', { class: 'catalogo-vacio', text: e.cursosVacio || 'Próximamente publicaremos los cursos disponibles.' })
      ])));
    } else if (Array.isArray(e.productos) && e.productos.length) {
      main.appendChild(h('section', { class: 'section section--alt' }, h('div', { class: 'container' }, [
        h('h2', { text: 'Productos y servicios' }),
        h('ul', { class: 'productos' }, e.productos.map(function (p) { return h('li', {}, [IFT.icon('check', 20), h('span', { text: p })]); }))
      ])));
    }

    main.appendChild(h('section', { class: 'section cta' }, h('div', { class: 'container cta-inner' }, [
      h('div', {}, [h('h2', { text: 'Consultá por ' + e.nombre }), h('p', { text: 'Completá el formulario y la consulta quedará asociada a esta empresa.' })]),
      h('div', { class: 'hero-acciones', style: 'margin-top:0' }, [
        h('a', { class: 'btn btn--acento', href: IFT.url('contacto/') + '?empresa=' + encodeURIComponent(e.slug), text: 'Enviar una consulta' }),
        h('a', { class: 'btn btn--claro', href: IFT.url(''), text: 'Volver al holding' })
      ])
    ])));
  };

  /* ---------- Página: mapa del sitio (HTML) ---------- */
  IFT.pageMapa = function (main) {
    function li(txt, href) { return h('li', {}, h('a', { href: href, text: txt })); }
    main.appendChild(IFT.pageHero('Mapa del sitio', 'Todas las páginas públicas del holding y de sus empresas.', [{ texto: 'Inicio', href: IFT.url('') }, { texto: 'Mapa del sitio' }]));
    main.appendChild(h('section', { class: 'section' }, h('div', { class: 'container mapa-sitio' }, h('ul', {}, [
      li('Inicio', IFT.url('')),
      li('Nosotros', IFT.url('nosotros/')),
      h('li', {}, [h('a', { href: IFT.url('negocios/'), text: 'Áreas de negocios' }), h('ul', {}, IFT.empresas.map(function (e) { return li(e.nombre + (e.area ? ' — ' + e.area : ''), IFT.empresaHref(e)); }))]),
      li('Contacto', IFT.url('contacto/')),
      li('Mapa del sitio', IFT.url('mapa-del-sitio/'))
    ]))));
  };
})();
