<template>
  <div id="nav-btns" :style="width">
    <button
      id="nav-left-hider"
      class="nav-btn"
      @click="player.options.navHide[0] = !player.options.navHide[0]"
    >
      <Icon
        class="icon"
        :class="player.options.navHide[0] ? 'toggled' : null"
        icon="ic:round-arrow-back-ios"
        width="35"
      />
    </button>
    <button
      id="nav-right-hider"
      class="nav-btn"
      @click="player.options.navHide[1] = !player.options.navHide[1]"
    >
      <Icon
        class="icon"
        :class="player.options.navHide[1] ? 'toggled' : null"
        icon="ic:round-arrow-forward-ios"
        width="35"
      />
    </button>
  </div>
</template>
<script setup>
import { width } from "./tabs";
import { Icon } from "@iconify/vue";
import { player } from "./save";
</script>
<style scoped>
#nav-btns {
  position: fixed;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.nav-btn {
  position: absolute;
  bottom: 25px;
  width: 40px;
  height: 50px;
  pointer-events: all;
  background-color: white;
}

.icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.25s;
  color: black;
}

.icon.toggled {
  transform: translate(-50%, -50%) rotate(180deg);
}

#nav-left-hider {
  left: 0;
  border-radius: 0 15px 15px 0;
}

#nav-right-hider {
  right: 0;
  border-radius: 15px 0 0 15px;
}
</style>
