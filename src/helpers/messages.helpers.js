const transporter = require("./nodemailer.helpers");
const { welcomeTemplate } = require("./emailTemplates.helpers");

const registroExitoso = async (emailUsuario, nombreUsuario) => {
  const info = await transporter.sendMail({
    from: `"Tucu-Gym" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: `${emailUsuario}`,
    subject: `Bienvenido  ${nombreUsuario} ✔`,
    text: "En breve podrás iniciar sesión",
    html: welcomeTemplate({
      nombreUsuario,
      urlLogin: `${
        process.env.URL_FRONT || "https://front-gym-rho.vercel.app"
      }/iniciarsesion`,
      brandColor: "#6366f1",
      accentColor: "#06b6d4",
    }),
  });

  return {
    info: info.response.includes("OK"),
    rejected: info.rejected,
  };
};

const recoveryPassEmail = async (emailUsuario, token) => {
  const info = await transporter.sendMail({
    from: `"Tucu-Gym" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: `${emailUsuario}`,
    subject: `Recuperación de contraseña`,
    html: `
    <img src="https://media.tenor.com/FWMGiswEeZUAAAAM/password.gif" alt="gif">
    <h1>Gracias por ser parte de esta comunidad</h1>
    <a href="${process.env.URL_FRONT}/recoveryPass?token=${token}">Ir a la página</a>
    `,
  });
  return {
    info: info.response.includes("OK"),
    rejected: info.rejected,
  };
};

module.exports = {
  registroExitoso,
  recoveryPassEmail,
};
