<template>
  You have {{ formatInteger(player.atom.quark) }} unassigned Quarks.<br /><br />
  <div>
    <button class="btn" @click="assignParticles">Distribute</button><br /><br />
    <input
      v-for="(particle, i) in PARTICLES"
      :style="{ color: particle.color }"
      type="number"
      class="input-ratio"
      v-model="splits[i].value"
    />
  </div>
  <br /><br />
  Ratio mode: {{ RATIO_DESC[player.atom.split] }}<br />
  <button class="btn" v-for="i in 3" @click="player.atom.split = i - 1">
    {{ RATIO_DESC[i - 1] }}</button
  ><br /><br />
  <div class="table-center" style="justify-content: space-evenly">
    <div style="width: 30%" v-for="(particle, i) in PARTICLES">
      <button class="btn" @click="assignParticle(i)">Assign</button><br /><br />
      <div
        style="min-height: 120px"
        :style="{
          color: particle.color,
        }"
      >
        <h2>
          <span>{{ formatInteger(player.atom.particles[i]) }}</span>
          {{ particle.name }}
        </h2>
        {{ hasElement(29) ? formatGain(player.atom.particles[i], player.atom.quark.div(10)) : ""}},
        <br />
        which generates
        <span>{{ format(powerGain(i)) }}</span>
        {{ particle.name }} Powers.<br />
        You have
        <span
          >{{ format(player.atom.powers[i]) }}
          {{ formatGain(player.atom.powers[i], powerGain(i)) }}</span
        >
        {{ particle.name }}
        Powers, which:
      </div>
      <br />
      <div>{{ desc(particle)[0] }}<br /><br />{{ desc(particle)[1] }}</div>
    </div>
  </div>
</template>
<script setup>
import { player } from "../core/save";
import { formatInteger, formatGain, format } from "../core/format";
import { PARTICLES, assignParticle, assignParticles, powerGain } from "./atom";
import { hasElement } from "./elements";
import { computed } from "vue";

const RATIO_DESC = ["+1", "25%", "100%"];
const splits = Array(PARTICLES.length)
  .fill()
  .map((_, i) =>
    computed({
      get: () => player.atom.ratio[i],
      set: (v) => {
        const num = Math.max(Number(v), 1);
        player.atom.ratio[i] = num;
      },
    }),
  );

function desc(particle) {
  return particle.desc(particle.effect.value);
}
</script>
<style scoped>
.input-ratio {
  width: 100px;
  border: solid 2px white;
  background-color: #171717;
}
</style>
