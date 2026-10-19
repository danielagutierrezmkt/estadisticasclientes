/*
  CONFIGURACIÓN DE LA LANDING · Del miedo al movimiento
  Todo lo que está pendiente de confirmar se edita aquí, en un solo lugar.
  Si un valor queda vacío ("") o en null, la página muestra "Por confirmar"
  o simplemente no lo menciona. No hace falta tocar el HTML.
*/
window.LANDING_CONFIG = {
  // Pasarela externa (Hotmart, Stripe...). Vacío = los botones abren el panel de pago propio (Zelle, Binance, Pago Móvil).
  checkoutUrl: "",

  // WhatsApp que recibe los comprobantes (código de país, sin + ni espacios)
  whatsapp: "584227138195",

  precio: 40,
  moneda: "USD",

  // Métodos de pago que aparecen en el panel
  pagos: {
    zelle: {
      correo: "mailenr79@gmail.com",
      titular: "José Montenegro"
    },
    binance: {
      correo: "dagr121201@gmail.com"
    },
    pagoMovil: {
      banco: "BNC",
      codigoBanco: "0191",
      cedula: "8492747",
      telefono: "0424-6661006"
    }
  },

  // Tasa para calcular el monto en bolívares del Pago Móvil.
  // Se consulta la API al abrir la página; si falla, se usa "respaldo" (Bs por dólar).
  tasa: {
    api: "https://ve.dolarapi.com/v1/dolares/paralelo",
    respaldo: 980
  },

  // Fechas y horario. Ejemplo: sabado: "Sábado 14 de noviembre", horario: "10:00 a 12:00", zonaHoraria: "hora de Venezuela (GMT-4)"
  fechas: {
    sabado: "7 de noviembre",
    domingo: "8 de noviembre",
    horario: "3:00 a 5:00 pm",
    zonaHoraria: "hora de Venezuela (GMT-4)"
  },

  // Ejemplo: "Zoom"
  plataforma: "Google Meet",

  // true = habrá grabación · false = no habrá · null = aún no se sabe (no se menciona en la página)
  grabacion: true,
  // Ejemplo: "Acceso a la grabación durante 30 días"
  grabacionDetalle: "",

  // Recursos incluidos (confirmar antes de publicar)
  recursos: [
    "Workbook digital",
    "Ejercicios guiados"
  ],

  // Ejemplo: "Reembolso completo hasta 48 horas antes del inicio"
  reembolso: "",

  instagram: "https://instagram.com/danielagutierrezmkt"
};
