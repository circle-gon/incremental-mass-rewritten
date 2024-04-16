<template>
  <div class="table-center stab-btn">
    <div v-for="(rk, idx) in RANKS" :key="rk.name" style="width: 145px">
      <button class="btn-tab" @click="player.options.rankRewardSelected = idx">
        {{ rk.name }}
      </button>
    </div>
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
import { player } from "../core/save";
import { computed, unref } from "vue";

const rank = computed(() => RANKS[player.options.rankRewardSelected]);

function formatEffect(reward) {
  if (!reward.effDesc) return "";
  return `Currently: ${reward.effDesc(reward.eff.value)}`;
}
</script>
