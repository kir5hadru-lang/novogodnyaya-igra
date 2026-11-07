import { Resend } from "resend";

function escape(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

function html(link: string) {
  const l = escape(link);
  return `<!doctype html><html><body style="margin:0;background:#0b1530;font-family:Arial,sans-serif;color:#f4f7ff">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
<table width="100%" style="max-width:520px;background:#13224a;border-radius:20px;padding:32px">
<tr><td style="font-size:40px;text-align:center">🎄</td></tr>
<tr><td style="font-size:24px;font-weight:bold;text-align:center;padding:12px 0">Ваша новогодняя игра готова!</td></tr>
<tr><td style="font-size:16px;line-height:1.5;text-align:center;color:#c9d3f0">
Нажмите на кнопку, ответьте на несколько вопросов — и игра соберётся специально для вас.
Ссылку можно переслать тому, кого хотите поздравить.</td></tr>
<tr><td align="center" style="padding:28px 0">
<a href="${l}" style="background:#f5c35b;color:#0b1530;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:999px;display:inline-block">Открыть игру</a></td></tr>
<tr><td style="font-size:12px;color:#8b98c4;text-align:center;word-break:break-all">${l}</td></tr>
</table></td></tr></table></body></html>`;
}

export async function sendGameLink(email: string, link: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Режим разработки: письмо не отправляем, ссылку печатаем в консоль сервера.
    console.log(`\n📧 [dev] Письмо для ${email}: ${link}\n`);
    return;
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Новогодняя игра <onboarding@resend.dev>",
    to: email,
    subject: "🎄 Ваша новогодняя игра-поздравление",
    html: html(link),
    text: `Ваша новогодняя игра готова! Откройте ссылку: ${link}`,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}
