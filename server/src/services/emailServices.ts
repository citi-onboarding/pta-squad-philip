import nodemailer from "nodemailer";
import path from "path";
import { determinarStatusPorData, obterCoresStatusEmail } from "../utils/statusHelpers";

type EnviarLembreteParams = {
  emailCliente: string;
  nomeCliente: string;
  tituloLivro: string;
  dataPrevista: Date | string;
};

type EnviarConfirmacaoDevolucaoParams = {
  emailCliente: string;
  nomeCliente: string;
  tituloLivro: string;
};

// Shared SMTP transporter used by all email sending functions.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function formatarData(data: Date | string) {
  return new Date(data).toLocaleDateString("pt-BR");
}

// The logo is attached to the email and referenced in the HTML using cid:logoCiti.
const caminhoLogoCiti = path.resolve(
  process.cwd(),
  "src/assets/icons/logoCitiSemFundo.png",
);

type TemplateEmailParams = {
  nomeCliente: string;
  titulo: string;
  subtitulo: string;
  tituloLivro: string;
  status: string;
  statusCor: string;
  statusFundo: string;
  mensagem: string;
  dataLabel?: string;
  dataValor?: string;
};

// Centralizes the email layout to keep reminder and confirmation emails visually consistent.
function gerarTemplateEmail({
  nomeCliente,
  titulo,
  subtitulo,
  tituloLivro,
  status,
  statusCor,
  statusFundo,
  mensagem,
  dataLabel,
  dataValor,
}: TemplateEmailParams) {
  return `
    <div style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 32px 0;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 420px; background-color: #ffffff;">
              
              <tr>
                <td style="padding: 20px 24px 12px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="left" style="vertical-align: middle;">
                        <img 
                          src="cid:logoCiti" 
                          alt="CITI" 
                          style="display: block; max-width: 70px; height: auto;" 
                        />
                      </td>

                      <td align="right" style="vertical-align: middle; font-size: 18px; color: #222222; font-weight: 600;">
                        Biblioteca Escolar
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 8px 24px 0 24px;">
                  <div style="padding: 18px 16px; background-color: #ffffff;">
                    <h1 style="margin: 0 0 8px 0; font-size: 22px; color: #222222; font-weight: 700;">
                      ${titulo}
                    </h1>

                    <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.5;">
                      ${subtitulo}
                    </p>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 16px 24px 0 24px;">
                  <div style="background-color: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 4px; padding: 18px 16px;">
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #222222;">
                      Olá, <strong>${nomeCliente}</strong>.
                    </p>

                    <p style="margin: 0 0 18px 0; font-size: 14px; color: #444444; line-height: 1.6;">
                      ${mensagem}
                    </p>

                    <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 4px; padding: 16px;">
                      <p style="margin: 0 0 10px 0; font-size: 16px; color: #222222; font-weight: 700;">
                        ${tituloLivro}
                      </p>

                      <span style="display: inline-block; padding: 4px 10px; border-radius: 999px; background-color: ${statusFundo}; color: ${statusCor}; font-size: 12px; font-weight: 600;">
                        ${status}
                      </span>

                      ${
                        dataLabel && dataValor
                          ? `
                            <p style="margin: 14px 0 0 0; font-size: 13px; color: #6b7280;">
                               ${dataLabel}: <strong>${dataValor}</strong>
                            </p>
                          `
                          : ""
                      }
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 22px 24px 24px 24px;">
                  <p style="margin: 0; font-size: 12px; color: #777777; line-height: 1.5; text-align: center;">
                    Esta é uma mensagem automática da Biblioteca Escolar.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

// Sends a return reminder email using the shared template.
export async function enviarLembrete({
  emailCliente,
  nomeCliente,
  tituloLivro,
  dataPrevista,
}: EnviarLembreteParams) {
  const dataFormatada = formatarData(dataPrevista);

  const status = determinarStatusPorData(dataPrevista);
  const { statusCor, statusFundo } = obterCoresStatusEmail(status);
  
  const subtitulo = status === "Atrasado"
    ? "Um dos seus empréstimos ultrapassou a data de devolução."
    : "Um dos seus empréstimos está próximo da data de devolução.";

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: emailCliente,
    subject: "Lembrete de devolução do livro",
    text: `Olá, ${nomeCliente}! O livro "${tituloLivro}" está com devolução prevista para ${dataFormatada}.`,
    html: gerarTemplateEmail({
      nomeCliente,
      titulo: "Lembrete de devolução",
      subtitulo,
      tituloLivro,
      status,
      statusCor,
      statusFundo,
      mensagem: `Estamos entrando em contato para lembrar que o livro <strong>${tituloLivro}</strong> está com devolução prevista para <strong>${dataFormatada}</strong>.`,
      dataLabel: "Devolução prevista",
      dataValor: dataFormatada,
    }),
    attachments: [
      {
        filename: "logo-citi.png",
        path: caminhoLogoCiti,
        cid: "logoCiti",
      },
    ],
  });
}

// Sends a confirmation email after the book return is successfully registered.
export async function enviarConfirmacaoDevolucao({
  emailCliente,
  nomeCliente,
  tituloLivro,
}: EnviarConfirmacaoDevolucaoParams) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: emailCliente,
    subject: "Confirmação de devolução de livro",
    text: `Olá, ${nomeCliente}! Confirmamos o recebimento do livro "${tituloLivro}".`,
    html: gerarTemplateEmail({
      nomeCliente,
      titulo: "Devolução confirmada",
      subtitulo: "O livro foi recebido com sucesso pela biblioteca.",
      tituloLivro,
      status: "Devolvido",
      statusCor: "#00a878",
      statusFundo: "#d8f8eb",
      mensagem: `Confirmamos o recebimento do livro <strong>${tituloLivro}</strong>. Obrigado por utilizar a Biblioteca Escolar.`,
    }),
    attachments: [
      {
        filename: "logo-citi.png",
        path: caminhoLogoCiti,
        cid: "logoCiti",
      },
    ],
  });
}
