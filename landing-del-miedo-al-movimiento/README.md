# Del miedo al movimiento · Landing de inscripción

Landing estática (HTML + CSS + JS, sin dependencias) del intensivo en vivo de Daniela Gutiérrez y Mailen Rodríguez.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura y textos de la página |
| `styles.css` | Diseño (colores de marca, tipografías, responsive) |
| `main.js` | Menú móvil, CTA fijo, FAQ, animaciones y lectura de la configuración |
| `config.js` | **Todo lo pendiente de confirmar**: enlace de pago, fechas, horario, plataforma, grabación, recursos, reembolso |
| `assets/` | Fotos ya recortadas y optimizadas |

## Activar el pago

Abre `config.js` y pega el enlace en `checkoutUrl`:

```js
checkoutUrl: "https://tu-enlace-de-pago",
```

Mientras `checkoutUrl` esté vacío, todos los botones llevan a `contactUrl` (por defecto, el Instagram) y bajo el precio aparece una nota que lo explica. La página nunca simula un pago.

## Completar fechas y detalles

En `config.js`, rellena `fechas`, `plataforma`, `grabacion` (`true`, `false` o `null`) y `reembolso`. Lo que quede vacío se muestra como "Por confirmar" o no se menciona.

## Cambiar fotos

Reemplaza los archivos de `assets/` con el mismo nombre:

- `foto-juntas.jpg` (hero, vertical 4:5)
- `daniela.jpg` y `mama.jpg` (facilitadoras, vertical 4:5)

## Publicar

Es una página estática: sube la carpeta completa a Netlify (arrastrar y soltar), Vercel, GitHub Pages o al hosting de tu web. Para verla en tu computadora, abre `index.html` en el navegador.

Antes de publicar, confirma la biografía de Mailen y que el `og:image` de `index.html` apunte a la URL absoluta de la foto una vez tengas dominio.
