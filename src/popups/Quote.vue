<template>
  <h2>Chapter {{ num + 1 }}: {{ title }}</h2>
  <br />
  <img class="quote" :src="src" /><br />
  {{ desc }}
</template>
<script setup>
const props = defineProps({
  num: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
});

const src = new URL(`../images/quotes/${props.num}.png`, import.meta.url).href;
</script>
