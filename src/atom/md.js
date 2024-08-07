import { computed } from "vue";
import { elementEffect, hasElement } from "./elements";
import { player } from "../core/save";
import { atomReset } from "./atom";
import { quadCostScaling } from "../core/cost";
import {
  format,
  formatInteger,
  formatMult,
  formatReduction,
} from "../core/format";
import { dilate, uni } from "../core/utils";
import { STARS } from "./stars";
import Decimal from "break_eternity.js";

const penalty = computed(() => 0.8);
function run() {
  if (player.md.active)
    player.md.particle = player.md.particle.add(rpGain.value);
  player.md.active = !player.md.active;
  atomReset();
}

function createUpgrades(base) {
  for (const [id, upg] of base.entries()) {
    upg.cost = quadCostScaling({
      ...upg.cost,
      amt: computed({
        get: () => player.md.upgrades[id],
        set: (v) => (player.md.upgrades[id] = v),
      }),
      res: computed({
        get: () => player.md.mass,
        set: (v) => (player.md.mass = v),
      }),
      spend: computed(() => !hasElement(42)),
    });
  }

  return base;
}

function single(cost, obj) {
  return {
    max: 1,
    cost: {
      base: cost,
      linear: Decimal.dLayerMax,
      quad: Decimal.dLayerMax,
    },
    ...obj,
  };
}

const UPGRADES = createUpgrades([
  {
    desc: computed(
      () => `${hasElement(24) ? formatMult(2.5) : "Double"} dilated mass gain`,
    ),
    max: Infinity,
    cost: {
      base: 10,
      linear: 4,
      quad: 1.005,
    },
    eff: computed(() => {
      const amt = player.md.upgrades[0];
      return amt.pow_base(hasElement(24) ? 2.5 : 2);
    }),
    effDesc: (x) => formatMult(x),
  },
  {
    desc: "Strengthen the dilated mass effect",
    max: Infinity,
    cost: {
      base: 100,
      linear: 8,
      quad: 1.01,
    },
    eff: computed(() => {
      const amt = player.md.upgrades[1];
      return amt.mul(player.md.upgrades[7].gte(1) ? 0.025 : 0.02).add(1);
    }),
    effDesc: (x) => `^${format(x)}`,
  },
  {
    desc: computed(() => "Double Relativistic Particle gain"),
    max: Infinity,
    cost: {
      amtScale: (x) => x.mul(effect(4)),
      amtInvert: (x) => x.div(effect(4)),
      base: 1000,
      linear: 12,
      quad: 1.02,
    },
    eff: computed(() => {
      const amt = player.md.upgrades[2];
      return amt.pow_base(2);
    }),
    effDesc: (x) => formatMult(x),
  },
  single(1.69e21, {
    desc: "Stronger's power is boosted by dilated mass",
    eff: computed(() =>
      dilate(player.md.mass.add(1).log10(), 1 / 3)
        .div(140)
        .add(1)
        .sqr(),
    ),
    effDesc: (x) => formatMult(x),
  }),
  {
    desc: computed(
      () => `Mass Dilation upgrade ${formatInteger(3)} scales slower`,
    ),
    max: 3,
    cost: {
      base: 1.619e23,
      linear: 1e6,
      quad: 100,
    },
    eff: computed(() => player.md.upgrades[4].mul(-0.1).add(1)),
    effDesc: (x) => formatReduction(x),
  },
  {
    desc: "Increase the exponent in the Relativistic Particle formula",
    max: Infinity,
    cost: {
      base: uni(1e19),
      linear: 25,
      quad: 1.04,
    },
    eff: computed(() => {
      let base = 0.25;
      if (hasElement(52)) base *= 1.5;
      return player.md.upgrades[5].mul(base);
    }),
    effDesc: (x) => `+^${format(x)}`,
  },
  single(uni(1e100), {
    desc: "Quark gain is boosted by Dilated Mass",
    eff: computed(() => dilate(player.md.mass.add(1), 1 / 2)),
    effDesc: (x) => formatMult(x),
  }),
  single(uni(1e267), {
    desc: computed(
      () => `Mass Dilation upgrade ${formatInteger(2)} is stronger`,
    ),
  }),
  single(uni("1e448"), {
    unl: computed(() => STARS.unlocked.value),
    desc: "All star resources are boosted by Tickspeed",
    eff: computed(() => player.buildings.tickspeed.add(1).pow(2 / 3)),
    effDesc: (x) => formatMult(x),
  }),
  {
    desc: "Double Quark gain",
    unl: computed(() => STARS.unlocked.value),
    max: Infinity,
    cost: {
      base: uni("1e666"),
      linear: 4,
      quad: 1.015,
    },
    eff: computed(() => player.md.upgrades[9].pow_base(2)),
    effDesc: (x) => formatMult(x),
  },
]);

function canBuy(upg) {
  const u = UPGRADES[upg];
  return player.md.upgrades[upg].lt(u.max) && u.cost.canAfford.value;
}

function buy(upg) {
  if (!canBuy(upg)) return;

  const u = UPGRADES[upg];
  u.cost.buy(u.cost.amt.value.neg().add(u.max));
}

function effect(upg) {
  return UPGRADES[upg].eff.value;
}

const rpExp = computed(() => effect(5).add(1));
const rpMult = computed(() => {
  let mult = effect(2);
  if (hasElement(23)) mult = mult.mul(elementEffect(23));
  if (hasElement(30)) mult = mult.mul(elementEffect(30));
  if (hasElement(33)) mult = mult.mul(elementEffect(33));
  if (hasElement(44)) mult = mult.mul(elementEffect(44));
  return mult;
});
const rpGain = computed(() => {
  const base = player.mass
    .max(1)
    .log10()
    .div(50)
    .sub(9)
    .max(0)
    .pow(rpExp.value)
    .mul(rpMult.value);
  return base.sub(player.md.particle).max(0).floor();
});
const rpNextAt = computed(() =>
  player.md.particle
    .add(1)
    .div(rpMult.value)
    .root(rpExp.value)
    .add(9)
    .mul(50)
    .pow10(),
);
const rpText = computed(
  () =>
    `Dilating mass will force an atom reset. While mass is dilated, all pre-atom resources and atomic power will get their gain exponents raised by ${format(penalty.value)}.`,
);

const dilatedMassGain = computed(() => {
  let gain = player.md.particle.sqr();
  gain = gain.mul(effect(0));
  if (hasElement(21)) gain = gain.mul(elementEffect(21));
  if (hasElement(34)) gain = gain.mul(elementEffect(34));
  if (hasElement(39)) gain = gain.mul(elementEffect(39));
  if (hasElement(31)) gain = gain.pow(1.03);
  return gain;
});
const dilatedMassEffect = computed(() =>
  player.md.mass.add(1).log10().div(5).add(1).sqrt().pow(effect(1)),
);

export const MASS_DILATION = {
  penalty,
  run,
  rpMult,
  rpExp,
  rpGain,
  rpNextAt,
  rpText,
  dilatedMassGain,
  dilatedMassEffect,
  upgrades: UPGRADES,
  canBuy,
  buy,
  effect,
};
