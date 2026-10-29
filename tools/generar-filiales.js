#!/usr/bin/env node
/* Genera negocios/<slug>/index.html para cada filial de js/data/empresas.js (a partir de negocios/plantilla-filial.html)
   y regenera sitemap.xml. Sin dependencias: solo Node.js. Uso: node tools/generar-filiales.js */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const raiz = path.resolve(__dirname, '..');

function cargar(rel) {
  const ctx = { window: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(raiz, rel), 'utf8'), ctx);
  return ctx.window;
}
const cfg = cargar('js/data/config.js').IFT_CONFIG;
const empresas = cargar('js/data/empresas.js').IFT_EMPRESAS;
const base = cfg.sitioUrl.replace(/\/?$/, '/');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const plantilla = fs.readFileSync(path.join(raiz, 'negocios', 'plantilla-filial.html'), 'utf8');

const slugs = new Set(); let creadas = 0;
for (const e of empresas) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.slug || '')) { console.error('Slug inválido, se omite:', e.slug); continue; }
  if (slugs.has(e.slug)) { console.error('Slug duplicado, se omite:', e.slug); continue; }
  slugs.add(e.slug);
  if (/^https:\/\//i.test(e.url || '')) continue; // filial con sitio externo: no necesita página local
  const titulo = esc(`${e.nombre} | ${cfg.nombre}`), desc = esc(e.descripcion || ''), url = `${base}negocios/${e.slug}/`;
  const html = plantilla
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${titulo}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${desc}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${titulo}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${desc}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`)
    .replace(/<meta name="robots" content="noindex">\s*/, '')
    .replace('data-slug=""', `data-slug="${e.slug}"`)
    .replace(/(href|src|data-root)="\.\.\//g, '$1="../../');
  const dir = path.join(raiz, 'negocios', e.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  creadas++;
}

const hoy = new Date().toISOString().slice(0, 10);
const urls = ['', 'nosotros/', 'negocios/', 'contacto/', 'mapa-del-sitio/']
  .concat([...slugs].filter(s => { const e = empresas.find(x => x.slug === s); return !/^https:\/\//i.test(e.url || ''); }).map(s => `negocios/${s}/`));
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => `  <url><loc>${base}${u}</loc><lastmod>${hoy}</lastmod></url>`).join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(raiz, 'sitemap.xml'), xml);

// Aviso de carpetas huérfanas (filiales eliminadas de empresas.js)
const dirs = fs.readdirSync(path.join(raiz, 'negocios'), { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
dirs.filter(d => !slugs.has(d)).forEach(d => console.warn(`Aviso: negocios/${d}/ ya no figura en empresas.js. Borrala a mano si corresponde.`));
console.log(`Páginas de filial generadas: ${creadas}. sitemap.xml actualizado con ${urls.length} URLs.`);
