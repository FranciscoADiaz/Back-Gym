// HTML templates for transactional emails

/**
 * Generates a polished HTML welcome email.
 * @param {{ nombreUsuario: string, urlLogin: string, brandColor?: string, accentColor?: string, logoUrl?: string }} params
 * @returns {string}
 */
const welcomeTemplate = ({
  nombreUsuario,
  urlLogin,
  brandColor = "#6366f1",
  accentColor = "#06b6d4",
  logoUrl = "https://png.pngtree.com/png-clipart/20231015/original/pngtree-man-character-training-at-the-gym-vector-illustration-png-image_13302900.png",
}) => `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bienvenido/a</title>
  </head>
  <body style="margin:0;padding:0;background:#0f0f23;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#f8fafc;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0f0f23;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:92%;background:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155;">
            <tr>
              <td style="background:${brandColor};padding:24px;text-align:center;">
                <img src="${logoUrl}" alt="Logo" width="64" height="64" style="display:block;margin:0 auto 8px auto;border-radius:8px;" />
                <h1 style="margin:0;color:#fff;font-size:22px;">¡Bienvenido/a, ${
                  nombreUsuario || ""
                }!</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 24px 8px 24px;color:#cbd5e1;">
                <p style="margin:0 0 12px 0;">Gracias por registrarte en Tucu-Gym 💪</p>
                <p style="margin:0 0 12px 0;">Tu cuenta ya está lista. Podés iniciar sesión cuando quieras.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 24px 24px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:8px auto 0 auto;">
                  <tr>
                    <td align="center" bgcolor="${accentColor}" style="border-radius:10px;">
                      <a href="${urlLogin}" target="_blank" style="display:inline-block;padding:12px 22px;color:#0f172a;text-decoration:none;font-weight:700;">Ir a iniciar sesión</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 24px 24px;color:#94a3b8;font-size:12px;text-align:center;border-top:1px solid #334155;">
                <p style="margin:0;">Si no fuiste vos, podés ignorar este correo.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;

const recoveryTemplate = ({
  nombreUsuario = "",
  urlReset,
  brandColor = "#0ea5e9",
  accentColor = "#38bdf8",
}) => `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recuperación de contraseña</title>
  </head>
  <body style="margin:0;padding:0;background:#020617;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#e2e8f0;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#020617;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:92%;background:#0f172a;border-radius:16px;overflow:hidden;border:1px solid #1e293b;">
            <tr>
              <td style="padding:28px 24px;background:${brandColor};text-align:center;">
                <h1 style="margin:0;color:#fff;font-size:22px;">Hola ${nombreUsuario || "otra vez"} 👋</h1>
                <p style="margin:8px 0 0 0;color:#e0f2fe;">Recibimos una solicitud para restablecer tu contraseña.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;color:#94a3b8;font-size:15px;line-height:1.6;">
                <p style="margin:0 0 12px;">Si fuiste vos, hacé clic en el botón para crear una nueva contraseña. Este enlace expira en los próximos <strong>30 minutos</strong>.</p>
                <p style="margin:0 0 12px;">Si no solicitaste el cambio, podés ignorar este correo: tu contraseña seguirá siendo la misma.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 32px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                  <tr>
                    <td bgcolor="${accentColor}" style="border-radius:999px;">
                      <a href="${urlReset}" target="_blank" style="display:inline-block;padding:14px 32px;color:#082f49;text-decoration:none;font-weight:700;">Restablecer contraseña</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 28px;color:#64748b;font-size:12px;text-align:center;border-top:1px solid #1e293b;">
                <p style="margin:0;">Si el botón no funciona, copiá y pegá este enlace en tu navegador:</p>
                <p style="margin:8px 0 0;"><a href="${urlReset}" style="color:#38bdf8;text-decoration:none;word-break:break-all;">${urlReset}</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

module.exports = { welcomeTemplate, recoveryTemplate };










