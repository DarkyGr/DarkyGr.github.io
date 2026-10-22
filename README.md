# DarkyGr.github.io

Portafolio personal de Guillermo Riaño → https://darkygr.github.io

## Stack

- [Astro 7](https://astro.build): sitio estático, sin JS por defecto, View Transitions
- [Tailwind CSS v4](https://tailwindcss.com) con `@theme`
- TypeScript
- i18n nativo de Astro: inglés en `/` y español en `/es/` (con `hreflang` y selector de idioma)
- CSS moderno: `@property`, scroll-driven animations, `clamp()`, `prefers-reduced-motion`
- Proyectos cargados desde la GitHub API en build time
- Deploy con GitHub Actions a GitHub Pages

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera ./dist
npm run preview  # sirve ./dist
npm run cv:pdf   # regenera los PDFs del CV (EN/ES) en public/cv/
```

## CV

- Fuente única: `src/data/cv.ts` (EN/ES). Alimenta `/cv/`, `/es/cv/`, los PDFs y `/resume.json` ([JSON Resume](https://jsonresume.org)).
- Diseño ATS: una columna, texto real (PDF etiquetado), encabezados estándar, sin tablas ni barras de nivel, metadatos (título, autor, keywords, idioma).
- Teléfono: no se publica. Crea `cv.private.json` (ignorado por git) con `{ "phone": "+52 ..." }` y `npm run cv:pdf` generará además versiones privadas con teléfono en `cv-private/`.
- Tras editar el CV, ejecuta `npm run cv:pdf` y haz commit de los PDFs de `public/cv/`.

## Estructura

```
public/            assets estáticos (favicon, og.png, imágenes)
src/components/    Home, Hero, Social, Projects, Experience, Footer, LangSwitcher, Typewriter, Icon
src/i18n/ui.ts     textos EN/ES (para añadir un idioma: nueva clave aquí + locale en astro.config.mjs)
src/pages/         index, cv y resume.json (EN) + es/ (ES)
src/data/cv.ts     contenido del CV en ambos idiomas
scripts/cv-pdf.mjs genera los PDFs del CV con Chrome headless
src/layouts/       Base.astro (SEO, Open Graph, JSON-LD)
src/lib/           datos del sitio y cliente de GitHub
src/styles/        global.css (Tailwind + animaciones)
```
