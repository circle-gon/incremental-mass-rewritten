import { computed } from "vue";
import { player } from "../core/save";
import Decimal from "break_eternity.js";
import { buildingEffect, resetBuilding } from "./buildings";
import { rageResetCore } from "./rage";
import { showPopup, showQuote } from "../core/popups";
import { hasUpgrade, resetUpgrades, upgradeEffect } from "./upgrades";
import { powerEffect } from "../atom/atom";
import { challengeEffect, inChallenge } from "./challenges";
import { MASS_DILATION } from "../atom/md";
import { dilate } from "../core/utils";
import { elementEffect, hasElement } from "../atom/elements";

const canDMReset = computed(() => {
  if (inChallenge(6)) return player.mass.gte(1e200);
  return player.rage.power.gte(1e22);
});

export const darkMatterGain = computed(() => {
  if (!canDMReset.value) return Decimal.dZero;

  let base = player.rage.power.div(1e22).root(4);
  if (inChallenge(6)) base = player.mass.div(1e200).root(8);

  base = base.mul(powerEffect(2, 0));
  if (inChallenge(7)) base = base.root(8);

  if (player.md.active) base = dilate(base, MASS_DILATION.penalty.value);

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
  if (hasUpgrade("dm", 13)) base = base.mul(upgradeEffect("dm", 13));
  if (hasElement(45)) base = base.mul(elementEffect(45));

  return base;
});

export const bhMultiExpo = computed(() => {
  return challengeEffect(7);
});

export const bhExpo = computed(() => {
  return 0.33;
});

export const bhGain = computed(() => {
  const self = player.dm.mass.add(1).pow(bhExpo.value);
  const multi = bhMulti.value.pow(bhMultiExpo.value);
  let gain = multi.mul(self);
  if (inChallenge(7)) gain = gain.root(8);
  if (player.md.active) gain = dilate(gain, MASS_DILATION.penalty.value);
  return gain;
});

export const bhEffect = computed(() => {
  return player.dm.mass.add(1).pow(hasUpgrade("atom", 11) ? 1.25 : 0.25);
});
