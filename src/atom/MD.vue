<template>
  You have
  <h4>{{ formatInteger(player.md.particle) }}</h4>
  Relativistic Particles.<br />
  You have
  <h4>{{ formatMass(player.md.mass) }} {{ formatGain(player.md.mass, MASS_DILATION.dilatedMassGain.value, true) }}</h4>
  of dilated mass, which gives a
  <h4>{{ formatMult(MASS_DILATION.dilatedMassEffect.value) }}</h4>
  to Tickspeed power.<br />
  Relativistic Particle gain formula - (log<sub>10</sub>([mass]) / 50 - 9)<sup>{{ format(MASS_DILATION.rpExp.value) }}</sup> * {{ format(MASS_DILATION.rpMult.value) }}<br /><br />
  <Tooltip>
    <template #content>
      <button class="btn full md" @click="MASS_DILATION.run()">{{ dilateText }}</button>
    </template>
    <template #tooltip>
      Dilating mass will force an atom reset. While mass is dilated, all
      pre-atom resources and atomic power will get their gain exponents
      raised by {{ format(MASS_DILATION.penalty.value) }}.
    </template>
  </Tooltip>
  <br /><br />
  <div class="table-center">
    <div style="width: 1000px">
      <button v-for="(upg, idx) in MASS_DILATION.upgrades" 
      @click="MASS_DILATION.buy(idx)" style="font-size: 11px" class="btn full md" :style="{
              visibility: (upg.unl?.value ?? true) ? 'visible' : 'hidden',
            }" :class="{
              locked: !MASS_DILATION.canBuy(idx)
            }">
      <div style="min-height: 80px">
        <template v-if="upg.max > 1">
          [Level {{ formatInteger(upg.cost.amt.value) }}{{ upg.max < Infinity ? " / " + formatInteger(upg.max) : "" }}]<br />
        </template>
        {{  unref(upg.desc) }}.<br />
        {{  upg.effDesc ? "Currently: " + upg.effDesc(upg.eff.value) : "" }}
      </div>
      {{ upg.cost.amt.value.lt(upg.max) ? ("Cost: " + formatMass(upg.cost.cost.value)) : ""}}
    </button>
    </div>
  </div>
</template>
<script setup>
import Tooltip from "../core/Tooltip.vue";
import { MASS_DILATION } from "./md";
import { formatInteger, formatMass, formatMult, format, formatGain } from "../core/format";
import { player } from "../core/save"
import { computed, unref } from "vue";

const dilateText = computed(() => {
  if (!player.md.active) return "Dilate Mass"

  const gain = MASS_DILATION.rpGain.value
  if (gain.gte(1)) return `Cancel dilation for ${formatInteger(gain)} Relativistic Particles`
  return `Reach ${formatMass(MASS_DILATION.rpNextAt.value)} to gain more Relativistic Particles`
})
</script>
<style scoped>
.md {
  border-color: darkgreen;
  background-color: #171717;
}

.md:not(.locked):hover {
  border-color: #00ce00;
  background-color: #003a00;
  box-shadow: 0 0 10px #00ce00;
}

.md.locked {
  border-color: #303030;
  cursor: default;
}
</style>
