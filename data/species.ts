/** Speculative design canon; population shares are creative targets, not real observations. */
export type SpeciesId='vaelori'|'myr'|'human'|'robot'|'planetary-intelligence';
export const civilizationCanon={
 government:'Vaelori-led Lexorian Concord',
 population:{vaelori:60,myrAndOtherNatives:23,human:17},
 authority:{central:'Vaelori institutions control government, defense, infrastructure and ceremonies.',ecological:'Myr assemblies govern indigenous territories, ecological evidence and protected environmental systems.',human:'Human minority delegates advocate transport workers, engineers and equitable survival access.'},
 history:[
  {era:'Before central rule',event:'Native Myr evolve on Lexoryn and establish ecological institutions, chemical language and living infrastructure.'},
  {era:'Vaelori ascendancy',event:'Vaelori establish technologically advanced political control through their engineering, Myr environmental knowledge and planetary intelligence.'},
  {era:'Late human arrival',event:'Human arrivals enter an already inhabited civilization, adapting over generations as a small minority.'},
  {era:'3186',event:'A Codex Vein crisis exposes competing claims to protection, sovereignty and environmental survival.'},
 ],
 endings:{shelter:'THE SHIELDED CONCORD: centralized Vaelori control remains dominant.',regional:'THE REGIONAL ACCORD: power and infrastructure are redistributed.',covenant:'THE LIVING COVENANT: Vaelori, Myr, humans and planetary intelligence negotiate inclusion.'},
} as const;
export const speciesDesign={
 vaelori:{name:'Vaelori',anatomy:'Backward-elongated bifurcated cranial vault, low nasal breathing slits, wide-set double-aperture eyes beneath continuous mineral brow shelves, recessed lateral acoustic membranes and fine mandibular sensory vanes. Six long fingers in two opposed triads; articulated split-heel, three-contact feet.',skin:'Muted graphite, bronze, pearl or obsidian dermis with embedded mineral scutes; sparse naturally luminous cyan capillary markings.',movement:'Deliberate counterbalanced head turns, long forearm gestures and stable three-contact walking.',biology:'Mineral-binding skin limits abrasion; recessed sensory structures protect against windborne grit. Bioluminescence communicates emphasis, not magical power.'},
 myr:{name:'Myr',anatomy:'Broad lens-shaped cranial mantle with three recessed sensory wells, no human nose or lips, flexible throat exchange folds and paired translucent chemosensory fans. Four-digit branching hands, low center of mass and broad compliant feet.',skin:'Translucent layered mineral-organic tissues, amber internal vascular webs and restrained green-cyan information patterns.',movement:'Low balanced posture, independently orienting sensory fans and slow patterned skin signals.',biology:'Chemical signals and patterned light supplement speech; vascular exchange folds sense moisture and trace nutrients. Fans need humid protected intervals; ecological perception is skilled interpretation, not omniscience.'},
 human:{name:'Human',anatomy:'Physiologically human; established original faces remain unchanged.',skin:'Natural human variation; no alien makeup substitution.',movement:'Human gait and practical tool gestures.',biology:'Require human-safe food and breathing protection in incompatible local atmospheres.'},
 robot:{name:'Constructed robot',anatomy:'Industrial articulations, useful tool hands and replaceable magnetic feet.',skin:'Titanium, bronze and sealed service bellows.',movement:'Mechanical actuator motion, restrained optic and brow expressions.',biology:'No biological metabolism; service fluids are never food.'},
 'planetary-intelligence':{name:'ORIGIN',anatomy:'No human face and no humanoid body. Distributed mineral networks, responsive architecture and actual Codex machinery.',skin:'Not applicable.',movement:'Mechanical transformation and spatial signals.',biology:'Non-biological; neither omniscient nor automatically aligned with any species.'},
} as const;
export const speciesDiets=[
 {id:'aether-grain',name:'AETHER GRAIN',vaelori:'Enzymatically softened mineral-grain mash.',myr:'Fermented soluble filtrate; remove dry husks.',human:'Cultivated human-safe strain, cooked and screened for mineral load.'},
 {id:'cryo-bloom',name:'CRYO BLOOM',vaelori:'Cultured edible cold-flower tissue.',myr:'Live nutrient gel supports exchange tissues.',human:'Only detoxified cultivated portions; raw native tissue is incompatible.'},
 {id:'sky-kelp',name:'SKY KELP',vaelori:'Salt-rinsed ribbon tissue.',myr:'Hydrated live symbiotic ribbons.',human:'Blanched human-safe cultivar; native symbionts removed.'},
 {id:'solar-fruit',name:'SOLAR FRUIT',vaelori:'Mineral-rich flesh with resin removed.',myr:'Diluted pulp filtrate with native microbial culture.',human:'Low-metal cultivated flesh only; rind is not edible.'},
 {id:'mistwater-broth',name:'MISTWATER BROTH',vaelori:'Buffered mineral broth served warm.',myr:'Ambient-temperature chemical nutrient suspension.',human:'Separate low-mineral recipe and sanitized utensils.'},
 {id:'lumifungus',name:'LUMIFUNGUS',vaelori:'Cooked cultivated fungal caps.',myr:'Managed living mycelial nutrient exchange.',human:'Verified non-luminous cultivated strain, cooked; native spores excluded.'},
] as const;
