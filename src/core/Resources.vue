<template>
  <div id="resources-table">
    <template v-for="(resource, icon) in resources" :key="resource.icon">
      <div v-if="resource.show.value">
        <Tooltip pos="left" tooltip-align="left" text-align="left">
          <template #content>
            <div :class="resource.class">
              <span class="res-desc">
                <template v-for="(item, idx) in resource.desc.value" :key="item"
                  ><br v-if="idx > 0" />{{ item }}
                </template></span
              >
              <div>
                <img
                  :src="getSrc(icon)"
                  :style="resource.click ? { cursor: 'pointer' } : null"
                  @click="resource.click?.()"
                />
              </div>
            </div>
          </template>
          <template #tooltip>
            <h3>[ {{ resource.name }} ]</h3>
            <br class="line" />
            <span v-html="resource.tooltip.value" />
          </template>
        </Tooltip>
      </div>
    </template>
  </div>
</template>
<script setup>
import resources from "./resources";
import Tooltip from "./Tooltip.vue";
// i love vite guys
function getSrc(icon) {
  return new URL(`../images/resources/${icon}.png`, import.meta.url).href;
}
</script>
<style scoped>
#resources-table {
  width: 246px;
  height: 100%;
  overflow-y: auto;
  border-left: solid 2px white;
}

#resources-table > div {
  display: flex;
  align-items: center;
  margin: 3px;
  width: calc(100% - 6px);
  height: 45px;
}

#resources-table > div > div {
  display: flex;
  justify-content: end;
  align-items: center;
  width: 100%;
}

#resources-table > div > div > span {
  font-size: 12px;
}

.res-desc {
  margin-right: 5px;
  text-align: right;
}
</style>
