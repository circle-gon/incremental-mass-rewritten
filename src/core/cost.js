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

export function quadCostScaling(data) {
  const amtScale = (amt) => (data.amtScale ? data.amtScale(amt) : amt);
  const amtInvert = (amt) => (data.amtInvert ? data.amtInvert(amt) : amt);
  const costScale = (cost) => (data.costScale ? data.costScale(cost) : cost);
  const costInvert = (cost) => (data.costInvert ? data.costInvert(cost) : cost);
  return manualCostScaling({
    amt: data.amt,
    res: data.res,
    spend: data.spend,
    cost: (amt) =>
      costScale(
        amtScale(amt)
          .sqr()
          .pow_base(unref(data.quad))
          .mul(amtScale(amt).pow_base(unref(data.linear)))
          .mul(unref(data.base)),
      ),
    invert(res) {
      const base = unref(data.base);

      const a = Decimal.log10(unref(data.quad));
      const b = Decimal.log10(unref(data.linear));
      const c = costInvert(res).div(base).log10();

      if (c.lte(0) || !Decimal.isFinite(base)) return Decimal.dOne.neg();

      let result;

      if (a.eq(0)) {
        result = c.div(b);
      } else {
        result = a.mul(c).mul(4).add(b.sqr()).sqrt().sub(b).div(2).div(a);
      }

      return amtInvert(result);
    },
  });
}
