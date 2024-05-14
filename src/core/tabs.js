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
import Stars from "../atom/Stars.vue"
import { player } from "./save";
import { hasElement } from "../atom/elements";

const tabs = [
  {
    name: "Main",
    icon: "pajamas:weight",
    tabs: [
      {
        name: "Mass",
        comp: Mass,
      },
      {
        name: "Black Hole",
        comp: DM,
        class: "dm",
        unlocked: computed(() => player.dm.unlocked),
      },
      {
        name: "Atomic Generator",
        comp: AtomicGenerator,
        class: "atom",
        unlocked: computed(() => player.atom.unlocked),
      },
      {
        name: "Stars",
        comp: Stars,
        class: "supernova",
        unlocked: computed(() => hasElement(35))
      }
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
        unlocked: computed(() => player.challenge.comps[6].gte(16)),
      },
      {
        name: "Mass Dilation",
        comp: MD,
        class: "md",
        unlocked: computed(() => hasElement(20)),
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
