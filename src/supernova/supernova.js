import { computed } from "vue";
import { player } from "../core/save";
import Decimal from "break_eternity.js";
import { PARTICLES, atomResetCore } from "../atom/atom";
import { resetBuilding } from "../main/buildings";
import { resetUpgrades } from "../main/upgrades";
import { MASS_DILATION } from "../atom/md";
import { STARS } from "../atom/stars";
import { supernovaTime } from "../core/utils";
import { showQuote } from "../core/popups";

export const canSupernovaReset = computed(() => {
  return player.stars.collapsed.gte(supernovaRequirement.value);
});

export const supernovaRequirement = computed(() =>
  player.supernova.count.pow(1.25).pow_base(1e50).mul(1e155),
);

export const supernovaGain = computed(() => {
  if (!canSupernovaReset.value) return Decimal.dZero;
  return player.stars.collapsed
    .div(1e155)
    .log(1e50)
    .root(1.25)
    .floor()
    .add(1)
    .sub(player.supernova.count);
});

const KEEP_ATOM_UPGRADES = [1, 4];
const KEEP_ELEMENTS = [20, 35];
function supernovaResetCore() {
  // Supernova Stuff
  supernovaTime.value = 0;

  // Atom Stuff
  player.atom.atom = Decimal.dZero;
  player.atom.quark = Decimal.dZero;
  player.atom.power = Decimal.dZero;
  player.atom.particles = Array(PARTICLES.length).fill(Decimal.dZero);
  player.atom.powers = Array(PARTICLES.length).fill(Decimal.dZero);
  resetBuilding("cosmic");
  resetUpgrades("atom", KEEP_ATOM_UPGRADES);
  player.atom.elements = player.atom.elements.filter((i) =>
    KEEP_ELEMENTS.includes(i),
  );

  // Mass Dilation Stuff
  player.md.active = false;
  player.md.particle = Decimal.dZero;
  player.md.mass = Decimal.dZero;
  player.md.upgrades = Array(MASS_DILATION.upgrades.length).fill(Decimal.dZero);

  // Star Stuff
  player.stars.unlocked = 0;
  player.stars.collapsed = Decimal.dZero;
  player.stars.stars = Array(STARS.count).fill(Decimal.dZero);

  // Challenges Stuff
  for (let i = 4; i < 8; i++) player.challenge.comps[i] = Decimal.dZero;

  // Pre-Atom Stuff
  atomResetCore();
}

export function supernovaReset() {
  player.supernova.count = player.supernova.count.add(supernovaGain.value);
  player.supernova.unlocked = true;
  supernovaResetCore();

  showQuote(4);
}
