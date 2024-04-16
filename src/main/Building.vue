<template>
  <div
    v-if="building.unlocked.value"
    class="table-center upgrade"
    style="width: 100%; margin-bottom: 5px"
  >
    <div style="width: 300px">
      <div class="resources">
        <img :src="src" />
        <span style="margin-left: 5px; text-align: left"
          >{{ building.name }} [{{ formatInteger(building.cost.amt.value)
          }}{{ extraText }}]</span
        >
      </div>
    </div>
    <button
      class="btn"
      :class="
        !building.cost.canAfford.value || !isPurchasable ? 'locked' : null
      "
      style="width: 300px"
      @click="buyBuilding(name, false)"
    >
      {{ costText }}
    </button>
    <button class="btn" style="width: 120px" @click="buyBuilding(name, true)">
      Buy Max
    </button>
    <button
      v-if="building.autoUnlocked.value"
      class="btn"
      style="width: 80px"
      @click="buildingAuto = !buildingAuto"
    >
      {{ buildingAuto ? "ON" : "OFF" }}
    </button>
    <div style="margin-left: 5px; text-align: left; width: 400px">
      Power: {{ building.formatPower(building.effect.value.power) }}<br />
      Effect: {{ building.formatEffect(building.effect.value.effect) }}
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { formatInteger } from "../core/format";
import { BUILDINGS, buyBuilding } from "./buildings";
import { player } from "../core/save";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const building = BUILDINGS[props.name];
const isPurchasable = computed(() => {
  return building.purchasable?.value ?? true;
});

// i love vite guys
const src = computed(() => {
  return new URL(`../images/buildings/${props.name}.png`, import.meta.url).href;
});

const costText = computed(() => {
  if (isPurchasable.value)
    return `Cost: ${building.formatCost(building.cost.cost.value)}`;
  return "Locked";
});

const extraText = computed(() => {
  if (!building.bonus || building.bonus.value.eq(0)) return "";
  return ` + ${formatInteger(building.bonus.value)}`;
});

const buildingAuto = computed({
  get: () => player.options.buildingAuto[props.name],
  set: (v) => (player.options.buildingAuto[props.name] = v),
});
</script>
<style scoped>
.upgrade {
  font-size: 14px;
}
.resources {
  display: flex;
  justify-content: start;
  align-items: center;
  min-width: 300px;
}
</style>
