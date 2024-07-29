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
export const supernovaTime = ref(0);

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

// The solution to the differential equation dy/dx = k(1-y/c)^n
// A linear function y = kx that slows down over time based on n to reach cap c
export function superlinear(x, k, c, n) {
  if (n < 1) throw new Error("That doesn't sound right...");
  const base = x.mul(k).div(c);
  const sub =
    n === 1
      ? base.neg().exp()
      : base
          .mul(n - 1)
          .add(1)
          .root(1 - n);
  return sub.neg().add(1).mul(c);
}
