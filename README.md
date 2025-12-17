
# Contextmoji Studio 🧠✨
**Tone-aware emoji insertion for social posts — professional when needed, playful when allowed.**

Contextmoji Studio takes your draft text and generates:
1) **Emoji suggestions** that match your content and platform tone  
2) An **auto-inserted output** with emojis placed where they make sense  
3) **Multiple rewritten variations** designed to unlock better emoji opportunities  
4) A **tone + platform policy** so LinkedIn ≠ X ≠ Threads ≠ Bluesky

> Goal: Improve clarity + engagement without making professional posts look goofy.

---

## Why Contextmoji Studio?
Emoji tools usually do “keyword → emoji.” That’s not enough.
Contextmoji Studio is designed for **context**, **tone**, and **audience expectations**:
- A thoughtful LinkedIn post should not get 😜😂😍
- An X post may benefit from punchy 🔥⚡️📌
- A product launch might want 🚀📣✅
- A security post might prefer 🛡️🔐📉

Contextmoji Studio makes emoji placement feel **intentional**, not random.

---

## Features
### Core
- ✅ **Emoji suggestions** based on semantics (not just keywords)
- ✅ **Selectable emoji density** (e.g., 0–12 emojis)
- ✅ **Insertion modes**
  - `light`: minimal, high-signal emojis
  - `balanced`: readable + expressive
  - `rich`: more emojis (useful for X/Threads)
- ✅ **Placement control**
  - Inline emphasis
  - Line prefixes (bullets / callouts)
  - End-of-sentence accents
- ✅ **Rewrite variations** (to improve emoji fit + structure)
- ✅ **Platform-aware tone policy**
  - LinkedIn: professional, minimal faces
  - X: punchy, expressive
  - Threads/Bluesky: conversational, moderate

### Optional (roadmap)
- 🧪 Hashtag suggestions
- 🧪 Hook/CTA generator
- 🧪 “Brand voice” profiles
- 🧪 Multi-lingual support

---

## How it works (conceptually)
1. **Classify** the text: topic + intent + tone (professional, neutral, casual)
2. **Infer platform norms**: LinkedIn vs X vs Threads vs Bluesky
3. **Select emoji candidates** using:
   - intent/topic mapping (launch, tutorial, opinion, security, hiring, etc.)
   - sentiment + tone constraints
4. **Place emojis** according to:
   - readability rules
   - density budget
   - structure (bullets/sections)
5. **Generate rewrites** that create clean places for emojis:
   - tighter sentences
   - clearer bullets
   - sharper headline/first line

---

## Quickstart
> This README is implementation-agnostic. You can build Contextmoji Studio as:
- a web app (Next.js / React)
- a CLI tool
- a browser extension
- an API service

### Example input
```text
Shipping an update to our AI support assistant this week.
We improved troubleshooting accuracy and reduced resolution time.

Example output (LinkedIn / light / 3 emojis)

Shipping an update to our AI support assistant this week. ✅
We improved troubleshooting accuracy and reduced resolution time. 📉
More details in the comments. 📌

Example output (X / balanced / 6 emojis)

Shipping an update to our AI support assistant this week 🚀
Better troubleshooting accuracy ✅ + faster resolution time 📉⚡️
More details below 👇📌
```

---

## License
MIT

---

## Acknowledgments
Inspired by the need for human-appropriate, platform-aware expression — not just keyword matching. Built for precision copywriters by Nik Kale.