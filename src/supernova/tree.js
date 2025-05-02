import Decimal from "break_eternity.js";
import { computed, ref } from "vue";
import { player } from "../core/save";
import { format, formatInteger, formatMult } from "../core/format";
import { dilate } from "../core/utils";

export const TREE_SUBTABS = [
  {
    title: "Main",
    ids: [
      ["start"],
      ["s1", "m1", "rp1", "dm1", "sn1"],
      ["", "m2", "", "", "", "", "sn2"],
    ],
  },
];

export const TREE_UPGRADES = {
  start: {
    req: computed(() => player.supernova.count.gte(1)),
    reqDesc: computed(() => `${formatInteger(1)} Supernova`),
    desc: computed(() => `Gain ${format(0.1, 1)} Neutron Star per second`),
    cost: Decimal.dZero,
  },
  s1: {
    branches: ["start"],
    desc: "The last star's gain is boosted by Neutron Star",
    cost: Decimal.dInf,
    eff: computed(() => 1),
    effDesc: (x) => formatMult(x),
  },
  m1: {
    branches: ["start"],
    desc: "Mass gain is boosted by Neutron Star",
    cost: new Decimal(25),
    eff: computed(() => dilate(player.supernova.star.add(1), 4).pow(100)),
    effDesc: (x) => formatMult(x),
  },
  m2: {
    branches: ["m1"],
    desc: computed(() => `Raise Mass gain by ${format(1, 0)}`),
    cost: Decimal.dInf,
  },
  rp1: {
    branches: ["start"],
    desc: "Rage Power gain is boosted by Neutron Star",
    cost: new Decimal(200),
    eff: computed(() => dilate(player.supernova.star.add(1), 4).pow(50)),
    effDesc: (x) => formatMult(x),
  },
  dm1: {
    branches: ["start"],
    desc: "Dark Matter gain is boosted by Neutron Star",
    cost: new Decimal(400),
    eff: computed(() => dilate(player.supernova.star.add(1), 4).pow(25)),
    effDesc: (x) => formatMult(x),
  },
  sn1: {
    branches: ["start"],
    desc: "Neutron Star gain is boosted by Tickspeed",
    cost: new Decimal(10),
    eff: computed(() => player.buildings.tickspeed.add(1).cbrt()),
    effDesc: (x) => formatMult(x),
  },
  sn2: {
    branches: ["sn1"],
    desc: "Neutron Star is boosted by Supernova",
    cost: Decimal.dInf,
    eff: computed(() => 1),
    effDesc: (x) => formatMult(x),
  },
};

export function hasTreeUpgrade(id) {
  return player.supernova.tree.includes(id);
}

export function treeUpgradeEffect(id) {
  return TREE_UPGRADES[id].eff.value;
}

export function canBuyTreeUpgrade(id) {
  const upg = TREE_UPGRADES[id];

  return (
    !hasTreeUpgrade(id) &&
    player.supernova.star.gte(upg.cost) &&
    (upg.req?.value ?? true) &&
    (upg.branches?.every((i) => hasTreeUpgrade(i)) ?? true)
  );
}

export function buyTreeUpgrade(id) {
  if (!canBuyTreeUpgrade(id)) return;
  player.supernova.star = player.supernova.star.sub(TREE_UPGRADES[id].cost);
  player.supernova.tree.push(id);
}

export const selectedTreeTab = ref(0);
export const selectedTreeUpg = ref("");
export const treeTime = ref(0);
