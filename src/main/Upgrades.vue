<template>
  <div style="min-height: 100px">
    <template v-if="player.options.upgradeHovered[0] !== ''">
      <span class="sky">{{ unref(selected.desc) }}</span
      ><br />
      <span
        >Cost: {{ formatInteger(selected.cost) }} {{ cat.resourceName }}</span
      >
      <template v-if="selected.eff">
        <br /><span class="green"
          >Currently: {{ selected.effDesc(selected.eff.value) }}</span
        >
      </template>
    </template>
  </div>
  <div class="table-center">
    <template v-for="(category, id) in UPGRADES" :key="id">
      <div
        v-if="category.unlocked.value"
        style="width: 230px; margin: 0px 10px"
      >
        <b>{{ category.title }}</b
        ><br /><br />
        <div style="font-size: 13px; min-height: 50px">
          You have {{ formatInteger(category.resource.value) }}
          {{ category.resourceName }}
        </div>
        <br />
        <div class="table-center" style="justify-content: start">
          <template
            v-for="(upgrade, num) in category.upgrades"
            :key="unref(upgrade.desc)"
          >
            <img
              :style="{
                visibility:
                  upgrade.unlocked?.value ?? true ? 'visible' : 'hidden',
              }"
              style="margin: 3px"
              class="img-btn"
              :class="{
                locked: !canBuyUpgrade(id, num),
                bought: hasUpgrade(id, num),
              }"
              :src="getSrc(id, num)"
              @click="buyUpgrade(id, num)"
              @mouseover="player.options.upgradeHovered = [id, num]"
              @mouseleave="player.options.upgradeHovered = ['', 0]"
            />
          </template>
        </div>
        <br /><button
          v-if="category.autoUnlocked.value"
          class="btn"
          style="width: 80px"
          @click="
            player.options.upgradeAuto[id] = !player.options.upgradeAuto[id]
          "
        >
          {{ player.options.upgradeAuto[id] ? "ON" : "OFF" }}
        </button>
      </div>
    </template>
  </div>
</template>
<script setup>
import { UPGRADES, buyUpgrade, canBuyUpgrade, hasUpgrade } from "./upgrades";
import { formatInteger } from "../core/format";
import { player } from "../core/save";
import { computed, unref } from "vue";

// i love vite guys
function getSrc(id, num) {
  return new URL(`../images/upgrades/${id}/${num}.png`, import.meta.url).href;
}

const cat = computed(() => {
  const upg = player.options.upgradeHovered;
  if (upg[0] === "") return null;
  return UPGRADES[upg[0]];
});

const selected = computed(() => {
  const upg = player.options.upgradeHovered;
  if (upg[0] === "") return null;
  return UPGRADES[upg[0]].upgrades[upg[1]];
});
</script>
