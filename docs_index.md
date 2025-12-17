
# Contextmoji Studio Documentation

## Overview
Contextmoji Studio is a high-fidelity emoji insertion and visual generation system for social media professionals. It optimizes for specific platform norms while maintaining brand consistency through AI-driven context analysis.

---

## Core Systems

### 1. The Multi-Visual Engine
Unlike standard generators, Contextmoji Studio creates a **Gallery of Variations**. 
- **Style**: Select from Professional, Abstract, Realistic, or Infographic.
- **Aspect Ratios**: Native support for 1:1, 16:9 (X/LinkedIn), and 9:16 (Threads).
- **Brand Consistency**: Signed-in users can toggle **Brand Mode** to force the AI to adhere to a specific Hex color code across all generations.

### 2. The Hybrid Billing System
Contextmoji Studio utilizes a flexible credit system to ensure everyone can access high-quality AI:
- **Free Tier**: 10 monthly credits for text + visual generation.
- **Pro Tier**: Unlimited platform-hosted generations + 4K resolution + Brand Mode features.
- **BYOK (Bring Your Own Key)**: Link your personal Google Gemini API Key. This unlocks all Pro features for free as you are paying Google directly for the underlying compute.

---

## Technical Details

### Credits Consumption
- **Emoji Analysis**: 0.2 Credits
- **Image Variation Set (3-5 images)**: 1 Credit
- **BYOK Mode**: 0 Credits (Unlimited)

### Custom Hex Matching
When Brand Mode is active, the system injects strict color directives into the Gemini-3-Pro-Image-Preview model to ensure visual outputs align with your corporate style guide.

---
Built for precision copywriters by Nik Kale. 2026.