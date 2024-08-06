<template>
  <div class="table-center stab-btn">
    <template v-for="(rk, idx) in RANKS" :key="rk.name">
      <div v-if="rk.unlocked.value" style="width: 145px">
        <button
          class="btn-tab"
          @click="selected = idx"
        >
          {{ rk.name }}
        </button>
      </div>
    </template>
  </div>
  <br />
  <div>
    <template v-for="reward in rank.rewards" :key="unref(reward.desc)">
      <span v-if="rank.cost.amt.value.gte(reward.require)">
        <b>{{ rank.name }} {{ formatInteger(reward.require) }}:</b>
        {{ unref(reward.desc) }}. {{ formatEffect(reward) }}</span
      ><br />
    </template>
  </div>
</template>
<script setup>
import { RANKS } from "./ranks";
import { formatInteger } from "../core/format";
import { computed, ref, unref } from "vue";

const selected = ref(0)
const rank = computed(() => RANKS[selected.value]);

function formatEffect(reward) {
  if (!reward.effDesc) return "";
  return `Currently: ${reward.effDesc(reward.eff.value)}`;
}
</script>
