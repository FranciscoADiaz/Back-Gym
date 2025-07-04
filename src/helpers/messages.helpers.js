const transporter = require("./nodemailer.helpers");

const registroExitoso = async (emailUsuario, nombreUsuario) => {
  const info = await transporter.sendMail({
    from: `"Tucu-Gym" <${process.env.MAILGUN_USER}>`,  // ✅ CAMBIADO a MAILGUN_USER
    to: `${emailUsuario}`,
    subject: `Bienvenido  ${nombreUsuario} ✔`,
    text: "En breve podrás iniciar sesión",
    html: `
    <img src="https://png.pngtree.com/png-clipart/20231015/original/pngtree-man-character-training-at-the-gym-vector-illustration-png-image_13302900.png" alt="gif">
    <h1>Gracias por registrarte en nuestra web </h1> ${nombreUsuario}
    `,
  });

  return {
    info: info.response.includes("OK"),
    rejected: info.rejected,
  };
};

const recoveryPassEmail = async (emailUsuario, token) => {
  const info = await transporter.sendMail({
    from: `"Tucu-Gym" <${process.env.MAILGUN_USER}>`,  // ✅ CAMBIADO a MAILGUN_USER
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
