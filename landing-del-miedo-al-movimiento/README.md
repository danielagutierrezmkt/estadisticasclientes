# Del miedo al movimiento · Landing de inscripción

Landing estática (HTML + CSS + JS, sin dependencias) del intensivo en vivo de Daniela Gutiérrez y Mailen Rodríguez.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura y textos de la página |
| `styles.css` | Diseño (colores de marca, tipografías, responsive) |
| `main.js` | Menú móvil, CTA fijo, FAQ, animaciones y lectura de la configuración |
| `checkout.js` | Panel de pago: métodos, tasa del día y mensaje de WhatsApp |
| `config.js` | Fechas, horario, plataforma, grabación, recursos, datos de pago, WhatsApp y tasa de respaldo |
| `assets/` | Fotos ya recortadas y optimizadas |

## Pago (Zelle, Binance, Pago Móvil)

Los botones de inscripción abren un panel lateral (`checkout.js`) donde la persona deja su nombre y correo, elige el método, ve los datos para pagar (con botón de copiar) y llena los datos de su pago. El botón final abre WhatsApp (`whatsapp` en `config.js`) con el mensaje ya escrito; la captura del comprobante la adjunta ahí.

- Datos de cada método: `pagos` en `config.js`.
- Monto en bolívares: se calcula con la tasa paralela de `tasa.api` (DolarApi). Si la API no responde, usa `tasa.respaldo`.
- Si algún día usas una pasarela externa, pega su enlace en `checkoutUrl` y los botones irán ahí en lugar del panel.

## Completar fechas y detalles

En `config.js`, rellena `fechas`, `plataforma`, `grabacion` (`true`, `false` o `null`) y `reembolso`. Lo que quede vacío se muestra como "Por confirmar" o no se menciona.

## Cambiar fotos

Reemplaza los archivos de `assets/` con el mismo nombre:

- `foto-juntas.jpg` (hero, vertical 4:5)
- `daniela.jpg` y `mama.jpg` (facilitadoras, vertical 4:5)

## Publicar

Es una página estática: sube la carpeta completa a Netlify (arrastrar y soltar), Vercel, GitHub Pages o al hosting de tu web. Para verla en tu computadora, abre `index.html` en el navegador.

Antes de publicar, confirma la biografía de Mailen y que el `og:image` de `index.html` apunte a la URL absoluta de la foto una vez tengas dominio.
