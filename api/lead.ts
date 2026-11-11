// What happens when someone sends the form on /start:
//
//   1. The answers are checked.
//   2. Chris gets a "New lead" mail. Replying to it answers the lead directly.
//   3. The lead is saved as a contact in Resend, in the segment "Website Leads",
//      with every answer as a property and lead_status = "new".
//   4. The lead is added as a new row to the Google Sheet "Website Leads".
//   5. The lead gets a short confirmation mail.
//
// Where to follow it in Resend:
//   - Audience → segment "Website Leads": one row per lead, with all answers.
//     Change lead_status by hand as you go (new → contacted → call → won / lost).
//   - Emails → filter by tag "type": lead_notification or lead_confirmation.
// The Google Sheet shows the same leads as a table with a status column.
//
// Environment variables in Vercel:
//   RESEND_API_KEY   a Resend API key
//   LEAD_NOTIFY_TO   the inbox that should receive new leads
//   LEAD_SHEET_URL   web app address of the script behind the Google Sheet
//                    (optional: without it, step 4 is skipped)
import { Resend } from "resend";

const SEGMENT_ID = "7bac9a00-1470-4734-a309-4ff384f81e29"; // "Website Leads"
const FROM_LEADS = "Website Leads <leads@chrismongang.com>";
const FROM_CHRIS = "Chris Mongang <hello@chrismongang.com>";
const SITE = "https://www.chrismongang.com";
const LINKEDIN = "https://www.linkedin.com/in/chris-mongang";

type Lead = {
  company: string;
  website: string;
  stage: string;
  goals: string[];
  timing: string;
  name: string;
  email: string;
  whatsapp: string;
  message: string;
};

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return Response.json({ ok: false }, { status: 405 });
    }

    // 1. Check the answers.
    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    if (body?.fax) return Response.json({ ok: true }); // hidden field, only bots fill it
    const lead = readLead(body);
    if (!lead) {
      return Response.json({ ok: false, error: "invalid" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const notifyTo = process.env.LEAD_NOTIFY_TO;
    if (!apiKey || !notifyTo) {
      // On your own machine without a key: show the lead in the terminal, send nothing.
      if (!process.env.VERCEL) {
        console.log("[lead] test run, nothing sent:", lead);
        return Response.json({ ok: true, testRun: true });
      }
      console.error("[lead] RESEND_API_KEY or LEAD_NOTIFY_TO is missing");
      return Response.json({ ok: false, error: "setup" }, { status: 500 });
    }
    const resend = new Resend(apiKey);

    // 2. Tell Chris. If this fails, the visitor sees an error and can retry.
    const notification = await resend.emails.send({
      from: FROM_LEADS,
      to: notifyTo,
      replyTo: lead.email,
      subject: `New lead: ${lead.company} (${lead.stage})`,
      html: notificationHtml(lead),
      text: notificationText(lead),
      tags: [{ name: "type", value: "lead_notification" }],
    });
    if (notification.error) {
      console.error("[lead] notification failed", notification.error);
      return Response.json({ ok: false, error: "send" }, { status: 502 });
    }

    // 3. Save the lead in Resend. Someone who writes twice is updated, not duplicated.
    const [firstName, ...rest] = lead.name.split(" ");
    const properties = {
      company: lead.company,
      website: lead.website,
      stage: lead.stage,
      goals: lead.goals.join(", "),
      timing: lead.timing,
      whatsapp: lead.whatsapp,
      message: lead.message,
      lead_status: "new",
      lead_date: new Date().toISOString().slice(0, 10),
    };
    const created = await resend.contacts.create({
      email: lead.email,
      firstName,
      lastName: rest.join(" "),
      properties,
      segments: [{ id: SEGMENT_ID }],
    });
    if (created.error) {
      const updated = await resend.contacts.update({
        email: lead.email,
        properties,
      });
      await resend.contacts.segments.add({
        email: lead.email,
        segmentId: SEGMENT_ID,
      });
      if (updated.error) console.error("[lead] contact not saved", updated.error);
    }

    // 4. Add a row to the Google Sheet. The script behind the sheet does the writing.
    const sheetUrl = process.env.LEAD_SHEET_URL;
    if (sheetUrl) {
      await fetch(sheetUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        // The sheet script fills the column "Nachricht" from the field it
        // calls reachVia (left over from an earlier version of the form).
        body: JSON.stringify({
          ...lead,
          goals: lead.goals.join(", "),
          reachVia: lead.message,
        }),
        signal: AbortSignal.timeout(8000),
      })
        .then((response) => {
          if (!response.ok) throw new Error(`status ${response.status}`);
        })
        .catch((error) => console.error("[lead] sheet row not added", error));
    }

    // 5. Confirm to the lead. Their reply lands in Chris's inbox.
    const confirmation = await resend.emails.send({
      from: FROM_CHRIS,
      to: lead.email,
      replyTo: notifyTo,
      subject: `Got your note about ${lead.company}`,
      html: confirmationHtml(lead, firstName, notifyTo),
      text: confirmationText(lead, firstName, notifyTo),
      tags: [{ name: "type", value: "lead_confirmation" }],
    });
    if (confirmation.error) {
      console.error("[lead] confirmation failed", confirmation.error);
    }

    return Response.json({ ok: true });
  },
};

function readLead(data: Record<string, unknown> | null): Lead | null {
  if (!data || typeof data !== "object") return null;
  const text = (value: unknown) =>
    typeof value === "string" ? value.trim().slice(0, 200) : "";
  const lead: Lead = {
    company: text(data.company),
    website: text(data.website),
    stage: text(data.stage),
    goals: Array.isArray(data.goals)
      ? data.goals.map(text).filter(Boolean).slice(0, 6)
      : [],
    timing: text(data.timing),
    name: text(data.name),
    email: text(data.email).toLowerCase(),
    whatsapp: text(data.whatsapp),
    message:
      typeof data.message === "string" ? data.message.trim().slice(0, 1000) : "",
  };
  const complete =
    lead.company &&
    lead.stage &&
    lead.goals.length > 0 &&
    lead.timing &&
    lead.name &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email);
  return complete ? lead : null;
}

function rows(lead: Lead): [string, string][] {
  return [
    ["Company", lead.company],
    ["Website", lead.website || "–"],
    ["Stage", lead.stage],
    ["Film should", lead.goals.join(", ")],
    ["Start", lead.timing],
    ["Name", lead.name],
    ["Email", lead.email],
    ["WhatsApp", lead.whatsapp || "–"],
    ["Message", lead.message || "–"],
  ];
}

function notificationText(lead: Lead) {
  return [
    ...rows(lead).map(([label, value]) => `${label}: ${value}`),
    "",
    "Reply to this mail to answer the lead directly.",
  ].join("\n");
}

function notificationHtml(lead: Lead) {
  const links: Record<string, string> = { Email: `mailto:${lead.email}` };
  if (lead.website) {
    links.Website = /^https?:\/\//.test(lead.website)
      ? lead.website
      : `https://${lead.website}`;
  }
  // WhatsApp links only work with the country code.
  if (/^(\+|00)/.test(lead.whatsapp)) {
    links.WhatsApp = `https://wa.me/${lead.whatsapp.replace(/^00/, "").replace(/\D/g, "")}`;
  }
  const table = rows(lead)
    .map(([label, value]) => {
      const shown = links[label]
        ? `<a href="${escape(links[label])}" style="color:#111111">${escape(value)}</a>`
        : escape(value);
      return `<tr><td style="padding:6px 24px 6px 0;color:#8a8a8a;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;white-space:pre-line">${shown}</td></tr>`;
    })
    .join("");
  return `<div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#111111">
<p style="margin:0 0 16px;font-size:18px;font-weight:bold">New lead: ${escape(lead.company)}</p>
<table style="border-collapse:collapse">${table}</table>
<p style="margin:24px 0 0;color:#8a8a8a">Reply to this mail to answer the lead directly.</p>
</div>`;
}

// The confirmation mail: three short paragraphs, then Chris's signature.
function confirmationLines(lead: Lead, firstName: string) {
  const look = lead.website ? `I'll take a look at ${lead.website} and` : "I'll";
  return [
    `Hi ${firstName},`,
    `thanks for telling me about ${lead.company}. ${look} get back to you, usually within one working day.`,
    `If you'd rather talk right away, you can book 15 minutes here: ${SITE}/contact`,
    "Chris",
  ];
}

function confirmationText(lead: Lead, firstName: string, replyTo: string) {
  return `${confirmationLines(lead, firstName).join("\n\n")}

--
Chris Mongang
Founder documentaries · Berlin · New York
${SITE} · ${LINKEDIN}
${replyTo}`;
}

function confirmationHtml(lead: Lead, firstName: string, replyTo: string) {
  const paragraphs = confirmationLines(lead, firstName)
    .map((line) => {
      const linked = escape(line).replace(
        `${SITE}/contact`,
        `<a href="${SITE}/contact" style="color:#111111">chrismongang.com/contact</a>`,
      );
      return `<p style="margin:0 0 16px">${linked}</p>`;
    })
    .join("");
  return `<div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#111111">
${paragraphs}
${signatureHtml(replyTo)}
</div>`;
}

// Same signature as in email-signature.html (the one Chris uses in Gmail).
function signatureHtml(email: string) {
  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:28px;border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;color:#111111">
<tr><td style="padding:0 0 2px 0;font-size:15px;line-height:20px;font-weight:bold;letter-spacing:-0.2px;color:#111111">Chris Mongang</td></tr>
<tr><td style="padding:0 0 14px 0;font-size:13px;line-height:18px;color:#8a8a8a">Founder documentaries · Berlin · New York</td></tr>
<tr><td style="font-size:13px;line-height:18px;color:#8a8a8a"><a href="${SITE}" style="color:#111111;text-decoration:none">chrismongang.com</a>&nbsp;·&nbsp;<a href="${LINKEDIN}" style="color:#111111;text-decoration:none">LinkedIn</a></td></tr>
<tr><td style="padding:2px 0 0 0;font-size:13px;line-height:18px"><a href="mailto:${escape(email)}" style="color:#8a8a8a;text-decoration:none">${escape(email)}</a></td></tr>
</table>`;
}

function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
