<template>
  <div style="min-height: 70px">
    <template v-if="elemSelected !== -1">
      <span class="sky"
        ><b>[{{ ELEMENT_METADATA.fullNames[elemSelected] }}]</b>
        {{ unref(selected.desc) }}.</span
      ><br />
      Cost: <span>{{ formatInteger(selected.cost) }} Quarks</span><br />
      <span v-if="selected.effDesc" class="green"
        >Currently: {{ selected.effDesc(selected.eff.value) }}</span
      >
    </template>
  </div>
  <br />
  <div style="width: 950px; margin: auto">
    <div v-for="(order, i) in elemOrder" :key="i" class="table-center">
      <template v-for="{ char, idx } in order" :key="idx">
        <template v-if="char === '_' || !isNaN(char)">
          <div
            :style="{
              visibility: idx < elementsUnlocked ? 'visible' : 'hidden',
            }"
            style="width: 50px; height: 50px"
          >
            <template v-if="!isNaN(char)">
              <br />{{ ELEMENT_METADATA.asterisk[char] }}
            </template>
          </div>
        </template>
        <template v-if="char === 'x'">
          <button
            class="element"
            :class="{
              bought: hasElement(idx),
              locked: !canBuyElement(idx),
            }"
            :style="{
              visibility: idx < elementsUnlocked ? 'visible' : 'hidden',
            }"
            @click="buyElement(idx)"
            @mouseover="elemSelected = idx"
            @mouseleave="elemSelected = -1"
          >
            <div style="font-size: 12px">{{ idx + 1 }}</div>
            {{ ELEMENT_METADATA.names[idx] }}
          </button>
        </template>
      </template>
    </div>
  </div>
</template>
<script setup>
import {
  ELEMENT_METADATA,
  ELEMENT_UPGRADES,
  elemSelected,
  hasElement,
  canBuyElement,
  buyElement,
  elementsUnlocked,
} from "./elements";
import { formatInteger } from "../core/format";
import { computed, unref } from "vue";

const selected = computed(() => ELEMENT_UPGRADES[elemSelected.value]);

let _idx = 0;
const elemOrder = ELEMENT_METADATA.map.split("v").map((i) => {
  const out = [];

  for (const char of i) {
    out.push({
      char,
      idx: _idx,
    });

    if (char === "x") {
      _idx++;
      if (_idx === 56 || _idx === 88) _idx += 14;
      else if (_idx === 70) _idx += 18;
      else if (_idx === 118) _idx = 56;
      else if (_idx === 102) _idx = 118;
    }
  }

  return out;
});
</script>
<style scoped>
.element {
  font-size: var(--elem-symbol-size);
  width: 50px;
  height: 50px;
  background-color: #444;
}
</style>
