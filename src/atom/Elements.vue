<template>
  <div style="min-height: 70px">
    <template v-if="elemSelected !== -1">
      <span class="sky"
        ><b>[{{ ELEMENT_FULL_LIST[elemSelected] }}]</b>
        {{ unref(selected.desc) }}.</span
      ><br />
      Cost: <span>{{ formatInteger(selected.cost) }} Quarks</span
      ><br />
      <span class="green" v-if="selected.effDesc">Currently: {{
        selected.effDesc(selected.eff.value)
      }}</span>
    </template>
  </div>
  <br />
  <div style="width: 950px; margin: auto">
    <div class="table-center" v-for="order in elemOrder">
      <template v-for="{ char, idx } in order">
        <template v-if="char === '_' || !isNaN(char)">
          <div style="width: 50px; height: 50px" :style="{
            visibility: idx < elementsUnlocked ? 'visible' : 'hidden'
          }">
            <template v-if="!isNaN(char)">
              <br />{{ ELEMENT_ASTERISK[char] }}
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
              visibility: idx < elementsUnlocked ? 'visible' : 'hidden'
            }"
            @click="buyElement(idx)"
            @mouseover="elemSelected = idx"
            @mouseleave="elemSelected = -1"
          >
            <div style="font-size: 12px">{{ idx + 1 }}</div>
            {{ ELEMENT_LIST[idx] }}
          </button>
        </template>
      </template>
    </div>
  </div>
</template>
<script setup>
import {
  ELEMENT_MAP,
  ELEMENT_LIST,
  ELEMENT_FULL_LIST,
  ELEMENT_ASTERISK,
  ELEMENT_UPGRADES,
  elemSelected,
  hasElement,
  canBuyElement,
  buyElement,
  elementsUnlocked
} from "./elements";
import { formatInteger } from "../core/format";
import { computed, unref } from "vue";

const selected = computed(() => ELEMENT_UPGRADES[elemSelected.value]);

let idx = 0;
const elemOrder = ELEMENT_MAP.split("v").map((i) => {
  const out = [];

  for (const char of i) {
    out.push({
      char,
      idx,
    });

    if (char === "x") {
      idx++;
      if (idx === 56 || idx === 88) idx += 14;
      else if (idx === 70) idx += 18;
      else if (idx === 118) idx = 56;
      else if (idx === 102) idx = 118;
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