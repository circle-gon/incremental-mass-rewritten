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
} from "../core/format";
import { atomReset } from "../atom/atom";

export const CHALLENGES = [
  {
    title: "Instant Scale",
    desc: "Mass upgrades, Rank, and Tickspeed scale twice as fast after 25.",
    reward: "Reduce Tickspeed and Rank scaling.",
    unlocked: computed(() => true),
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
      return new Decimal(100);
    }),
    eff: computed(() => {
      const comps = player.challenge.comps[0];
      return comps.pow(0.8).pow_base(0.95);
    }),
    effDesc: (x) => `-${formatReduction(x)} to Rank and Tickspeed scaling`,
  },
  {
    title: "Anti-Tickspeed",
    desc: "Tickspeed cannot be bought.",
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
      return new Decimal(100);
    }),
    eff: computed(() => {
      const comps = player.challenge.comps[1];
      return comps.mul(0.05);
    }),
    effDesc: (x) => `+${formatPercent(x)} to Tickspeed power`,
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
      return new Decimal(100);
    }),
    eff: computed(() => {
      const comps = player.challenge.comps[2];
      return comps.add(1).log10().mul(0.05).add(1);
    }),
    effDesc: (x) => `^${format(x)} to Mass gain`,
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
      return new Decimal(100);
    }),
    eff: computed(() => {
      const comps = player.challenge.comps[3];
      return comps.add(1).log10().mul(0.1).add(1);
    }),
    effDesc: (x) => `^${format(x)} to Rage Power gain`,
  },
  {
    title: "No Rank",
    desc: "Ranks are disabled.",
    reward: "Reduce Rank scaling.",
    unlocked: computed(() => player.atom.unlocked),
    cost: costScaling({
      base: Decimal.dInf,
      linear: Decimal.dInf,
      quad: Decimal.dInf,
      amt: computed({
        get: () => player.challenge.comps[4],
        set: (v) => (player.challenge.comps[4] = v),
      }),
      res: computed(() => player.mass),
      spend: false,
    }),
    max: computed(() => {
      return new Decimal(50);
    }),
    eff: computed(() => {
      return Decimal.dOne;
    }),
    effDesc: (x) => `-${formatReduction(x)} to Rank scaling`,
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
