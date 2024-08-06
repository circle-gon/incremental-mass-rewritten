<template>
  <div id="hider" class="table-center">
    <template v-for="(resource, name) in resources" :key="name">
      <div v-if="resource.show.value">
        <img :src="getSrc(name)" /><button
          class="btn"
          @click="
            player.options.hideResource[name] =
              !player.options.hideResource[name]
          "
        >
          {{ player.options.hideResource[name] ? "Hidden" : "Shown" }}
        </button>
      </div>
    </template>
  </div>
</template>
<script setup>
import resources from "../core/resources";
import { player } from "../core/save";
// i love vite guys
function getSrc(icon) {
  return new URL(`../images/resources/${icon}.png`, import.meta.url).href;
}
</script>
<style scoped>
#hider > div {
  margin: 10px;
  padding: 5px;
  background-color: #222;
}

#hider > div {
  display: flex;
  align-items: center;
}

#hider button {
  margin-left: 10px;
  width: 100px;
}
</style>
