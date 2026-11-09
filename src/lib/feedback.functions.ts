import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  password: z.string().min(1).max(200),
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
  const [x, y] = await Promise.all([digest(a), digest(b)]);
  let diff = 0;

  for (let i = 0; i < x.length; i++) {
    diff |= x[i]! ^ y[i]!;
  }

  return diff === 0;
}

export const validateFeedbackPassword = createServerFn({
  method: "POST",
})
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

    return { ok: true as const };
  });
