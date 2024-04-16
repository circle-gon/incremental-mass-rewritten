<template>
  <div class="table-center" style="min-height: 180px">
    <Rank :num="0" />
    <Rank :num="1" />
    <Rank :num="2" />
  </div>
  <br /><br />
  <Building name="mass1" />
  <Building name="mass2" />
  <Building name="mass3" />
  <br /><br />
  <Building name="tickspeed" />
</template>
<script setup>
import Rank from './Rank.vue';
import Building from './Building.vue';
</script>
