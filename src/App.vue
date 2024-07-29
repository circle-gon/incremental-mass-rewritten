<template>
  <Popups />
  <Notify />
  <div id="star" v-if="player.supernova.count.lt(1e5)" :style="starStyle" />
  <div v-if="supernovaTime > 4" style="width: 100%; width: 100%">
    <br />
    <div
      :style="{ opacity: minmax(supernovaTime - 4) }"
      style="font-size: 25px"
    >
      You have gone SUPERNOVA!
    </div>
    <br />
    <div
      :style="{ opacity: minmax(supernovaTime - 7) }"
      style="font-size: 15px"
    >
      But it will reset everything to gain SUPERNOVA!
    </div>
    <br />
    <div
      :style="{ opacity: minmax(supernovaTime - 10) }"
      style="font-size: 15px"
    >
      You can pass it...
    </div>
    <br />
    <div
      :style="{ opacity: minmax(supernovaTime - 14) }"
      style="font-size: 20px"
    >
      ... to discover more!
    </div>
    <br />
    <button
      v-if="supernovaTime > 17"
      :style="{ opacity: minmax(supernovaTime - 17) }"
      class="btn"
      @click="supernovaReset"
    >
      Go Supernova...
    </button>
  </div>
  <div
    v-if="supernovaTime === 0"
    class="table-center"
    style="height: 100%; width: 100%"
  >
    <Tabs v-if="!player.options.navHide[0]" />
    <Main />
    <Resources v-if="!player.options.navHide[1]" />
  </div>
</template>
<script setup>
import { computed } from "vue";
import Tabs from "./core/Tabs.vue";
import Main from "./core/Main.vue";
import Resources from "./core/Resources.vue";
import Popups from "./core/Popups.vue";
import Notify from "./core/Notify.vue";
import { player } from "./core/save";
import { supernovaRequirement, supernovaReset } from "./supernova/supernova";
import { supernovaTime } from "./core/utils";

function minmax(x) {
  return Math.max(Math.min(x, 1), 0);
}

const starStyle = computed(() => {
  const percent = player.stars.collapsed
    .max(1)
    .log10()
    .div(supernovaRequirement.value.max(1).log10())
    .max(0)
    .min(1)
    .toNumber();
  const size = Math.min(window.innerWidth, window.innerHeight) * 0.9 * percent;

  let color = `rgb(${(percent / 0.4) * 191}, ${(percent / 0.4) * 91 + 133}, 255)`;
  if (percent > 0.4)
    color = `rgb(${((percent - 0.4) / 0.2) * 64 + 191}, ${224 - ((percent - 0.4) / 0.2) * 11}, ${255 - ((percent - 0.4) / 0.2) * 255})`;
  if (percent > 0.6)
    color = `rgb(255, ${213 - ((percent - 0.6) / 0.1) * 131}, 0)`;
  if (percent > 0.7)
    color = `rgb(${255 - ((percent - 0.7) / 0.1) * 102}, ${82 - ((percent - 0.7) / 0.1) * 82}, 0)`;
  if (percent > 0.8) color = `rgb(153, 0, 0)`;

  return {
    backgroundColor: color,
    width: size + "px",
    height: size + "px",
  };
});
</script>
<style scoped>
#star {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  z-index: -1;
  opacity: 0.25;
  transition-duration: 0.15s;
}
</style>
