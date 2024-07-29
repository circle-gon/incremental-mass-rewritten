<template>
  <button class="btn" @click="save">Save</button>
  <button class="btn" @click="hardReset">Hard Reset</button>
  <button class="btn" @click="download">Export</button>
  <button class="btn" @click="copy">Export to clipboard</button>
  <button class="btn" @click="importSave">Import</button>
  <button class="btn" @click="open('https://discord.gg/Ekp8FsSwzR')">
    Join Discord
  </button>
  <Tooltip>
    <template #content>
      <button class="btn" @click="open('https://boosty.to/mrredshark77')">
        Donate
      </button>
    </template>
    <template #tooltip>Support the original creator of IMR!</template>
  </Tooltip>
  <button class="btn" @click="showPopup('help')">Help</button>
  <button
    class="btn"
    @click="player.options.offlineProgress = !player.options.offlineProgress"
  >
    Offline Production: {{ player.options.offlineProgress ? "ON" : "OFF" }}
  </button>
  <button class="btn" @click="showPopup('fonts')">Fonts</button>
  <button class="btn" @click="showPopup('notations')">Notations</button>
  <button class="btn">Tree Animation: ON</button>
  <button
    class="btn"
    @click="player.options.massDis = (player.options.massDis + 1) % 4"
  >
    Mass Format Display: {{ massFormat[player.options.massDis] }}
  </button>
  <br /><br />
  <h2>Confirmation Settings</h2>
  <div class="table-center">
    <template v-for="confirm in CONFIRMATIONS" :key="confirm">
      <div v-if="player[confirm].unlocked" style="width: 100px">
        <img :src="getSrc(confirm)" /><br /><button
          class="btn"
          @click="
            player.options.confirm[confirm] = !player.options.confirm[confirm]
          "
        >
          {{ player.options.confirm[confirm] ? "ON" : "OFF" }}
        </button>
      </div>
    </template>
  </div>
  <br />
  <br /><br />
  Incremental Mass Rewritten v0.7.1.6 - made by MrRedShark77<br />
  The game is inspired by Distance Incremental & Synergism<br />
  Contributors:
  <span style="cursor: pointer" @click="lemon">Bézier</span>, 16777216 & Aarex
  (Artists)<br /><br /><br />
  Hint 1: Hover top image above tabs to show description...<br /><br />
  Total time played: {{ formatTime(player.time) }}<br /><br />
</template>
<script setup>
import { compress, player, save } from "../core/save";
import { formatTime } from "../core/format";
import { showPopup, notify } from "../core/popups";
import Tooltip from "../core/Tooltip.vue";

const CONFIRMATIONS = ["rage", "dm", "atom", "supernova"];

// i love vite guys
function getSrc(icon) {
  return new URL(`../images/resources/${icon}.png`, import.meta.url).href;
}

const massFormat = [
  "Default",
  "Always show g",
  "Always show mlt",
  "Important units only",
];

function hardReset() {
  showPopup("hardReset");
}

function download() {
  const save = compress();
  const url = URL.createObjectURL(new Blob([save], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download =
    "Incremental Mass Rewritten Save - " + new Date().toGMTString() + ".txt";
  a.click();
  URL.revokeObjectURL(url);
}

async function copy() {
  try {
    await navigator.clipboard.writeText(compress());
    notify("Copied to clipboard");
  } catch {
    notify("Export failed.");
  }
}

function importSave() {
  showPopup("import");
}

function open(url) {
  window.open(url);
}

function lemon() {
  // this is quite literally the only reason why notify accepts HTML
  notify(
    'where lemon<br><img src="https://i.imgflip.com/57cc98.jpg" style="width:100%">',
  );
}
</script>
