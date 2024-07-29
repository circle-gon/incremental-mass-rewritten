import { computed } from "vue";
import { buildingEffect } from "./buildings";
import { hasRankReward, rankReward } from "./ranks";
import Decimal from "break_eternity.js";
import { bhEffect } from "./dm";
import { challengeEffect, inChallenge } from "./challenges";
import { hasUpgrade, upgradeEffect } from "./upgrades";
import { powerEffect } from "../atom/atom";
import { player } from "../core/save";
import { dilate } from "../core/utils";
import { MASS_DILATION } from "../atom/md";
import { hasElement } from "../atom/elements";
import { STARS } from "../atom/stars";

export const massGain = computed(() => {
  let gain = Decimal.dOne;
  gain = gain.add(buildingEffect("mass1"));

  if (hasRankReward(0, 5)) gain = gain.mul(rankReward(0, 5));
  if (hasRankReward(0, 6)) gain = gain.mul(4);
  gain = gain.mul(buildingEffect("tickspeed"));
  gain = gain.mul(bhEffect.value);
  if (hasUpgrade("dm", 9)) gain = gain.mul(upgradeEffect("dm", 9));
  if (hasUpgrade("rp", 12)) gain = gain.mul(upgradeEffect("rp", 12));
  gain = gain.mul(powerEffect(0, 0));
  gain = gain.mul(powerEffect(1, 1));
  if (hasRankReward(0, 14)) gain = gain.mul(rankReward(0, 14));
  gain = gain.mul(STARS.effect.value);

  if (hasRankReward(1, 1)) gain = gain.pow(1.1);
  if (inChallenge(2)) gain = gain.pow(0.7);
  else gain = gain.pow(challengeEffect(2));
  if (hasRankReward(0, 12)) gain = gain.pow(1.02);
  if (hasRankReward(2, 5)) gain = gain.pow(1.02);
  if (hasRankReward(0, 15)) gain = gain.pow(rankReward(0, 15));
  if (hasElement(50)) gain = gain.pow(1.03);

  if (player.md.active) {
    gain = dilate(gain, MASS_DILATION.penalty.value);
    if (hasElement(27)) gain = gain.pow(1.5);
  }

  return gain;
});
