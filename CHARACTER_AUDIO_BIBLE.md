# Mumbai: Afterlight — Character & Audio Bible v1

## Visual language

The game uses a rain-worn 2D cinematic style: clear silhouettes, readable faces, strong directional light, and restrained color. Every character must remain recognizable in shadow, monsoon rain, and small-screen dialogue shots.

| Character | Visual silhouette | Palette and costume | Expression language |
|---|---|---|---|
| Harsh | Lean shoulders, cross-body bag, hood pushed back | Charcoal rain jacket, muted rust strap, worn trainers | Neutral restraint; anger tightens the jaw; care softens the eyes |
| Kavya | Compact outline, scarf and small backpack | Deep teal scarf, faded yellow bag tab, practical dark clothes | Worry is active, not helpless; warmth appears in the mouth before the eyes |
| Kabir | Broad jacket, diagonal strap, grounded stance | Slate jacket, worn amber reflective stripe | Dry skepticism; anger is stillness rather than shouting |
| Zoya | Long pale clinic coat and stethoscope shape | Weathered ivory, hospital green, dark hair | Controlled focus; compassion is visible only when the room is safe |
| Raghav | High-visibility vest and radio block | Dirty ochre, station-control navy, rain-dulled metal | A man trying to sound useful while hiding fear |

## Expression rules

Use five reusable states: neutral, worried, soft, angry, panicked. The scenes should never exaggerate them into comedy. Important emotional beats combine an expression change, a close shot, and a brief pause in the sound bed.

## Voice direction

| Character | Delivery | Accent and pace | Casting note |
|---|---|---|---|
| Harsh | Quiet, contained, then suddenly direct under pressure | Natural Mumbai English/Hindi mix when final script requires it; measured pace | Avoid heroic trailer delivery |
| Kavya | Alert, smart, emotionally honest | Slightly quicker than Harsh; clear rather than childlike | Her anger must land as a boundary, not a tantrum |
| Kabir | Low, dry, sparing with words | Slowest pace, occasional humour under stress | Truth scenes should carry disappointment, not cruelty |
| Zoya | Precise and practical, warmth under restraint | Calm pace with medical authority | Never sound like a generic exposition character |
| Raghav | Frayed, apologetic, trying to regain competence | Interrupted breath and short phrases | Guilt should emerge before his backstory does |

## Voice implementation

The current **Voice preview** option uses the browser's local speech engine, with per-character rate and pitch profiles. It is a zero-cost accessibility and pacing preview only; installed system voices vary by browser and operating system.

Final voices should use one of these ₹0 paths:

1. Original performer recordings with written consent and a simple home-recording guide.
2. Open-source local TTS only after voice tests establish that it can keep a consistent Indian-English delivery.
3. A hybrid: performer-recorded main characters and silent/processed system voices.

Do not lock final casting or generate a full voice track before the Episode 1 script is stable.

## Sound palette

| Location | Constant bed | Detail cues | Silence rule |
|---|---|---|---|
| Platform 3 | Hard rain, far electrical hum, metal vibration | Door alarms, distant crowd, water on tile | Drop the crowd before the first moral choice |
| Footbridge | Wind through railing, rain on sheet metal | Strained bolts, footsteps, beacon buzz | Let one line play dry after a major loss |
| Ticket Hall | Roof drips, distant phone ring, flooding | Locker scrape, paper map flutter, shutter rattle | Hold the phone ring alone after discovery |
| Underpass | Low generator drone, water echo | Taxi tick, fluorescent flicker | Reduce bass before Kabir asks for the truth |
| Dispensary | Generator, muffled patients, rain behind curtain | Glass bottles, cabinet latch, monitor-like pulse | Mute the generator briefly when resources are chosen |
| Repeater and Service Gate | Wind, rain, radio static, distant city | Morse-like bleep, gate chain, emergency lamp | Cut static before a stranger's first answer |

## Current implementation

Ambient sound is generated locally in browser Web Audio: filtered rain/noise with quieter settings for enclosed scenes. It needs no downloaded audio file, account, service, or subscription. Short choice and dialogue cues are also synthesized locally.

## Next art tasks

1. Produce approved, original turnaround/reference art for the five main characters.
2. Redraw the CSS character heads and outfits against those approved designs.
3. Record a 60-second audition scene per character before committing to full dialogue.
4. Build a reusable local sound library for rain, rooms, UI, and narrative silence.
