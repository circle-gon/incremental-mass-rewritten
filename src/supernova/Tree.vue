<template>
  <div style="height: 130px; position: relative">
    <div style="position: absolute; bottom: 10px; left: 25px">
      <button class="btn" @click="supernovaReset">
        Force a Supernova Reset
      </button>
    </div>
    You have {{ format(player.supernova.star, 2) }}
    {{ formatGain(player.supernova.star, neutronStarGain) }} Neutron Star.<br />
    <div style="margin-top: 3px">
      <div
        v-if="selectedTreeUpg === ''"
        style="font-size: 12px; font-weight: bold"
      >
        <span class="gray"
          >(click on any tree upgrade to show its description)</span
        >
      </div>
      <div v-else>
        <div style="font-size: 12px; font-weight: bold">
          <span class="gray">(click again to buy it if affordable)</span>
          <span
            v-if="upgSelected.req"
            :class="upgSelected.req.value ? 'green' : 'red'"
          >
            Requirement: {{ unref(upgSelected.reqDesc) }}</span
          >
        </div>
        <span class="sky"
          ><b>[{{ selectedTreeUpg }}]</b> {{ unref(upgSelected.desc) }}.</span
        ><br />
        <span>Cost: {{ format(upgSelected.cost, 2) }} Neutron Star</span><br />
        <span v-if="upgSelected.effDesc" class="green"
          >Currently: {{ upgSelected.effDesc(upgSelected.eff.value) }}</span
        >
      </div>
    </div>
  </div>
  <canvas id="tree-canvas" ref="canvas"></canvas>
  <div class="table-center" style="min-height: 30px">
    <template v-for="(tab, idx) in TREE_SUBTABS" :key="tab.title">
      <div v-if="tab.unl?.value" style="width: 145px">
        <button class="btn-tab" @click="selectedTreeTab = idx">
          {{ tab.title
          }}<b v-if="couldBuyUpgrade(idx)" style="color: red">[!]</b>
        </button>
      </div>
    </template>
  </div>
  <br />
  <div>
    <div
      v-for="(idList, idx) in TREE_SUBTABS[selectedTreeTab].ids"
      :key="idx"
      class="tree-column"
    >
      <button
        v-for="(id, idx2) in idList"
        :key="idx2"
        ref="upgs"
        :data-id="id"
        class="btn-tree"
        :style="
          id === '' ||
          !(TREE_UPGRADES[id].unl?.value ?? true) ||
          !treeUpgUnlocked(id)
            ? 'visibility: hidden'
            : null
        "
        :class="{
          // id could be ''
          locked: id === '' || !canBuyTreeUpgrade(id),
          bought: hasTreeUpgrade(id),
          chosen: selectedTreeUpg === id,
        }"
        @click="buyTreeUpg(id)"
      >
        <img v-if="id !== ''" :src="getSrc(id)" />
      </button>
    </div>
  </div>
</template>
<script setup>
import { neutronStarGain, supernovaReset } from "./supernova";
import { format, formatGain } from "../core/format";
import { player } from "../core/save";
import {
  buyTreeUpgrade,
  canBuyTreeUpgrade,
  hasTreeUpgrade,
  selectedTreeTab,
  selectedTreeUpg,
  TREE_SUBTABS,
  TREE_UPGRADES,
  treeTime,
} from "./tree";
import { computed, onMounted, onUnmounted, unref, useTemplateRef } from "vue";

const canvas = useTemplateRef("canvas");
const upgs = useTemplateRef("upgs");

function resize() {
  const c = canvas.value;
  c.width = c.clientWidth;
  c.height = c.clientHeight;
}

function treeUpgUnlocked(id) {
  return (
    hasTreeUpgrade(id) ||
    (TREE_UPGRADES[id].branches?.every((i) => hasTreeUpgrade(i)) ?? true)
  );
}

const CR = 5;
const SR = 7.0710678118654755;
function drawTreeBranch(a, b) {
  const c = canvas.value;
  const ctx = c.getContext("2d");
  const start = upgs.value
    .find((i) => a === i.dataset.id)
    .getBoundingClientRect();
  const end = upgs.value
    .find((i) => b === i.dataset.id)
    .getBoundingClientRect();

  const x1 =
    start.left + start.width / 2 - (document.body.scrollWidth - c.width) / 2;
  const y1 = start.top + start.height / 2 - (window.innerHeight - c.height);
  const x2 =
    end.left + end.width / 2 - (document.body.scrollWidth - c.width) / 2;
  const y2 = end.top + end.height / 2 - (window.innerHeight - c.height);
  ctx.lineWidth = 10;
  ctx.beginPath();
  const color = "#00520b";
  const color2 = "#fff";
  ctx.strokeStyle = player.supernova.tree.includes(b)
    ? color
    : canBuyTreeUpgrade(b)
      ? "#fff"
      : "#333";
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  if (player.options.treeAnimation !== 2) {
    ctx.fillStyle = player.supernova.tree.includes(b) ? color2 : "#888";
    const tt = [
      treeTime.value,
      (treeTime.value + 1) % 3,
      (treeTime.value + 2) % 3,
    ];
    for (let i = 0; i < 3; i++) {
      const [t, dx, dy] = [tt[i], x2 - x1, y2 - y1];
      const [x, y] = [x1 + (dx * t) / 3, y1 + (dy * t) / 3];
      ctx.beginPath();
      if (player.options.treeAnimation === 1) {
        const a = Math.atan2(y1 - y2, dx) - Math.PI / 4;
        ctx.moveTo(x + SR * Math.cos(a), y - SR * Math.sin(a));
        for (let j = 1; j <= 3; j++)
          ctx.lineTo(
            x + SR * Math.cos(a + (Math.PI * j) / 2),
            y - SR * Math.sin(a + (Math.PI * j) / 2)
          );
      } else if (player.options.treeAnimation === 0) {
        ctx.arc(x, y, CR, 0, Math.PI * 2, true);
      }
      ctx.fill();
    }
  }
}

let i;
function update() {
  const c = canvas.value;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);

  const tab = selectedTreeTab.value;
  const ids = TREE_SUBTABS[tab].ids.flat();

  for (const id of ids) {
    if (id === "" || !treeUpgUnlocked(id)) continue;
    const branches = TREE_UPGRADES[id].branches ?? [];
    for (const branch of branches) {
      if (treeUpgUnlocked(branch)) drawTreeBranch(branch, id);
    }
  }

  i = requestAnimationFrame(update);
}

onMounted(() => {
  window.addEventListener("resize", resize);
  resize();
  update();
});

onUnmounted(() => {
  window.removeEventListener("resize", resize);
  cancelAnimationFrame(i);
});

function buyTreeUpg(id) {
  if (selectedTreeUpg.value === id) buyTreeUpgrade(id);
  selectedTreeUpg.value = id;
}

const upgSelected = computed(() => {
  return TREE_UPGRADES[selectedTreeUpg.value];
});

function couldBuyUpgrade(id) {
  const tab = TREE_SUBTABS[id];
  return tab.ids.flat().some((i) => i !== "" && canBuyTreeUpgrade(i));
}

// i love vite guys
function getSrc(id) {
  return new URL(`../images/tree/${id}.png`, import.meta.url).href;
}
</script>
<style scoped>
.tree-column {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  margin-bottom: 5px;
}
.btn-tree {
  background-color: black;
  border: solid 2px white;
  margin: 15px;
  width: 54px;
  height: 54px;
  padding: 0;
  z-index: 1;
}
.btn-tree:not(.bought).locked {
  border-color: #171717;
}
.btn-tree.chosen {
  transform: scale(1.25) !important;
}
/* Use this for later when Quantum tree is implemented */
.btn-tree:not(.qu_tree).bought {
  border-color: #00520b;
}
#tree-canvas {
  pointer-events: none;
  z-index: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
