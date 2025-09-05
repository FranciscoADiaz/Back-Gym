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

module.exports = { welcomeTemplate };

