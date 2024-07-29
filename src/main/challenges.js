import { computed } from "vue";
import { costScaling } from "../core/cost";
import { player } from "../core/save";
import { DMReset } from "./dm";
import Decimal from "break_eternity.js";
import {
  formatPercent,
  formatReduction,
  format,
  formatInteger,
  formatMult,
} from "../core/format";
import { atomReset } from "../atom/atom";
import { dilate } from "../core/utils";
import { elementEffect, hasElement } from "../atom/elements";

export const CHALLENGES = [
  {
    title: "Instant Scale",
    desc: "Mass upgrades, Rank, and Tickspeed scale twice as fast after 25.",
    reward: "Reduce Rank and Tickspeed scaling",
    unlocked: computed(() => player.challenge.unlocked),
    cost: costScaling({
      base: 1e54,
      linear: 10,
      quad: 1.02,
      amt: computed({
        get: () => player.challenge.comps[0],
        set: (v) => (player.challenge.comps[0] = v),
      }),
      res: computed(() => player.mass),
      spend: false,
    }),
    max: computed(() => {
      return challengeEffect(6).add(100);
    }),
    eff: computed(() => {
      const comps = player.challenge.comps[0];
      return {
        linear: comps.pow(0.8).pow_base(0.95),
        amount: dilate(comps, 1 / 3)
          .div(300)
          .add(1),
      };
    }),
    effDesc: (x) => {
      const second = hasElement(7)
        ? `, ${formatReduction(x.amount.recip())} to amount scaling`
        : "";
      return `${formatReduction(x.linear)} to linear scaling` + second;
    },
  },
  {
    title: "Anti-Tickspeed",
    desc: "Tickspeed is disabled.",
    reward: computed(
      () => `+${formatPercent(0.05, 0)} Tickspeed power per completion`,
    ),
    unlocked: computed(() => player.challenge.comps[0].gte(3)),
    cost: costScaling({
      base: 1e43,
      linear: 20,
      quad: 1.02,
      amt: computed({
        get: () => player.challenge.comps[1],
        set: (v) => (player.challenge.comps[1] = v),
      }),
      res: computed(() => player.mass),
      spend: false,
    }),
    max: computed(() => {
      return challengeEffect(6).add(100);
    }),
    eff: computed(() => {
      const comps = player.challenge.comps[1];
      let eff = comps.mul(0.05);
      if (hasElement(38)) eff = eff.mul(1.5);
      return eff;
    }),
    effDesc: (x) => `+${formatPercent(x)}`,
  },
  {
    title: "Melted Mass",
    desc: computed(() => `Mass gain is ^${format(0.7, 1)}.`),
    reward:
      "Mass gain is raised based on completions, but it doesn't work in this challenge",
    unlocked: computed(() => player.challenge.comps[1].gte(5)),
    cost: costScaling({
      base: 1e50,
      linear: 50,
      quad: 1.04,
      amt: computed({
        get: () => player.challenge.comps[2],
        set: (v) => (player.challenge.comps[2] = v),
      }),
      res: computed(() => player.mass),
      spend: false,
    }),
    max: computed(() => {
      return challengeEffect(6).add(100);
    }),
    eff: computed(() => {
      const comps = player.challenge.comps[2];
      let eff = comps.add(1).log10().mul(0.05).add(1);
      if (hasElement(9)) eff = eff.pow(1.25);
      return eff;
    }),
    effDesc: (x) => `^${format(x)}`,
  },
  {
    title: "Weakened Rage",
    desc: computed(() => `Rage Power gain is rooted by ${formatInteger(10)}.`),
    reward:
      "Rage Power gain is raised based on completions, but it doesn't work in this challenge",
    unlocked: computed(() => player.challenge.comps[2].gte(12)),
    cost: costScaling({
      base: 1e110,
      linear: 50,
      quad: 1.04,
      amt: computed({
        get: () => player.challenge.comps[3],
        set: (v) => (player.challenge.comps[3] = v),
      }),
      res: computed(() => player.mass),
      spend: false,
    }),
    max: computed(() => {
      return challengeEffect(6).add(100);
    }),
    eff: computed(() => {
      const comps = player.challenge.comps[3];
      let eff = comps.add(1).log10().mul(0.1).add(1);
      if (hasElement(9)) eff = eff.pow(1.25);
      return eff;
    }),
    effDesc: (x) => `^${format(x)}`,
  },
  {
    title: "No Rank",
    desc: "Ranks are disabled.",
    reward: "Reduce Rank amount scaling",
    unlocked: computed(() => player.atom.unlocked),
    cost: costScaling({
      base: 1e58,
      linear: 200,
      quad: 1.1,
      amt: computed({
        get: () => player.challenge.comps[4],
        set: (v) => (player.challenge.comps[4] = v),
      }),
      res: computed(() => player.dm.mass),
      spend: false,
    }),
    max: computed(() => {
      let max = new Decimal(75);
      if (hasElement(4)) max = max.add(50);
      if (hasElement(12)) max = max.add(elementEffect(12));
      return max;
    }),
    eff: computed(() => {
      return dilate(player.challenge.comps[4], 0.5).mul(0.02).add(1);
    }),
    effDesc: (x) => `${formatReduction(x.recip())}`,
  },
  {
    title: "Weakened Tickspeed and BH Condenser",
    desc: computed(
      () => `Tickspeed and BH Condenser scale ${formatMult(5, 0)} as fast.`,
    ),
    reward: computed(
      () =>
        `+${formatPercent(0.2, 0)} to Tickspeed and +${format(0.1, 1)} to BH Condenser power per completion`,
    ),
    unlocked: computed(
      () => player.challenge.comps[4].gte(1) || player.supernova.unlocked,
    ),
    cost: costScaling({
      base: 1e35,
      linear: computed(() => (hasElement(1) ? 5 : 100)),
      quad: 1.1,
      amt: computed({
        get: () => player.challenge.comps[5],
        set: (v) => (player.challenge.comps[5] = v),
      }),
      res: computed(() => player.dm.mass),
      spend: false,
    }),
    max: computed(() => {
      let max = new Decimal(75);
      if (hasElement(4)) max = max.add(50);
      if (hasElement(12)) max = max.add(elementEffect(12));
      return max;
    }),
    eff: computed(() => {
      const comps = player.challenge.comps[5];
      const better = hasElement(1) && !(inChallenge(1) || inChallenge(6));
      return {
        tickspeed: comps.mul(0.2).mul(hasElement(38) ? 3 : 1),
        bhc: comps.mul(better ? 0.05 : 0.1).mul(hasElement(38) ? 2 : 1),
      };
    }),
    effDesc: (x) =>
      `+${formatPercent(x.tickspeed)} to Tickspeed, +${format(x.bhc)} to BH Condenser power`,
  },
  {
    title: "No Rage Power",
    desc: "Rage Power is disabled. However, Dark Matter is gained from Mass instead of Rage Power at a reduced rate.",
    firstTime: computed(
      () =>
        `After completing this challenge ${formatInteger(16)} times, unlock Elements, a new subtab found in the Atom tab.`,
    ),
    reward: computed(
      () =>
        `Each completion adds ${formatInteger(4)} to C${formatInteger(1)}-${formatInteger(4)} cap`,
    ),
    unlocked: computed(
      () => player.challenge.comps[5].gte(1) || player.supernova.unlocked,
    ),
    cost: costScaling({
      base: 1e53,
      linear: 100,
      quad: 1.1,
      amt: computed({
        get: () => player.challenge.comps[6],
        set: (v) => (player.challenge.comps[6] = v),
      }),
      res: computed(() => player.dm.mass),
      spend: false,
    }),
    max: computed(() => {
      let max = new Decimal(75);
      if (hasElement(4)) max = max.add(50);
      if (hasElement(12)) max = max.add(25);
      if (hasElement(19)) max = max.add(50);
      if (hasElement(25)) max = max.add(100);
      if (hasElement(32)) max = max.add(200);
      if (hasElement(40)) max = max.add(100);
      return max;
    }),
    eff: computed(() => {
      let eff = player.challenge.comps[6].mul(4);
      if (hasElement(32)) eff = eff.mul(1.5);
      if (hasElement(40)) eff = eff.mul(1.25);
      return eff.floor();
    }),
    effDesc: (x) => `+${formatInteger(x)}`,
  },
  {
    title: "White Hole",
    desc: computed(
      () =>
        `Dark Matter & Black Hole's mass gain is rooted by ${formatInteger(8)}.`,
    ),
    firstTime: computed(
      () =>
        `After completing this challenge once, unlock up to ${formatInteger(3)} rows of Elements`,
    ),
    reward:
      "Raise Dark Matter & Black Hole's mass gain multiplier based on completions",
    unlocked: computed(
      () => player.challenge.comps[6].gte(1) || player.supernova.unlocked,
    ),
    cost: costScaling({
      base: 1e27,
      linear: 50,
      quad: 1.1,
      amt: computed({
        get: () => player.challenge.comps[7],
        set: (v) => (player.challenge.comps[7] = v),
      }),
      res: computed(() => player.dm.mass),
      spend: false,
    }),
    max: computed(() => {
      let max = new Decimal(50);
      if (hasElement(25)) max = max.add(50);
      if (hasElement(40)) max = max.add(50);
      return max;
    }),
    eff: computed(() => {
      const comps = player.challenge.comps[7];
      return comps.add(1).log10().mul(0.05).add(1).sqr();
    }),
    effDesc: (x) => `^${format(x)}`,
  },
];

function challengeReset(num) {
  if (num >= 4) atomReset();
  else DMReset();
}

export function challengeResetText(num) {
  let text;
  if (num >= 4) text = "an atom";
  else text = "a dark matter";
  return `This challenge will force ${text} reset.`;
}

export function inChallenge(num) {
  return player.challenge.active === num;
}

export function challengeEffect(num) {
  return CHALLENGES[num].eff.value;
}

export function enterChallenge(num) {
  if (player.challenge.active !== -1) exitChallenge();
  challengeReset(num);
  player.challenge.active = num;
}

export function exitChallenge() {
  const active = player.challenge.active;
  const chal = CHALLENGES[active];
  chal.cost.buy(chal.max.value.sub(chal.cost.amt.value));
  challengeReset(active);
  player.challenge.active = -1;
}

export function selectChallenge(num) {
  if (player.challenge.chosen === num) enterChallenge(num);
  player.challenge.chosen = num;
}
