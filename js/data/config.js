/* ==========================================================
   CONFIGURACIÓN DEL HOLDING — datos generales editables
   Los valores entre [CORCHETES] o vacíos son marcadores:
   la web no los publica como enlaces ni los presenta como reales.
   ========================================================== */
window.IFT_CONFIG = {
  nombre: "ACM GROUP EAS UNIPERSONAL",                    // nombre del grupo o holding
  siglas: "ACM",                        // letra o siglas del logotipo textual provisional
  razonSocial: "ACM GROUP EAS UNIPERSONAL",                    // ej.: "Mi Holding S.A."
  ruc: "80141045-2",                            // ej.: "80000000-0"
  logo: "assets/logos/LOGO-ACM.png",                           // ruta desde la raíz del sitio, ej.: "assets/logos/logo.svg" (vacío = logotipo textual)
  sitioUrl: "https://midominio.com.py/ift/",   // URL pública; la usa tools/generar-filiales.js para sitemap y canonical
  descripcion: "[DESCRIPCIÓN INSTITUCIONAL BREVE] Texto provisional: reemplazar por la descripción oficial del grupo.",

  direccion: "Tte. Vicente Rolón Viera 2715",
  ciudad: "Lambaré 2420",
  pais: "Paraguay",

  telefonos: [                        // numero en formato internacional, ej.: "+595981000000"
    { etiqueta: "Teléfono principal", numero: "+595992432543" },
    { etiqueta: "Otro teléfono", numero: "+595973492024" }
  ],
  whatsapp: { numero: "+595992432543", mensaje: "Hola, quisiera realizar una consulta." },
  email: "operativoacm@gmail.com",                          // ej.: "contacto@midominio.com.py"

  redesSociales: {                    // URLs completas https://...; vacío = no se muestra
    facebook: "",
    instagram: "https://www.instagram.com/acmtallermecanico",
    linkedin: "",
    youtube: ""
  },

  mapaUrl: "https://maps.app.goo.gl/Qgc1Vja5vjAcxyDr6",                        // URL https de "insertar mapa" (embed); vacío = se muestra un marcador
  politicaPrivacidadUrl: "",          // ruta relativa o URL; vacío = no se muestra enlace

  formulario: {
    endpoint: "",                     // URL https de tu backend o servicio de formularios. Vacío = el envío NO está habilitado
    motivos: ["Consulta general", "Inscripción a curso", "Alianzas comerciales", "Proveedores", "Trabajo en el grupo", "Otro"]
  },

  // Cifras opcionales: solo se muestran las que tengan valor real.
  // (La cantidad de empresas y de sectores se calcula sola a partir de empresas.js)
  estadisticas: [
    { valor: "+20", etiqueta: "Años de trayectoria" }
  ]
};
