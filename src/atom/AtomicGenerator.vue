<template>
  You have
  <h4>
    {{ format(player.atom.power) }}
    {{ formatGain(player.atom.power, atomicPowerGain) }}
  </h4>
  Atomic Power,<br />
  <span class="green"
    >which provides
    <h4>{{ formatInteger(atomicPowerEffect) }}</h4>
    free Tickspeed.</span
  ><br /><br />
  <Building name="cosmic" />
</template>
<script setup>
import { player } from "../core/save";
import { format, formatInteger, formatGain } from "../core/format";
import { atomicPowerEffect, atomicPowerGain } from "./atom";
import Building from "../main/Building.vue";
</script>
