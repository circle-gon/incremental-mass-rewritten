<template>
  Note: Click any image to show the challenge description. Click again to enter
  that challenge.<br /><br />
  <div class="table-center" style="width: 100%">
    <div style="width: calc(50%)">
      <div id="chals-table">
        <div
          v-for="i in Math.ceil(CHALLENGES.length / 4)"
          :key="i"
          class="table-center"
          style="min-height: 160px"
        >
          <template
            v-for="j in Math.min(CHALLENGES.length - 4 * (i - 1), 4)"
            :key="j"
          >
            <Challenge :num="4 * (i - 1) + (j - 1)" />
          </template>
        </div>
      </div>
    </div>
    <div style="width: calc(50% - 30px); margin: 0 15px">
      <button
        class="btn"
        :style="{
          visibility: player.challenge.active !== -1 ? 'visible' : 'hidden',
        }"
        @click="exitChallenge"
      >
        {{ exitText }}</button
      ><br /><br />
      <div v-if="player.challenge.chosen !== -1">
        <button
          class="btn"
          :style="{
            visibility:
              player.challenge.active !== player.challenge.chosen
                ? 'visible'
                : 'hidden',
          }"
          @click="enterChallenge(player.challenge.chosen)"
        >
          Enter Challenge
        </button>
        <p style="line-height: 1">{{ chalText }}</p>
        <span class="red">{{ unref(current.desc) }}</span
        ><br />
        <span class="red">{{
          challengeResetText(player.challenge.chosen)
        }}</span>
        <p>{{ goalText }}</p>
        <span class="green">{{ unref(current.reward) }}.</span><br />
        <template v-if="current.firstTime">
          <span class="yellow">{{ unref(current.firstTime) }}</span>
          <br />
        </template>
        <span class="green">{{ currText }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  CHALLENGES,
  exitChallenge,
  enterChallenge,
  challengeResetText,
} from "./challenges";
import { player } from "../core/save";
import { formatInteger, formatMass } from "../core/format";
import { computed, unref } from "vue";
import Challenge from "./Challenge.vue";

function outOf(num) {
  const goal = CHALLENGES[num].max.value;
  if (goal.gte(Infinity)) return "";
  return " / " + formatInteger(goal);
}

const current = computed(() => CHALLENGES[player.challenge.chosen]);
const isGood = computed(() => player.challenge.chosen !== -1);
const exitText = computed(() => {
  if (player.challenge.active === -1) return "";

  const current = CHALLENGES[player.challenge.active];
  const diff = current.cost.max.value
    .min(current.max.value)
    .sub(current.cost.amt.value);
  if (diff.gt(0))
    return `Finish Challenge for ${formatInteger(diff)} completions`;
  return "Exit Challenge";
});
const chalText = computed(() => {
  if (!isGood.value) return "";

  const curr = current.value;
  return `[${player.challenge.chosen + 1}] ${curr.title} [${formatInteger(
    curr.cost.amt.value,
  )}${outOf(player.challenge.chosen)} completions]`;
});
const goalText = computed(() => {
  if (!isGood.value) return "";

  const bh = player.challenge.chosen >= 4 ? " of Black Hole" : "";
  return `Goal: ${formatMass(current.value.cost.cost.value)}${bh}`;
});
const currText = computed(() => {
  if (!isGood.value) return "";

  const curr = current.value;
  return `Currently: ${curr.effDesc(curr.eff.value)}`;
});
</script>
