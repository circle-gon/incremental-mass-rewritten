import { computed } from "vue";
import { player } from "../core/save";
import { dilate, uni } from "../core/utils";
import Decimal from "break_eternity.js";
import { showPopup, showQuote } from "../core/popups";
import { buildingEffect, resetBuilding } from "../main/buildings";
import { dmResetCore } from "../main/dm";
import { hasUpgrade, resetUpgrades, upgradeEffect } from "../main/upgrades";
import { format, formatMult, formatPercent } from "../core/format";
import { hasRankReward, rankReward } from "../main/ranks";
import { elementEffect, hasElement } from "./elements";
import { MASS_DILATION } from "./md";

const REQUIRE = uni(1e90);

const canAtomReset = computed(() => {
  return player.dm.mass.gte(REQUIRE);
});

export const atomGain = computed(() => {
  if (!canAtomReset.value) return Decimal.dZero;

  let base = player.dm.mass.div(REQUIRE).root(5);
  if (hasUpgrade("rp", 14)) base = base.mul(upgradeEffect("rp", 14));
  if (hasElement(16)) base = base.pow(1.1);
  return base.floor();
});

export const quarkGain = computed(() => {
  if (!canAtomReset.value) return Decimal.dZero;

  let base = hasElement(0)
    ? atomGain.value.root(10)
    : atomGain.value.log10().add(1).pow(1.1);
  if (hasUpgrade("dm", 12)) base = base.mul(10);
  if (hasUpgrade("atom", 7)) base = base.mul(upgradeEffect("atom", 7));
  if (hasRankReward(0, 13)) base = base.mul(rankReward(0, 13));
  if (hasElement(5)) base = base.mul(elementEffect(5));
  if (player.md.upgrades[6].gte(1)) base = base.mul(MASS_DILATION.effect(6))
  return base.floor();
});

const KEEP_DM_UPGRADES = [4];
function atomResetCore() {
  resetUpgrades("dm", KEEP_DM_UPGRADES);
  player.dm.darkMatter = Decimal.dZero;
  resetBuilding("bhc");
  if (!hasUpgrade("atom", 3))
    for (let i = 0; i < 4; i++) player.challenge.comps[i] = Decimal.dZero;
  player.atom.power = Decimal.dZero;
  dmResetCore();
}

export function atomReset() {
  player.atom.atom = player.atom.atom.add(atomGain.value);
  player.atom.quark = player.atom.quark.add(quarkGain.value);
  player.atom.unlocked = true;
  atomResetCore();

  showQuote(3);
}

export function manualAtomReset() {
  if (!canAtomReset.value) return;
  if (!player.options.confirm.atom) atomReset();
  else showPopup("atom");
}

const RATIO_MODE = [0.25, 1];
export function assignParticle(num) {
  if (player.atom.quark.lt(1)) return;
  const mode = player.atom.split;
  const spend = mode > 0 ? player.atom.quark.mul(RATIO_MODE[mode - 1]) : 1;
  player.atom.quark = player.atom.quark.sub(spend);
  player.atom.particles[num] = player.atom.particles[num].add(spend);
}

export function assignParticles() {
  const sum = player.atom.ratio.reduce((a, b) => a + b);
  if (player.atom.quark.lt(sum)) return;

  const spent = player.atom.quark.div(sum).floor();
  for (let x = 0; x < PARTICLES.length; x++) {
    const add = spent.mul(player.atom.ratio[x]);
    player.atom.quark = player.atom.quark.sub(add);
    player.atom.particles[x] = player.atom.particles[x].add(add);
  }
}

export function powerGain(i) {
  let base = player.atom.particles[i].pow(2);
  if (hasUpgrade("atom", 6)) base = base.mul(upgradeEffect("atom", 6));
  if (hasElement(11))
    base = base.pow(
      dilate(base.add(1).log10(), 1 / 3)
        .div(100)
        .add(1),
    );
  return base;
}

export function powerEffect(i, j) {
  return PARTICLES[i].effect.value[j];
}

export const atomicPowerGain = computed(() => {
  let base = buildingEffect("cosmic");
  if (hasElement(2)) base = base.mul(elementEffect(2));
  if (player.md.active) base = dilate(base, MASS_DILATION.penalty.value)
  return base;
});

export const atomicPowerEffect = computed(() => {
  let base = player.atom.power.add(1).log2();
  if (hasElement(22)) base = base.mul(1.5)
  return base.floor();
});

export const PARTICLES = [
  {
    name: "Proton",
    effect: computed(() => {
      const amt = player.atom.powers[0];
      return [amt.add(1).pow(3), amt.add(1).log10().mul(0.2)];
    }),
    desc: (eff) => [
      `Boost Mass gain by ${formatMult(eff[0])}`,
      `Increase Tickspeed power by ${formatPercent(eff[1])}`,
    ],
    color: "#0f0",
  },
  {
    name: "Neutron",
    effect: computed(() => {
      const amt = player.atom.powers[1];
      const mass = player.mass.add(1).log10().add(1).pow(1.25);
      const rage = player.rage.power
        .add(1)
        .log10()
        .add(1)
        .pow(hasElement(18) ? 0.25 : 0.2)
        .sub(1);
      const amtboost = amt
        .add(1)
        .log10()
        .add(1)
        .pow(hasElement(18) ? 0.5 : 0.4)
        .sub(1);
      return [amt.add(1).pow(2), mass.pow(rage.mul(amtboost))];
    }),
    desc: (eff) => [
      `Boost Rage Power gain by ${formatMult(eff[0])}`,
      `Boost Mass gain based on Rage Power - ${formatMult(eff[1])}`,
    ],
    color: "#ff0",
  },
  {
    name: "Electron",
    effect: computed(() => {
      const amt = player.atom.powers[2];
      return [amt.add(1), amt.add(1).log10().mul(0.04)];
    }),
    desc: (eff) => [
      `Boost Dark Matter gain by ${formatMult(eff[0])}`,
      `Increase BH Condenser power by ${format(eff[1])}`,
    ],
    color: "#f00",
  },
];
