<template>
  <h2>Congratulations!</h2><br />
  You have reached the end of this mod. You can keep going, but there will be no
  more content until a future release.<br /><br />
  Current endgame:
  <b>{{ formatInteger(1) }} supernova (~{{ formatMass(MASS_END) }})</b>
</template>
<script setup>
import { formatInteger, formatMass } from "../core/format";
import Decimal from "break_eternity.js";

const MASS_END = new Decimal(1.33e6).pow10();
</script>
