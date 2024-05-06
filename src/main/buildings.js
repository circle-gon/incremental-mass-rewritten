import { computed } from "vue";
import { hasRankReward, rankReward } from "./ranks";
import { costScaling } from "../core/cost";
import {
  format,
  formatInteger,
  formatMass,
  formatMult,
  formatPercent,
} from "../core/format";
import Decimal from "break_eternity.js";
import { hasUpgrade, upgradeEffect } from "./upgrades";
import { player } from "../core/save";
import { challengeEffect, inChallenge } from "./challenges";
import { atomicPowerEffect, powerEffect } from "../atom/atom";
import { elementEffect, hasElement } from "../atom/elements";
import { MASS_DILATION } from "../atom/md";

function upgrade(result) {
  return {
    ...result,
    effect: computed(() => {
      const amt =
        result.unlocked.value && (result.purchasable?.value ?? true)
          ? result.cost.amt.value.add(result.bonus?.value ?? 0)
          : Decimal.dZero;
      return result.effect(amt);
    }),
  };
}

export const BUILDINGS = {
  mass1: upgrade({
    name: "Muscler",
    unlocked: computed(() => hasRankReward(0, 0) || hasUpgrade("atom", 0)),
    autoUnlocked: computed(() => hasUpgrade("rp", 2)),
    cost: costScaling({
      amtScale: (a) => {
        let amt = a;
        if (inChallenge(0) && amt.gte(25)) amt = amt.sub(25).mul(2).add(25);
        return amt;
      },
      amtInvert: (a) => {
        let amt = a;
        if (inChallenge(0) && amt.gte(25)) amt = amt.sub(25).div(2).add(25);
        return amt;
      },
      costScale: (c) => {
        let cost = c;
        if (hasUpgrade("dm", 10)) cost = cost.pow(0.98);
        if (hasUpgrade("dm", 11)) cost = cost.pow(0.985);
        return cost;
      },
      costInvert: (c) => {
        let cost = c;
        if (hasUpgrade("dm", 10)) cost = cost.root(0.98);
        if (hasUpgrade("dm", 11)) cost = cost.root(0.985);
        return cost;
      },
      base: computed(() => {
        let base = Decimal.dOne;
        if (hasRankReward(0, 7)) base = base.div(10);
        if (hasUpgrade("rp", 7)) base = base.div(upgradeEffect("rp", 7));
        if (hasUpgrade("dm", 2)) base = base.div(upgradeEffect("dm", 2));
        return base;
      }),
      linear: computed(() => {
        let base = 2;
        if (hasRankReward(0, 1)) base **= 0.8;
        if (hasRankReward(1, 2)) base **= 0.9;
        return base;
      }),
      quad: 1,
      amt: computed({
        get: () => player.buildings.mass1,
        set: (v) => (player.buildings.mass1 = v),
      }),
      res: computed({
        get: () => player.mass,
        set: (v) => (player.mass = v),
      }),
      spend: computed(() => !hasUpgrade("dm", 0)),
    }),
    bonus: computed(() => {
      let bonus = Decimal.dZero;
      if (hasUpgrade("rp", 0)) bonus = bonus.add(upgradeEffect("rp", 0));
      return bonus;
    }),
    formatCost: (x) => formatMass(x),
    formatPower: (x) => `+${formatMass(x)}`,
    formatEffect: (x) => `+${formatMass(x)} to mass gain`,
    effect(amt) {
      let power = Decimal.dOne;
      if (hasRankReward(0, 2)) power = power.add(rankReward(0, 2));
      power = power.mul(buildingEffect("mass2"));

      return {
        power,
        effect: power.mul(amt),
      };
    },
  }),
  mass2: upgrade({
    name: "Booster",
    unlocked: computed(() => hasRankReward(0, 1) || hasUpgrade("atom", 0)),
    autoUnlocked: computed(() => hasUpgrade("rp", 2)),
    cost: costScaling({
      amtScale: (a) => {
        let amt = a;
        if (inChallenge(0) && amt.gte(25)) amt = amt.sub(25).mul(2).add(25);
        return amt;
      },
      amtInvert: (a) => {
        let amt = a;
        if (inChallenge(0) && amt.gte(25)) amt = amt.sub(25).div(2).add(25);
        return amt;
      },
      costScale: (c) => {
        let cost = c;
        if (hasUpgrade("dm", 10)) cost = cost.pow(0.98);
        if (hasUpgrade("dm", 11)) cost = cost.pow(0.985);
        return cost;
      },
      costInvert: (c) => {
        let cost = c;
        if (hasUpgrade("dm", 10)) cost = cost.root(0.98);
        if (hasUpgrade("dm", 11)) cost = cost.root(0.985);
        return cost;
      },
      base: computed(() => {
        let base = new Decimal(5);
        if (hasRankReward(0, 7)) base = base.div(10);
        if (hasUpgrade("rp", 7)) base = base.div(upgradeEffect("rp", 7));
        if (hasUpgrade("dm", 2)) base = base.div(upgradeEffect("dm", 2));
        return base;
      }),
      linear: computed(() => {
        let base = 4;
        if (hasRankReward(0, 2)) base **= 0.8;
        if (hasRankReward(1, 2)) base **= 0.9;
        return base;
      }),
      quad: 1,
      amt: computed({
        get: () => player.buildings.mass2,
        set: (v) => (player.buildings.mass2 = v),
      }),
      res: computed({
        get: () => player.mass,
        set: (v) => (player.mass = v),
      }),
      spend: computed(() => !hasUpgrade("dm", 0)),
    }),
    bonus: computed(() => {
      let bonus = Decimal.dZero;
      if (hasUpgrade("rp", 1)) bonus = bonus.add(upgradeEffect("rp", 1));
      return bonus;
    }),
    formatCost: (x) => formatMass(x),
    formatPower: (x) => `+${formatMult(x)}`,
    formatEffect: (x) => `${formatMult(x)} to Muscler Power`,
    effect(amt) {
      let power = Decimal.dTwo;
      if (hasRankReward(0, 4)) power = power.add(rankReward(0, 4));
      power = power.pow(buildingEffect("mass3"));

      return {
        power,
        effect: power.mul(amt).add(1),
      };
    },
  }),
  mass3: upgrade({
    name: "Stronger",
    unlocked: computed(() => hasRankReward(0, 2) || hasUpgrade("atom", 0)),
    autoUnlocked: computed(() => hasUpgrade("rp", 2)),
    cost: costScaling({
      amtScale: (a) => {
        let amt = a;
        if (inChallenge(0) && amt.gte(25)) amt = amt.sub(25).mul(2).add(25);
        return amt;
      },
      amtInvert: (a) => {
        let amt = a;
        if (inChallenge(0) && amt.gte(25)) amt = amt.sub(25).div(2).add(25);
        return amt;
      },
      costScale: (c) => {
        let cost = c;
        if (hasUpgrade("dm", 10)) cost = cost.pow(0.98);
        if (hasUpgrade("dm", 11)) cost = cost.pow(0.985);
        return cost;
      },
      costInvert: (c) => {
        let cost = c;
        if (hasUpgrade("dm", 10)) cost = cost.root(0.98);
        if (hasUpgrade("dm", 11)) cost = cost.root(0.985);
        return cost;
      },
      base: computed(() => {
        let base = new Decimal(100);
        if (hasRankReward(0, 7)) base = base.div(10);
        if (hasUpgrade("rp", 7)) base = base.div(upgradeEffect("rp", 7));
        if (hasUpgrade("dm", 2)) base = base.div(upgradeEffect("dm", 2));
        return base;
      }),
      linear: computed(() => {
        let base = 10;
        if (hasRankReward(0, 3)) base **= 0.9;
        if (hasRankReward(1, 2)) base **= 0.9;
        return base;
      }),
      quad: 1.05,
      amt: computed({
        get: () => player.buildings.mass3,
        set: (v) => (player.buildings.mass3 = v),
      }),
      res: computed({
        get: () => player.mass,
        set: (v) => (player.mass = v),
      }),
      spend: computed(() => !hasUpgrade("dm", 0)),
    }),
    bonus: computed(() => {
      let bonus = Decimal.dZero;
      if (hasUpgrade("rp", 6)) bonus = bonus.add(upgradeEffect("rp", 6));
      return bonus;
    }),
    formatCost: (x) => formatMass(x),
    formatPower: (x) => `+^${format(x)}`,
    formatEffect: (x) => `^${format(x)} to Booster Power`,
    effect(amt) {
      let power = Decimal.dOne;
      if (hasRankReward(0, 9)) power = power.add(0.1);
      if (hasUpgrade("rp", 8)) power = power.add(0.15);
      if (hasUpgrade("rp", 11)) power = power.add(upgradeEffect("rp", 11));
      if (hasRankReward(2, 1)) power = power.add(rankReward(2, 1));
      if (hasUpgrade("atom", 8)) power = power.add(0.05);
      if (hasRankReward(1, 6)) power = power.add(0.05);
      if (hasElement(3)) power = power.mul(elementEffect(3));
      if (player.md.upgrades[3].gte(1)) power = power.mul(MASS_DILATION.effect(3))

      let effect = power.mul(amt).add(1);
      if (hasUpgrade("dm", 8)) effect = effect.add(upgradeEffect("dm", 8));

      return {
        power,
        effect,
      };
    },
  }),
  tickspeed: upgrade({
    name: "Tickspeed",
    unlocked: computed(() => player.rage.unlocked),
    purchasable: computed(() => !inChallenge(1)),
    autoUnlocked: computed(() => hasUpgrade("dm", 4)),
    cost: costScaling({
      amtScale: (a) => {
        let amt = a;
        if (hasElement(7)) amt = amt.div(challengeEffect(0).amount);
        if (hasRankReward(2, 4)) amt = amt.div(rankReward(2, 4));
        if (inChallenge(5)) amt = amt.mul(5);
        if (hasUpgrade("rp", 13)) amt = amt.sub(50);
        if (inChallenge(0) && amt.gte(25)) amt = amt.sub(25).mul(2).add(25);
        return amt;
      },
      amtInvert: (a) => {
        let amt = a;
        if (inChallenge(0) && amt.gte(25)) amt = amt.sub(25).div(2).add(25);
        if (hasUpgrade("rp", 13)) amt = amt.add(50);
        if (inChallenge(5)) amt = amt.div(5);
        if (hasRankReward(2, 4)) amt = amt.mul(rankReward(2, 4));
        if (hasElement(7)) amt = amt.mul(challengeEffect(0).amount);
        return amt;
      },
      costScale: (c) => {
        let cost = c;
        if (hasUpgrade("dm", 11)) cost = cost.pow(0.985);
        return cost;
      },
      costInvert: (c) => {
        let cost = c;
        if (hasUpgrade("dm", 11)) cost = cost.root(0.985);
        return cost;
      },
      base: 1,
      linear: computed(() => {
        let base = Decimal.dTwo;
        base = base.pow(challengeEffect(0).linear);
        return base;
      }),
      quad: 1.015,
      amt: computed({
        get: () => player.buildings.tickspeed,
        set: (v) => (player.buildings.tickspeed = v),
      }),
      res: computed({
        get: () => player.rage.power,
        set: (v) => (player.rage.power = v),
      }),
      spend: computed(() => !hasUpgrade("atom", 1)),
    }),
    bonus: computed(() => {
      let bonus = Decimal.dZero;
      bonus = bonus.add(atomicPowerEffect.value);
      return bonus;
    }),
    formatCost: (x) => `${formatInteger(x)} Rage Power`,
    formatPower: (x) => (x.gte(10) ? formatMult(x) : formatPercent(x.sub(1))),
    formatEffect: (x) => `${formatMult(x)} to mass gain`,
    effect(amt) {
      let power = new Decimal(1.5);
      if (hasRankReward(1, 3)) power = power.add(rankReward(1, 3));
      if (hasRankReward(0, 10)) power = power.add(rankReward(0, 10));
      power = power.add(challengeEffect(1));
      power = power.add(powerEffect(0, 1));
      power = power.add(challengeEffect(5).tickspeed);
      power = power.mul(MASS_DILATION.dilatedMassEffect.value)

      let effect = power.pow(amt);
      if (hasRankReward(2, 2)) effect = effect.pow(1.05);
      if (hasElement(17)) effect = effect.pow(elementEffect(17));

      return {
        power,
        effect,
      };
    },
  }),
  bhc: upgrade({
    name: "Black Hole Condenser",
    unlocked: computed(() => player.dm.unlocked),
    autoUnlocked: computed(() => hasUpgrade("atom", 1)),
    cost: costScaling({
      amtScale: (a) => {
        let amt = a;
        if (inChallenge(5)) amt = amt.mul(5);
        if (hasElement(14)) amt = amt.mul(0.95);
        return amt;
      },
      amtInvert: (a) => {
        let amt = a;
        if (inChallenge(5)) amt = amt.div(5);
        if (hasElement(14)) amt = amt.div(0.95);
        return amt;
      },
      base: computed(() => {
        let base = Decimal.dOne;
        if (hasUpgrade("dm", 6)) base = base.div(upgradeEffect("dm", 6));
        if (hasUpgrade("atom", 5)) base = base.div(upgradeEffect("atom", 5));
        return base;
      }),
      linear: 2,
      quad: 1.015,
      amt: computed({
        get: () => player.buildings.bhc,
        set: (v) => (player.buildings.bhc = v),
      }),
      res: computed({
        get: () => player.dm.darkMatter,
        set: (v) => (player.dm.darkMatter = v),
      }),
      spend: true,
    }),
    bonus: computed(() => {
      let bonus = Decimal.dZero;
      if (hasUpgrade("dm", 14)) bonus = bonus.add(upgradeEffect("dm", 14));
      return bonus;
    }),
    formatCost: (x) => `${formatInteger(x)} Dark Matter`,
    formatPower: (x) => formatMult(x),
    formatEffect: (x) => `${formatMult(x)} to Black Hole's mass gain`,
    effect(amt) {
      const better = hasElement(1) && !(inChallenge(1) || inChallenge(6));
      let power = Decimal.dTwo;
      power = power.add(powerEffect(2, 1));
      if (better) power = power.add(challengeEffect(5).bhc);
      if (hasUpgrade("dm", 1)) power = power.mul(upgradeEffect("dm", 1));
      if (!better) power = power.add(challengeEffect(5).bhc);

      return {
        power,
        effect: power.pow(amt),
      };
    },
  }),
  cosmic: upgrade({
    name: "Cosmic Ray",
    unlocked: computed(() => player.atom.unlocked),
    autoUnlocked: computed(() => hasElement(17)),
    cost: costScaling({
      amtScale: (a) => {
        let amt = a;
        if (hasElement(14)) amt = amt.mul(0.95);
        return amt;
      },
      amtInvert: (a) => {
        let amt = a;
        if (hasElement(14)) amt = amt.div(0.95);
        return amt;
      },
      base: computed(() => {
        let base = Decimal.dOne;
        return base;
      }),
      linear: 2,
      quad: 1.015,
      amt: computed({
        get: () => player.buildings.cosmic,
        set: (v) => (player.buildings.cosmic = v),
      }),
      res: computed({
        get: () => player.atom.atom,
        set: (v) => (player.atom.atom = v),
      }),
      spend: true,
    }),
    formatCost: (x) => `${formatInteger(x)} Atom`,
    formatPower: (x) => formatMult(x),
    formatEffect: (x) => `${formatMult(x)} to Atomic Power gain`,
    effect(amt) {
      let power = Decimal.dTwo;
      if (hasUpgrade("atom", 3)) power = power.add(upgradeEffect("atom", 3));

      return {
        power,
        effect: power.pow(amt).sub(1),
      };
    },
  }),
};

export function buyBuilding(name, max) {
  const building = BUILDINGS[name];

  if (!(building.purchasable?.value ?? true)) return;

  building.cost.buy(max ? Infinity : 1);
}

export function buildingAmount(name) {
  return BUILDINGS[name].cost.amt.value;
}

export function buildingEffect(name) {
  return BUILDINGS[name].effect.value.effect;
}

export function resetBuilding(name) {
  BUILDINGS[name].cost.amt.value = Decimal.dZero;
}

export function buildingAuto() {
  for (const [name, building] of Object.entries(BUILDINGS)) {
    if (
      building.unlocked.value &&
      (building.purchasable?.value ?? true) &&
      building.autoUnlocked.value &&
      player.options.buildingAuto[name]
    ) {
      building.cost.buy(Infinity);
    }
  }
}
