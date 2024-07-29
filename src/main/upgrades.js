import { computed } from "vue";
import { player } from "../core/save";
import {
  formatInteger,
  format,
  formatMult,
  formatPercent,
} from "../core/format";
import { dilate } from "../core/utils";
import { elementEffect, hasElement } from "../atom/elements";

export const UPGRADES = {
  rp: {
    title: "Rage Upgrades",
    resourceName: "Rage Power",
    resource: computed({
      get: () => player.rage.power,
      set: (v) => (player.rage.power = v),
    }),
    unlocked: computed(() => player.rage.unlocked),
    autoUnlocked: computed(() => hasUpgrade("dm", 4)),
    upgrades: [
      {
        desc: "Boosters give free Musclers.",
        cost: 1,
        eff: computed(() => player.buildings.mass2),
        effDesc: (x) => `+${formatInteger(x)}`,
      },
      {
        desc: "Strongers give free Boosters.",
        cost: 10,
        eff: computed(() => player.buildings.mass3),
        effDesc: (x) => `+${formatInteger(x)}`,
      },
      {
        desc: "Auto-buy Mass upgrades.",
        cost: 25,
      },
      {
        desc: "Ranks no longer reset anything.",
        cost: 100,
      },
      {
        desc: "Auto-buy Ranks.",
        cost: 1e3,
      },
      {
        desc: "Auto-buy Tiers.",
        cost: 1e4,
      },
      {
        desc: "Tickspeeds give free Strongers.",
        cost: 1e5,
        eff: computed(() => {
          let free = player.buildings.tickspeed.sqrt().floor();
          if (hasElement(37)) free = free.add(elementEffect(37));
          return free;
        }),
        effDesc: (x) => `+${formatInteger(x)}`,
      },
      {
        desc: "Divide Mass upgrade costs based on Rage Powers.",
        cost: 1e14,
        eff: computed(() => player.rage.power.add(1).log10().add(1).sqr()),
        effDesc: (x) => `/${format(x)}`,
      },
      {
        desc: computed(
          () => `Stronger's power is increased to ${format(0.25, 2)}.`,
        ),
        cost: 1e40,
        unlocked: computed(() => player.dm.unlocked),
      },
      {
        desc: computed(
          () => `Reduce Rank linear scaling by ${formatPercent(0.2, 0)}.`,
        ),
        cost: 1e80,
        unlocked: computed(() => player.dm.unlocked),
      },
      {
        desc: "Black Hole mass gain is boosted by Rage Powers.",
        cost: "1e310",
        unlocked: computed(() => player.challenge.unlocked),
        // todo: probably use dilate instead
        eff: computed(() => player.rage.power.add(1).log10().add(1).pow(4)),
        effDesc: (x) => formatMult(x),
      },
      {
        desc: "Increase Stronger power based on Rage Power.",
        // just had to
        cost: "6.9e420",
        unlocked: computed(() => player.challenge.unlocked),
        eff: computed(() =>
          dilate(player.rage.power.add(1).log10(), 1 / 3).div(457.4),
        ),
        effDesc: (x) => `+${format(x)}`,
      },
      {
        desc: "Multiply Mass gain based on Rank.",
        cost: "1e560",
        unlocked: computed(() => player.challenge.unlocked),
        eff: computed(() => player.ranks[0].pow(0.85).pow_base(2)),
        effDesc: (x) => formatMult(x),
      },
      {
        desc: "Subtract effective Tickspeed amount in the cost formula by 50.",
        cost: "1e880",
        unlocked: computed(() => player.atom.unlocked),
      },
      {
        desc: "Atom gain is boosted by Mass.",
        cost: "1e1045",
        unlocked: computed(() => player.atom.unlocked),
        eff: computed(() => player.mass.add(1).log10().add(1).sqrt()),
        effDesc: (x) => formatMult(x),
      },
    ],
  },
  dm: {
    title: "Dark Matter Upgrades",
    resourceName: "Dark Matter",
    resource: computed({
      get: () => player.dm.darkMatter,
      set: (v) => (player.dm.darkMatter = v),
    }),
    unlocked: computed(() => player.dm.unlocked),
    autoUnlocked: computed(() => hasUpgrade("atom", 1)),
    upgrades: [
      {
        desc: "Mass upgrades no longer spend Mass.",
        cost: 1,
      },
      {
        desc: "Tickspeeds boost BH Condenser power.",
        cost: 5,
        eff: computed(() => player.buildings.tickspeed.add(1).root(8)),
        effDesc: (x) => formatMult(x),
      },
      {
        desc: `Divide Mass upgrade costs based on Black Hole's mass.`,
        cost: 10,
        eff: computed(() => player.dm.mass.add(1).log10().add(1).pow(4)),
        effDesc: (x) => `/${format(x)}`,
      },
      {
        desc: "Tiers no longer reset anything.",
        cost: 100,
      },
      {
        desc: "Auto-buy Tickspeed and Rage Power upgrades.",
        cost: 10000,
      },
      {
        desc: computed(
          () =>
            `Gain ${formatPercent(
              1,
              0,
            )} of Rage Power gained from reset per second. Rage Powers gain is boosted by Black Hole's mass.`,
        ),
        cost: 5e12,
        // todo: probably use dilate instead
        eff: computed(() => player.dm.mass.add(1).log10().add(1).sqr()),
        effDesc: (x) => formatMult(x),
      },
      {
        desc: "Divide BH Condenser cost based on Mass.",
        cost: 1e45,
        unlocked: computed(() => player.challenge.unlocked),
        eff: computed(() => player.mass.add(1).log10().add(1).sqr()),
        effDesc: (x) => `/${format(x)}`,
      },
      {
        desc: computed(() => `Raise Rage Power gain by ${format(1.15, 2)}.`),
        cost: 1e51,
        unlocked: computed(() => player.challenge.unlocked),
      },
      {
        desc: `Increase Stronger's effect based on Dark Matter.`,
        cost: 1e75,
        unlocked: computed(() => player.challenge.unlocked),
        eff: computed(() =>
          // 0.4 is probably not nessecary but go away inflation
          player.dm.darkMatter.add(1).log10().add(1).pow(0.4).sub(1).mul(2),
        ),
        effDesc: (x) => `+${format(x)}`,
      },
      {
        desc: "Multiply Mass gain based on Dark Matter.",
        cost: 1.11e111,
        unlocked: computed(() => player.challenge.unlocked),
        eff: computed(() => dilate(player.dm.darkMatter.add(1), 0.5).sqr()),
        effDesc: (x) => formatMult(x),
      },
      {
        desc: computed(() => `Raise Mass upgrade costs by ${format(0.98, 2)}.`),
        cost: 1e240,
        unlocked: computed(() => player.atom.unlocked),
      },
      {
        desc: computed(
          () =>
            `Raise Mass upgrade and Tickspeed costs by ${format(0.985, 3)}.`,
        ),
        cost: 1e255,
        unlocked: computed(() => player.atom.unlocked),
      },
      {
        desc: "Quark gain is multiplied by 10.",
        cost: 1e285,
        unlocked: computed(() => player.atom.unlocked),
      },
      {
        desc: "Black Hole's mass gain is boosted by Neutron Power.",
        cost: "1e335",
        unlocked: computed(() => player.atom.unlocked),
        // INFLATION
        eff: computed(() => dilate(player.atom.powers[2].add(1), 0.5).pow(4)),
        effDesc: (x) => formatMult(x),
      },
      {
        desc: "Atomic Power gives free Black Hole Condensers.",
        cost: "1e385",
        unlocked: computed(() => player.atom.unlocked),
        eff: computed(() => player.atom.power.add(1).log10().floor()),
        effDesc: (x) => `+${formatInteger(x)}`,
      },
    ],
  },
  atom: {
    title: "Atom Upgrades",
    resourceName: "Atom",
    resource: computed({
      get: () => player.atom.atom,
      set: (v) => (player.atom.atom = v),
    }),
    unlocked: computed(() => player.atom.unlocked),
    autoUnlocked: computed(() => false),
    upgrades: [
      {
        desc: "Mass upgrades are always unlocked.",
        cost: 1,
      },
      {
        desc: "Auto-buy BH Condensers and Dark Matter upgrades. Tickspeed no longer spend Rage Power.",
        cost: 5000,
      },
      {
        desc: "Unlock Tetr, a new type of Rank found in the Mass tab.",
        cost: 20000,
      },
      {
        desc: "Keep challenge 1-4 completions on an Atom reset. Cosmic Ray power is boosted by BH Condensers.",
        cost: 1e6,
        eff: computed(() => player.buildings.bhc.root(3).mul(0.2)),
        effDesc: (x) => `+${format(x)}`,
      },
      {
        desc: computed(
          () => `Auto-buy Tetr. Tier scales ${formatPercent(0.14, 0)} slower.`,
        ),
        cost: 1e11,
      },
      {
        desc: computed(
          () =>
            `Gain ${formatPercent(1, 0)} of Dark Matter and Rage Power gained from reset per second. Divide BH Condenser cost based on Atomic Power.`,
        ),
        cost: 1e14,
        eff: computed(() =>
          player.atom.power.add(1).log10().mul(5).add(1).pow(5),
        ),
        effDesc: (x) => `/${format(x)}`,
      },
      {
        desc: "Particle powers gain is boosted by Tickspeed.",
        cost: 1e18,
        eff: computed(() => player.buildings.tickspeed.pow_base(1.01)),
        effDesc: (x) => formatMult(x),
      },
      {
        desc: "Atomic Power boosts Quark gain.",
        cost: 1e28,
        eff: computed(() => player.atom.power.add(1).log10().add(1)),
        effDesc: (x) => formatMult(x),
      },
      {
        desc: computed(
          () => `Stronger's power is increased by ${format(0.05, 2)}.`,
        ),
        cost: 1e45,
      },
      {
        desc: computed(
          () =>
            `The Tier requirement is reduced by ${formatPercent(0.3, 0)}. Divide the Rank requirement based on Tier.`,
        ),
        cost: 1e52,
        eff: computed(() => player.ranks[1].pow10()),
        effDesc: (x) => `/${format(x)}`,
      },
      {
        desc: "BH Condenser and Cosmic Ray power is boosted by Dilated Mass.",
        cost: "1e1460",
        eff: computed(() =>
          player.md.mass.add(1).log10().add(1).root(4).sub(1).div(20).add(1),
        ),
        effDesc: (x) => formatMult(x),
      },
      {
        desc: "Black Hole's effect is stronger.",
        cost: "1e2280",
      },
    ],
  },
};

export function hasUpgrade(id, num) {
  return player.upgrades[id].includes(num);
}

export function upgradeEffect(id, num) {
  return UPGRADES[id].upgrades[num].eff.value;
}

export function canBuyUpgrade(id, num) {
  const cat = UPGRADES[id];
  return !hasUpgrade(id, num) && cat.resource.value.gte(cat.upgrades[num].cost);
}

export function buyUpgrade(id, num) {
  const cat = UPGRADES[id];
  const res = cat.resource;

  if (!canBuyUpgrade(id, num)) return;

  res.value = res.value.sub(cat.upgrades[num].cost);
  player.upgrades[id].push(num);
}

export function resetUpgrades(id, keep) {
  player.upgrades[id] = player.upgrades[id].filter((i) => keep.includes(i));
}

export function upgradeAuto() {
  for (const [name, upg] of Object.entries(UPGRADES)) {
    if (
      upg.unlocked.value &&
      upg.autoUnlocked.value &&
      player.options.upgradeAuto[name]
    ) {
      for (const [num, upgrade] of upg.upgrades.entries()) {
        if (upgrade.unlocked?.value ?? true) {
          buyUpgrade(name, num);
        }
      }
    }
  }
}
