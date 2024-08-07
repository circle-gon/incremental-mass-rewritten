import { computed } from "vue";
import { player } from "../core/save";
import Decimal from "break_eternity.js";
import { RANKS, hasRankReward, rankReset, rankReward } from "./ranks";
import { hasUpgrade, upgradeEffect } from "./upgrades";
import { showPopup, showQuote } from "../core/popups";
import { challengeEffect, inChallenge } from "./challenges";
import { powerEffect } from "../atom/atom";
import { MASS_DILATION } from "../atom/md";
import { dilate } from "../core/utils";

const canRageReset = computed(() => {
  return player.mass.gte(1e16) && !inChallenge(6);
});

export const ragePowerGain = computed(() => {
  if (!canRageReset.value) return Decimal.dZero;

  let base = player.mass.div(1e16).root(3);
  if (hasRankReward(1, 4)) base = base.mul(rankReward(1, 4));
  if (hasUpgrade("dm", 5)) base = base.mul(upgradeEffect("dm", 5));
  if (hasRankReward(0, 11)) base = base.mul(rankReward(0, 11));
  base = base.mul(powerEffect(1, 0));

  if (inChallenge(3)) base = base.root(10);
  else base = base.pow(challengeEffect(3));
  if (hasUpgrade("dm", 7)) base = base.pow(1.15);

  if (player.md.active) base = dilate(base, MASS_DILATION.penalty.value);

  return base.floor();
});

export function rageResetCore() {
  rankReset(RANKS.length);
}

export function rageReset() {
  player.rage.power = player.rage.power.add(ragePowerGain.value);
  player.rage.unlocked = true;
  rageResetCore();

  showQuote(1);
}

export function manualRageReset() {
  if (!canRageReset.value) return;
  if (!player.options.confirm.rage) rageReset();
  else showPopup("rp");
}
