<template>
  <button class="btn" @click="player.options.notation = 'elemental'">
    Elemental
  </button>
  <button class="btn" @click="player.options.notation = 'eng'">
    Engineering
  </button>
  <button class="btn" @click="player.options.notation = 'inf'">Infinity</button>
  <button class="btn" @click="player.options.notation = 'mixed_sc'">
    Mixed Scientific
  </button>
  <button class="btn" @click="player.options.notation = 'layer'">
    Prestige Layer
  </button>
  <button class="btn" @click="player.options.notation = 'sc'">
    Scientific
  </button>
  <button class="btn" @click="player.options.notation = 'st'">Standard</button>
  <button class="btn" @click="player.options.notation = 'old_sc'">
    Old Scientific
  </button>
  <button class="btn" @click="player.options.notation = 'omega'">Omega</button>
  <button class="btn" @click="player.options.notation = 'omega_short'">
    Omega Short
  </button>
</template>
<script setup>
import { player } from "../core/save";
</script>
