import { computed, unref } from "vue";
import Decimal from "break_eternity.js";

export function manualCostScaling(data) {
  const costFunc = data.cost;
  const cost = computed(() => costFunc(data.amt.value));
  const max = computed(() => data.invert(data.res.value).floor().add(1));
  return {
    cost,
    costFunc,
    amt: data.amt,
    canAfford: computed(() => data.res.value.gte(cost.value)),
    max,
    buy(amount) {
      const amt = data.amt.value;
      const res = data.res.value;

      if (res.lt(cost.value)) return;

      const ab = max.value.sub(amt).max(0).min(amount).add(amt);

      if (ab.eq(amt)) return;

      data.amt.value = ab;

      if (unref(data.spend)) {
        data.res.value = res.sub(costFunc(ab.sub(1))).max(0);
      }
    },
  };
}

export function costScaling(data) {
  const trueAmt = (amt) => (data.cost ? data.cost(amt) : amt);
  const trueInvert = (amt) => (data.invert ? data.invert(amt) : amt);
  return manualCostScaling({
    ...data,
    cost: (amt) =>
      trueAmt(amt)
        .pow(2)
        .pow_base(unref(data.quad))
        .mul(trueAmt(amt).pow_base(unref(data.linear)))
        .mul(unref(data.base)),
    invert(res) {
      const base = unref(data.base);

      const a = Decimal.log10(unref(data.quad));
      const b = Decimal.log10(unref(data.linear));
      const c = res.div(base).log10();

      if (c.lte(0) || !Decimal.isFinite(base)) return Decimal.dOne.neg();

      let result;

      if (a.eq(0)) {
        result = c.div(b);
      } else {
        result = a.mul(c).mul(4).add(b.sqr()).sqrt().sub(b).div(2).div(a);
      }

      return trueInvert(result);
    },
  });
}
