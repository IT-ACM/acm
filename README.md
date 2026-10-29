# Sitio corporativo del holding (HTML + CSS + JavaScript, sin frameworks)

Sitio estático pensado para publicarse en `https://midominio.com.py/ift/`. Todo es contenido **provisional**: los textos entre `[CORCHETES]` y las cuatro filiales «Demo» son ficticios y deben reemplazarse antes de publicar.

## Estructura

```
ift/
├── index.html · nosotros/ · negocios/ · contacto/ · mapa-del-sitio/   (cada ruta = carpeta con index.html)
├── negocios/plantilla-filial.html     plantilla de filial (noindex)
├── negocios/<slug>/index.html         una por filial (se generan con tools/generar-filiales.js)
├── css/   variables.css (colores, tipografía, tamaños) · styles.css · components.css · responsive.css
├── js/    utils · icons · navigation · render-empresas · main · contact
│   └── data/  config.js (datos del holding) · empresas.js (filiales) · contenido.js (textos)
├── assets/img/ (hero, institucional, favicon) · assets/logos/ · assets/icons/
├── tools/generar-filiales.js · sitemap.xml · robots.txt · .htaccess
```

## Dónde se edita cada cosa

| Qué | Archivo |
|---|---|
| Nombre, razón social, RUC, logo, dirección, teléfonos, WhatsApp, correo, redes, mapa, política de privacidad, endpoint del formulario | `js/data/config.js` |
| Filiales (nombre, slug de URL derivado del nombre, área, descripción, productos/cursos, logo, contacto, redes, color) | `js/data/empresas.js` |
| Textos de Inicio, historia, misión, visión, valores | `js/data/contenido.js` |
| Colores, tipografías, anchos | `css/variables.css` |

Los datos vacíos o entre corchetes **no se publican como enlaces**: un teléfono sin cargar aparece como «pendiente», no como `tel:` falso. Las redes solo se muestran si tienen una URL `https://` válida.

### Disertantes de IFT Entrenamientos

En `js/data/empresas.js`, dentro de la filial con `slug: "ift"`, agregá objetos al arreglo `disertantes` con el nombre, la especialidad, una ruta de foto y una descripción. Las tarjetas aparecen antes de los cursos: se giran al hacer clic o tocarlas para mostrar la descripción, y se cierran con «Volver».

```js
disertantes: [
  {
    nombre: "Nombre del disertante",
    especialidad: "Especialidad técnica",
    foto: "assets/img/disertantes/nombre.jpg",
    descripcion: "Experiencia y conocimientos que comparte en las capacitaciones."
  }
]
```

Las fotos se guardan en `assets/img/disertantes/`; si todavía no hay una foto disponible, se muestra un monograma con las iniciales. El perfil «Juan Pérez» que viene cargado está marcado como ejemplo y usa una ilustración genérica; reemplazalo o quitá ese objeto antes de publicar.

## Cómo funciona

- Cabecera, pie, tarjetas, menú de áreas, mapa del sitio y páginas de filial se generan con JavaScript desde los datos. No hay HTML duplicado por filial.
- Los enlaces son **relativos** (cada página declara `data-root`), por eso funcionan igual bajo `/ift/` o en otra carpeta.
- El contenido variable se inserta con `textContent`/`createElement`, nunca con `innerHTML`; los enlaces se validan (`tel:`, `mailto:`, `https:`).
- Limitación: como el contenido se renderiza en el navegador, los buscadores deben ejecutar JavaScript para verlo. Los títulos y descripciones de cada página sí están en el HTML estático.

## Agregar una filial nueva

1. Agregá un objeto en `js/data/empresas.js` (copiá uno existente; usá como `slug` el nombre de la filial en minúsculas, sin acentos y con guiones en lugar de espacios; poné `demo: false`).
2. Subí el logo a `assets/logos/` y poné su ruta en `logo` (si falta, se muestra un monograma).
3. Ejecutá `node tools/generar-filiales.js` (requiere Node.js solo en tu computadora, no en el servidor). Crea `negocios/<slug>/index.html` y actualiza `sitemap.xml`.
4. Subí por FTP las carpetas nuevas, `sitemap.xml` y `js/data/empresas.js`.

Sin Node: copiá `negocios/plantilla-filial.html` a `negocios/<slug>/index.html`, cambiá `data-slug=""` por el slug, cambiá cada `="../` por `="../../` y sumá la URL al `sitemap.xml` a mano.
La plantilla también funciona en `negocios/plantilla-filial.html?slug=<slug>` para previsualizar.

Si una filial tiene sitio propio, poné su `url` con `https://…`: el menú y las tarjetas enlazan allí y no se genera página local.

### Cursos de IFT Entrenamientos

Los cursos de IFT se administran en `js/data/empresas.js`, dentro de la filial con `slug: "ift"`. Agregá objetos al arreglo `cursos` con `nombre` y, cuando corresponda, `descripcion`, `modalidad`, `duracion`, `nivel`, `proximaFecha` y `requisitos`. El curso que aparece inicialmente está marcado como ejemplo y debe reemplazarse por información confirmada. Cada curso se despliega para mostrar sus datos y el formulario de inscripción.

```js
cursos: [
  {
    nombre: "Nombre del curso",
    descripcion: "Temas y habilidades que se trabajarán.",
    modalidad: "Presencial",
    duracion: "8 horas",
    nivel: "Inicial",
    proximaFecha: "A confirmar",
    requisitos: "Sin experiencia previa"
  }
]
```

El formulario solicita nombre, correo, teléfono opcional y consentimiento. Envía la inscripción como una consulta al `formulario.endpoint` HTTPS configurado en `js/data/config.js`; mientras ese endpoint esté vacío, avisa que no se envió. Si el arreglo de cursos está vacío, la página muestra el aviso configurado en `cursosVacio`.

## Formulario de contacto

Valida nombre, correo, teléfono (opcional), motivo, mensaje (10–2000 caracteres) y aceptación de privacidad. **No envía nada hasta que configures `formulario.endpoint`** en `config.js` con una URL `https://` que reciba un `POST` en JSON (`nombre, email, telefono, empresa, motivo, mensaje`) — por ejemplo un servicio de formularios o un script propio en el servidor. Mientras esté vacío, la página avisa que la consulta no fue enviada. Incluye un campo señuelo anti-spam; ese control también debe hacerse del lado del servidor.

## URLs, sitemap y `sitemaps.xhtml`

- Las rutas amigables (`/ift/nosotros/`, `/ift/negocios/<slug>/`) son carpetas reales con `index.html`: **no requieren reglas de reescritura**. Si el servidor redirige `/ift/nosotros` a `/ift/nosotros/` (Apache y Nginx lo hacen por defecto), todo funciona.
- La navegación usa enlaces HTML normales; `mapa-del-sitio/` es la página HTML con todas las páginas públicas.
- `sitemap.xml` es solo para buscadores y lo genera `tools/generar-filiales.js`. **Si `sitemaps.xhtml` es un endpoint exigido por tu sistema actual**, no se pudo verificar desde acá: confirmalo con quien administra el servidor y, de ser así, hay que generarlo aparte; este proyecto no depende de él.
- `robots.txt` solo es válido en la raíz del dominio (`https://midominio.com.py/robots.txt`); la copia de esta carpeta es para fusionar allí.
- Cambiá `sitioUrl` en `config.js` por el dominio real antes de generar. En el HTML estático (canonical y Open Graph) está `midominio.com.py`: reemplazalo con buscar y reemplazar.
- Open Graph: falta una imagen para compartir. Agregá una de 1200×630 px y la etiqueta `og:image`.

## Pruebas

Probar siempre desde un servidor (no abriendo el archivo con doble clic):

```
cd <carpeta que contiene ift/>
python3 -m http.server 8000   # abrir http://localhost:8000/ift/
```

Qué se verificó de forma automatizada (jsdom, sin navegador real): que las 8 páginas cargan sin errores de JavaScript, que las tarjetas y el menú salen de `empresas.js`, que no hay enlaces internos rotos, que abre el desplegable y el menú móvil, y que el formulario valida y no finge enviar. **No se probó** en navegadores reales, ni el aspecto visual en móviles, ni accesibilidad con lector de pantalla: revisalo antes de publicar.

## Publicación

Subí la carpeta `ift/` completa a `public_html/ift/` (sin `tools/` si no querés exponerla). Usa HTTPS y no necesita base de datos ni backend, salvo para el formulario.
