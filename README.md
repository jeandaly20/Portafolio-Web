# Portafolio Web — Jean Carlos Suárez

Portafolio personal e interactivo desarrollado con **HTML5 semántico, CSS puro y JavaScript vanilla** (sin frameworks ni librerías externas), como proyecto de la asignatura de desarrollo web de la carrera de Ingeniería de Software — **Universidad Estatal de Milagro (UNEMI)**.

**Autor:** Jean Carlos Suárez · Naranjito, Ecuador
**Contacto:** [jsuareza11@unemi.edu.ec](mailto:jsuareza11@unemi.edu.ec) · [GitHub](https://github.com/jeandaly20) · [LinkedIn](https://www.linkedin.com/in/jean-suarez-acevedo-46091a190)

---

## Descripción

Sitio web personal que reunirá mi información académica y profesional, mis habilidades técnicas y
los proyectos desarrollados durante la carrera. Incluirá además una página de **Design System**
donde se documentan las decisiones visuales y los componentes reutilizables.

Objetivos técnicos del proyecto:

- Estructura HTML semántica y accesible.
- CSS organizado por capas y basado en *custom properties*, no en valores repetidos.
- Comportamiento real con JavaScript, sin frameworks.
- Diseño responsive para escritorio, tablet y móvil.

---

## Fases de implementación

| Fase | Nombre | Entregable | Estado |
|---|---|---|---|
| 1 | Configuración y sistema de diseño | Repositorio inicializado y tokens visuales definidos | ✅ |
| 2 | Estructura y maquetación | Página principal con HTML semántico y CSS responsive | ⏳ |
| 3 | Interactividad | Funcionalidades JavaScript | ⏳ |
| 4 | Documentación del sistema | Página de Design System y README final | ⏳ |

---

## Fase 1 — Configuración y sistema de diseño

Antes de maquetar una sola pantalla se definieron todas las decisiones visuales del proyecto como
**CSS Custom Properties**, para que después los componentes las consuman y no haya valores sueltos
repartidos por el código.

```text
Portafolio_Jean_Suárez/
├── README.md
├── .gitignore
├── css/
│   ├── tokens.css      # Colores, tipografía, espaciado, radios, sombras y capas
│   └── base.css        # Reset, tipografía global, utilidades y accesibilidad
└── assets/
    └── img/
        └── favicon.svg
```

### Tokens definidos (`css/tokens.css`)

```css
:root {
  --color-primary: #4f46e5;
  --color-secondary: #0d9488;
  --color-background: #ffffff;
  --color-surface: #f7f7f9;
  --color-text: #111116;
  --color-text-muted: #64646f;

  --font-primary: "Inter", -apple-system, "Segoe UI", Arial, sans-serif;
  --text-base: 1rem;

  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;

  --radius-md: 0.75rem;
  --shadow-card: 0 4px 16px rgb(15 15 20 / 0.08);
}
```

Categorías cubiertas: **color** (marca, superficies, texto y estados), **tipografía** (familias,
escala fluida con `clamp()`, pesos e interlineado), **espaciado** (escala de 4 px en `rem`),
**bordes y radios**, **sombras**, **medidas de layout**, **transiciones** y **capas (z-index)**.

El **tema oscuro** se resuelve redefiniendo esas mismas variables en `:root[data-theme="dark"]` y
en `@media (prefers-color-scheme: dark)`, de modo que ningún componente necesitará reglas propias
para el modo oscuro.

### Base (`css/base.css`)

Reset ligero, jerarquía tipográfica de `h1` a `h6`, estilos de enlaces y multimedia, utilidades de
contenedor y sección, foco visible, enlace de salto al contenido y soporte de
`prefers-reduced-motion`.

---

## Cómo verlo en local

Todavía no hay página que abrir: la Fase 1 solo contiene las hojas de estilo base. Desde la Fase 2
el sitio se podrá levantar con:

```bash
python -m http.server 5500
```

---

## Tecnologías

- HTML5 semántico
- CSS3: Custom Properties, Flexbox, CSS Grid, Media Queries, `clamp()`, `color-mix()`
- JavaScript ES6+
- Git y GitHub · GitHub Pages
- Google Fonts (Inter + JetBrains Mono)

---

© 2026 Jean Carlos Suárez — Proyecto académico de Ingeniería de Software.
