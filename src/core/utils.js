/* eslint-disable vue/one-component-per-file */

import Decimal from "break_eternity.js";
import { defineComponent, ref, h } from "vue";

export function uni(x) {
  return Decimal.mul(1.5e56, x);
}
export function mlt(x) {
  return uni("ee9").pow(x);
}

export const TPS = ref(Infinity);

export function curryComponent(comp, props) {
  return defineComponent({
    render: () => h(comp, props),
  });
}

export function textComponent(text) {
  return defineComponent({
    render: () => text,
  });
}

export function dilate(num, expo) {
  if (num.lt(10)) return num;
  return num.log10().pow(expo).pow10();
}
