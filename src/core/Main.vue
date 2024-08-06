<template>
  <div id="main" :style="width">
    <Nav />
    <div style="min-height: 60px">
      <div id="chal-upper">
        <template v-if="player.challenge.active !== -1">
          You are now in the [{{ active.title }}] Challenge! Get over
          {{ formatMass(active.cost.cost.value) }}{{ bhText }} to complete.<br />
          +{{ formatInteger(currentComp.sub(active.cost.amt.value)) }}
          completions (+1 at
          {{ formatMass(active.cost.costFunc(currentComp)) }}{{ bhText }})
        </template>
      </div>
    </div>
    <div id="main-line"></div>
    <div style="min-height: 45px">
      <div class="table-center stab-btn">
        <div
          v-for="(tab, idx) in selected"
          :key="tab.name"
          style="width: 160px"
        >
          <button
            v-if="tab.unlocked?.value ?? true"
            class="btn-tab"
            :class="[
              chosen === idx ? 'chosen' : null,
              tab.class,
              tab.notify?.value ? 'notif' : null,
            ]"
            @click="selectedTab.subtabs[selectedTab.tab] = idx"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>
    </div>
    <br />
    <div><component :is="selected[chosen].comp" /></div>
  </div>
</template>
<script setup>
import Nav from "./Nav.vue";
import tabs, { selectedTab, width } from "./tabs";
import { computed } from "vue";
import { CHALLENGES } from "../main/challenges";
import { player } from "./save";
import { formatMass, formatInteger } from "./format";

const selected = computed(() => tabs[selectedTab.tab].tabs);
const chosen = computed(() => selectedTab.subtabs[selectedTab.tab]);
const active = computed(() => CHALLENGES[player.challenge.active]);
const currentComp = computed(() => {
  const act = active.value;
  return act.cost.max.value.min(act.max.value).max(act.cost.amt.value);
});
const bhText = computed(() => {
  return player.challenge.active >= 4 ? " of Black Hole" : "";
});
</script>
<style scoped>
#main {
  height: 100%;
  overflow: auto;
  position: relative;
}

#chal-upper {
  width: 100%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0%);
}

#main-line {
  width: 100%;
  border-bottom: solid 2px white;
  height: 5px;
  margin-bottom: 13px;
}
</style>
