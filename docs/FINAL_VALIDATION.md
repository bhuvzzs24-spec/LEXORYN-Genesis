# LEXORYN final Phase3 validation

Validation date: 11 November2026. Base commit: e667addcb3684fbe3a2942a832f46cac157f116a. Delivery target: existing GitHub main, preserving earlier history. Hosted publication is explicitly excluded.

## Delivered state

56 scenes across eight chapters use the original pinned stage and 3D planet. The new cast contains six main characters, five supporting figures (including the industrial robot) and ORIGIN represented by real-time machinery. Six full-body alpha sources and one five-person atlas are in use. Three already-generated close-up portraits are preserved as prepared assets; they are not connected to runtime notes. No artwork was regenerated during validation.

## Final code checks

- `npm run typecheck`: PASS.
- `npm run lint`: PASS, zero warnings.
- `npm test`: PASS,21/21 tests. Tests cover56 scene timing/navigation, desktop/mobile C1 camera joins and deterministic reversal, seven-resource transitions, all24 ordered distinct three-choice sequences, three reachable default endings, hostile saved-state replay, organizer-card substitution, character identity metadata, alpha/dimensions and real asset files.
- `npm run build`: PASS, Next16.4.6 webpack static export.
- All34 existing finale WebPs decoded; declared native dimensions/alpha match the manifests. Native environment plates remain1672×941; comic triptych2172×724; body images941×1672 or1024×1536; support atlas1983×793. No4K claim.

## Critical bugs fixed during validation

1. ScrollTrigger resize refresh changed the current scene when viewport dimensions changed. The scroll controller now restores rendered story progress after a resize and cancels an obsolete navigation tween. Regression: scene15 held progress0.22868 across1280×800→1280×900; mobile breakpoint changes also preserve the selected story position.
2. Tailwind's global image max-width constrained the300%-wide comic strip to one cell. Panels2–3 appeared black despite a loaded source. The comic image now has `max-width:none`; browser measurements confirm each strip image is exactly3× its cell, and all four panels are visibly correct at desktop and390×844 mobile. Native aspect ratios are retained.

## Browser evidence

- All56 scenes reached and captured. Scenes01–14 retain the completed pre-interruption checks/captures;15–56 were completed in this continuation. Scene backgrounds, six main character identities, optional field notes, captions and four-panel compositions were inspected. Inactive captions do not accumulate; each stage has one cinematic-caption element, with the intended signal/comic/ending overlays replacing it where appropriate.
- Desktop1280×800 and mobile390×844 navigation tested, including jumping directly to56, council choices, outcomes, field notes and comic; no horizontal overflow observed.
- Planet drag verified in final scene56: quaternion-derived orientation changed from0.100,0.176,0.000 to0.433,0.834,-0.333.
- Codex independent motion verified with camera and story progress held fixed: phase0.8292→1.2883 at progress0.78548; camera stayed−0.4059,−2.0132,8.5909. Pause/reduced motion held phase0.8234 and retained scene46.
- Festival scroll test changed activated lights96→160 and launched drones669→1140, with independent traffic coordinates and camera movement. Sound enable/mute controls worked.
- Local decision persistence survived reload. Crisis choices and outcomes remained available after reverse navigation.
- The configured3:48 showcase completed its route to scene56 and stopped automatically. Replay/manual-stop controls worked. Saved decisions remained regional,evacuate,covenant before and after the run. Supporting notes for Kito, Bolt-7, Thess, Lysara, Tork and ORIGIN all opened correctly; feast Sky Kelp selected, pinned and lifted in scene31. Final browser console check contained no warnings or errors.

### Crisis outcomes actually exercised in the browser

| Three commitments | Ending | Safety / Energy / Water / Food / Resilience / Ecosystem / Trust |
| --- | --- | --- |
| Central, regional, evacuation | The Shielded Concord |100 /24 /42 /46 /60 /32 /63 |
| Central, regional, covenant | A Constellation of Refuges |70 /37 /71 /73 /75 /57 /75 |
| Central, evacuation, covenant | The Shielded Concord |88 /42 /62 /64 /45 /49 /74 |
| Regional, evacuation, covenant | The Living Covenant |77 /44 /50 /56 /80 /79 /87 |

Every case displayed four loaded comic panels and the corresponding central/regional/covenant aftermath. Unit tests also exercise the configured failure outcome using a replacement organizer card. No ending is random.

Local evidence is in `outputs/final-56-scenes/`: scene captures, mobile comic/notes, strategy results, motion checks and contact sheets. Those QA captures and source masters are outside the public runtime/repository.

## Practical limits

The experience is a cinematic layered-image/3D hybrid. Human and Myr bodies in photographic assets are still; no rigging, facial animation, lip sync or generated moving footage is claimed. Geometry supplies the actual planet, vehicles, machinery, gantries, drones and atmospheric effects. Native4K sources, film-production character rigs and a measured60fps guarantee are not part of this delivery. G.P.T. is an authored fictional interface, not a live external language-model service. Three separate portrait close-ups remain prepared/unwired; three others were not completed before the validation-only instruction.

A fresh clone of the actual configured main remote was used for final checks because macOS intermittently timed out when reading older local Git/cache files. Saved source and assets were copied byte-for-byte; old files/metadata are preserved. No remote history rewrite, credential file, supplied reference image or restricted derivative is included.
