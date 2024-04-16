import { computed } from "vue";
import { player } from "../core/save";
import Decimal from "break_eternity.js";
import { buildingEffect, resetBuilding } from "./buildings";
import { rageResetCore } from "./rage";
import { showPopup, showQuote } from "../core/popups";
import { hasUpgrade, resetUpgrades, upgradeEffect } from "./upgrades";
import { powerEffect } from "../atom/atom";

const canDMReset = computed(() => {
  return player.rage.power.gte(1e22);
});

export const darkMatterGain = computed(() => {
  if (!canDMReset.value) return Decimal.dZero;

  let base = player.rage.power.div(1e22).root(4);
  base = base.mul(powerEffect(2, 0));

  return base.floor();
});

const KEEP_RAGE_UPGRADES = [2, 4, 5];
export function dmResetCore() {
  resetUpgrades("rp", KEEP_RAGE_UPGRADES);
  player.rage.power = Decimal.dZero;
  resetBuilding("tickspeed");
  player.dm.mass = Decimal.dZero;
  rageResetCore();
}

export function DMReset() {
  player.dm.darkMatter = player.dm.darkMatter.add(darkMatterGain.value);
  player.dm.unlocked = true;
  dmResetCore();

  showQuote(2);
}

export function manualDMReset() {
  if (!canDMReset.value) return;
  if (!player.options.confirm.dm) DMReset();
  else showPopup("dm");
}

export const bhMulti = computed(() => {
  let base = Decimal.dOne;
  base = base.mul(buildingEffect("bhc"));
  if (hasUpgrade("rp", 10)) base = base.mul(upgradeEffect("rp", 10));

  return base;
});

export const bhExpo = computed(() => {
  return 0.33;
});

export const bhGain = computed(() => {
  const self = player.dm.mass.add(1).pow(bhExpo.value);
  return bhMulti.value.mul(self);
});

export const bhEffect = computed(() => {
  return player.dm.mass.add(1).root(4);
});
