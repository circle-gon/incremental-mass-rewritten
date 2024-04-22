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

export const CHALLENGES = [
  {
    title: "Instant Scale",
    desc: "Mass upgrades, Rank, and Tickspeed scale twice as fast after 25.",
    reward: "Reduce Rank and Tickspeed scaling.",
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
      return comps.pow(0.8).pow_base(0.95);
    }),
    effDesc: (x) => `${formatReduction(x)}`,
  },
  {
    title: "Anti-Tickspeed",
    desc: "Tickspeed is disabled.",
    reward: computed(
      () => `+${formatPercent(0.05, 0)} Tickspeed power per completion.`,
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
      return comps.mul(0.05);
    }),
    effDesc: (x) => `+${formatPercent(x)}`,
  },
  {
    title: "Melted Mass",
    desc: computed(() => `Mass gain is ^${format(0.7, 1)}.`),
    reward:
      "Mass gain is raised based on completions, but it doesn't work in this challenge.",
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
      return comps.add(1).log10().mul(0.05).add(1);
    }),
    effDesc: (x) => `^${format(x)}`,
  },
  {
    title: "Weakened Rage",
    desc: computed(() => `Rage Power gain is rooted by ${formatInteger(10)}.`),
    reward:
      "Rage Power gain is raised based on completions, but it doesn't work in this challenge.",
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
      return comps.add(1).log10().mul(0.1).add(1);
    }),
    effDesc: (x) => `^${format(x)}`,
  },
  {
    title: "No Rank",
    desc: "Ranks are disabled.",
    reward: "Reduce Rank scaling.",
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
      return new Decimal(50);
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
    reward: "Add to Tickspeed and BH Condenser power.",
    unlocked: computed(() => player.challenge.comps[4].gte(1)),
    cost: costScaling({
      base: 1e35,
      linear: 100,
      quad: 1.1,
      amt: computed({
        get: () => player.challenge.comps[5],
        set: (v) => (player.challenge.comps[5] = v),
      }),
      res: computed(() => player.dm.mass),
      spend: false,
    }),
    max: computed(() => {
      return new Decimal(50);
    }),
    eff: computed(() => {
      const comps = player.challenge.comps[5];
      return {
        tickspeed: comps.mul(0.2),
        bhc: comps.mul(0.1),
      };
    }),
    effDesc: (x) =>
      `+${formatPercent(x.tickspeed)} to Tickspeed, +${format(x.bhc)} to Black Hole Condenser`,
  },
  {
    title: "No Rage Power",
    desc: "Rage Power is disabled. However, Dark Matter is gained from Mass instead of Rage Power at a reduced rate.",
    firstTime: computed(
      () =>
        `After completing this challenge ${formatInteger(16)} times, unlock Elements, a new subtab found in the Atom tab.`,
    ),
    reward: computed(
      () => `Each completion adds ${formatInteger(4)} to challenges 1-4 cap.`,
    ),
    unlocked: computed(() => player.challenge.comps[5].gte(1)),
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
      return new Decimal(50);
    }),
    eff: computed(() => {
      return player.challenge.comps[6].mul(4);
    }),
    effDesc: (x) => `+${formatInteger(x)}`,
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
  player.challenge.comps[active] = chal.cost.max.value
    .min(chal.max.value)
    .max(player.challenge.comps[active]);

  challengeReset(active);
  player.challenge.active = -1;
}

export function selectChallenge(num) {
  if (player.challenge.chosen === num) enterChallenge(num);
  player.challenge.chosen = num;
}
