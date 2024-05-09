import { computed } from "vue";
import { elementEffect, hasElement } from "./elements";
import Decimal from "break_eternity.js";
import { player } from "../core/save";
import { atomReset } from "./atom";
import { costScaling } from "../core/cost";
import { format, formatInteger, formatMult, formatReduction } from "../core/format";
import { dilate, uni } from "../core/utils";

const unlocked = computed(() => hasElement(20));
const penalty = computed(() => 0.8);
function run() {
  if (player.md.active) player.md.particle = player.md.particle.add(rpGain.value)
  player.md.active = !player.md.active
  atomReset()
}

function createUpgrades(base) {
  for (const [id, upg] of base.entries()) {
    upg.cost = costScaling({
      ...upg.cost,
      amt: computed({
        get: () => player.md.upgrades[id],
        set: (v) => (player.md.upgrades[id] = v),
      }),
      res: computed({
        get: () => player.md.mass,
        set: (v) => (player.md.mass = v),
      }),
      spend: true,
    })
  }

  return base
}

function single(cost) {
  return {
    max: 1,
    cost: {
      base: cost,
      linear: Infinity,
      quad: Infinity
    }
  }
}

const UPGRADES = createUpgrades([
  {
    desc: computed(() => `${hasElement(24) ? formatMult(2.5) : "Double"} dilated mass gain`),
    max: Infinity,
    cost: {
      base: 10,
      linear: 4,
      quad: 1.005
    },
    eff: computed(() => {
      const amt = player.md.upgrades[0]
      return amt.pow_base(hasElement(24) ? 2.5 : 2)
    }),
    effDesc: x => formatMult(x)
  },
  {
    desc: "Strengthen the dilated mass effect",
    max: Infinity,
    cost: {
      base: 100,
      linear: 8,
      quad: 1.01
    },
    eff: computed(() => {
      const amt = player.md.upgrades[1]
      return amt.mul(0.02).add(1)
    }),
    effDesc: x => `^${format(x)}`
  },
  {
    desc: computed(() => "Double Relativistic Particle gain"),
    max: Infinity,
    cost: {
      amtScale: x => x.mul(effect(4)),
      amtInvert: x => x.div(effect(4)),
      base: 1000,
      linear: 12,
      quad: 1.02
    },
    eff: computed(() => {
      const amt = player.md.upgrades[2]
      return amt.pow_base(2)
    }),
    effDesc: x => formatMult(x)
  },
  {
    ...single(1.619e21),
    desc: "Stronger's power is boosted by dilated mass",
    eff: computed(() => dilate(player.md.mass.add(1).log10(), 1 / 3).div(140).add(1).pow(2)),
    effDesc: x => formatMult(x)
  },
  {
    desc: computed(() => `Mass Dilation upgrade ${formatInteger(3)} scales slower`),
    max: 3,
    cost: {
      base: 1.619e23,
      linear: 1e6,
      quad: 100
    },
    eff: computed(() => player.md.upgrades[4].mul(-0.1).add(1)),
    effDesc: x => formatReduction(x)
  },
  {
    desc: "Increase the exponent in the Relativistic Particle formula",
    max: Infinity,
    cost: {
      base: uni(1e19),
      linear: 25,
      quad: 1.04
    },
    eff: computed(() => player.md.upgrades[5].mul(0.25)),
    effDesc: x => `+^${format(x)}`
  },
  {
    ...single(uni(1e100)),
    desc: "Quark gain is boosted by Dilated Mass",
    eff: computed(() => dilate(player.md.mass.add(1), 1 / 2)),
    effDesc: x => formatMult(x)
  }
]);

function canBuy(upg) {
  const u = UPGRADES[upg]
  return player.md.upgrades[upg].lt(u.max) && u.cost.canAfford.value
}

function buy(upg) {
  if (!canBuy(upg)) return

  const u = UPGRADES[upg]
  u.cost.buy(u.cost.amt.value.neg().add(u.max))
}

function effect(upg) {
  return UPGRADES[upg].eff.value
}

const rpExp = computed(() => effect(5).add(1));
const rpMult = computed(() => {
  let mult = effect(2)
  if (hasElement(23)) mult = mult.mul(elementEffect(23))
  return mult
});
const rpGain = computed(() => {
  const base = player.mass.max(1).log10().div(50).sub(9).max(0).pow(rpExp.value).mul(rpMult.value)
  return base.sub(player.md.particle).max(0).floor()
});
const rpNextAt = computed(() => player.md.particle.add(1).div(rpMult.value).root(rpExp.value).add(9).mul(50).pow10());

const dilatedMassGain = computed(() => {
  let gain = player.md.particle.pow(2)
  gain = gain.mul(effect(0))
  if (hasElement(21)) gain = gain.mul(elementEffect(21))
  return gain
});
const dilatedMassEffect = computed(() => player.md.mass.add(1).log10().div(5).add(1).sqrt().pow(effect(1)));

export const MASS_DILATION = {
  unlocked,
  penalty,
  run,
  rpMult,
  rpExp,
  rpGain,
  rpNextAt,
  dilatedMassGain,
  dilatedMassEffect,
  upgrades: UPGRADES,
  canBuy,
  buy,
  effect
};
