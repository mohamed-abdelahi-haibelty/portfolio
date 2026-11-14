import type { Dictionary } from "./types";

export const en = {
  site: {
    name: "abdellahi.dev",
    person: "Mohamed Abdellahi Haibelty",
  },
  logo: {
    text: "abdellahi.dev",
  },
  skip: "Skip to content",
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
    lead: "Ideas that aren’t organised yet, requirements still fuzzy? No problem: we lay them out together, I put them in order and turn them into a concrete project, ready to use.",
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
  method: {
    title: "How we work",
    note: "— no headaches ↓",
    steps: [
      { title: "We talk", text: "You tell me your idea. It’s free, no strings attached." },
      {
        title: "I propose a plan",
        text: "What we build, how long it takes, what it costs. Clear.",
      },
      { title: "I build", text: "You follow progress at every step, no jargon." },
      { title: "Live!", text: "Your site goes live, fast and secure. And I stay around." },
    ],
  },
  contact: {
    title: { before: "Got a project in mind? ", highlight: "Let’s talk." },
    note: "promise, I don’t bite →",
    whatsapp: { label: "WhatsApp", message: "Hi Mohamed, I have a project in mind:" },
    phone: { label: "Phone" },
    email: { label: "Email" },
  },
  footer: {
    copyright: "© {year} Mohamed Abdellahi Haibelty",
    domain: "abdellahi.dev",
  },
  notFound: {
    title: "Oops, this page got lost.",
    text: "Don’t worry, the home page is right here.",
    cta: "Back to home",
  },
  seo: {
    title: "Mohamed Abdellahi — Web developer: secure, fast, SEO-friendly web apps",
    description:
      "Web developer in Nouakchott. I turn your ideas, even messy ones, into secure, fast web apps that are easy to find on Google. Let’s talk about your project.",
    ogAlt: "Mohamed Abdellahi, web developer — abdellahi.dev",
    jobTitle: "Web developer",
  },
} satisfies Dictionary;
