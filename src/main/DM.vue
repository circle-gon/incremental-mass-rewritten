<template>
  <div class="table-center">
    <div style="width: 50%; min-width: 600px">
      Your Black Hole is at
      <!-- display: inline -->
      <h4>
        {{ formatMass(player.dm.mass) }}
        {{ formatGain(player.dm.mass, bhGain, true) }} </h4
      >,
      <br />
      <span class="green"
        >which boosts Mass gain by
        <!-- display: inline -->
        <h4>{{ formatMult(bhEffect) }}</h4
        >.</span
      ><br /><br />
      Black Hole's mass gain formula - ([BH Mass] + 1)<sup>{{
        format(bhExpo)
      }}</sup>
      * <span>{{ format(bhMulti) }}</span
      ><sup v-if="bhMultiExpo.gt(1)">{{ format(bhMultiExpo) }}</sup>
    </div>
  </div>
  <br /><br />
  <Building name="bhc" />
</template>
<script setup>
import Building from "./Building.vue";
import { player } from "../core/save";
import { formatMass, formatGain, formatMult, format } from "../core/format";
import { bhMulti, bhMultiExpo, bhExpo, bhGain, bhEffect } from "./dm";
</script>
