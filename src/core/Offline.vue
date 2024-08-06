<template>
  <div id="container">
  <div style="font-size: 30px">
    You were offline for <b>{{ formatTime(offlineProgress.time) }}</b
    >.
  </div>
    <div id="bar">
      {{ formatInteger(offlineProgress.ranTicks) }} /
        {{ formatInteger(offlineProgress.ticks) }} ticks simulated
      <div id="progress" :style="{
        width: (offlineProgress.ranTicks / offlineProgress.ticks * 100) + '%'
      }"></div>
    </div>
  <canvas ref="graph" id="graph" width="800" height="600"></canvas>
  <div>
    <Tooltip>
      <template #content>
        <button class="btn" :class="done ? 'locked' : null" @click="offlineProgress.speed++">Speed Up</button>
      </template>
      <template #tooltip>
        Offline Progress will run twice as fast.
      </template>
    </Tooltip>
    <Tooltip>
      <template #content>
        <button class="btn" :class="done ? 'locked' : null" @click="offlineProgress.speed = Infinity">Finish</button>
      </template>
      <template #tooltip>
        All remaining offline time will be used in one tick.
      </template>
    </Tooltip>
  <button class="btn" :class="!done ? 'locked' : null" @click="end">Done</button>
  </div>
</div>
</template>
<script setup>
import { formatTime, formatInteger } from "./format";
import { offlineProgress } from "./offline";
import { player } from "./save"
import { start } from "../main"
import { computed, onMounted, ref } from "vue";
import Tooltip from "./Tooltip.vue"

const done = computed(() => offlineProgress.ranTicks === offlineProgress.ticks)

function end() {
  if (!done.value) return
  offlineProgress.active = false;
  player.lastUpdate = Date.now();
  start();
}

const graph = ref(null)

onMounted(() => {
  offlineProgress.canvas = graph.value.getContext("2d")
})
</script>
<style scoped>
#container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#bar {
  position: relative;
  width: 800px;
  height: 30px;
  line-height: 30px;
  border: 2px solid white;
}

#progress {
  position: absolute;
  z-index: -100;
  top: 0;
  left: 0;
  height: 100%;
  background-color: green;
}

#graph {
	width: 800px;
	height: 600px;
	padding: 0px;
	margin: 5px;
}
</style>
