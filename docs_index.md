# Contextmoji Documentation

## Overview
Contextmoji is a tone-aware emoji insertion system for social posts. It helps you:
- generate high-quality emoji suggestions based on intent + content
- automatically insert emojis without damaging readability
- produce rewritten versions that unlock better emoji placement
- adapt output to platform norms (LinkedIn vs X vs Threads vs Bluesky)

---

## Key concepts

### Platform
The platform changes what “appropriate” means.
- **LinkedIn**: restrained, high-signal, professional
- **X**: punchy, concise, expressive
- **Threads/Bluesky**: conversational, moderate expressiveness

### Tone
Tone can be:
- `professional`
- `neutral`
- `casual`
- `playful`
- `auto` (recommended)

Tone influences emoji selection and placement rules.

### Emoji density (budget)
Density is controlled via `emoji_count` and `mode`:
- `light`: lower density, emphasis-only
- `balanced`: readable + expressive
- `rich`: higher density (still constrained)

---

## Inputs and outputs

### Input: draft text
A user provides:
- text content (the post)
- target platform
- optional tone override
- emoji count / insertion mode
- constraints (avoid faces, avoid flags, etc.)

### Output: three layers
Contextmoji returns:
1. **Suggestions**: emoji candidates + reasoning
2. **Inserted variants**: multiple formatted outputs
3. **Rewrites**: alternative drafts designed for better emoji fit

---

## Emoji selection logic

### 1) Intent detection
Contextmoji infers the post’s intent:
- product update
- launch / announcement
- educational / how-to
- opinion / thought leadership
- hiring / recruiting
- incident / postmortem
- congratulations / recognition

### 2) Topic detection
Topics influence emoji mapping:
- AI/ML → 🧠🧪🤖 (platform/tone gated)
- Security → 🛡️🔐🚨 (🚨 gated for serious incidents)
- Performance / metrics → 📈📉⚡️
- Process / tooling → 🛠️⚙️
- Learning / documentation → 📚📝

### 3) Constraint filtering
Then it filters candidates based on:
- platform rules
- tone rules
- user constraints:
  - `avoid_faces`
  - `avoid_flags`
  - `avoid_sensitive`
  - `avoid_negative`

---

## Proposed API

### POST /v1/compose
**Purpose:** Generate suggestions + inserted variants + rewrites.

**Request**
```json
{
  "text": "string",
  "platform": "linkedin | x | threads | bluesky",
  "tone": "auto | professional | neutral | casual | playful",
  "emoji_count": 0,
  "mode": "light | balanced | rich",
  "constraints": {
    "avoid_faces": true,
    "avoid_flags": true,
    "avoid_sensitive": true
  },
  "output": {
    "variants": 3,
    "rewrites": 3
  }
}
```

---

## FAQ

**Does this require an LLM?**
Not necessarily. You can implement deterministic intent/topic classifiers + emoji mapping tables. However, this app uses Gemini for semantic depth.

**Can it work offline?**
Yes, with local embeddings and rewrite templates.

---
Built for precision copywriters by Nik Kale.