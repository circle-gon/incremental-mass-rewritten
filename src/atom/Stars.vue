<template>
  You have collapsed
  <h4>
    {{ format(player.stars.collapsed, 2) }} /
    {{ format(supernovaRequirement) }}
    {{ formatGain(player.stars.collapsed, STARS.gain.value) }}
  </h4>
  stars, and based on all Rank types,<br />
  <span class="green"
    >it boosts Mass gain by
    <!-- display: inline -->
    <h4>{{ formatMult(STARS.effect.value) }}</h4
    >.</span
  ><br /><br />
  <button
    v-if="player.stars.unlocked < STARS.count"
    class="btn"
    :class="player.atom.quark.lt(STARS.nextAt.value) ? 'locked' : null"
    @click="STARS.unlock()"
  >
    Unlock a new type of Star.<br />Cost:
    {{ formatInteger(STARS.nextAt.value) }} Quark.</button
  ><br /><br />
  <div class="table-center">
    <template v-for="i in player.stars.unlocked" :key="i">
      <div v-if="i > 1" style="width: 30px; font-size: 30px"><br />&larr;</div>
      <div style="width: 250px">
        <img :src="getSrc(i - 1)" /><br /><br />
        <div>
          {{ format(player.stars.stars[i - 1], 2) }}<br />
          {{ formatGain(player.stars.stars[i - 1], STARS.starGain(i - 1)) }}
        </div>
      </div>
    </template>
  </div>
  <br /><br />
</template>
<script setup>
import { format, formatMult, formatInteger, formatGain } from "../core/format";
import { player } from "../core/save";
import { STARS } from "./stars";
import { supernovaRequirement } from "../supernova/supernova";

// i love vite guys
function getSrc(icon) {
  return new URL(`../images/stars/${icon}.png`, import.meta.url).href;
}
</script>
