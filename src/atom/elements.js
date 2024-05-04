import { computed, ref } from "vue";
import { ELEMENT_FORMAT_LIST, format, formatInteger, formatMult, formatPercent } from "../core/format";
import { player } from "../core/save";
import { dilate } from "../core/utils";
import Decimal from "break_eternity.js";
import { CHALLENGES } from "../main/challenges";

// Element metadata
export const ELEMENT_LIST = ELEMENT_FORMAT_LIST.flat();
export const ELEMENT_FULL_LIST = [
  "Hydrogen",
  "Helium",
  "Lithium",
  "Beryllium",
  "Boron",
  "Carbon",
  "Nitrogen",
  "Oxygen",
  "Fluorine",
  "Neon",
  "Sodium",
  "Magnesium",
  "Aluminium",
  "Silicon",
  "Phosphorus",
  "Sulfur",
  "Chlorine",
  "Argon",
  "Potassium",
  "Calcium",
  "Scandium",
  "Titanium",
  "Vanadium",
  "Chromium",
  "Manganese",
  "Iron",
  "Cobalt",
  "Nickel",
  "Copper",
  "Zinc",
  "Gallium",
  "Germanium",
  "Arsenic",
  "Selenium",
  "Bromine",
  "Krypton",
  "Rubidium",
  "Strontium",
  "Yttrium",
  "Zirconium",
  "Niobium",
  "Molybdenum",
  "Technetium",
  "Ruthenium",
  "Rhodium",
  "Palladium",
  "Silver",
  "Cadmium",
  "Indium",
  "Tin",
  "Antimony",
  "Tellurium",
  "Iodine",
  "Xenon",
  "Caesium",
  "Barium",
  "Lanthanum",
  "Cerium",
  "Praseodymium",
  "Neodymium",
  "Promethium",
  "Samarium",
  "Europium",
  "Gadolinium",
  "Terbium",
  "Dysprosium",
  "Holmium",
  "Erbium",
  "Thulium",
  "Ytterbium",
  "Lutetium",
  "Hafnium",
  "Tantalum",
  "Tungsten",
  "Rhenium",
  "Osmium",
  "Iridium",
  "Platinum",
  "Gold",
  "Mercury",
  "Thallium",
  "Lead",
  "Bismuth",
  "Polonium",
  "Astatine",
  "Radon",
  "Francium",
  "Radium",
  "Actinium",
  "Thorium",
  "Protactinium",
  "Uranium",
  "Neptunium",
  "Plutonium",
  "Americium",
  "Curium",
  "Berkelium",
  "Californium",
  "Einsteinium",
  "Fermium",
  "Mendelevium",
  "Nobelium",
  "Lawrencium",
  "Rutherfordium",
  "Dubnium",
  "Seaborgium",
  "Bohrium",
  "Hassium",
  "Meitnerium",
  "Darmstadium",
  "Roeritgenium",
  "Copernicium",
  "Nihonium",
  "Flerovium",
  "Moscovium",
  "Livermorium",
  "Tennessine",
  "Oganesson",
];
export const ELEMENT_MAP = `x_________________xvxx___________xxxxxxvxx___________xxxxxxvxx_xxxxxxxxxxxxxxxxvxx_xxxxxxxxxxxxxxxxvxx0xxxxxxxxxxxxxxxxvxx1xxxxxxxxxxxxxxxxv_v__0xxxxxxxxxxxxxx__v__1xxxxxxxxxxxxxx__`;
export const ELEMENT_ASTERISK = ["*", "**"];
export const elemSelected = ref(-1);

export const ELEMENT_UPGRADES = [
  {
    desc: "Improve Quark gain",
    cost: 5e7,
  },
  {
    desc: computed(() => `Reduce C${formatInteger(6)}'s scaling and strengthen its reward when not in C${formatInteger(2)} or C${formatInteger(7)}`),
    cost: 5e13
  },
  {
    desc: "Atomic Power gain is boosted by Electron Powers",
    cost: 1e21,
    // INFLATION
    eff: computed(() => dilate(player.atom.powers[2].add(1), 1 / 4).pow(10)),
    effDesc: x => formatMult(x)
  },
  {
    desc: "Stronger's power is boosted by Proton Powers",
    cost: 1e24,
    eff: computed(() => dilate(player.atom.powers[0].add(1).log10(), 1 / 3).div(200).add(1)),
    effDesc: x => formatMult(x)
  },
  {
    desc: computed(() => `C${formatInteger(5)}-${formatInteger(7)} caps are increased by ${formatInteger(50)}`),
    cost: 1e28
  },
  {
    desc: computed(() => `Gain ${formatPercent(0.01, 0)} (additively) more Quarks per challenge completion`),
    cost: 2.5e30,
    eff: computed(() => {
      let comps = Decimal.dZero;
      for (const chal of CHALLENGES) comps = comps.add(chal.cost.amt.value)
      if (hasElement(6)) comps = comps.mul(elementEffect(6))
      return comps.div(100).add(1)
    }),
    effDesc: x => formatMult(x)
  },
  {
    desc: "Multiply effective completions in Carbon's effect based on the number of elements bought",
    cost: 1e33,
    eff: computed(() => {
      let eff = player.atom.elements.length + 1
      if (hasElement(10)) eff **= 2
      return eff
    }),
    effDesc: x => formatMult(x)
  },
  {
    desc: computed(() => `Add a new effect to C${formatInteger(1)}`),
    cost: 5e34
  },
  {
    desc: computed(() => `Tetr scales ${formatPercent(0.15, 0)} slower`),
    cost: 2.5e38
  },
  {
    desc: computed(() => `C${formatInteger(3)} and C${formatInteger(4)}'s rewards are stronger`),
    cost: 2.5e40
  },
  {
    desc: "Nitrogen's multiplier is squared",
    cost: 2.5e44
  },
  {
    desc: "Particle Power gain is stronger",
    cost: 5e46
  },
  {
    desc: computed(() => `Increase C${formatInteger(5)} and C${formatInteger(6)} cap for every C${formatInteger(7)} completion past ${formatInteger(100)}, and its cap is increased by ${formatInteger(25)}`),
    cost: 2.5e48,
    eff: computed(() => player.challenge.comps[6].sub(100).max(0)),
    effDesc: x => `+${formatInteger(x)}`
  },
  {
    desc: computed(() => `Automatically gain a percentage of Quarks gained from reset passively`),
    cost: 2.5e50,
    eff: computed(() => {
      let eff = 0.5
      if (hasElement(15)) eff += elementEffect(15)
      return eff
    }),
    effDesc: x => formatPercent(x, 0)
  },
  {
    desc: computed(() => `BH Condenser and Cosmic Ray scale ${formatPercent(0.05, 0)} slower`),
    cost: 1e51
  },
  {
    desc: computed(() => `Increase Silicon's effect by ${formatPercent(0.04, 0)} for every element bought`),
    cost: 1e56,
    eff: computed(() => 0.04 * player.atom.elements.length),
    effDesc: x => `+${formatPercent(x, 0)}`
  },
  {
    desc: computed(() => `Raise Atom gain by ${format(1.1, 2)}`),
    cost: 1e57
  },
  {
    desc: "Auto-buy Cosmic Ray, and it raises the Tickspeed effect",
    cost: 5e64,
    eff: computed(() => dilate(player.buildings.cosmic, 1 / 3).div(500).add(1)),
    effDesc: x => `^${format(x)}`
  },
  {
    desc: "The second Neutron effect is stronger",
    cost: 1e66
  },
  {
    desc: computed(() => `Increase C${formatInteger(7)}'s cap by ${formatInteger(50)}`),
    cost: 2.5e70
  },
  {
    desc: "Unlock Mass Dilation, a new subtab found in the Atom tab",
    cost: 1e72
  }
];

ELEMENT_UPGRADES.push(...Array(118 - ELEMENT_UPGRADES.length).fill({
  desc: "TBD",
  cost: Infinity
}))

export const elementsUnlocked = computed(() => {
  let unl = 0
  if (player.challenge.comps[6].gte(16)) unl += 4
  if (player.challenge.comps[7].gte(1)) unl += 14
  if (hasElement(17)) unl += 3
  return unl
})

export function hasElement(idx) {
  return player.atom.elements.includes(idx);
}

export function elementEffect(idx) {
  return ELEMENT_UPGRADES[idx].eff.value
}

export function canBuyElement(idx) {
  return !hasElement(idx) && player.atom.quark.gte(ELEMENT_UPGRADES[idx].cost);
}

export function buyElement(idx) {
  if (!canBuyElement(idx)) return;

  const cost = ELEMENT_UPGRADES[idx].cost;
  player.atom.quark = player.atom.quark.sub(cost);
  player.atom.elements.push(idx);
}
