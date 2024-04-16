<template>
  <div id="popups">
    <Popup v-for="popup in activePopups" :key="popup" :popup-name="popup" />
  </div>
</template>
<script setup>
import { activePopups } from "./popups";
import Popup from "./Popup.vue";
</script>
<style scoped>
#popups {
  z-index: 3;
  width: 100%;
  height: 100%;
  position: fixed;
  pointer-events: none;
}
</style>
