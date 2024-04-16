<template>
  <div id="tabs">
    <template v-for="(tab, idx) in tabs" :key="tab.name">
      <div v-if="tab.unlocked?.value ?? true" style="width: 100%">
        <button
          class="btn-tab"
          :class="[idx === selectedTab.tab ? 'chosen' : null, tab.class]"
          @click="selectedTab.tab = idx"
        >
          <Icon
            :icon="tab.icon"
            width="72"
            :style="{ color: tab.color ?? 'white' }"
            class="icon"
          />
          <div class="tab-name">
            {{ tab.name }}
          </div>
        </button>
      </div>
    </template>
  </div>
</template>
<script setup>
import tabs, { selectedTab } from "./tabs";
import { Icon } from "@iconify/vue";
</script>
<style scoped>
#tabs {
  width: 196px;
  height: 100%;
  overflow-y: auto;
  border-right: solid 2px white;
}

.btn-tab {
  width: 100%;
  height: 50px;
  position: relative;
  overflow: hidden;
}

.tab-name {
  width: 170px;
  font-size: 16px;
  text-align: left;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.icon {
  opacity: 0.1;
  position: absolute;
  bottom: -20px;
  right: 5px;
  transition: transform 0.25s;
  transform: rotate(-15deg);
}
.btn-tab:hover > .icon,
.btn-tab.chosen > .icon {
  transform: scale(1.3) rotate(-25deg);
}

.btn-tab.chosen {
  border-left-width: 10px;
  border-bottom-width: 2px;
}
</style>
