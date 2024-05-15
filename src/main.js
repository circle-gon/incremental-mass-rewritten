import { createApp, watchEffect } from "vue";
import { loadStorage, player, startAutoSave, save } from "./core/save";
import { TPS } from "./core/utils";
import { massGain } from "./main/mass";
import App from "./App.vue";
import "./style.css";
import { buildingAuto } from "./main/buildings";
import { hasUpgrade, upgradeAuto } from "./main/upgrades";
import { rankAuto } from "./main/ranks";
import { bhGain, darkMatterGain } from "./main/dm";
import { ragePowerGain } from "./main/rage";
import { PARTICLES, atomGain, atomicPowerGain, powerGain, quarkGain } from "./atom/atom";
import { elementEffect, hasElement } from "./atom/elements";
import { MASS_DILATION } from "./atom/md";
import { STARS } from "./atom/stars";

let paused = true
function loop() {
  const now = Date.now();
  const diff = (now - player.lastUpdate) / 1000;
  player.lastUpdate = now;
  TPS.value = 1 / diff;

  if (!(import.meta.env.DEV && paused)) {
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
        .add(player.md.mass)
    if (hasElement(23))
      player.atom.atom = atomGain.value
        .mul(diff)
        .add(player.atom.atom)
    if (hasElement(29))
      for (let i = 0; i < PARTICLES.length; i++)
        player.atom.particles[i] = player.atom.quark
          .mul(0.1 * diff)
          .add(player.atom.particles[i]);
    if (hasElement(35))
      // give the gain for each of the previous ones
      // this makes the gain slightly more smoother
      for (let i = player.stars.unlocked - 1; i >= 0; i--) 
        player.stars.stars[i] = STARS.starGain(player.stars.stars[i + 1] ?? 0)
          .mul(diff)
          .add(player.stars.stars[i])
      player.stars.collapsed = STARS.gain.value
        .mul(diff)
        .add(player.stars.collapsed)
  }

  upgradeAuto();
  rankAuto();
  buildingAuto();
  requestAnimationFrame(loop);
}

function updateCss() {
  watchEffect(() => {
    const { style } = document.documentElement;
    style.setProperty("--font", player.options.font);
  });
}

function init() {
  createApp(App).mount("#app");
  loadStorage();
  startAutoSave();
  updateCss();
  loop();
}

function debug() {
  return new Promise((resolve) => {
    // ERUDA
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/eruda";
    script.onload = () => {
      window.eruda.init();
      resolve();
    };
    document.body.append(script);

    // debug helps
    window.player = player;
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
