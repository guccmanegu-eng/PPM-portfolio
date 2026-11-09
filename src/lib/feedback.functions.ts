
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RECIPIENT = "141383@martinuscollege.nl";
const SITE_URL = "https://ppmportfolio.vercel.app";

const schema = z.object({
  password: z.string().min(1).max(200),
  name: z.string().trim().min(1, "Vul je naam in").max(100),
  module: z.string().trim().max(60),
  message: z.string().trim().min(5, "Schrijf iets meer feedback").max(5000),
});

async function digest(s: string) {
  return new Uint8Array(
    await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(s)
    )
  );
}

async function safeEqual(a: string, b: string) {
  const [x, y] = await Promise.all([
    digest(a),
    digest(b),
  ]);

  let diff = 0;

  for (let i = 0; i < x.length; i++) {
    diff |= x[i]! ^ y[i]!;
  }

  return diff === 0;
}

export const sendFeedback = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const expected = process.env["FEEDBACK_PASSWORD"];

    if (!expected) {
      return {
        ok: false as const,
        error: "De website is nog niet goed ingesteld.",
      };
    }

    if (!(await safeEqual(data.password, expected))) {
      return {
        ok: false as const,
        error: "Wachtwoord klopt niet.",
      };
    }

    try {
      const res = await fetch(
        `https://formsubmit.co/ajax/${RECIPIENT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Referer: `${SITE_URL}/`,
          },
          body: JSON.stringify({
            _subject: `Portfolio-feedback van ${data.name} (${data.module})`,
            _template: "table",
            _captcha: "false",
            _url: SITE_URL,
            Docent: data.name,
            Module: data.module,
            Feedback: data.message,
          }),
        }
      );

      const responseText = await res.text();

      console.log("FormSubmit status:", res.status);
      console.log("FormSubmit response:", responseText);
      console.log(
        "FormSubmit headers:",
        Object.fromEntries(res.headers.entries())
      );

      let body: {
        success?: string | boolean;
        message?: string;
      } = {};

      try {
        body = JSON.parse(responseText);
      } catch {
        console.error("FormSubmit did not return JSON");
      }

      if (!res.ok || String(body.success) !== "true") {
        return {
          ok: false as const,
          error:
            body.message ||
            "Versturen lukte niet. Probeer het later opnieuw.",
        };
      }

      return { ok: true as const };

    } catch (e) {
      console.error("FormSubmit error:", e);

      return {
        ok: false as const,
        error: "Versturen lukte niet. Probeer het later opnieuw.",
      };
    }
  });
