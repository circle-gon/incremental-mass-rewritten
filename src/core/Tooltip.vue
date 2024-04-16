<template>
  <slot name="content" />
  <Teleport to="body">
    <div v-if="hovered" ref="tooltip" class="tooltip-div" :style="style">
      <slot name="tooltip" />
    </div>
  </Teleport>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed, getCurrentInstance } from "vue";

const props = defineProps({
  pos: {
    type: String,
    default: "top",
    validator: (p) => ["top", "bottom", "left", "right"].includes(p),
  },
  tooltipAlign: {
    type: String,
    default: "center",
    validator: (p) => ["left", "start", "center", "right", "end"].includes(p),
  },
  textAlign: {
    type: String,
    default: "center",
  },
});
const PADX = 5;
const PADY = 5;

const hovered = ref(false);
const time = ref(0);
const content = ref(null);
const tooltip = ref(null);
let interval;
let last;

const style = computed(() => {
  // go away error
  if (content.value === null || tooltip.value === null) return {};

  const ts = Math.sin((time.value * Math.PI) / 2);
  const { pos, tooltipAlign, textAlign } = props;

  const contentRect = content.value.getBoundingClientRect();
  const tooltipRect = tooltip.value.getBoundingClientRect();

  let [dx, dy] = [0, 0];

  if (pos === "bottom") dy = contentRect.bottom + 8 * ts;
  else if (pos === "top") dy = contentRect.top - tooltipRect.height - 8 * ts;
  else if (pos === "left") dx = contentRect.left - tooltipRect.width - 8 * ts;
  else if (pos === "right") dx = contentRect.right + 8 * ts;

  if (pos === "left" || pos === "right") {
    if (tooltipAlign === "left" || tooltipAlign === "start")
      dy = contentRect.top;
    else if (tooltipAlign === "center")
      dy = contentRect.top + (contentRect.height - tooltipRect.height) / 2;
    else if (tooltipAlign === "right" || tooltipAlign === "end") {
      dy = contentRect.bottom - tooltipRect.height;
    }
  } else if (pos === "top" || pos === "bottom") {
    if (tooltipAlign === "left" || tooltipAlign === "start")
      dx = contentRect.left;
    else if (tooltipAlign === "center")
      dx = contentRect.left + (contentRect.width - tooltipRect.width) / 2;
    else if (tooltipAlign === "right" || tooltipAlign === "end") {
      dx = contentRect.right - tooltipRect.width;
    }
  }

  return {
    opacity: ts,
    textAlign,
    top:
      Math.max(
        PADY,
        Math.min(window.innerHeight - tooltipRect.height - PADY, dy),
      ) +
      window.scrollY +
      "px",
    left:
      Math.max(
        PADX,
        Math.min(window.innerWidth - tooltipRect.width - PADX, dx),
      ) +
      window.scrollX +
      "px",
  };
});

onMounted(() => {
  interval = setInterval(() => {
    const now = Date.now();
    const diff = (now - last) / 500;
    last = now;

    if (hovered.value) time.value = Math.min(time.value + diff, 1);
    else time.value = 0;
  }, 50);

  // this is incredibly sketchy but it seems to work
  const { el } = getCurrentInstance().subTree.children[0].children[0];
  el.addEventListener("mouseenter", () => (hovered.value = true));
  el.addEventListener("mouseleave", () => (hovered.value = false));
  content.value = el;
});

onUnmounted(() => clearInterval(interval));
</script>
<style scoped>
.tooltip-div {
  position: absolute;
  z-index: 2;

  background-color: #000e;
  min-width: 20px;
  max-width: 300px;
  min-height: 10px;
  font-size: 13px;
  padding: 5px 10px;

  border: solid 3px #444;
  border-radius: 10px;

  color: white;
  text-align: center;

  pointer-events: none;
}
</style>
