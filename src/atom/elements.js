import { ref } from "vue";
import { ELEMENT_FORMAT_LIST } from "../core/format";
import { player } from "../core/save";

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
    desc: " 1 2 3",
    cost: 0,
  },
  ...Array(118).fill({
    desc: "foo bar",
    cost: Infinity,
  }),
];

export function hasElement(idx) {
  return player.atom.elements.includes(idx);
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
