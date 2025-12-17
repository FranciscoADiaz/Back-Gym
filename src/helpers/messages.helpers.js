const transporter = require("./nodemailer.helpers");
const {
  welcomeTemplate,
  recoveryTemplate,
} = require("./emailTemplates.helpers");

const sanitize = (value = "") => value.toString().trim();
const formatContactHtml = ({ nombre, email, mensaje }) => {
  const safeMessage = sanitize(mensaje).replace(/\n/g, "<br>");
  return `
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Nombre:</strong> ${sanitize(nombre)}</p>
    <p><strong>Email:</strong> ${sanitize(email)}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${safeMessage}</p>
  `;
};

const sendContactEmail = async ({ nombre, email, mensaje }) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return {
        success: false,
        statusCode: 500,
        error: "Credenciales SMTP no configuradas",
      };
    }

    const destinatario =
      process.env.CONTACT_EMAIL ||
      process.env.FROM_EMAIL ||
      process.env.SMTP_USER;

    const info = await transporter.sendMail({
      from: `"Contacto TucuGym" <${
        process.env.FROM_EMAIL || process.env.SMTP_USER
      }>`,
      to: destinatario,
      replyTo: sanitize(email),
      subject: `Nuevo mensaje de ${sanitize(nombre)}`,
      text: `Nombre: ${sanitize(nombre)}\nEmail: ${sanitize(
        email
      )}\n\nMensaje:\n${sanitize(mensaje)}`,
      html: formatContactHtml({ nombre, email, mensaje }),
    });

    return {
      success: true,
      statusCode: 200,
      msg: "Mensaje enviado correctamente",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Error al enviar mensaje de contacto:", error.message);
    return {
      success: false,
      statusCode: 500,
      error: "No se pudo enviar el mensaje. Intenta más tarde.",
    };
  }
};

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
  sendContactEmail,
};
