import { computed } from 'vue';
import { player } from '../core/save';
import Decimal from 'break_eternity.js';
import { costScaling, manualCostScaling } from '../core/cost';
import { buildingAmount, resetBuilding } from './buildings';
import {
  format,
  formatInteger,
  formatMult,
  formatPercent,
} from '../core/format';
import { hasUpgrade } from './upgrades';
import { showQuote } from '../core/popups';
import { challengeEffect, inChallenge } from './challenges';

export const RANKS = [
  {
    name: 'Rank',
    unlocked: computed(() => true),
    autoUnlocked: computed(() => hasUpgrade('rp', 4)),
    noReset: computed(() => hasUpgrade('rp', 3)),
    cost: costScaling({
      cost: (a) => {
        let amt = a;
        if (inChallenge(0) && amt.gte(25)) amt = amt.sub(25).mul(2).add(25);
        return amt;
      },
      invert: (a) => {
        let amt = a;
        if (inChallenge(0) && amt.gte(25)) amt = amt.sub(25).div(2).add(25);
        return amt;
      },
      base: 5,
      linear: computed(() => {
        let base = new Decimal(7);
        if (hasRankReward(1, 0)) base = base.pow(0.9);
        if (hasUpgrade('rp', 9)) base = base.pow(0.8);
        base = base.pow(challengeEffect(0));
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
        desc: 'unlock Muscler',
      },
      {
        require: 2,
        desc: computed(
          () =>
            `unlock Booster, and reduce Muscler's scaling by ${formatPercent(
              0.2,
              0
            )}`
        ),
      },
      {
        require: 3,
        desc: computed(
          () =>
            `unlock Stronger, reduce Booster's scaling by ${formatPercent(
              0.2,
              0
            )}, and Muscler boosts itself`
        ),
        eff: computed(() => buildingAmount('mass1').div(20)),
        effDesc: (x) => `+${format(x)}`,
      },
      {
        require: 4,
        desc: computed(
          () => `reduce Stronger's scaling by ${formatPercent(0.1, 0)}`
        ),
      },
      {
        require: 5,
        desc: 'Booster boosts itself',
        eff: computed(() => buildingAmount('mass2').div(40)),
        effDesc: (x) => `+${format(x)}`,
      },
      {
        require: 6,
        desc: 'Ranks boost Mass gain',
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
          () => `divide Mass upgrade costs by ${formatInteger(10)}`
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
          () => `+${formatPercent(0.004, 1)} Tickspeed power per Rank`
        ),
        eff: computed(() => player.ranks[0].mul(0.004)),
        effDesc: (x) => `+${formatPercent(x)}`,
      },
      {
        require: 180,
        desc: 'Boost Rage Power gain based on Rank',
        eff: computed(() => player.ranks[0].pow(2)),
        effDesc: (x) => formatMult(x),
      },
    ],
  },
  {
    name: 'Tier',
    unlocked: computed(() => player.ranks[0].gte(3) || player.ranks[1].gt(0)),
    autoUnlocked: computed(() => hasUpgrade('rp', 5)),
    noReset: computed(() => hasUpgrade('dm', 3)),
    cost: manualCostScaling({
      amt: computed({
        get: () => player.ranks[1],
        set: (v) => (player.ranks[1] = v),
      }),
      res: computed(() => player.ranks[0]),
      spend: false,
      // for some reason it looks strange
      cost: (x) => x.add(2).sqr().round(),
      invert: (x) => x.sqrt().sub(2),
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
          () => `reduce Mass upgrade scalings by ${formatPercent(0.1, 0)}`
        ),
      },
      {
        require: 4,
        desc: computed(
          () => `+${formatPercent(0.075, 1)} Tickspeed power for every Tier`
        ),
        eff: computed(() => player.ranks[1].mul(0.075)),
        effDesc: (x) => `+${formatPercent(x)}`,
      },
      {
        require: 7,
        desc: 'multiply Rage Power gain based on Tiers',
        eff: computed(() => {
          let base = player.ranks[1].pow_base(2);
          if (hasRankReward(1, 5)) base = base.pow(rankReward(1, 5));
          return base;
        }),
        effDesc: (x) => formatMult(x),
      },
      {
        require: 13,
        desc: "Raise Tier 7's reward based on Dark Matter",
        eff: computed(() =>
          player.dm.darkMatter.add(1).log10().add(1).log10().add(1)
        ),
        effDesc: (x) => `^${format(x)}`,
      },
    ],
  },
  {
    name: 'Tetr',
    unlocked: computed(() => hasUpgrade('atom', 2)),
    autoUnlocked: computed(() => false),
    noReset: computed(() => false),
    cost: manualCostScaling({
      amt: computed({
        get: () => player.ranks[2],
        set: (v) => (player.ranks[2] = v),
      }),
      res: computed(() => player.ranks[1]),
      spend: false,
      cost: () => Infinity,
      invert: () => Decimal.dZero,
    }),
    rewards: [],
  },
];

export function rankReset(level) {
  // don't reset itself
  for (let i = 0; i < level; i++) {
    RANKS[i].cost.amt.value = Decimal.dZero;
  }

  player.mass = Decimal.dZero;
  resetBuilding('mass1');
  resetBuilding('mass2');
  resetBuilding('mass3');
}

export function rankUp(level, max) {
  const cost = RANKS[level].cost;
  if (!cost.canAfford.value) return;

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
