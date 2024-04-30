import Decimal from "break_eternity.js";
import { compressToBase64, decompressFromBase64 } from "lz-string";
import { reactive } from "vue";
import { RANKS } from "../main/ranks";
import { BUILDINGS } from "../main/buildings";
import { UPGRADES } from "../main/upgrades";
import { notify } from "./popups";
import { CHALLENGES } from "../main/challenges";
import { PARTICLES } from "../atom/atom";

function defaultStart() {
  return {
    time: 0,
    version: 0.01,
    lastUpdate: Date.now(),
    mass: Decimal.dZero,
    rage: {
      power: Decimal.dZero,
      unlocked: false,
    },
    dm: {
      darkMatter: Decimal.dZero,
      mass: Decimal.dZero,
      unlocked: false,
    },
    atom: {
      atom: Decimal.dZero,
      quark: Decimal.dZero,
      power: Decimal.dZero,
      split: 0,
      ratio: Array(PARTICLES.length).fill(1),
      particles: Array(PARTICLES.length).fill(Decimal.dZero),
      powers: Array(PARTICLES.length).fill(Decimal.dZero),
      elements: [],
      unlocked: false,
    },
    quotes: [],
    options: {
      notation: "sc",
      massDis: 0,
      font: "Verdana",
      offlineProgress: true,
      navHide: [false, false],
      rankRewardSelected: 0,
      // this is probably stupid but I'm following IMR conventions
      upgradeHovered: ["", 0],
      paused: false,
      confirm: {
        rage: true,
        dm: true,
        atom: true,
      },
      buildingAuto: Object.fromEntries(
        Object.keys(BUILDINGS).map((i) => [i, false]),
      ),
      upgradeAuto: Object.fromEntries(
        Object.keys(UPGRADES).map((i) => [i, false]),
      ),
      rankAuto: Array(RANKS.length).fill(false),
    },
    ranks: Array(RANKS.length).fill(Decimal.dZero),
    buildings: Object.fromEntries(
      Object.keys(BUILDINGS).map((i) => [i, Decimal.dZero]),
    ),
    upgrades: Object.fromEntries(Object.keys(UPGRADES).map((i) => [i, []])),
    challenge: {
      comps: Array(CHALLENGES.length).fill(Decimal.dZero),
      active: -1,
      chosen: -1,
      unlocked: false,
    },
  };
}

const cache = new WeakMap();
function nanGuard(obj, name) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      const obj = Reflect.get(target, key, receiver);
      if (
        typeof obj === "object" &&
        obj !== null &&
        !(obj instanceof Decimal)
      ) {
        // I will kill Vue because of this
        if (cache.has(obj)) return cache.get(obj);

        const guard = nanGuard(obj, `${name}.${key}`);
        cache.set(obj, guard);
        return guard;
      }
      return obj;
    },
    set(target, key, value, receiver) {
      const expected = Reflect.get(target, key, receiver);
      const str = `${name}.${key}`;

      if (typeof expected === "number" && value instanceof Decimal)
        throw new Error("Decimal cannot be used as Number: " + str);
      if (expected instanceof Decimal && typeof value === "number")
        throw new Error("Number cannot be used as Decimal: " + str);

      if (
        (typeof value === "number" || value instanceof Decimal) &&
        Decimal.isNaN(value)
      ) {
        notify(`Game NaNed because of <b>${str}</b>`);
        // Don't crash the game because this could happen really often
        console.error("Bad NaN value: " + str);
        return true;
      }

      return Reflect.set(target, key, value, receiver);
    },
  });
}

export const player = reactive(nanGuard(defaultStart(), "player"));

export function hardReset() {
  // teeheehee
  Object.assign(player, defaultStart());
  save();
}

export function compress() {
  return compressToBase64(JSON.stringify(player));
}

function decimalize(obj, orig) {
  for (const key of Object.keys(orig)) {
    const item = obj[key];
    const other = orig[key];
    if (item === undefined) obj[key] = other;
    if (other instanceof Decimal) obj[key] = new Decimal(item);
    else if (typeof item === "object" && item !== null) decimalize(item, other);
  }
}

export function load(str) {
  try {
    const result = JSON.parse(decompressFromBase64(str));
    decimalize(result, defaultStart());
    Object.assign(player, result);
    save();
  } catch (e) {
    // don't panic on invalid saves
    console.error(e);
  }
}

const SAVE_KEY = "save";
export function save() {
  localStorage.setItem(SAVE_KEY, compress());
  notify("Game Saved");
}

export function loadStorage() {
  const str = localStorage.getItem(SAVE_KEY);
  if (str === null) return;
  load(str);
}

export function startAutoSave() {
  setInterval(save, 60000);
}
