import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, 
  logger: true 
});

transporter.verify((error) => {
  if (error) {
    console.log("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP listo para enviar correos");
  }
});

export const sendResetEmail = async (to, resetLink) => {
  const mailOptions = {
    from: `"FeedYou" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Recuperación de contraseña - FeedYou",
    html: resetEmailTemplate(resetLink),
  };

  await transporter.sendMail(mailOptions);
};

const resetEmailTemplate = (resetLink) => {
  return `
  <div style="
      margin:0;
      padding:0;
      background:#0f172a;
      font-family:'Segoe UI', Arial, sans-serif;
  ">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:80px 20px;">
      <tr>
        <td align="center">

          <!-- TARJETA -->
          <table width="520" cellpadding="0" cellspacing="0" style="
              background:#ffffff;
              border-radius:20px;
              padding:60px 45px;
              box-shadow:0 25px 60px rgb(37, 37, 37);
          ">

            <!-- NOMBRE -->
            <tr>
              <td align="center" style="padding-bottom:8px;">
                <h1 style="
                  margin:0;
                  font-size:30px;
                  font-weight:900;
                  letter-spacing:1px;
                  color:#111827;
                ">
                  FeedYou
                </h1>
              </td>
            </tr>

            <!-- BARRA COLORES FEEDYOU -->
            <tr>
              <td align="center" style="padding:18px 0 35px 0;">
                <div style="
                  width:100px;
                  height:6px;
                  border-radius:6px;
                  background: linear-gradient(
                    90deg,
                    #3b82f6,
                    #22c55e,
                    #f97316,
                    #ec4899,
                    #a855f7
                  );
                "></div>
              </td>
            </tr>

            <!-- TITULO -->
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <h2 style="
                  margin:0;
                  font-size:22px;
                  font-weight:700;
                  color:#1f2937;
                ">
                  Recupera tu contraseña
                </h2>
              </td>
            </tr>

            <!-- TEXTO -->
            <tr>
              <td style="
                  padding:10px 0 25px 0;
                  color:#4b5563;
                  font-size:15px;
                  line-height:1.7;
                  text-align:center;
              ">
                <p style="margin:0 0 12px 0;">Hola 👋</p>
                <p style="margin:0 0 12px 0;">
                  Recibimos una solicitud para restablecer tu contraseña.
                </p>
                <p style="margin:0;">
                  Haz clic en el botón para crear una nueva.
                </p>
              </td>
            </tr>

            <!-- BOTÓN SUAVE MORADO ROSA -->
            <tr>
              <td align="center" style="padding:35px 0;">
                <a href="${resetLink}" 
                   style="
                     display:inline-block;
                     padding:15px 40px;
                     font-size:15px;
                     font-weight:700;
                     text-decoration:none;
                     border-radius:12px;
                     background: linear-gradient(90deg, #a78bfa, #f9a8d4);
                     color:#1f2937;
                     box-shadow:0 10px 30px rgba(168,85,247,0.25);
                   ">
                   Restablecer contraseña
                </a>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td align="center" style="
                  padding-top:10px;
                  font-size:13px;
                  color:#9ca3af;
              ">
                Este enlace expirará en 1 hora.<br/><br/>
                Si no solicitaste este cambio, puedes ignorar este correo.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
  `;
};
export const sendWelcomeEmail = async (to, nombre) => {
  const mailOptions = {
    from: `"FeedYou" <${process.env.EMAIL_USER}>`,
    to,
    subject: "¡Bienvenido a FeedYou!",
    html: welcomeEmailTemplate(nombre),
  };

  await transporter.sendMail(mailOptions);
};

const welcomeEmailTemplate = (nombre) => {
  return `
  <div style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:80px 20px;">
      <tr>
        <td align="center">
          <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;padding:60px 45px;box-shadow:0 25px 60px rgb(37, 37, 37);">
            <tr>
              <td align="center">
                <h1 style="margin:0;font-size:30px;font-weight:900;color:#111827;">FeedYou</h1>
                <div style="width:100px;height:6px;border-radius:6px;background:linear-gradient(90deg,#3b82f6,#22c55e,#f97316,#ec4899,#a855f7);margin:20px 0;"></div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <h2 style="margin:0;font-size:24px;font-weight:700;color:#1f2937;">¡Hola, ${nombre}! ✨</h2>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0 25px 0;color:#4b5563;font-size:16px;line-height:1.7;text-align:center;">
                <p>Estamos emocionados de tenerte con nosotros. Tu cuenta ha sido creada exitosamente y ya puedes empezar a explorar todo lo que FeedYou tiene para ti.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:30px 0;">
                <a href="http://localhost:5173/login" style="display:inline-block;padding:15px 40px;font-size:15px;font-weight:700;text-decoration:none;border-radius:12px;background:linear-gradient(90deg, #22c55e, #3b82f6);color:#ffffff;">
                  Comenzar ahora
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
};