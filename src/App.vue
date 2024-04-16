<template>
  <Popups />
  <Notify />
  <div class="table-center" style="height: 100%; width: 100%">
    <Tabs v-if="!player.options.navHide[0]" />
    <Main />
    <Resources v-if="!player.options.navHide[1]" />
  </div>
</template>
<script setup>
import Tabs from "./core/Tabs.vue";
import Main from "./core/Main.vue";
import Resources from "./core/Resources.vue";
import Popups from "./core/Popups.vue";
import Notify from "./core/Notify.vue";
import { player } from "./core/save";
</script>
