import { computed, ref } from "vue";
import {
  ELEMENT_FORMAT_LIST,
  format,
  formatInteger,
  formatMult,
  formatPercent,
  formatReduction,
} from "../core/format";
import { player } from "../core/save";
import { dilate } from "../core/utils";
import Decimal from "break_eternity.js";
import { CHALLENGES } from "../main/challenges";
import { MASS_DILATION } from "./md";
import { atomicPowerEffect } from "./atom";
import { STARS } from "./stars";

// Element metadata
export const ELEMENT_METADATA = {
  names: ELEMENT_FORMAT_LIST.flat(),
  fullNames: [
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
  ],
  map: `x_________________xvxx___________xxxxxxvxx___________xxxxxxvxx_xxxxxxxxxxxxxxxxvxx_xxxxxxxxxxxxxxxxvxx0xxxxxxxxxxxxxxxxvxx1xxxxxxxxxxxxxxxxv_v__0xxxxxxxxxxxxxx__v__1xxxxxxxxxxxxxx__`,
  asterisk: ["*", "**"],
};

export const elemSelected = ref(-1);

export const ELEMENT_UPGRADES = [
  {
    desc: "Improve Quark gain",
    cost: 5e7,
  },
  {
    desc: computed(
      () =>
        `Reduce C${formatInteger(6)}'s linear scaling and strengthen its effect when not in C${formatInteger(2)} or C${formatInteger(7)}`,
    ),
    cost: 5e13,
  },
  {
    desc: "Atomic Power gain is boosted by Electron Powers",
    cost: 1e21,
    // INFLATION
    eff: computed(() => dilate(player.atom.powers[2].add(1), 1 / 4).pow(10)),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: "Stronger's power is boosted by Proton Powers",
    cost: 1e24,
    eff: computed(() =>
      dilate(player.atom.powers[0].add(1).log10(), 1 / 3)
        .div(200)
        .add(1),
    ),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: computed(
      () =>
        `C${formatInteger(5)}-${formatInteger(7)} caps are increased by ${formatInteger(50)}`,
    ),
    cost: 1e28,
  },
  {
    desc: computed(
      () =>
        `Gain ${formatPercent(0.01, 0)} (additively) more Quarks per challenge completion`,
    ),
    cost: 2.5e30,
    eff: computed(() => {
      let comps = Decimal.dZero;
      for (const chal of CHALLENGES) comps = comps.add(chal.cost.amt.value);
      if (hasElement(6)) comps = comps.mul(elementEffect(6));
      return comps.div(100).add(1);
    }),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: "Multiply effective completions in Carbon's effect based on the number of elements bought",
    cost: 1e33,
    eff: computed(() => {
      let eff = player.atom.elements.length + 1;
      if (hasElement(10)) eff **= 2;
      return eff;
    }),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: computed(() => `Add a new effect to C${formatInteger(1)}`),
    cost: 5e34,
  },
  {
    desc: computed(() => `Tetr scales ${formatPercent(0.15, 0)} slower`),
    cost: 2.5e38,
  },
  {
    desc: computed(
      () =>
        `C${formatInteger(3)} and C${formatInteger(4)}'s effects are stronger`,
    ),
    cost: 2.5e40,
  },
  {
    desc: "Nitrogen's multiplier is squared",
    cost: 2.5e44,
  },
  {
    desc: "Particle Power gain is stronger",
    cost: 5e46,
  },
  {
    desc: computed(
      () =>
        `Increase C${formatInteger(5)} and C${formatInteger(6)} cap for every C${formatInteger(7)} completion past ${formatInteger(100)}, and its cap is increased by ${formatInteger(25)}`,
    ),
    cost: 2.5e48,
    eff: computed(() => player.challenge.comps[6].sub(100).max(0)),
    effDesc: (x) => `+${formatInteger(x)}`,
  },
  {
    desc: computed(
      () =>
        `Automatically gain a percentage of Quarks gained from reset passively`,
    ),
    cost: 2.5e50,
    eff: computed(() => {
      let eff = 0.5;
      if (hasElement(15)) eff += elementEffect(15);
      return eff;
    }),
    effDesc: (x) => formatPercent(x, 0),
  },
  {
    desc: computed(
      () =>
        `BH Condenser and Cosmic Ray scale ${formatPercent(0.05, 0)} slower`,
    ),
    cost: 1e51,
  },
  {
    desc: computed(
      () =>
        `Increase Silicon's effect by ${formatPercent(0.04, 0)} for every element bought`,
    ),
    cost: 1e56,
    eff: computed(() => 0.04 * player.atom.elements.length),
    effDesc: (x) => `+${formatPercent(x, 0)}`,
  },
  {
    desc: computed(() => `Raise Atom gain by ${format(1.1, 2)}`),
    cost: 1e57,
  },
  {
    desc: "Auto-buy Cosmic Ray, and it raises the Tickspeed effect",
    cost: 5e64,
    eff: computed(() =>
      dilate(player.buildings.cosmic, 1 / 3)
        .div(500)
        .add(1),
    ),
    effDesc: (x) => `^${format(x)}`,
  },
  {
    desc: "The second Neutron effect is stronger",
    cost: 1e66,
  },
  {
    desc: computed(
      () => `Increase C${formatInteger(7)}'s cap by ${formatInteger(50)}`,
    ),
    cost: 2.5e70,
  },
  {
    desc: "Unlock more Atom upgrades and Mass Dilation, a new subtab found in the Atom tab",
    cost: 1e72,
  },
  {
    desc: "Dilated Mass gain is boosted by Tickspeed",
    cost: 1e98,
    eff: computed(() => player.buildings.tickspeed.sqr().div(4e4).add(1)),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: computed(
      () => `Atomic Power gives ${formatPercent(0.5, 0)} more Tickspeed`,
    ),
    cost: 1e107,
  },
  {
    desc: computed(
      () =>
        `Gain ${formatPercent(1, 0)} of Atoms gained from reset per second, and Relativistic Particle gain is boosted by Atomic Power`,
    ),
    cost: 1e119,
    eff: computed(() => player.atom.power.add(1).log10().add(1)),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: computed(
      () =>
        `Increase Mass Dilation upgrade ${formatInteger(1)}'s base by ${format(0.5, 1)}`,
    ),
    cost: 1e142,
  },
  {
    desc: computed(
      () =>
        `Increase C${formatInteger(7)}'s cap by ${formatInteger(100)} and C${formatInteger(8)}'s cap by ${formatInteger(50)}`,
    ),
    cost: 1e161,
  },
  {
    desc: computed(
      () =>
        `Reduce Rank and Tickspeed amount scaling by ${formatPercent(0.05, 0)}`,
    ),
    cost: 1e168,
  },
  {
    desc: computed(
      () =>
        `Raise Mass gain by ${format(1.5, 1)} after the dilation penalty when in Mass Dilation`,
    ),
    cost: 1e192,
  },
  {
    desc: computed(
      () => `Raise Proton Power's first effect by ${formatInteger(2)}`,
    ),
    cost: 1e203,
  },
  {
    desc: computed(
      () =>
        `Raise Neutron Power's first effect by ${formatInteger(2)}, and gain ${formatPercent(0.1, 0)} of each Particle gained from assigning per second`,
    ),
    cost: 1e210,
  },
  {
    desc: "Relativistic Particle gain is boosted by Dilated Mass",
    cost: 1e233,
    eff: computed(() => dilate(player.md.mass.add(1), 1 / 3).sqrt()),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: computed(() => `Raise Dilated Mass gain by ${format(1.02, 2)}`),
    cost: 1e240,
  },
  {
    desc: computed(
      () =>
        `Increase C${formatInteger(7)}'s cap by ${formatInteger(200)}, and its effect is ${formatPercent(0.5, 0)} more effective`,
    ),
    cost: 1e250,
  },
  {
    desc: "Relativistic Particle gain is boosted by Rage Power",
    cost: 1e285,
    eff: computed(() => player.rage.power.add(1).log10().add(1).pow(1.25)),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: "Dilated Mass gain is boosted by Black Hole's mass",
    cost: 1e291,
    eff: computed(() => player.dm.mass.add(1).log10().add(1).pow(2.25)),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: "Unlock Stars, a new subtab found in the Main tab, and more Mass Dilation upgrades",
    cost: 1e300,
  },
  {
    desc: "Tier scales slower based on Tetr",
    cost: "1e315",
    eff: computed(() =>
      dilate(player.ranks[2], 1 / 3)
        .div(100)
        .add(1),
    ),
    effDesc: (x) => formatReduction(x.recip()),
  },
  {
    desc: computed(
      () =>
        `Atomic Power also boosts Rage Upgrade ${formatInteger(7)}'s effect`,
    ),
    cost: "6.54e321",
    eff: computed(() => atomicPowerEffect.value.div(5).floor()),
    effDesc: (x) => `+${formatInteger(x)}`,
  },
  {
    desc: computed(
      () =>
        `C${formatInteger(2)}'s effect is ${formatPercent(0.5, 0)} more effective, and C${formatInteger(6)}'s Tickspeed boost is tripled and its BH Condenser boost doubled`,
    ),
    cost: "1e338",
  },
  {
    desc: "Collapsed Star boosts Dilated Mass gain",
    cost: "1e368",
    eff: computed(() =>
      dilate(player.stars.collapsed.add(1).log10().add(1).pow(3), 2),
    ),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: computed(
      () =>
        `Increase C${formatInteger(8)}'s cap by ${formatInteger(50)}, C${formatInteger(7)}'s cap is increased by ${formatInteger(100)}, its effect is ${formatPercent(0.25, 0)} more effective, and C${formatInteger(6)}'s penalty is reduced to ${format(1.6, 1)}`,
    ),
    cost: "1e385",
  },
  {
    desc: "Collapsed Star boosts Quark gain",
    cost: "1e415",
    eff: computed(() => dilate(player.stars.collapsed.add(1), 1 / 3).pow(2)),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: "Auto-buy Mass Dilation upgrades if they've been purchased at least once, and they no longer spend Dilated Mass",
    cost: "1e430",
  },
  {
    desc: "Tetr scales much slower",
    cost: "1e435",
  },
  {
    desc: "Collapsed Star boosts Relativistic Particle gain",
    cost: "1e455",
    eff: computed(() =>
      dilate(player.stars.collapsed.add(1).log10().add(1).pow(2), 2),
    ),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: "Collapsed Star's effect also boosts Black Hole's mass gain multiplier at a reduced rate",
    cost: "1e465",
    eff: computed(() => dilate(STARS.effect.value, 1 / 2).pow(4)),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: computed(() => `Quark gain is raised by ${format(1.05, 2)}`),
    cost: "1e540",
  },
  {
    desc: computed(
      () => `Collapsed Star's effect is ${formatPercent(0.5, 0)} stronger`,
    ),
    cost: "1e580",
  },
  {
    desc: "Collapsed Star boosts the gain of the last star type",
    cost: "1e666",
    eff: computed(() => player.stars.collapsed.add(1).log10().add(1).pow(2.5)),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: computed(() => `Stars are ^${format(1.05, 2)} as powerful`),
    cost: "1e700",
  },
  {
    desc: computed(() => `Raise Mass gain by ${format(1.03, 2)}`),
    cost: "1e780",
  },
  {
    desc: "Atomic Power gain is boosted by Black Hole's mass",
    cost: "1e817",
    eff: computed(() => dilate(player.dm.mass.add(1), 1 / 3).pow(3)),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: computed(
      () =>
        `Mass Dilation upgrade ${formatInteger(6)} is ${formatPercent(0.5, 0)} stronger`,
    ),
    cost: "1e850",
  },
  {
    desc: "All star resources are boosted by Mass",
    cost: "1e1005",
    eff: computed(() => player.mass.add(1).log10().add(1).sqrt()),
    effDesc: (x) => formatMult(x),
  },
];

ELEMENT_UPGRADES.push(
  ...Array(118 - ELEMENT_UPGRADES.length).fill({
    desc: "TBD",
    cost: Infinity,
  }),
);

export const elementsUnlocked = computed(() => {
  let unl = 0;

  if (player.supernova.unlocked) unl += 54;
  else {
    if (player.challenge.comps[6].gte(16)) unl += 4;
    if (player.challenge.comps[7].gte(1)) unl += 14;
    if (hasElement(17)) unl += 3;
    if (hasElement(20)) unl += 15;
    if (hasElement(35)) unl += 18;
  }
  return unl;
});

export function hasElement(idx) {
  return player.atom.elements.includes(idx);
}

export function elementEffect(idx) {
  return ELEMENT_UPGRADES[idx].eff.value;
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
