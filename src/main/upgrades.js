import { computed } from "vue";
import { player } from "../core/save";
import {
  formatInteger,
  format,
  formatMult,
  formatPercent,
} from "../core/format";
import { dilate } from "../core/utils";

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
        effDesc: (x) => `+${formatInteger(x)} free Musclers`,
      },
      {
        desc: "Strongers give free Boosters.",
        cost: 10,
        eff: computed(() => player.buildings.mass3),
        effDesc: (x) => `+${formatInteger(x)} free Boosters`,
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
        eff: computed(() => player.buildings.tickspeed.sqrt().floor()),
        effDesc: (x) => `+${formatInteger(x)} free Strongers`,
      },
      {
        desc: "Divide Mass upgrade costs based on Rage Powers.",
        cost: 1e14,
        eff: computed(() => player.rage.power.add(1).log10().add(1).pow(2)),
        effDesc: (x) => `/${format(x)} to Mass upgrade costs`,
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
          () => `Reduce Rank scaling by ${formatPercent(0.2, 0)}.`,
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
        desc: "TBD.",
        cost: Infinity,
      },
      {
        desc: "TBD.",
        cost: Infinity,
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
        eff: computed(() => player.dm.mass.add(1).log10().add(1).pow(2)),
        effDesc: (x) => formatMult(x),
      },
      {
        desc: "Divide the BH Condenser cost based on Mass.",
        cost: 1e45,
        unlocked: computed(() => player.challenge.unlocked),
        eff: computed(() => player.mass.add(1).log10().add(1).pow(2)),
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
        eff: computed(() => dilate(player.dm.darkMatter, 0.5).pow(2)),
        effDesc: (x) => formatMult(x),
      },
      {
        desc: "TBD.",
        cost: Infinity,
      },
      {
        desc: "TBD.",
        cost: Infinity,
      },
      {
        desc: "TBD.",
        cost: Infinity,
      },
      {
        desc: "TBD.",
        cost: Infinity,
      },
      {
        desc: "TBD.",
        cost: Infinity,
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
        // yes the inflation is real
        cost: 5e7,
      },
      {
        desc: "Unlock Tetr, a new type of Rank found in the Mass tab.",
        cost: 1e9,
      },
      {
        desc: "TBD.",
        cost: Infinity,
      },
      {
        desc: "TBD.",
        cost: Infinity,
      },
      {
        desc: "TBD.",
        cost: Infinity,
      },
      {
        desc: "TBD.",
        cost: Infinity,
      },
      {
        desc: "TBD.",
        cost: Infinity,
      },
      {
        desc: "TBD.",
        cost: Infinity,
      },
      {
        desc: "TBD.",
        cost: Infinity,
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
