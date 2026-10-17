/*
  CONFIGURACIÓN DE LA LANDING · Del miedo al movimiento
  Todo lo que está pendiente de confirmar se edita aquí, en un solo lugar.
  Si un valor queda vacío ("") o en null, la página muestra "Por confirmar"
  o simplemente no lo menciona. No hace falta tocar el HTML.
*/
window.LANDING_CONFIG = {
  // Enlace de pago (Hotmart, Stripe, PayPal, etc.). Vacío = los botones usan el contacto de abajo.
  checkoutUrl: "",

  // Contacto de respaldo mientras no hay enlace de pago (WhatsApp, Instagram, formulario...).
  contactUrl: "https://instagram.com/danielagutierrezmkt",
  contactLabel: "Escríbenos por Instagram",

  precio: 40,
  moneda: "USD",

  // Fechas y horario. Ejemplo: sabado: "Sábado 14 de noviembre", horario: "10:00 a 12:00", zonaHoraria: "hora de Venezuela (GMT-4)"
  fechas: {
    sabado: "",
    domingo: "",
    horario: "",
    zonaHoraria: ""
  },

  // Ejemplo: "Zoom"
  plataforma: "",

  // true = habrá grabación · false = no habrá · null = aún no se sabe (no se menciona en la página)
  grabacion: null,
  // Ejemplo: "Acceso a la grabación durante 30 días"
  grabacionDetalle: "",

  // Recursos incluidos (confirmar antes de publicar)
  recursos: [
    "Workbook digital",
    "Ejercicios guiados",
    "Plantilla de organización de contenido"
  ],

  // Ejemplo: "Reembolso completo hasta 48 horas antes del inicio"
  reembolso: "",

  instagram: "https://instagram.com/danielagutierrezmkt"
};
