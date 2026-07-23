export const content = {
  media: {
    heroRail: [
      {
        src: "/placeholders/weft/carousel1.JPG",
        width: 2340,
        height: 1560,
        alt: "Carousel image 1",
        placeholder: false,
      },
      {
        src: "/placeholders/weft/video3.mp4",
        width: 2340,
        height: 1560,
        alt: "Carousel clip of Weft experience",
        placeholder: false,
        type: "video"
      },
      {
        src: "/placeholders/weft/video1.mp4",
        width: 1080,
        height: 1350,
        alt: "Carousel clip of the Weft matching experience",
        placeholder: false,
        type: "video",
      },
      {
        src: "/placeholders/weft/carousel33.png",
        width: 2340,
        height: 1560,
        alt: "Carousel image 3",
        placeholder: false,
      },
      {
        src: "/placeholders/weft/video4.mp4",
        width: 2340,
        height: 1560,
        alt: "Carousel clip of the Weft matching experience",
        placeholder: false,
        type: "video"
      },
      {
        src: "/placeholders/weft/video2.mp4",
        width: 1080,
        height: 1350,
        alt: "Carousel clip of attendees connecting at an event",
        placeholder: false,
        type: "video",
      },
      {
        src: "/placeholders/weft/carousel5.png",
        width: 2340,
        height: 1560,
        alt: "Carousel image 5",
        placeholder: false,
      },
    ],
    portraits: [
      {
        src: "/placeholders/weft/attendee-01.png",
        width: 1000,
        height: 1500,
        alt: "Placeholder portrait of a smiling event attendee",
        placeholder: true,
      },
      {
        src: "/placeholders/weft/attendee-02.png",
        width: 447,
        height: 495,
        alt: "Placeholder portrait of a matched event attendee",
        placeholder: true,
      },
      {
        src: "/placeholders/weft/attendee-03.png",
        width: 700,
        height: 806,
        alt: "Placeholder portrait of another matched attendee",
        placeholder: true,
      },
    ],
    problem: {
      src: "/placeholders/weft/problem-room.png",
      width: 816,
      height: 1126,
      alt: "Placeholder event portrait representing an unproductive room",
      placeholder: true,
    },
    how: [
      {
        src: "/placeholders/weft/intake-preview.png",
        width: 2340,
        height: 1560,
        alt: "Placeholder preview of attendee intake",
        placeholder: true,
      },
      {
        src: "/placeholders/weft/matching-preview.png",
        width: 2340,
        height: 1560,
        alt: "Placeholder preview of group computation",
        placeholder: true,
      },
      {
        src: "/placeholders/weft/reveal-preview.png",
        width: 2340,
        height: 1560,
        alt: "Placeholder preview of attendee reveal",
        placeholder: true,
      },
    ],
    outcome: {
      src: "/placeholders/weft/outcome-feature.png",
      width: 3021,
      height: 2904,
      alt: "Placeholder portrait for the featured event outcome",
      placeholder: true,
    },
    testimonialAvatars: [
      {
        src: "/placeholders/weft/testimonial-01.png",
        width: 1630,
        height: 1775,
        alt: "Placeholder portrait for the first testimonial",
        placeholder: true,
      },
      {
        src: "/placeholders/weft/testimonial-02.png",
        width: 943,
        height: 979,
        alt: "Placeholder portrait for the second testimonial",
        placeholder: true,
      },
      {
        src: "/placeholders/weft/testimonial-03.png",
        width: 736,
        height: 1104,
        alt: "Placeholder portrait for the third testimonial",
        placeholder: true,
      },
    ],
    contact: {
      src: "/placeholders/weft/contact-art.png",
      width: 800,
      height: 800,
      alt: "Placeholder artwork for the Weft contact panel",
      placeholder: true,
    },
  },
  nav: {
    links: [
      { label: "The problem", href: "#problem" },
      { label: "How it works", href: "#how" },
      { label: "Stories", href: "#stories" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: "Try it!",
  },

  hero: {
    // Two-tone: `muted` renders in --ash and resolves last.
    headline: [
      { text: "Matched on what matters, not your badge.", muted: "", accent: "your badge" },
    ],
    sub: "Weft matches attendees on their goals and values, not small talk. Finding the right people becomes the best part of the event.",
    ctaPrimary: "Try it!",
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
          "the number of people most attendees actually talk to. They already knew all three.",
      },
      {
        stat: "0:14",
        label:
          "how long it takes to glance at a badge and decide the conversation isn't worth having.",
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
      { text: "So we built the thread that pulls", muted: "the people who actually belong." },
    ],
  },

  how: {
    eyebrow: "How Weft works",
    headline: [{ text: "Three steps.", muted: "One unforgettable room." }],
    steps: [
      {
        n: "01",
        title: "They tell us what actually matters to them",
        body: "A two-minute intake before the event, not a resume. We ask about their goals, expertise, values, and who they're hoping to meet, not just their job title.",
      },
      {
        n: "02",
        title: "The algorithm weaves the groups",
        body: "Weft weighs goals, expertise, and values together, not just job titles or small talk. It forms small groups where every person is exactly who someone else came to meet.",
      },
      {
        n: "03",
        title: "The room rearranges itself",
        body: "At the moment you choose, everyone learns their group live, and strangers walk straight toward the exact people they came to meet.",
      },
    ],
  },

  reveal: {
    eyebrow: "The moment it clicks",
    headline: [{ text: "Four strangers.", muted: "One reason they're here." }],
    body: "This is the part attendees post about. The reveal turns a room of nametags into the best conversation of their quarter, because for once they were matched on their goals, expertise, and values, not just their industry.",
    // Placeholder stats, replace with real numbers before launch.
    stats: [
      { value: 92, suffix: "%", label: "of matched attendees rate their group a 9 or 10" },
      { value: 3.4, suffix: "x", label: "more qualified conversations vs. open networking" },
      { value: 4.8, suffix: "/5", label: "average event rating after adding Weft" },
    ],
    statsNote: "Placeholder metrics. Replace in content.ts before launch.",
    // The five avatars in the fan-out: [attendee, ...four matches]
    group: [
      { initials: "YOU", role: "You" },
      { initials: "AM", role: "The investor you needed" },
      { initials: "RK", role: "Your next hire" },
      { initials: "TS", role: "The operator two steps ahead" },
      { initials: "JD", role: "The friend you didn't expect to make" },
    ],
  },

  testimonials: {
    eyebrow: "Stories",
    headline: [{ text: "The events people", muted: "remember." }],
    // Placeholder quotes and names, replace before launch.
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
        q: "How is this different from matching by shared interests?",
        a: "Two people who both like hiking might have nothing else in common. Weft looks past hobbies to what actually predicts a good conversation: goals, expertise, and values together. Then it builds small groups around that.",
      },
      {
        q: "How much does an attendee have to do beforehand?",
        a: "About two minutes. A short intake captures their goals, expertise, values, and who they're hoping to meet, not just their job title. If they skip it, Weft still places them using whatever the organizer provides.",
      },
      {
        q: "What size event does Weft work for?",
        a: "From 30-person dinners to multi-thousand-person conferences. Group sizes and reveal timing are configurable per session.",
      },
      {
        q: "How does the matching actually decide?",
        a: "Weft models goals, expertise, and values together, not just shared industry or interests. It optimizes for groups where each person is genuinely glad to be there, then balances for enough difference to keep the conversation interesting.",
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
    cta: "Book a call",
    wordmark: "weft",
    footerLinks: ["The problem", "How it works", "Stories", "FAQ"],
    copyright: "© 2026 Weft. All rights reserved.",
  },
} as const;

export type Content = typeof content;
