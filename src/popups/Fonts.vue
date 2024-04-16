<template>
  <button
    v-for="font in FONTS"
    :key="font.name"
    class="btn"
    :style="{ fontFamily: font.font ?? font.name }"
    @click="player.options.font = font.font ?? font.name"
  >
    {{ font.name }}
  </button>
</template>
<script setup>
import { player } from "../core/save";
const FONTS = [
  { name: "Andy Bold" },
  { name: "Arial", font: "Arial, Helvetica, sans-ser" },
  { name: "Bahnschrift" },
  { name: "Courier" },
  { name: "Cousine" },
  { name: "Flexi IBM VGA False" },
  { name: "Inconsolata" },
  { name: "Lato" },
  { name: "Lucida Handwriting" },
  { name: "Lunasima" },
  { name: "Monospace Typewritter", font: "Monospace-Typewritter" },
  { name: "MS Sans Serif" },
  { name: "Noto Sans JP" },
  { name: "Nova Mono" },
  { name: "Nunito" },
  { name: "Retron 2000", font: "Retron2000" },
  { name: "Roboto" },
  { name: "Roboto Mono" },
  { name: "Source Sans Pro" },
  { name: "Source Serif Pro" },
  { name: "Verdana", font: "Verdana, Geneva, Tahoma, sans-serif" },
];
</script>
