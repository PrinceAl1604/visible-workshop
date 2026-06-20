// ════════════════════════════════════════════════════════════════════
// VISIBLE — waiting-list capture endpoint (Vercel serverless function).
// Receives the form POST from index.html, adds the contact to a Resend
// Audience, and (optionally) sends the welcome email with the gift.
//
// The Resend API key lives ONLY here (server-side) — never in the browser.
//
// Required Vercel env vars (Project → Settings → Environment Variables):
//   RESEND_API_KEY      — your Resend API key (re_...)
//   RESEND_AUDIENCE_ID  — the Audience to add contacts to
// Optional (welcome email + gift — needs a domain verified on Resend):
//   WELCOME_FROM        — e.g. "VISIBLE <hello@workshop-visible.com>"
//   GIFT_URL            — link to the mini Brand Blueprint
// ════════════════════════════════════════════════════════════════════

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const prenom = (body.prenom || "").toString().trim();
  const email = (body.email || "").toString().trim();

  // honeypot — bots fill hidden fields; humans don't
  if (body._company) return res.status(200).json({ ok: true });

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: "Email invalide." });
  }

  const KEY = process.env.RESEND_API_KEY;
  const AUDIENCE = process.env.RESEND_AUDIENCE_ID;
  if (!KEY || !AUDIENCE) {
    // Not wired yet — tell the client so it can show a soft message.
    return res.status(503).json({ error: "not_configured" });
  }

  try {
    // 1) Add the contact to the Resend Audience (409 = already there = fine)
    const add = await fetch(`https://api.resend.com/audiences/${AUDIENCE}/contacts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, first_name: prenom, unsubscribed: false }),
    });
    if (!add.ok && add.status !== 409) {
      console.error("Resend audience error", add.status, await add.text());
      return res.status(502).json({ error: "Impossible d'enregistrer pour le moment." });
    }

    // 2) Optional welcome email with the gift (only if a sender is configured)
    const FROM = process.env.WELCOME_FROM;
    if (FROM) {
      const gift = process.env.GIFT_URL || "#";
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: [email],
          subject: "Bienvenue sur la liste VISIBLE 🎉",
          html:
            '<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1a1a1a">' +
            "<p>Salut " + (prenom || "à toi") + ",</p>" +
            "<p>Tu es officiellement sur la liste <strong>VISIBLE</strong>. 🎉</p>" +
            '<p>Comme promis, voici ton <strong>mini Brand Blueprint</strong> : <a href="' + gift + '">je récupère mon cadeau</a>.</p>' +
            "<p>Tu seras aussi le premier prévenu pour le prochain workshop, avec le prix fondateur verrouillé.</p>" +
            "<p>À très vite,<br>Alex — VISIBLE</p></div>",
        }),
      }).catch((e) => console.error("Resend email error", e));
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erreur serveur." });
  }
};

function safeParse(s) {
  try { return JSON.parse(s); } catch (_) { return {}; }
}
