import type { Dictionary } from "./types";

export const en = {
  site: {
    name: "abdellahi.dev",
    person: "Mohamed Abdellahi Haibelty",
  },
  nav: {
    guarantees: "What I guarantee",
    method: "How I work",
    contact: "Contact",
    cta: "Let’s talk ↗",
    menu: "Menu",
    language: "Language",
    switchTo: "French version",
  },
  hero: {
    hello: "hi, I’m Mohamed Abdellahi!",
    title: {
      start: "I build ",
      highlight: "secure",
      afterHighlight: ", ",
      circle: "fast",
      afterCircle: " web apps that are ",
      wavy: "easy to find",
      end: ".",
    },
    lead: "Security, performance, SEO, clean code: I take care of it all. You keep your peace of mind.",
    ctaPrimary: "Let’s talk about your project",
    ctaWhatsapp: "WhatsApp",
    fig: "fig. 1 — me, at work",
    notes: ["secure ✓", "fast ✓", "clean ✓"],
    sticker: "100 % tailor-made!",
    characterAlt: "Mohamed Abdellahi working on his laptop, line drawing",
  },
  badge: {
    header: "DEVELOPER PASS",
    name: "Mohamed Abdellahi",
    role: "Web developer · Nouakchott",
    tags: ["SECURITY", "SPEED", "SEO"],
  },
  ideas: {
    title: { before: "Messy ideas? ", highlight: "I make them real." },
    scraps: [
      "an app for my clients…?",
      "a website? an app?",
      "it should work on phones too",
      "online payments??",
      "?!",
    ],
    arrow: "I sort, clarify and structure",
    windowLabel: "your project",
    result: [
      "Clear requirements, in black and white",
      "A plan and mockups we agree on together",
      "A live app that actually works",
    ],
    done: "a real project ✓",
  },
  guarantees: {
    title: "What I guarantee",
    note: "— hand-drawn, but promises kept",
    items: [
      {
        title: "Security",
        text: "Protected data, secure connections, known flaws closed from day one.",
      },
      {
        title: "Performance",
        text: "Pages that load fast, even on a phone with a weak connection.",
      },
      {
        title: "SEO",
        text: "Well structured for Google: people find you, people click.",
      },
      {
        title: "Clean code",
        text: "Clear, tested, documented: easy to evolve, no nasty surprises.",
      },
    ],
  },
  contact: {
    title: { before: "Got a project in mind? ", highlight: "Let’s talk." },
    note: "promise, I don’t bite →",
    whatsapp: { label: "WhatsApp", message: "Hi Mohamed, I have a project in mind:" },
    phone: { label: "Phone" },
    email: { label: "Email" },
  },
  seo: {
    title: "Mohamed Abdellahi — Web developer: secure, fast, SEO-friendly web apps",
  },
} satisfies Dictionary;
