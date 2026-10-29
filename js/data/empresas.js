/* ==========================================================
   FILIALES — ÚNICA FUENTE DE DATOS
   Al agregar un objeto acá, la filial aparece en el menú,
   la portada, Nosotros, Áreas de negocios, el pie de página
   y el mapa del sitio. Luego ejecutá: node tools/generar-filiales.js
   (crea la carpeta negocios/<slug>/ y actualiza sitemap.xml).

   TODOS ESTOS DATOS SON FICTICIOS (demo: true). Reemplazalos antes de publicar.
   ========================================================== */
window.IFT_EMPRESAS = [
  {
    id: 1,
    nombre: "ACM GROUP TALLER MECÁNICO",
    slug: "acm-group-taller-mecanico",      // nombre de la filial en formato URL
    area: "Taller",             // nombre del área de negocios a la que pertenece
    icono: "truck",                          // chip | building | truck | leaf | briefcase | globe | shield | star
    descripcion: "Texto de demostración: breve descripción de la actividad de esta filial.",
    descripcionLarga: "Texto de demostración. Reemplazar por la presentación oficial de la empresa: qué hace, a quién atiende y cuál es su rol dentro del grupo.",
    productos: ["Servicio de demostración A", "Servicio de demostración B", "Servicio de demostración C"],
    logo: "assets/logos/LOGO-ACM.png",                               // ruta desde la raíz, ej.: "assets/logos/filial-uno.svg"
    url: "",                                // vacío = negocios/<slug>/ ; también admite una URL https externa
    telefono: "+595992432543",                           // ej.: "+595981000000"
    email: "",
    redesSociales: { facebook: "", instagram: "https://www.instagram.com/acmtallermecanico?dlrf=d2ZrdnU2aTQ4amRn", linkedin: "", youtube: "" },
    colorAcento: "",                        // opcional, ej.: "#2a7f62"
    demo: false
  },
  {
    id: 2,
    nombre: "IFT Entrenamientos",
    slug: "ift",
    area: "Instituto de Formación Técnica",
    icono: "building",
    descripcion: "Centro de formación técnica del grupo ACM, con cursos orientados al desarrollo de habilidades aplicables al ámbito laboral.",
    descripcionLarga: "IFT Entrenamientos es el instituto de formación técnica del grupo ACM. Su propuesta se centra en acercar conocimientos técnicos y desarrollar habilidades vinculadas al trabajo. La información de modalidad, duración, requisitos y próximas fechas se publicará en la ficha de cada curso.",
    cursosDescripcion: "Conocé las capacitaciones disponibles. Cada ficha puede incluir modalidad, duración y nivel; consultanos para recibir información sobre fechas e inscripción.",
    cursosVacio: "Estamos preparando la publicación de los próximos cursos. Escribinos para consultar la oferta y las próximas fechas.",
    disertantesDescripcion: "Conocé a los profesionales que comparten su experiencia y conocimientos en nuestras capacitaciones.",
    disertantesVacio: "Próximamente compartiremos información sobre nuestros disertantes.",
    disertantes: [
      {
        nombre: "Camilo Mieres",
        especialidad: "Diagnóstico de transmisiones automáticas",
        foto: "assets/img/disertantes/disertante-demo.svg",
        descripcion: "Perfil de ejemplo. Un disertante puede contar aquí su experiencia en el diagnóstico y mantenimiento de transmisiones automáticas, y el enfoque práctico que comparte en sus capacitaciones.",
        demo: false
      },
      {
        nombre: "Cassio Moroni",
        especialidad: "Especialista en cambios automaticos",
        foto: "assets/img/disertantes/disertante-demo.svg",
        descripcion: "Perfil de ejemplo. Un disertante puede contar aquí su experiencia en el diagnóstico y mantenimiento de transmisiones automáticas, y el enfoque práctico que comparte en sus capacitaciones.",
        demo: false
      }
    ],
    cursos: [
      {
        nombre: "Curso de transmisiones automaticas",
        demo: false,
        descripcion: "Curso de ejemplo para mostrar cómo se publicarán las capacitaciones. Reemplazá esta información por los datos oficiales antes de ofrecer inscripciones.",
        modalidad: "Presencial",
        duracion: "120 horas",
        nivel: "1 y 2",
        proximaFecha: "20 y 21 de noviembre",
        requisitos: "A confirmar"
      },
      {
        nombre: "Diagnóstico electrónico automotriz",
        demo: false,
        descripcion: "Curso de ejemplo para mostrar cómo se publicarán las capacitaciones. Reemplazá esta información por los datos oficiales antes de ofrecer inscripciones.",
        modalidad: "A confirmar",
        duracion: "A confirmar",
        nivel: "A confirmar",
        proximaFecha: "A confirmar",
        requisitos: "A confirmar"
      }
    ],
    logo: "assets/logos/LOGO-IFT.jpeg", url: "", telefono: "+595973492024", email: "",
    redesSociales: { facebook: "", instagram: "https://www.instagram.com/ift_py/", linkedin: "", youtube: "https://youtube.com/@iftentrenamientos" },
    colorAcento: "", demo: false
  },
  {
    id: 3,
    nombre: "Automatic Transmission ACM",
    slug: "acm-automatic-transmision",
    area: "Transmisiones Automáticas",
    icono: "truck",
    descripcion: "Texto de demostración: breve descripción de la actividad de esta filial.",
    descripcionLarga: "Texto de demostración. Reemplazar por la presentación oficial de la empresa.",
    productos: ["Servicio de demostración A", "Servicio de demostración B", "Servicio de demostración C", "Servicio de demostración D"],
    logo: "", url: "", telefono: "", email: "",
    redesSociales: { facebook: "", instagram: "", linkedin: "", youtube: "" },
    colorAcento: "", demo: false
  }
];
