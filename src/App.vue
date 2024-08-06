<template>
  <Popups />
  <Notify />
  <Offline v-if="offlineProgress.active" />
  <template v-else>
    <Misc />
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
</template>
<script setup>
import Tabs from "./core/Tabs.vue";
import Main from "./core/Main.vue";
import Resources from "./core/Resources.vue";
import Popups from "./core/Popups.vue";
import Notify from "./core/Notify.vue";
import Misc from "./Misc.vue";
import Offline from "./core/Offline.vue";
import { player } from "./core/save";
import { supernovaTime } from "./core/utils";
import { offlineProgress } from "./core/offline";
</script>
