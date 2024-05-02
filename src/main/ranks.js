import { computed } from "vue";
import { player } from "../core/save";
import Decimal from "break_eternity.js";
import { costScaling, manualCostScaling } from "../core/cost";
import { buildingAmount, resetBuilding } from "./buildings";
import {
  format,
  formatInteger,
  formatMult,
  formatPercent,
  formatReduction,
} from "../core/format";
import { hasUpgrade, upgradeEffect } from "./upgrades";
import { showQuote } from "../core/popups";
import { challengeEffect, inChallenge } from "./challenges";
import { dilate } from "../core/utils";
import { hasElement } from "../atom/elements";

export const RANKS = [
  {
    name: "Rank",
    unlocked: computed(() => true),
    autoUnlocked: computed(() => hasUpgrade("rp", 4)),
    noReset: computed(() => hasUpgrade("rp", 3)),
    cost: costScaling({
      amtScale: (a) => {
        let amt = a;
        if (hasElement(7)) amt = amt.div(challengeEffect(0).amount)
        if (hasRankReward(2, 3)) amt = amt.div(rankReward(2, 3));
        amt = amt.div(challengeEffect(4));
        if (hasRankReward(2, 0)) amt = amt.mul(0.9);
        if (inChallenge(0) && amt.gte(25)) amt = amt.sub(25).mul(2).add(25);
        return amt;
      },
      amtInvert: (a) => {
        let amt = a;
        if (inChallenge(0) && amt.gte(25)) amt = amt.sub(25).div(2).add(25);
        if (hasRankReward(2, 0)) amt = amt.div(0.9);
        amt = amt.mul(challengeEffect(4));
        if (hasRankReward(2, 3)) amt = amt.mul(rankReward(2, 3));
        if (hasElement(7)) amt = amt.mul(challengeEffect(0).amount)
        return amt;
      },
      costScale: (c) => {
        let cost = c;
        if (hasUpgrade("atom", 9)) cost = cost.div(upgradeEffect("atom", 9));
        return cost;
      },
      costInvert: (c) => {
        let cost = c;
        if (hasUpgrade("atom", 9)) cost = cost.mul(upgradeEffect("atom", 9));
        return cost;
      },
      base: 5,
      linear: computed(() => {
        let base = new Decimal(7);
        if (hasRankReward(1, 0)) base = base.pow(0.9);
        if (hasUpgrade("rp", 9)) base = base.pow(0.8);
        base = base.pow(challengeEffect(0).linear);
        return base;
      }),
      quad: 1.01,
      amt: computed({
        get: () => player.ranks[0],
        set: (v) => (player.ranks[0] = v),
      }),
      res: computed(() => player.mass),
      spend: false,
    }),
    rewards: [
      {
        require: 1,
        desc: "unlock Muscler",
      },
      {
        require: 2,
        desc: computed(
          () =>
            `unlock Booster, and reduce Muscler's scaling by ${formatPercent(
              0.2,
              0,
            )}`,
        ),
      },
      {
        require: 3,
        desc: computed(
          () =>
            `unlock Stronger, reduce Booster's scaling by ${formatPercent(
              0.2,
              0,
            )}, and Muscler boosts itself`,
        ),
        eff: computed(() => buildingAmount("mass1").div(20)),
        effDesc: (x) => `+${format(x)}`,
      },
      {
        require: 4,
        desc: computed(
          () => `reduce Stronger's scaling by ${formatPercent(0.1, 0)}`,
        ),
      },
      {
        require: 5,
        desc: "Booster boosts itself",
        eff: computed(() => buildingAmount("mass2").div(40)),
        effDesc: (x) => `+${format(x)}`,
      },
      {
        require: 6,
        desc: "Ranks boost Mass gain",
        eff: computed(() => {
          let base = player.ranks[0];
          if (hasRankReward(0, 8)) base = base.pow(1.5);
          return base;
        }),
        effDesc: (x) => formatMult(x),
      },
      {
        require: 12,
        desc: computed(() => `${formatMult(4, 0)} to Mass gain`),
      },
      {
        require: 14,
        desc: computed(
          () => `divide Mass upgrade costs by ${formatInteger(10)}`,
        ),
      },
      {
        require: 17,
        desc: computed(() => `Rank ${formatInteger(6)}'s effect is better`),
      },
      {
        require: 25,
        desc: computed(() => `Stronger's power is +${format(0.1, 1)}`),
      },
      {
        require: 90,
        desc: computed(
          () => `+${formatPercent(0.004, 1)} Tickspeed power per Rank`,
        ),
        eff: computed(() => player.ranks[0].mul(0.004)),
        effDesc: (x) => `+${formatPercent(x)}`,
      },
      {
        require: 180,
        desc: "Boost Rage Power gain based on Rank",
        eff: computed(() => player.ranks[0].pow(2)),
        effDesc: (x) => formatMult(x),
      },
      {
        require: 930,
        desc: computed(() => `Raise Mass gain by ${format(1.02, 2)}`),
      },
      {
        require: 1290,
        desc: "Boost Quark gain based on Rank",
        eff: computed(() => player.ranks[0].add(1).sqrt()),
        effDesc: (x) => formatMult(x),
      },
      {
        require: 1950,
        desc: "Boost Mass gain based on Rank",
        eff: computed(() => {
          let base = player.ranks[0].sub(1949).pow(0.75).pow_base(1e6)
          if (hasRankReward(1, 7)) base = base.pow(rankReward(1, 7))
          return base
        }),
        effDesc: x => formatMult(x)
      }
    ],
  },
  {
    name: "Tier",
    unlocked: computed(
      () =>
        player.ranks[0].gte(3) ||
        player.ranks[1].gt(0) ||
        hasUpgrade("atom", 2),
    ),
    autoUnlocked: computed(() => hasUpgrade("rp", 5)),
    noReset: computed(() => hasUpgrade("dm", 3)),
    cost: manualCostScaling({
      amt: computed({
        get: () => player.ranks[1],
        set: (v) => (player.ranks[1] = v),
      }),
      res: computed(() => player.ranks[0]),
      spend: false,
      // for some reason it looks strange
      cost: (x) => {
        let base = x;
        if (hasRankReward(2, 0)) base = base.mul(0.9);
        if (hasUpgrade("atom", 4)) base = base.mul(0.86);
        if (hasRankReward(2, 3)) base = base.mul(0.9);

        let cost = base.add(2).sqr();
        if (hasUpgrade("atom", 9)) cost = cost.mul(0.7);
        return cost.ceil();
      },
      invert: (x) => {
        let base = x;
        if (hasUpgrade("atom", 9)) base = base.div(0.7);

        let cost = base.sqrt().sub(2);
        if (hasRankReward(2, 0)) cost = cost.div(0.9);
        if (hasUpgrade("atom", 4)) cost = cost.div(0.86);
        if (hasRankReward(2, 3)) cost = cost.div(0.9);
        return cost;
      },
    }),
    rewards: [
      {
        require: 1,
        desc: computed(() => `reduce Rank scaling by ${formatPercent(0.1, 0)}`),
      },
      {
        require: 2,
        desc: computed(() => `raise Mass gain by ${format(1.1, 1)}`),
      },
      {
        require: 3,
        desc: computed(
          () => `reduce Mass upgrade scalings by ${formatPercent(0.1, 0)}`,
        ),
      },
      {
        require: 4,
        desc: computed(
          () => `+${formatPercent(0.075, 1)} Tickspeed power for every Tier`,
        ),
        eff: computed(() => player.ranks[1].mul(0.075)),
        effDesc: (x) => `+${formatPercent(x)}`,
      },
      {
        require: 7,
        desc: "multiply Rage Power gain based on Tiers",
        eff: computed(() => {
          let base = player.ranks[1].pow_base(2);
          if (hasRankReward(1, 5)) base = base.pow(rankReward(1, 5));
          return base;
        }),
        effDesc: (x) => formatMult(x),
      },
      {
        require: 13,
        desc: computed(
          () => `Raise Tier ${formatInteger(7)}'s reward based on Dark Matter`,
        ),
        eff: computed(() =>
          player.dm.darkMatter.add(1).log10().add(1).log10().add(1),
        ),
        effDesc: (x) => `^${format(x)}`,
      },
      {
        require: 67,
        desc: computed(
          () => `Stronger's power is increased by ${format(0.05, 2)}`,
        ),
      },
      {
        require: 75,
        desc: computed(() => `Raise Rank ${formatInteger(1950)}'s effect based on Tier`),
        eff: computed(() => player.ranks[1].sub(74).div(30).add(1).pow(0.3)),
        effDesc: x => `^${format(x)}`
      }
    ],
  },
  {
    name: "Tetr",
    unlocked: computed(() => hasUpgrade("atom", 2)),
    autoUnlocked: computed(() => hasUpgrade("atom", 4)),
    noReset: computed(() => false),
    cost: manualCostScaling({
      amt: computed({
        get: () => player.ranks[2],
        set: (v) => (player.ranks[2] = v),
      }),
      res: computed(() => player.ranks[1]),
      spend: false,
      cost: (a) => {
        let amt = a
        if (hasElement(8)) amt = amt.mul(0.85)
        return amt.pow(2).mul(3).add(23).ceil()
      },
      invert: (res) => {
        let amt = res.sub(23).div(3).max(0).sqrt()
        if (hasElement(8)) amt = amt.div(0.85)
        return amt
      },
    }),
    rewards: [
      {
        require: 1,
        desc: computed(
          () => `Reduce Rank and Tier scaling by ${formatPercent(0.1, 0)}`,
        ),
      },
      {
        require: 2,
        desc: "Stronger boosts itself",
        eff: computed(() => dilate(player.buildings.mass3, 1 / 3).div(400)),
        effDesc: (x) => `+${format(x)}`,
      },
      {
        require: 3,
        desc: computed(() => `Raise Tickspeed effect by ${format(1.05, 2)}`),
      },
      {
        require: 4,
        desc: computed(
          () =>
            `Tier scales ${formatPercent(0.1, 0)} slower, and Rank scaling is reduced based on Tiers`,
        ),
        eff: computed(() =>
          dilate(player.ranks[1], 1 / 3)
            .mul(0.01)
            .add(1),
        ),
        effDesc: (x) => formatReduction(x.recip()),
      },
      {
        require: 5,
        desc: "Tickspeed scales slower based on Tetr",
        eff: computed(() => dilate(player.ranks[2], 1 / 3).mul(0.02).add(1)),
        effDesc: x => formatReduction(x.recip())
      },
      {
        require: 7,
        desc: computed(() => `Raise Mass gain by ${format(1.02, 2)}`)
      }
    ],
  },
];

export function rankReset(level) {
  // don't reset itself
  for (let i = 0; i < level; i++) {
    RANKS[i].cost.amt.value = Decimal.dZero;
  }

  player.mass = Decimal.dZero;
  resetBuilding("mass1");
  resetBuilding("mass2");
  resetBuilding("mass3");
}

export function rankUp(level, max) {
  const cost = RANKS[level].cost;
  // Do special treatment for challenge 5 instead of setting unlocked to false
  if (!cost.canAfford.value || inChallenge(4)) return;

  cost.buy(max ? Infinity : 1);

  if (RANKS[level].noReset.value) return;
  rankReset(level);

  showQuote(0);
}

export function hasRankReward(level, num) {
  const rank = RANKS[level];
  return rank.cost.amt.value.gte(rank.rewards[num].require);
}

export function rankReward(level, num) {
  return RANKS[level].rewards[num].eff.value;
}

export function rankAuto() {
  for (const [num, rank] of RANKS.entries()) {
    if (
      rank.unlocked.value &&
      rank.autoUnlocked.value &&
      player.options.rankAuto[num]
    )
      rankUp(num, true);
  }
}
