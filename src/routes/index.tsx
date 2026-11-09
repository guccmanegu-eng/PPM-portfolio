import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { validateFeedbackPassword } from "@/lib/feedback.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mijn groei — PGP Portfolio havo" },
      { name: "description", content: "Persoonlijk groeiportfolio voor het Praktijk Gerichte Programma: reflecties, feedback en doelen per module." },
      { property: "og:title", content: "Mijn groei — PGP Portfolio havo" },
      { property: "og:description", content: "Reflecties, feedback en doelen per PGP-module." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAAM = "Yassin Ben Salem";
const KLAS = "H5C";

type QA = { q: string; a: string };
type Module = {
  nr: number;
  title: string;
  sub: string;
  done: boolean;
  emoji: string;
  bg: string;
  werkwijze?: QA[];
  ontwikkeling?: QA[];
  toekomst?: QA[];
};

const modules: Module[] = [
  {
    nr: 1, title: "Veiligheid & Forensisch Onderzoek", sub: "Website voor groep 8", done: true, emoji: "🔍", bg: "bg-primary",
    werkwijze: [
      { q: "Wat heb ik gedaan en hoe tevreden ben ik?", a: "Ik heb deze periode een website ontwikkeld voor groep 8, om hen voor te bereiden op de middelbare school. Ik vind dit een leuk en passend project omdat de kinderen uit groep 8 zelf kunnen voelen hoe de middelbare school is door gebruik van spelletjes. Normaal krijgen kinderen te horen wat hen te wachten staat, maar nu kunnen ze zichzelf beter voorbereiden." },
      { q: "Heb ik iets nieuws geleerd over het onderwerp?", a: "Niet per se. Ik wist al dat het veel beter kon bij groep 8 om hun spanning te verminderen, maar verder heb ik niet iets specifieks geleerd." },
      { q: "Wat heb ik geleerd over samenwerken met betrokkenen?", a: "Dat je geluk moet hebben met wie je aan de lijn krijgt. Bij de eerste basisschool die we belden werd er meteen een melding gemaakt bij school, in plaats van dat ze naar ons verhaal luisterden." },
      { q: "Hoe tevreden ben ik met het eindproduct?", a: "Heel tevreden. Ik denk dat het product echt een kans heeft op de markt: het is een leuke manier om kinderen voor te bereiden op de middelbare school." },
      { q: "Wat ging goed, wat kan beter?", a: "Er is veel goed gegaan. De samenwerking met mijn groepje liep goed, en het coderen en afspraken nakomen thuis ging ook goed." },
    ],
    ontwikkeling: [
      { q: "Wat sprak mij aan?", a: "Veel zelfstandigheid. We konden als groepje makkelijk samenwerken, maar apart. Zo werkten we vooral thuis en kwam er een mooi eindproduct uit." },
      { q: "Wat heb ik geleerd over mezelf?", a: "Dat ik het leuk vind om creatief te zijn met code. Ik heb alles op de website zelf verzonnen." },
      { q: "Welke vaardigheid wil ik verder ontwikkelen?", a: "Vooral communicatie. Als ik iets nodig had van mijn groepje, ging ik het zelf oplossen in plaats van om hulp te vragen." },
      { q: "Welke feedback kreeg ik?", a: "Twee docenten zeiden dat ze het project graag echt gebruikt zouden zien, en dat ik het daarom zou moeten uitbrengen voor groep 8. Ook de opdrachtgever van de basisschool vond het een heel leuk idee." },
    ],
    toekomst: [
      { q: "Met welke functies maakte ik kennis?", a: "Vooral ICT. Ik vond het heel leuk om digitaal aan de slag te gaan in plaats van iets fysieks te maken. Ik ga zelf een informatica-opleiding volgen, dus dat past goed." },
      { q: "Wat neem ik mee naar een vervolgopleiding?", a: "Niet heel veel nieuws: ik heb vooral gebruikgemaakt van de kennis die ik al had." },
      { q: "Wat past bij mij met het oog op het HBO?", a: "Vooral het digitaal werken en coderen." },
    ],
  },
  { nr: 2, title: "Zorg", sub: "Binnenkort", done: false, emoji: "🩺", bg: "bg-mint" },
  { nr: 3, title: "Sociaal Ondernemen & Energieopslag", sub: "Binnenkort", done: false, emoji: "⚡", bg: "bg-sun" },
  { nr: 4, title: "Stage", sub: "Binnenkort", done: false, emoji: "🚀", bg: "bg-accent" },
];

function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }), { threshold: 0.12 });
    document.querySelectorAll(".scroll-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const woorden = ["Reflectie", "Groei", "Samenwerken", "Coderen", "Creativiteit", "Communicatie", "Doelen", "Feedback"];

function Marquee() {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-foreground/20 bg-foreground py-4 text-background">
      <div className="marquee flex w-max gap-10 font-display text-2xl italic">
        {[...woorden, ...woorden].map((w, i) => (
          <span key={i} className="flex items-center gap-10">{w}<span className="text-primary not-italic">✦</span></span>
        ))}
      </div>
    </div>
  );
}

function Index() {
  useScrollReveal();
  return (
    <main className="mx-auto max-w-4xl px-6">
      <ProgressBar />
      <Header />
      <Marquee />
      <Intro />
      <Overzicht />
      <ModuleDetail m={modules[0]!} />
      <Feedback />
      <footer className="border-t border-foreground/20 py-10 text-sm text-muted-foreground">
        {NAAM} · {KLAS} · Martinuscollege · PGP-portfolio
      </footer>
    </main>
  );
}

function quoteInFeedback(text: string) {
  window.dispatchEvent(new CustomEvent("pgp-quote", { detail: text }));
  document.getElementById("feedback")?.scrollIntoView({ behavior: "smooth" });
}

function ProgressBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      setP(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-secondary">
      <div className="h-full origin-left bg-primary transition-transform duration-150" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">{children}</p>;
}

function Header() {
  return (
    <header className="relative pt-16 pb-14 md:pt-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="float-slow absolute top-20 right-4 h-40 w-40 rounded-full bg-sun opacity-80 md:h-56 md:w-56" />
        <div className="float-fast absolute top-64 right-40 h-24 w-24 rounded-full bg-mint" />
        <div className="float-slow absolute bottom-10 right-16 h-14 w-14 rotate-12 bg-primary" />
        <span className="float-fast absolute top-36 right-24 text-5xl md:right-36">✏️</span>
      </div>
      <div className="flex items-baseline justify-between text-sm text-muted-foreground">
        <span>Portfolio PGP</span>
        <span>{KLAS} · 2026</span>
      </div>
      <h1 className="mt-16 text-6xl leading-[1.02] font-medium tracking-tight md:text-8xl" aria-label={NAAM}>
        {NAAM.split(" ").map((w, wi) => (
          <span key={wi} aria-hidden className="mr-[0.25em] inline-block whitespace-nowrap">
            {w.split("").map((c, ci) => (
              <span key={ci} className="letter-pop" style={{ animationDelay: `${(wi * 6 + ci) * 45}ms` }}>{c}</span>
            ))}
          </span>
        ))}
      </h1>
      <p className="mt-8 max-w-xl font-display text-2xl leading-snug text-muted-foreground italic">
        “Elke expert was ooit een beginner.”
      </p>
      <nav className="mt-12 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <a href="#intro" className="underline-offset-4 hover:underline">Introductie</a>
        <a href="#modules" className="underline-offset-4 hover:underline">Modules</a>
        <a href="#module-1" className="underline-offset-4 hover:underline">Module 1</a>
        <a href="#feedback" className="text-primary underline underline-offset-4">Feedback geven</a>
      </nav>
    </header>
  );
}

function Intro() {
  return (
    <section id="intro" className="scroll-reveal grid gap-8 border-b border-foreground/20 py-16 md:grid-cols-[180px_1fr]">
      <Label>Introductie</Label>
      <div className="space-y-5 text-lg leading-relaxed">
        <p>
          Dit is mijn groeidocument voor het Praktijk Gerichte Programma. Per module schrijf ik op wat ik gemaakt heb,
          hoe het ging en wat ik ervan geleerd heb. Elke module beantwoord ik dezelfde vragen, zodat je kunt zien
          waar ik groei.
        </p>
        <p className="text-muted-foreground">
          .
        </p>
      </div>
    </section>
  );
}

function Overzicht() {
  return (
    <section id="modules" className="scroll-reveal grid gap-8 border-b border-foreground/20 py-16 md:grid-cols-[180px_1fr]">
      <Label>Modules</Label>
      <div>
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Voortgang PGP</span>
          <span>{modules.filter((m) => m.done).length} van {modules.length} afgerond</span>
        </div>
        <div className="mt-2 flex gap-1.5">
          {modules.map((m) => (
            <div key={m.nr} title={m.title} className={`h-3 flex-1 rounded-full ${m.done ? m.bg : "bg-secondary"}`} />
          ))}
        </div>
      </div>
      <ol className="divide-y divide-foreground/15 border-y border-foreground/15">
        {modules.map((m) => (
          <li key={m.nr}>
            <a href={m.done ? `#module-${m.nr}` : undefined}
              className={`flex items-baseline gap-6 py-5 ${m.done ? "group" : "text-muted-foreground"}`}>
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg transition group-hover:scale-110 group-hover:rotate-6 ${m.done ? m.bg : "bg-secondary grayscale"}`}>{m.emoji}</span>
              <span className="flex-1 font-display text-2xl group-hover:text-primary">{m.title}</span>
              <span className="text-sm">{m.done ? "Afgerond" : "Nog niet gestart"}</span>
            </a>
          </li>
        ))}
      </ol>
      </div>
    </section>
  );
}

const tabs = [
  { key: "werkwijze", label: "Werkwijze" },
  { key: "ontwikkeling", label: "Ontwikkeling" },
  { key: "toekomst", label: "Toekomst" },
] as const;

const quizOpties = [
  { t: "Plannen", ok: false, uitleg: "Plannen ging juist goed: afspraken thuis nakomen lukte prima." },
  { t: "Communicatie", ok: true, uitleg: "Klopt! Ik loste dingen liever zelf op in plaats van hulp te vragen aan mijn groepje." },
  { t: "Programmeren", ok: false, uitleg: "Nee, coderen vind ik juist leuk: ik heb de hele website zelf verzonnen." },
];

function Quiz() {
  const [keuze, setKeuze] = useState<number | null>(null);
  const k = keuze === null ? null : quizOpties[keuze]!;
  return (
    <div className="mt-10 border-2 border-foreground p-6 shadow-pop">
      <Label>Mini-quiz voor de docent</Label>
      <p className="mt-2 font-display text-2xl">Wat denk je: wat is mijn grootste groeipunt?</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {quizOpties.map((o, i) => (
          <button key={o.t} onClick={() => setKeuze(i)}
            className={`rounded-full border px-4 py-2 text-sm transition active:scale-95 ${keuze === i ? (o.ok ? "border-transparent bg-mint" : "border-transparent bg-sun") : "border-foreground/30 hover:-translate-y-0.5 hover:border-primary"}`}>
            {o.t}
          </button>
        ))}
      </div>
      {k && <p key={keuze} className="reveal mt-4 text-sm">{k.ok ? "✅ " : "🤔 "}{k.uitleg}</p>}
    </div>
  );
}

function ModuleDetail({ m }: { m: Module }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("werkwijze");
  const items = m[tab] ?? [];
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());
  const toggle = (q: string) => setOpenSet((s) => { const n = new Set(s); if (n.has(q)) n.delete(q); else n.add(q); return n; });
  return (
    <section id="module-1" className="scroll-reveal border-b border-foreground/20 py-16">
      <Label>Module 1</Label>
      <h2 className="mt-4 text-4xl leading-tight font-medium md:text-5xl">{m.title}</h2>
      <p className="mt-6 max-w-2xl font-display text-2xl leading-snug">
        Ik maakte met mijn groepje een website met spelletjes, waarmee leerlingen uit groep 8 kunnen ervaren hoe de
        middelbare school is.
      </p>

      <dl className="mt-10 grid gap-6 border-y border-foreground/15 py-6 text-sm sm:grid-cols-3">
        <div><dt className="text-muted-foreground">Mijn rol</dt><dd className="mt-1">Concept en programmeren</dd></div>
        <div><dt className="text-muted-foreground">Opdrachtgever</dt><dd className="mt-1">Basisschool</dd></div>
        <div><dt className="text-muted-foreground">Groeipunt</dt><dd className="mt-1">Communicatie in het groepje</dd></div>
      </dl>

      <Quiz />

      <div className="mt-12 flex gap-6 border-b border-foreground/15">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => { setTab(t.key); setOpenSet(new Set()); }}
            className={`-mb-px border-b-2 pb-3 text-sm font-medium transition ${tab === t.key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            Reflectie op {t.label.toLowerCase()}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">Klik op een vraag om mijn antwoord te lezen. {openSet.size}/{items.length} gelezen</p>
      <div key={tab} className="mt-4 space-y-3">
        {items.map((qa, i) => {
          const open = openSet.has(qa.q);
          return (
            <article key={qa.q} className={`reveal border border-foreground/15 transition ${open ? "bg-card shadow-pop" : "hover:-translate-y-0.5 hover:border-primary"}`} style={{ animationDelay: `${i * 60}ms` }}>
              <button onClick={() => toggle(qa.q)} aria-expanded={open} className="flex w-full items-center gap-4 p-5 text-left">
                <span className="font-display text-sm text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="flex-1 font-display text-xl leading-snug italic">{qa.q}</h3>
                <span className={`text-2xl text-primary transition-transform ${open ? "rotate-45" : ""}`}>+</span>
              </button>
              {open && (
                <div className="reveal px-5 pb-5 md:pl-14">
                  <p className="leading-relaxed">{qa.a}</p>
                  <button onClick={() => quoteInFeedback(`Over "${qa.q}": `)} className="mt-4 text-sm text-primary underline-offset-4 hover:underline">
                    💬 Reageer op dit antwoord
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {items.length > 0 && openSet.size === items.length && (
        <div className="reveal mt-4 flex items-center gap-3 bg-mint p-4 text-sm font-medium">
          <span className="animate-bounce text-2xl">🎉</span>
          Alle vragen over {tab} gelezen!
          {tab !== "toekomst" && (
            <button onClick={() => { const i = tabs.findIndex((t) => t.key === tab); setTab(tabs[i + 1]!.key); setOpenSet(new Set()); }} className="ml-auto underline underline-offset-4">
              Volgende reflectie →
            </button>
          )}
        </div>
      )}
      {items.length > 0 && (
        <button onClick={() => setOpenSet(openSet.size === items.length ? new Set() : new Set(items.map((x) => x.q)))} className="mt-4 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
          {openSet.size === items.length ? "Alles inklappen" : "Alles openklappen"}
        </button>
      )}

      <div className="mt-8 grid gap-8 bg-secondary p-8 md:grid-cols-2">
        <div>
          <Label>Doelen voor module 2</Label>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Eerder hulp vragen aan mijn groepje.</li>
            <li>Vaker laten weten waar ik mee bezig ben.</li>
          </ul>
        </div>
        <div>
          <Label>Feedback van docent</Label>
          <p className="mt-3 text-muted-foreground">Docenten kunnen hieronder feedback achterlaten.</p>
        </div>
      </div>
    </section>
  );
}


function Feedback() {
  const validate = useServerFn(validateFeedbackPassword);

  const [message, setMessage] = useState("");
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);

  const chips = [
    "👏 Sterk gedaan",
    "💡 Goede reflectie",
    "🗣️ Werk aan communicatie",
    "🚀 Breng het echt uit!",
  ];

  const [state, setState] = useState<{
    status: "idle" | "sending" | "done" | "error";
    msg?: string;
  }>({ status: "idle" });

  useEffect(() => {
    const on = (e: Event) =>
      setMessage((m) =>
        (m ? m + "\n\n" : "") + (e as CustomEvent<string>).detail
      );

    window.addEventListener("pgp-quote", on);
    return () => window.removeEventListener("pgp-quote", on);
  }, []);

  // Detect a successful return from FormSubmit.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("feedback") === "sent") {
      setState({ status: "done" });
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.hash
      );
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const f = new FormData(form);

    setState({ status: "sending" });

    try {
      // First, validate the password on the Vercel server.
      const result = await validate({
        data: {
          password: String(f.get("password") ?? ""),
        },
      });

      if (!result.ok) {
        setState({ status: "error", msg: result.error });
        return;
      }

      // Prepare the feedback for a direct browser submission.
      const feedback =
        (stars
          ? `Beoordeling: ${"★".repeat(stars)}${"☆".repeat(5 - stars)}\n\n`
          : "") + String(f.get("message") ?? "");

      // Create a separate form so the password is NOT sent to FormSubmit.
      const outbound = document.createElement("form");
      outbound.method = "POST";
      outbound.action = "https://formsubmit.co/141383@martinuscollege.nl";

      const fields: Record<string, string> = {
        _subject: `Portfolio-feedback van ${String(f.get("name"))} (${String(f.get("module"))})`,
        _template: "table",
        _next: `${window.location.origin}${window.location.pathname}?feedback=sent#feedback`,
        Docent: String(f.get("name") ?? ""),
        Module: String(f.get("module") ?? ""),
        Feedback: feedback,
      };

      for (const [name, value] of Object.entries(fields)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        outbound.appendChild(input);
      }

      document.body.appendChild(outbound);

      // Submit directly from the visitor's browser to FormSubmit.
      outbound.submit();
    } catch (error) {
      console.error("Feedback error:", error);
      setState({
        status: "error",
        msg: "Er ging iets mis. Probeer het opnieuw.",
      });
    }
  }

  const input =
    "w-full border-b border-foreground/30 bg-transparent py-2 outline-none focus:border-primary";

  return (
    <section
      id="feedback"
      className="scroll-reveal grid gap-8 py-16 md:grid-cols-[180px_1fr]"
    >
      <Label>Voor docenten</Label>

      <div>
        <h2 className="text-4xl font-medium">Feedback achterlaten</h2>

        <p className="mt-3 text-muted-foreground">
          Je feedback wordt direct naar mij gemaild. Je hebt het wachtwoord
          nodig dat ik heb meegestuurd.
        </p>

        {state.status === "done" ? (
          <p className="mt-10 border-l-2 border-primary pl-4 text-lg">
            Bedankt, je feedback is verstuurd.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <label className="block text-sm">
                Naam docent
                <input
                  name="name"
                  required
                  maxLength={100}
                  className={input}
                />
              </label>

              <label className="block text-sm">
                Module
                <select
                  name="module"
                  className={input}
                  defaultValue="Module 1"
                >
                  {modules.map((m) => (
                    <option key={m.nr}>Module {m.nr}</option>
                  ))}
                  <option>Algemeen</option>
                </select>
              </label>
            </div>

            <div>
              <p className="text-sm">Hoe vind je deze module?</p>

              <div
                className="mt-2 flex gap-1"
                onMouseLeave={() => setHover(0)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    aria-label={`${n} sterren`}
                    onMouseEnter={() => setHover(n)}
                    onClick={() => setStars(n)}
                    className={`text-3xl transition hover:scale-125 ${
                      n <= (hover || stars)
                        ? "text-primary"
                        : "text-foreground/20"
                    }`}
                  >
                    ★
                  </button>
                ))}

                {stars > 0 && (
                  <span className="ml-3 self-center text-sm text-muted-foreground">
                    {
                      ["", "Kan beter", "Oké", "Goed", "Heel goed", "Top!"][
                        stars
                      ]
                    }
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm">Snelle reactie</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() =>
                      setMessage((m) => (m ? m + " " : "") + c + ".")
                    }
                    className="rounded-full border border-foreground/20 px-3 py-1.5 text-sm transition hover:-translate-y-0.5 hover:border-primary hover:bg-secondary active:scale-95"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-sm">
              Feedback
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={5}
                maxLength={5000}
                rows={5}
                className={input}
              />
            </label>

            <label className="block max-w-xs text-sm">
              Wachtwoord
              <input
                name="password"
                type="password"
                required
                className={input}
              />
            </label>

            {state.status === "error" && (
              <p className="text-sm text-destructive">{state.msg}</p>
            )}

            <button
              disabled={state.status === "sending"}
              className="bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:bg-primary disabled:opacity-50"
            >
              {state.status === "sending"
                ? "Versturen…"
                : "Verstuur feedback"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
