// ════════════════════════════════════════════════════════════════════
// VISIBLE — waiting-list capture endpoint (Vercel serverless function).
// Receives the form POST from index.html, adds the contact to a Resend
// Audience, and (optionally) sends the welcome email with the gift.
//
// The Resend API key lives ONLY here (server-side) — never in the browser.
//
// Required Vercel env var:
//   RESEND_API_KEY      — your Resend API key (re_...)
// Optional:
//   RESEND_AUDIENCE_ID  — target audience. If missing OR wrong (404), the
//                         function auto-discovers your first audience.
//   WELCOME_FROM        — e.g. "VISIBLE <hello@workshop-visible.com>"
//                         (welcome email + gift — needs a verified domain)
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

  if (body._company) return res.status(200).json({ ok: true }); // honeypot
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: "Email invalide." });
  }

  const KEY = process.env.RESEND_API_KEY;
  if (!KEY) return res.status(503).json({ error: "not_configured" });

  const contact = { email, first_name: prenom, unsubscribed: false };

  try {
    let resp = null;

    // 1) Try the configured audience first (if any).
    const envId = (process.env.RESEND_AUDIENCE_ID || "").trim();
    if (envId) {
      resp = await addContact(KEY, envId, contact);
      if (resp.ok || resp.status === 409) return await done(res, KEY, email, prenom);
      if (resp.status !== 404) {
        console.error("Resend add error", resp.status, await resp.text());
        return res.status(502).json({ error: "Impossible d'enregistrer pour le moment." });
      }
      console.warn("RESEND_AUDIENCE_ID introuvable (404) — auto-découverte.");
    }

    // 2) Auto-discover the first audience and use it.
    const list = await fetch("https://api.resend.com/audiences", {
      headers: { Authorization: `Bearer ${KEY}` },
    });
    if (!list.ok) {
      console.error("Resend list audiences error", list.status, await list.text());
      return res.status(502).json({ error: "Impossible d'enregistrer pour le moment." });
    }
    const audiences = ((await list.json()) || {}).data || [];
    const first = audiences[0];
    if (!first) {
      return res.status(502).json({ error: "Aucune audience Resend trouvée — crée-en une d'abord." });
    }
    console.log("Audience auto-découverte:", first.id, "—", first.name);

    resp = await addContact(KEY, first.id, contact);
    if (!resp.ok && resp.status !== 409) {
      console.error("Resend add error", resp.status, await resp.text());
      return res.status(502).json({ error: "Impossible d'enregistrer pour le moment." });
    }
    return await done(res, KEY, email, prenom);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erreur serveur." });
  }
};

// Success: send the optional welcome email, then 200.
async function done(res, KEY, email, prenom) {
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
}

function addContact(KEY, audienceId, contact) {
  return fetch("https://api.resend.com/audiences/" + audienceId + "/contacts", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
}

function safeParse(s) {
  try { return JSON.parse(s); } catch (_) { return {}; }
}
