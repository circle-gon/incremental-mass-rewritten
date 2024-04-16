<template>
  <div v-if="CHALLENGES[num].unlocked.value" style="width: 120px; margin: 5px">
    <img
      class="img-chal"
      :class="{
        'in-chal': inChallenge(num),
        'chal-completed': comps.gte(CHALLENGES[num].max.value),
      }"
      :src="src"
      @click="selectChallenge(num)"
    /><br /><span>{{ formatInteger(comps) }}{{ outOf }}</span>
  </div>
</template>
<script setup>
import { CHALLENGES, selectChallenge, inChallenge } from "./challenges";
import { formatInteger } from "../core/format";
import { computed } from "vue";

const props = defineProps({
  num: {
    type: Number,
    required: true,
  },
});

const comps = computed(() => CHALLENGES[props.num].cost.amt.value);
const outOf = computed(() => {
  const goal = CHALLENGES[props.num].max.value;
  if (goal.gte(Infinity)) return "";
  return " / " + formatInteger(goal);
});

// i love vite guys
const src = computed(() => {
  return new URL(`../images/challenges/${props.num}.png`, import.meta.url).href;
});
</script>
<style scoped>
.img-chal {
  cursor: pointer;
  background-color: #171717;
  transition-duration: 0.15s;
  margin: 3px;
}

.in-chal {
  background-color: #444;
}

.chal-completed {
  background-color: #00520b;
}
</style>
