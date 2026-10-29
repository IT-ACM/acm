/* Página de contacto: datos desde config, mapa, validación y envío (solo si hay endpoint configurado). */
(function () {
  'use strict';
  var IFT = window.IFT, h = IFT.h, cfg = IFT.cfg;

  IFT.iniciarContacto = function () {
    var info = document.getElementById('contacto-info');
    var form = document.getElementById('form-contacto');
    if (!info || !form) return;

    /* Datos del holding */
    var wa = IFT.waHref(cfg.whatsapp && cfg.whatsapp.numero, cfg.whatsapp && cfg.whatsapp.mensaje);
    var lista = h('ul', { class: 'lista-datos' }, [
      IFT.filaDato('pin', 'Dirección', [cfg.direccion, cfg.ciudad, cfg.pais].filter(Boolean).join(', '), ''),
      (cfg.telefonos || []).map(function (t) { return IFT.filaDato('phone', t.etiqueta || 'Teléfono', t.numero, IFT.telHref(t.numero)); }),
      IFT.filaDato('whatsapp', 'WhatsApp', 'Escribir por WhatsApp', wa),
      IFT.filaDato('mail', 'Correo electrónico', cfg.email, IFT.mailHref(cfg.email))
    ]);
    // La dirección es texto informativo, no un enlace:
    if (!IFT.esPlaceholder(cfg.direccion)) { var d = lista.firstChild.querySelector('.pendiente'); if (d) { d.className = ''; d.textContent = [cfg.direccion, cfg.ciudad, cfg.pais].filter(Boolean).join(', '); } }
    info.appendChild(lista);
    var redes = IFT.redes(cfg.redesSociales); if (redes) info.appendChild(redes);

    var mapaUrl = IFT.httpsUrl(cfg.mapaUrl);
    var mapa = document.getElementById('mapa');
    if (mapa) mapa.appendChild(mapaUrl
      ? h('iframe', { src: mapaUrl, title: 'Mapa de ubicación de ' + cfg.nombre, loading: 'lazy', referrerpolicy: 'no-referrer-when-downgrade' })
      : h('p', { text: '[MAPA] Se mostrará cuando se configure una dirección verificable (mapaUrl en js/data/config.js).' }));

    /* Motivos y política */
    var sel = form.elements.motivo;
    ((cfg.formulario && cfg.formulario.motivos) || []).forEach(function (m) { sel.appendChild(h('option', { value: m, text: m })); });
    var pol = document.getElementById('enlace-politica');
    if (pol && cfg.politicaPrivacidadUrl) pol.appendChild(h('a', { href: cfg.politicaPrivacidadUrl, text: 'Política de privacidad' }));

    /* Prellenar empresa si viene de una filial: contacto/?empresa=slug */
    var q = new URLSearchParams(location.search).get('empresa');
    var emp = IFT.empresas.filter(function (e) { return e.slug === q; })[0];
    if (emp) form.elements.empresa.value = emp.nombre;
    var curso = new URLSearchParams(location.search).get('curso');
    if (curso) form.elements.mensaje.value = 'Hola, quisiera recibir información sobre el curso "' + curso.slice(0, 120) + '".';

    /* Validación */
    var reglas = {
      nombre: function (v) { return v.trim().length >= 2 ? '' : 'Escribí tu nombre (mínimo 2 caracteres).'; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Escribí un correo válido, por ejemplo nombre@dominio.com.'; },
      telefono: function (v) { return !v.trim() || /^\+?[\d\s().-]{6,20}$/.test(v.trim()) ? '' : 'Usá solo números, espacios, + o guiones (mínimo 6 dígitos).'; },
      motivo: function (v) { return v ? '' : 'Elegí el motivo de tu consulta.'; },
      mensaje: function (v) { var n = v.trim().length; return n < 10 ? 'Contanos tu consulta en al menos 10 caracteres.' : n > 2000 ? 'El mensaje no puede superar los 2000 caracteres.' : ''; },
      privacidad: function (v, el) { return el.checked ? '' : 'Debés aceptar el tratamiento de tus datos para poder enviar la consulta.'; }
    };
    function validar(nombre) {
      var el = form.elements[nombre], err = document.getElementById('err-' + nombre);
      var msg = reglas[nombre](el.value, el);
      err.textContent = msg;
      if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
      return !msg;
    }
    Object.keys(reglas).forEach(function (n) {
      var el = form.elements[n];
      el.addEventListener('blur', function () { validar(n); });
      el.addEventListener('input', function () { if (el.getAttribute('aria-invalid')) validar(n); });
    });

    var estado = document.getElementById('estado-form');
    function mostrar(tipo, texto) {
      estado.hidden = false; estado.className = 'estado-form estado-form--' + tipo; estado.textContent = texto;
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var invalidos = Object.keys(reglas).filter(function (n) { return !validar(n); });
      if (invalidos.length) { form.elements[invalidos[0]].focus(); mostrar('error', 'Revisá los campos marcados: hay ' + invalidos.length + ' dato(s) por corregir.'); return; }
      if (form.elements._gotcha.value) return; // señuelo anti-spam

      var endpoint = IFT.httpsUrl(cfg.formulario && cfg.formulario.endpoint);
      if (!endpoint) {
        mostrar('info', 'El formulario es correcto, pero el envío todavía no está habilitado en este sitio: falta configurar formulario.endpoint. Tu consulta no fue enviada. Mientras tanto, usá los datos de contacto de esta página.');
        return;
      }
      var datos = {};
      ['nombre', 'email', 'telefono', 'empresa', 'motivo', 'mensaje'].forEach(function (k) { datos[k] = form.elements[k].value.trim(); });
      var boton = form.querySelector('button[type="submit"]'); boton.disabled = true; mostrar('info', 'Enviando…');
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(datos) })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); form.reset(); mostrar('ok', 'Recibimos tu consulta. Te responderemos a la brevedad.'); })
        .catch(function () { mostrar('error', 'No pudimos enviar tu consulta. Probá de nuevo en unos minutos o usá los datos de contacto de esta página.'); })
        .then(function () { boton.disabled = false; });
    });
  };
})();
