# Character reference audit

Audited 11 November 2026 against the verified Phase 3 source at `a010bd372e77f4ba526546dc7ac6319b8e266d6a` and the retained private reference pack. This is a source-file and visible-feature comparison, not identification of real people or a biometric likeness assessment.

**The six named reference faces are present together on a supplied character board. Six separate original actor-face uploads were not found in the inspected locations. The six generated characters used by the application do not preserve those board faces.** The saved generation prompts explicitly requested original fictional faces without actor or celebrity resemblance. Their wardrobe roles, materials and equipment generally follow the world's established direction.

No faces were regenerated, no costumes were changed, and no supplied reference images were added to the public repository during this audit.

## Retained original files

The private reference root is `work/lexoryn-site-release/references/`, relative to the local workspace, outside this public repository. The original supplied Downloads folders are no longer present at their supplied paths. The retained copies below exist and were visually inspected.

| Retained relative filename | Native size | What it establishes |
| --- | --- | --- |
| `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_25_57 AM-1.png` | 1672 × 941 | A single labeled six-person board containing Aaryan Veer, General Kaor, Sorya Elin, Nyra Voss, Elara Quin and Empress Vaelora. Each has an enlarged face and a smaller costume/body study. This is the clearest available mapping between the six names and intended reference faces. |
| `Chatexia_ Project Genesis World-Building Atlas.png` | 1672 × 941 | Earlier ensemble/world board with the same six labels, mixed with other world-building material. It is a composite, not six original portrait files. |
| `LEXORYN_Cinematic_Reference_Pack/reference_boards/03_world_civilization_moodboard.png` | 1672 × 941 | Byte-identical duplicate of the preceding Chatexia board. It supplies no additional portrait resolution. |
| `Screenshot 2026-11-10 at 21.10.29.png` | 1068 × 1072 | Unlabeled bald armored commander study with a close goatee. It supports armor/material direction, but its filename and image do not establish a reliable named-character mapping. |
| `Screenshot 2026-11-10 at 21.12.27.png` | 1312 × 574 | Three unlabeled portrait/costume studies. They do not establish six independently supplied named faces. |

SHA-256 of the six-person board: `ffd466e1a93e98cc4b0d19a6a4a8012cef4ad1cbb01a9af4a2f21025f752d3c3`.

SHA-256 of both copies of the earlier ensemble board: `b1f74a74fe382e730f8ed45a2cd0d542bf78a1eb3c947f869f2a89266a9e3b01`.

The search covered the retained project reference pack, relevant character/actor/face/portrait/LEXORYN filename matches under Downloads, and image files immediately within the available Codex attachment directories. It found no six separate original portrait uploads. This does not assert that no such files exist elsewhere on the computer. The original paths `/Users/bhuvzzs/Downloads/references` and `/Users/bhuvzzs/Downloads/LEXORYN_Phase2_Props_Locations_and_Motion` were absent during the audit.

## Per-character comparison and active assets

All six rows use the labeled six-person board above as the available original reference. Native sizes below are the actual delivered WebP dimensions, not claimed 4K sizes. The generated WebPs were individually opened and compared with the supplied board.

| Character | Generated asset actually loaded | Native size | Visible reference-to-generated difference | Costume, jewelry and footwear continuity |
| --- | --- | --- | --- | --- |
| Aaryan Veer | `/assets/finale/character-aaryan.webp` | 941 × 1672 | The reference has thick tousled dark hair and a fuller beard. The generated face is narrower and more angular, with an asymmetric silver-streaked haircut, bridge scar and light stubble. The intended face is not preserved. | Graphite/bronze protective armor, technical cloak, scanner and magnetic boots remain coherent with the explorer role. |
| General Kaor | `/assets/finale/character-kaor.webp` | 1024 × 1536 | The reference is bald, smiling, with a close dark goatee. The generated character has short silver hair, a fuller gray beard and a more lined, restrained face. The intended face is not preserved. | Heavy articulated graphite armor, bronze command hardware, carried visor and reinforced tactical boots remain coherent. |
| Sorya Elin | `/assets/finale/character-sorya.webp` | 1024 × 1536 | The reference has pulled-back dark hair, a longer face and a broad smile. The generated character has short tight curls, a rounder/softer face and a restrained expression. The intended face is not preserved. | Ivory research coat over a charcoal suit, diagnostic cuffs/staff and sealed boots retain the scientist's practical costume direction. |
| Nyra Voss | `/assets/finale/character-nyra.webp` | 1024 × 1536 | The reference has long loose brown hair and a different facial structure. The generated character has copper-brown braids, a close undercut, angular features and a small scar. The intended face is not preserved. | Dark modular engineering suit, bronze utility hardware, tools and work boots remain consistent with the engineer role. |
| Elara Quin | `/assets/finale/character-elara.webp` | 1024 × 1536 | The reference has blonde shoulder-length hair and a lighter face. The generated character has auburn braided hair, freckles and a narrower face. The intended face is not preserved. | Slate/bronze archival fieldwear, memory pendant, earpiece, reader and field boots remain coherent with the role. |
| Empress Vaelora | `/assets/finale/character-vaelora.webp` | 1024 × 1536 | The reference has long loose brown hair, a smiling face and an ornate jeweled crown. The generated character has a darker, mature face, a low braided hairstyle and an architectural bronze crown. The intended face is not preserved. | Ceremonial dark cloth, bronze crown/signets/jewelry and practical low boots preserve a restrained royal identity, rather than reproducing the supplied gown exactly. |

The saved prompts in the local `work/finale-character-inputs.json`, also recorded in [CHARACTER_CONTINUITY.md](CHARACTER_CONTINUITY.md), explicitly asked for original people. For example, Aaryan's prompt says, “Do not resemble any celebrity or actor.” Other prompts likewise exclude real-actor resemblance. The current registry descriptions match those newly generated identities. There is no evidence that the supplied face board was used as an identity-preserving generation input.

## Runtime consumption

[data/characters.ts](../data/characters.ts) is the active character registry. [components/story/FinaleWorld.tsx](../components/story/FinaleWorld.tsx) loads `character.asset` directly in `CastPlane`:

- Scenes 36–41 display the six full-body WebPs in registry order: Aaryan, Kaor, Sorya, Nyra, Elara and Vaelora.
- Scene 43 reuses Aaryan, Sorya and Elara's full-body assets in a group composition.
- Scene 42 selects from the five-figure generated supporting-cast atlas. Its ORIGIN option suppresses the human plane and uses machinery.
- Hero planes preserve the source image aspect ratio and use their full image. The `portraitCrop` property is applied only to supporting atlas cells in this renderer.
- The registry's `scenes` arrays describe narrative participation; they are not proof of a separately rendered character cutout in every listed scene.

Three previously prepared close-up assets exist and were visually inspected. The corrections integrate these existing files into optional field notes without replacing the body reveals:

| Prepared asset | Native size | Integration after corrections |
| --- | --- | --- |
| `/assets/finale/portrait-aaryan.webp` | 1086 × 1448 | Active in optional Aaryan field notes through `portraitAsset`. |
| `/assets/finale/portrait-kaor.webp` | 1086 × 1448 | Active in optional character field notes through `portraitAsset`. |
| `/assets/finale/portrait-sorya.webp` | 1024 × 1536 | Active in optional character field notes through `portraitAsset`. |

These close-ups visibly retain the corresponding **generated** identities and wardrobe, not the supplied board likenesses. Their saved input record is `work/finale-character-portraits.json` in the local workspace. They must not be reported as all six active portrait replacements.

## Permissions and remaining limits

The owner previously stated that redistribution rights for supplied references were uncertain and instructed that those images stay out of public GitHub. [PUBLIC_ARTWORK.md](PUBLIC_ARTWORK.md) records that separation. The audit does not infer a license or permission to publish real-person likenesses from the presence of a reference file.

The available board is only 1672 × 941 for all six characters and their costume studies combined. It is not six high-resolution face originals. Consequently, exact intended facial details cannot be established at portrait-source resolution, and the generated characters cannot truthfully be described as verified actor-likeness matches.

No actor identities were inferred. No supplied images were copied, embedded or committed by this audit. Existing generated faces, costumes, jewelry, equipment and footwear remain unchanged. Restoring a specific intended real-person likeness would be a separate scope decision requiring the actual authorized source portraits and explicit permission for the intended use; it was not performed as part of the cinematic corrections.
