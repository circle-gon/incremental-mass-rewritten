import { computed, createApp, watchEffect } from "vue";
import { loadStorage, player, startAutoSave, save } from "./core/save";
import { TICKS, TPS, supernovaTime } from "./core/utils";
import { massGain } from "./main/mass";
import { buildingAuto } from "./main/buildings";
import { hasUpgrade, upgradeAuto } from "./main/upgrades";
import { rankAuto } from "./main/ranks";
import { bhGain, darkMatterGain } from "./main/dm";
import { ragePowerGain } from "./main/rage";
import {
  PARTICLES,
  atomGain,
  atomicPowerGain,
  powerGain,
  quarkGain,
} from "./atom/atom";
import { elementEffect, hasElement } from "./atom/elements";
import { MASS_DILATION } from "./atom/md";
import { STARS } from "./atom/stars";
import {
  canSupernovaReset,
  supernovaRequirement,
  supernovaReset,
} from "./supernova/supernova";
import { notify, showPopup } from "./core/popups";
import { runOfflineProgress } from "./core/offline";
import Decimal from "break_eternity.js";
import App from "./App.vue";

// Always place after App.vue so that way its styles take priority
import "./style.css";

let paused = false;

const reachedEnd = computed(() => player.supernova.count.gte(1));

export function tick(diff) {
  if (!paused) {
    player.time += diff;
    player.mass = massGain.value.mul(diff).add(player.mass);

    if (player.dm.unlocked)
      player.dm.mass = bhGain.value.mul(diff).add(player.dm.mass);
    if (hasUpgrade("dm", 5) || hasUpgrade("atom", 5))
      player.rage.power = ragePowerGain.value.mul(diff).add(player.rage.power);
    if (player.ranks[0].gte(175)) player.challenge.unlocked = true;
    if (player.atom.unlocked) {
      for (let i = 0; i < PARTICLES.length; i++)
        player.atom.powers[i] = powerGain(i)
          .mul(diff)
          .add(player.atom.powers[i]);
      player.atom.power = atomicPowerGain.value
        .mul(diff)
        .add(player.atom.power);
    }
    if (hasUpgrade("atom", 5))
      player.dm.darkMatter = darkMatterGain.value
        .mul(diff)
        .add(player.dm.darkMatter);
    if (hasElement(13))
      player.atom.quark = quarkGain.value
        .mul(elementEffect(13) * diff)
        .add(player.atom.quark);
    if (hasElement(20))
      player.md.mass = MASS_DILATION.dilatedMassGain.value
        .mul(diff)
        .add(player.md.mass);
    if (hasElement(23))
      player.atom.atom = atomGain.value.mul(diff).add(player.atom.atom);
    if (hasElement(29))
      for (let i = 0; i < PARTICLES.length; i++)
        player.atom.particles[i] = player.atom.quark
          .mul(0.1 * diff)
          .add(player.atom.particles[i]);
    if (hasElement(35))
      // give the gain for each of the previous ones
      // this makes the gain slightly more smoother
      for (let i = player.stars.unlocked - 1; i >= 0; i--)
        player.stars.stars[i] = STARS.starGain(i)
          .mul(diff)
          .add(player.stars.stars[i]);
    player.stars.collapsed = STARS.gain.value
      .mul(diff)
      .add(player.stars.collapsed)
      .min(supernovaRequirement.value);
    if (hasElement(42))
      for (const [id, upg] of MASS_DILATION.upgrades.entries())
        if ((upg.unl?.value ?? true) && upg.cost.amt.value.gte(1))
          MASS_DILATION.buy(id);
    if (canSupernovaReset.value) {
      if (player.supernova.unlocked) {
        notify("You have gone Supernova!");
        supernovaReset();
      } else supernovaTime.value += diff;
    }

    if (reachedEnd.value && !player.end) {
      showPopup("endgame");
      player.end = true;
    }

    upgradeAuto();
    rankAuto();
    buildingAuto();
  }
}

function loop() {
  const now = Date.now();
  const diff = (now - player.lastUpdate) / 1000;

  if (diff >= 60 && player.options.offlineProgress) {
    runOfflineProgress(diff)
    return
  }

  player.lastUpdate = now;
  TPS.value = 1 / diff;

  tick(diff);
  setTimeout(loop, 1000 / TICKS);
}

export function start() {
  loop()
}

function updateCss() {
  watchEffect(() => {
    const { style } = document.documentElement;
    style.setProperty("--font", player.options.font);
  });
}

function init() {
  // core
  loadStorage();
  startAutoSave();
  updateCss();
  start();

  window.player = player;
  window.Decimal = Decimal;

  // UI
  createApp(App).mount("#app");
  document.getElementById("loading").remove();
}

function debug() {
  return new Promise((resolve) => {
    // ERUDA
    /*const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/eruda";
    script.onload = () => {
      window.eruda.init();
      resolve();
    };
    document.body.append(script);*/
    resolve();

    // debug helps
    window.addEventListener("keypress", (e) => {
      if (e.key === "p") {
        paused = !paused;
        save();
      }
    });
  });
}

if (import.meta.env.DEV) debug().then(() => init());
else init();
