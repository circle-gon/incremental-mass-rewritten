import { computed, reactive } from "vue";
import Mass from "../main/Mass.vue";
import Options from "../options/Options.vue";
import RankRewards from "../main/RankRewards.vue";
import Upgrades from "../main/Upgrades.vue";
import Challenges from "../main/Challenges.vue";
import DM from "../main/DM.vue";
import AtomicGenerator from "../atom/AtomicGenerator.vue";
import Particles from "../atom/Particles.vue";
import Elements from "../atom/Elements.vue";
import MD from "../atom/MD.vue";
import Stars from "../atom/Stars.vue";
import Tree from "../supernova/Tree.vue";
import ResourceHider from "../options/ResourceHider.vue"
import { player } from "./save";
import {
  hasElement,
  ELEMENT_UPGRADES,
  canBuyElement,
  elementsUnlocked,
} from "../atom/elements";
import { STARS } from "../atom/stars";
import { BUILDINGS } from "../main/buildings";
import { RANKS } from "../main/ranks";
import { UPGRADES, canBuyUpgrade } from "../main/upgrades";
import { inChallenge, CHALLENGES } from "../main/challenges";
import { MASS_DILATION } from "../atom/md";

function shouldBuyBuilding(id) {
  const building = BUILDINGS[id];

  return (
    building.unlocked.value &&
    (building.purchasable?.value ?? true) &&
    !(building.autoUnlocked.value && player.options.buildingAuto[id])
  );
}

const tabs = [
  {
    name: "Main",
    icon: "pajamas:weight",
    tabs: [
      {
        name: "Mass",
        comp: Mass,
        notify: computed(() => {
          const buyRank =
            !inChallenge(4) &&
            RANKS.some(
              (rank, idx) =>
                rank.cost.canAfford.value &&
                rank.unlocked.value &&
                !(rank.autoUnlocked.value && player.options.rankAuto[idx]),
            );

          const buyBuilding = ["mass1", "mass2", "mass3", "tickspeed"].some(
            (i) => shouldBuyBuilding(i),
          );

          return buyRank || buyBuilding;
        }),
      },
      {
        name: "Black Hole",
        comp: DM,
        class: "dm",
        unlocked: computed(() => player.dm.unlocked),
        notify: computed(() => shouldBuyBuilding("bhc")),
      },
      {
        name: "Atomic Generator",
        comp: AtomicGenerator,
        class: "atom",
        unlocked: computed(() => player.atom.unlocked),
        notify: computed(() => shouldBuyBuilding("cosmic")),
      },
      {
        name: "Stars",
        comp: Stars,
        class: "supernova",
        unlocked: computed(() => STARS.unlocked.value),
        notify: computed(() => player.atom.quark.gte(STARS.nextAt.value)),
      },
    ],
  },
  {
    name: "Stats",
    icon: "material-symbols:query-stats",
    tabs: [
      {
        name: "Rank Rewards",
        comp: RankRewards,
      },
    ],
  },
  {
    name: "Upgrades",
    icon: "carbon:upgrade",
    unlocked: computed(() => player.rage.unlocked),
    tabs: [
      {
        name: "Main Upgrades",
        comp: Upgrades,
        notify: computed(() => {
          for (const [name, upg] of Object.entries(UPGRADES)) {
            if (
              upg.unlocked.value &&
              !(upg.autoUnlocked.value && player.options.upgradeAuto[name])
            ) {
              for (const [num, upgrade] of upg.upgrades.entries()) {
                if (
                  (upgrade.unlocked?.value ?? true) &&
                  canBuyUpgrade(name, num)
                )
                  return true;
              }
            }
          }
          return false;
        }),
      },
    ],
  },
  {
    name: "Challenges",
    icon: "material-symbols:star",
    unlocked: computed(() => player.challenge.unlocked),
    tabs: [
      {
        name: "Challenges",
        comp: Challenges,
        notify: computed(
          () =>
            player.challenge.active !== -1 &&
            CHALLENGES[player.challenge.active].cost.canAfford.value,
        ),
      },
    ],
  },
  {
    name: "Atom",
    icon: "eos-icons:atom-electron",
    unlocked: computed(() => player.atom.unlocked),
    color: "cyan",
    class: "atom",
    tabs: [
      {
        name: "Particles",
        comp: Particles,
      },
      {
        name: "Elements",
        comp: Elements,
        unlocked: computed(
          () => player.challenge.comps[6].gte(16) || player.supernova.unlocked,
        ),
        notify: computed(() =>
          ELEMENT_UPGRADES.some(
            (_, i) => i < elementsUnlocked.value && canBuyElement(i),
          ),
        ),
      },
      {
        name: "Mass Dilation",
        comp: MD,
        class: "md",
        unlocked: computed(() => hasElement(20)),
        notify: computed(
          () =>
            (MASS_DILATION.upgrades.some((_, i) => MASS_DILATION.canBuy(i)) &&
              !hasElement(42)) ||
            (player.md.active && MASS_DILATION.rpGain.value.gt(0)),
        ),
      },
    ],
  },
  {
    name: "Supernova",
    icon: "material-symbols:explosion-outline",
    color: "magenta",
    unlocked: computed(() => player.supernova.unlocked),
    class: "supernova",
    tabs: [
      {
        name: "Neutron Tree",
        comp: Tree,
      },
    ],
  },
  {
    name: "Options",
    icon: "mdi:gear",
    tabs: [
      {
        name: "Options",
        comp: Options,
      },
      {
        name: "Resource Hider",
        comp: ResourceHider
      }
    ],
  },
];

export const selectedTab = reactive({
  tab: 0,
  subtabs: Array(tabs.length).fill(0),
});

export const width = computed(() => {
  let w = 450;
  if (player.options.navHide[0]) w -= 198;
  if (player.options.navHide[1]) w -= 248;

  return {
    width: `calc(100% - ${w}px)`,
  };
});

export default tabs;
