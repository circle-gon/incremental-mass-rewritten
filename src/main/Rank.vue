<template>
  <div v-if="rank.unlocked.value" style="width: 300px">
    <button
      v-if="rank.autoUnlocked.value"
      class="btn"
      style="width: 80px"
      @click="autoRank = !autoRank"
    >
      {{ autoRank ? "ON" : "OFF" }}
    </button>
    {{ rank.name }}
    <h4>{{ formatInteger(amt) }}</h4>
    <br /><br />
    <!-- Special treatment for challenge 5 -->
    <button
      class="btn"
      :class="inChallenge(4) || !rank.cost.canAfford.value ? 'locked' : null"
      @click="rankUp(num, false)"
    >
      Reset your {{ resetText }} but {{ rank.name }} up. {{ nextText }}<br />
      Req: {{ requires }}
    </button>
  </div>
</template>
<script setup>
import { RANKS, rankUp } from "./ranks";
import { computed, unref } from "vue";
import { formatInteger, formatMass } from "../core/format";
import { player } from "../core/save";
import { inChallenge } from "./challenges";

const props = defineProps({
  num: {
    type: Number,
    required: true,
  },
});

const rank = RANKS[props.num];

const amt = computed(() => rank.cost.amt.value);
const resetText = computed(() => {
  if (props.num > 0) return RANKS[props.num - 1].name + "s";
  return "mass and upgrades";
});

const nextText = computed(() => {
  const r = rank.rewards.find((i) => amt.value.lt(i.require));

  if (!r) return "";

  return `At ${rank.name} ${formatInteger(r.require)} - ${unref(r.desc)}.`;
});

const requires = computed(() => {
  const cost = rank.cost.cost.value;
  if (props.num === 0) return formatMass(cost);
  return `${RANKS[props.num - 1].name} ${formatInteger(cost)}`;
});

const autoRank = computed({
  get: () => player.options.rankAuto[props.num],
  set: (v) => (player.options.rankAuto[props.num] = v),
});
</script>
