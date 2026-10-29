/* Íconos SVG en línea (trazo). Uso: IFT.icon('phone', 20). Se agregan nuevos sumando una entrada. */
(function () {
  'use strict';
  var IFT = (window.IFT = window.IFT || {});
  var P = {
    menu: 'M4 6h16M4 12h16M4 18h16',
    close: 'M6 6l12 12M18 6L6 18',
    chevron: 'M6 9l6 6 6-6',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    check: 'M5 12l5 5 9-10',
    phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
    whatsapp: 'M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.4z M9 9.5c.5 2 2.5 4 4.5 4.5',
    mail: 'M3 5h18v14H3z M3 7l9 6 9-6',
    pin: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z M12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
    chip: 'M7 7h10v10H7z M10 10h4v4h-4z M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4',
    building: 'M4 21V5l8-2v18 M12 9l8 2v10 M2 21h20 M8 8h.01M8 12h.01M8 16h.01M16 14h.01M16 18h.01',
    truck: 'M2 6h11v10H2z M13 10h5l3 3v3h-8z M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    leaf: 'M5 19C5 9 11 4 20 4c0 9-5 15-15 15z M5 19c3-5 6-8 10-10',
    shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4',
    star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
    users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2 20c0-3.5 3-6 7-6s7 2.5 7 6 M17 5a3.5 3.5 0 0 1 0 6 M19 14c2 .7 3 2.5 3 5',
    trend: 'M3 17l6-6 4 4 8-8 M15 7h6v6',
    target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M12 12h.01',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    briefcase: 'M3 8h18v12H3z M8 8V5h8v3 M3 13h18',
    globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18',
    facebook: 'M15 3h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z',
    instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M17.5 6.5h.01',
    linkedin: 'M6 9v11 M6 4.5v.01 M10 20v-7a3 3 0 0 1 6 0v7 M10 9v11',
    youtube: 'M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z M10 9l5 3-5 3z'
  };
  IFT.icon = function (name, size) {
    var NS = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('width', size || 20);
    s.setAttribute('height', size || 20);
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '1.8');
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    s.setAttribute('class', 'icon');
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', P[name] || P.briefcase);
    s.appendChild(p);
    return s;
  };
})();
