const transporter = require("./nodemailer.helpers");
const {
  welcomeTemplate,
  recoveryTemplate,
} = require("./emailTemplates.helpers");

/**
 * Envía email de bienvenida cuando un usuario se registra
 * @param {string} emailUsuario - Email del usuario
 * @param {string} nombreUsuario - Nombre del usuario
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const registroExitoso = async (emailUsuario, nombreUsuario) => {
  try {
    // Validar que existan las credenciales SMTP
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("⚠️  Credenciales SMTP no configuradas. Email no enviado.");
      return {
        success: false,
        error: "Credenciales SMTP no configuradas",
      };
    }

    const info = await transporter.sendMail({
      from: `"TucuGym" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: emailUsuario,
      subject: `¡Bienvenido/a ${nombreUsuario}! 💪`,
      text: `Hola ${nombreUsuario}, gracias por registrarte en TucuGym. Ya podés iniciar sesión y comenzar a entrenar.`,
      html: welcomeTemplate({
        nombreUsuario,
        urlLogin: `${
          process.env.URL_FRONT || "https://front-gym-rho.vercel.app"
        }/iniciarsesion`,
        brandColor: "#6366f1",
        accentColor: "#06b6d4",
      }),
    });

    console.log(`✅ Email de bienvenida enviado a: ${emailUsuario}`);

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error("❌ Error al enviar email de bienvenida:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

const recoveryPassEmail = async (emailUsuario, token, nombreUsuario = "") => {
  const urlFront = process.env.URL_FRONT || "http://localhost:5173";
  const resetUrl = `${urlFront.replace(/\/$/, "")}/recoveryPass?token=${token}`;

  const info = await transporter.sendMail({
    from: `"TucuGym" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: emailUsuario,
    subject: "Recuperar contraseña",
    text: `Hola ${
      nombreUsuario || ""
    }, recibimos una solicitud para restablecer tu contraseña. Ingresá a: ${resetUrl}`,
    html: recoveryTemplate({
      nombreUsuario,
      urlReset: resetUrl,
    }),
  });
  return {
    success: info.response.includes("OK"),
    rejected: info.rejected,
  };
};

module.exports = {
  registroExitoso,
  recoveryPassEmail,
};
