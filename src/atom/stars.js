import { computed } from "vue";
import { player } from "../core/save";
import Decimal from "break_eternity.js";
import { MASS_DILATION } from "./md";
import { dilate } from "../core/utils";
import { elementEffect, hasElement } from "./elements";

const unlocked = computed(() => hasElement(35) || player.supernova.unlocked);

const REQUIREMENTS = [1e300, "1e333", "1e424", "1e515", "1e715"];

const nextAt = computed(() => {
  const unl = player.stars.unlocked;
  if (unl >= REQUIREMENTS.length) return Infinity;
  return REQUIREMENTS[unl];
});
function unlock() {
  if (player.atom.quark.lt(nextAt.value)) return;
  player.atom.quark = player.atom.quark.sub(nextAt.value);
  player.stars.unlocked++;
}

function starGain(i) {
  let expo = 1.5;
  if (hasElement(49)) expo *= 1.05;

  let gain = Decimal.dOne.add(player.stars.stars[i + 1] ?? 0).pow(expo);
  if (player.md.upgrades[8].gte(1)) gain = gain.mul(MASS_DILATION.effect(8));
  if (hasElement(48) && i === player.stars.unlocked - 1)
    gain = gain.mul(elementEffect(48));
  if (hasElement(53)) gain = gain.mul(elementEffect(53));

  return gain;
}

const gain = computed(() => {
  let gain = player.stars.stars[0];
  if (player.md.upgrades[8].gte(1)) gain = gain.mul(MASS_DILATION.effect(8));
  return gain;
});

const effect = computed(() => {
  const p = hasElement(47) ? 1.5 : 1;
  const star = dilate(player.stars.collapsed.mul(p).add(1), 1 / 2);
  const rank = player.ranks[0].mul(p).add(1).log10().add(1).pow(1.6);
  const tier = player.ranks[1].mul(p).add(1).log10().mul(2).add(1).pow(1.8);
  const tetr = player.ranks[2]
    .mul(p)
    .add(1)
    .log10()
    .add(1)
    .log10()
    .add(1)
    .pow(1.2);
  return star.pow(rank.mul(tier).pow(tetr));
});

export const STARS = {
  unlocked,
  count: REQUIREMENTS.length,
  nextAt,
  unlock,
  starGain,
  gain,
  effect,
};
