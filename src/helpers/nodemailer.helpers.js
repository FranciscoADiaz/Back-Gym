const nodemailer = require("nodemailer");


// Configuración para Outlook/Hotmail
const host = process.env.SMTP_HOST || "smtp-mail.outlook.com";
const port = Number(process.env.SMTP_PORT || 587);
const secure = process.env.SMTP_SECURE === "true"; // false para Outlook (usa STARTTLS)
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

// Validar que existan las credenciales
if (!user || !pass) {
  console.warn(
    "⚠️  SMTP_USER o SMTP_PASS no están configurados. Los emails no se enviarán."
  );
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure, // false para 587, true para 465
  auth: {
    user,
    pass,
  },
  tls: {
    // Configuración adicional para Outlook/Hotmail
    ciphers: "SSLv3",
    rejectUnauthorized: false, // Solo para desarrollo, en producción debería ser true
  },
});

// Verificar la configuración al iniciar (opcional, deshabilitado para reducir ruido)
// Si necesitas debug, descomenta el bloque siguiente:
// if (user && pass) {
//   transporter.verify((error) => {
//     if (error) {
//       console.error("❌ Error en configuración de email:", error.message);
//       console.error(
//         "💡 Verifica que SMTP_USER y SMTP_PASS estén correctos en .env"
//       );
//     } else {
//       console.log("✅ Servidor de email configurado correctamente");
//       console.log(`📧 Enviando desde: ${user}`);
//     }
//   });
// }

module.exports = transporter;
