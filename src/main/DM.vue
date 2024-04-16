<template>
  <div class="table-center">
    <div style="width: 50%; min-width: 600px">
      Your Black Hole is at
      <h4>
        {{ formatMass(player.dm.mass) }}
        {{ formatGain(player.dm.mass, bhGain, true) }}
      </h4>
      <br />
      <span class="green"
        >Which boosts Mass gain by
        <h4>{{ formatMult(bhEffect) }}</h4></span
      ><br /><br />
      Black Hole's mass gain formula - (x + 1)<sup>{{ format(bhExpo) }}</sup> *
      <span>{{ format(bhMulti) }}</span>
    </div>
  </div>
  <br /><br />
  <Building name="bhc" />
</template>
<script setup>
import Building from "./Building.vue";
import { player } from "../core/save";
import { formatMass, formatGain, formatMult, format } from "../core/format";
import { bhMulti, bhExpo, bhGain, bhEffect } from "./dm";
</script>
