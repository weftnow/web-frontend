export const content = {
  nav: {
    links: [
      { label: "The problem", href: "#problem" },
      { label: "How it works", href: "#how" },
      { label: "Stories", href: "#stories" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: "Book a demo",
  },

  hero: {
    // Two-tone: `muted` renders in --ash and resolves last.
    headline: [
      { text: "The person who changes your year is in this room.", muted: "" },
      { text: "You will spend the night talking to", muted: "someone else." },
    ],
    sub: "Weft finds the four people at your event who should be in a room together — and puts them there.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "See how it works",
    ycLabel: "Backed by Y Combinator",
  },

  // logos: `real` renders real wordmark components; `placeholders` are placeholder marks.
  logos: {
    intro: "The teams behind unforgettable events run on Weft",
    real: ["google"] as const,
    placeholders: ["Northwind", "Lumen", "Atlas", "Vela", "Corva"],
  },

  problem: {
    eyebrow: "The room that didn't work",
    headline: [{ text: "Everyone came to connect.", muted: "Almost no one did." }],
    beats: [
      {
        stat: "3",
        label:
          "the number of people most attendees actually talk to — and they already knew all three.",
      },
      {
        stat: "0:14",
        label:
          "how long a badge glance takes before the conversation is already deciding not to happen.",
      },
      {
        stat: "1",
        label:
          "the lasting memory they leave with: a room that felt like work. That memory has your name on it.",
      },
    ],
    kicker:
      "A forgettable event isn't neutral. It's the story your brand tells for the next twelve months.",
  },

  turn: {
    line: [
      { text: "So we built the thread that", muted: "pulls the right people together." },
    ],
  },

  how: {
    eyebrow: "How Weft works",
    headline: [{ text: "Three steps.", muted: "One unforgettable room." }],
    steps: [
      {
        n: "01",
        title: "They tell us who they are",
        body: "A two-minute prompt before the event — goals, expertise, what they're looking for, who they want to become. No forms that feel like homework.",
      },
      {
        n: "02",
        title: "The algorithm weaves the groups",
        body: "Weft reads intent, not just industry. It forms small groups where every person is the reason someone else showed up — complementary, not identical.",
      },
      {
        n: "03",
        title: "The room rearranges itself",
        body: "At the moment you choose, everyone learns their group. Strangers walk toward the exact people they came to meet.",
      },
    ],
  },

  reveal: {
    eyebrow: "The moment it clicks",
    headline: [{ text: "Four strangers.", muted: "One reason they're here." }],
    body: "This is the part attendees post about. The reveal turns a room of nametags into the best conversation of their quarter — and turns your event into the one they clear their calendar for next year.",
    // Placeholder stats — replace with real numbers before launch.
    stats: [
      { value: 92, suffix: "%", label: "of matched attendees rate their group a 9 or 10" },
      { value: 3.4, suffix: "x", label: "more qualified conversations vs. open networking" },
      { value: 4.8, suffix: "/5", label: "average event rating after adding Weft" },
    ],
    statsNote: "Placeholder metrics — replace in content.ts before launch.",
    // The five avatars in the fan-out: [attendee, ...four matches]
    group: [
      { initials: "YOU", role: "You" },
      { initials: "AM", role: "The investor you needed" },
      { initials: "RK", role: "Your next hire" },
      { initials: "TS", role: "The operator two steps ahead" },
      { initials: "JD", role: "The partner you didn't know to look for" },
    ],
  },

  testimonials: {
    eyebrow: "Stories",
    headline: [{ text: "The events people", muted: "remember." }],
    // Placeholder quotes and names — replace before launch.
    items: [
      {
        quote:
          "Our attendees stopped asking when they could leave and started asking when the next one is.",
        name: "Placeholder Name",
        title: "Head of Events, Placeholder Co.",
      },
      {
        quote:
          "Weft did in one evening what our community usually takes six months of Slack to do.",
        name: "Placeholder Name",
        title: "Community Lead, Placeholder Co.",
      },
      {
        quote:
          "The reveal moment got a genuine gasp. I have never seen a networking session do that.",
        name: "Placeholder Name",
        title: "Founder, Placeholder Co.",
      },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    headline: [{ text: "The things", muted: "people ask." }],
    items: [
      {
        q: "How much does an attendee have to do beforehand?",
        a: "About two minutes. A short intake captures goals, expertise, and who they want to meet. If they skip it, Weft still places them using whatever the organizer provides.",
      },
      {
        q: "What size event does Weft work for?",
        a: "From 30-person dinners to multi-thousand-person conferences. Group sizes and reveal timing are configurable per session.",
      },
      {
        q: "How does the matching actually decide?",
        a: "Weft models intent and complementarity, not just shared industry. It optimizes for groups where each person is high-value to the others, then balances for diversity of perspective.",
      },
      {
        q: "Do organizers get to see how it went?",
        a: "Yes. A live dashboard shows match quality, participation, and post-event ratings you can put in front of sponsors and leadership.",
      },
      {
        q: "Can we brand the experience?",
        a: "The attendee-facing app carries your event's identity. Weft runs the matchmaking; your brand gets the credit.",
      },
    ],
  },

  contact: {
    eyebrow: "Let's talk",
    headline: [{ text: "Make your event the one", muted: "they don't forget." }],
    body: "Tell us about your event. We'll show you the room it could be.",
    fields: {
      name: "Your name",
      email: "Work email",
      event: "What are you organizing?",
    },
    cta: "Book a demo",
    wordmark: "weft",
    footerLinks: ["The problem", "How it works", "Stories", "FAQ"],
    copyright: "© 2026 Weft. All rights reserved.",
  },
} as const;

export type Content = typeof content;
