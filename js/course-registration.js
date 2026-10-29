/* Formularios de inscripción a cursos: usa el endpoint HTTPS general del sitio. */
(function () {
  'use strict';
  var IFT = window.IFT;

  IFT.iniciarInscripciones = function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-course-registration]'), function (form) {
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (!form.reportValidity()) return;

        var estado = form.querySelector('[role="status"]');
        var boton = form.querySelector('button[type="submit"]');
        var endpoint = IFT.httpsUrl(IFT.cfg.formulario && IFT.cfg.formulario.endpoint);
        function mostrar(tipo, texto) {
          estado.hidden = false;
          estado.className = 'estado-form estado-form--' + tipo;
          estado.textContent = texto;
        }

        if (form.elements.website.value) return;
        if (!endpoint) {
          mostrar('info', 'La solicitud está completa, pero todavía no se envió. El formulario del sitio requiere configuración para recibir inscripciones.');
          return;
        }

        var curso = form.getAttribute('data-course') || '';
        var datos = {
          nombre: form.elements.nombre.value.trim(),
          email: form.elements.email.value.trim(),
          telefono: form.elements.telefono.value.trim(),
          empresa: 'IFT Entrenamientos',
          motivo: 'Inscripción a curso',
          mensaje: 'Solicitud de inscripción al curso "' + curso + '". La persona aceptó el uso de sus datos para gestionar esta solicitud.'
        };
        boton.disabled = true;
        mostrar('info', 'Enviando solicitud…');
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(datos)
        }).then(function (respuesta) {
          if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
          form.reset();
          mostrar('ok', 'Recibimos tu solicitud de inscripción. Te contactaremos para confirmar los detalles del curso.');
        }).catch(function () {
          mostrar('error', 'No pudimos enviar la solicitud. Probá de nuevo más tarde o contactanos por los canales publicados.');
        }).then(function () {
          boton.disabled = false;
        });
      });
    });
  };
})();
