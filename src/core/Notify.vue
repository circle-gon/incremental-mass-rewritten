<template>
  <Transition name="notify" @after-enter="after" @before-leave="leave">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-if="activeNotif" id="notify" v-html="activeNotif"></div>
  </Transition>
</template>
<script setup>
import { activeNotif } from "./popups";

// This is incredibly stupid but whatever
function after(el) {
  el.style.top = "20px";
}

function leave(el) {
  el.style.top = null;
}
</script>
<style scoped>
#notify {
  z-index: 3;
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  width: 400px;
  min-height: 10px;
  color: white;
  border: solid 2px white;
  background-color: #171717;
  padding: 7px 25px;
  transition-duration: 0.75s;
}

.notify-enter-from,
.notify-leave-to {
  opacity: 0;
  top: -130px;
}

.notify-enter-to,
.notify-leave-from {
  opacity: 1;
  top: 20px;
}
</style>
