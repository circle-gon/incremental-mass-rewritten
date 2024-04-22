// i have no idea how good this is because i literally copied and pasted it
import Decimal from "break_eternity.js";
import { player } from "./save";
import { TPS, mlt } from "./utils";

const GREEK = "βζλψΣΘΨω";
const ELEMENT_LIST = [
  ["H"],
  ["He", "Li", "Be", "B", "C", "N", "O", "F"],
  ["Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl"],
  [
    "Ar",
    "K",
    "Ca",
    "Sc",
    "Ti",
    "V",
    "Cr",
    "Mn",
    "Fe",
    "Co",
    "Ni",
    "Cu",
    "Zn",
    "Ga",
    "Ge",
    "As",
    "Se",
    "Br",
  ],
  [
    "Kr",
    "Rb",
    "Sr",
    "Y",
    "Zr",
    "Nb",
    "Mo",
    "Tc",
    "Ru",
    "Rh",
    "Pd",
    "Ag",
    "Cd",
    "In",
    "Sn",
    "Sb",
    "Te",
    "I",
  ],
  [
    "Xe",
    "Cs",
    "Ba",
    "La",
    "Ce",
    "Pr",
    "Nd",
    "Pm",
    "Sm",
    "Eu",
    "Gd",
    "Tb",
    "Dy",
    "Ho",
    "Er",
    "Tm",
    "Yb",
    "Lu",
    "Hf",
    "Ta",
    "W",
    "Re",
    "Os",
    "Ir",
    "Pt",
    "Au",
    "Hg",
    "Tl",
    "Pb",
    "Bi",
    "Po",
    "At",
  ],
  [
    "Rn",
    "Fr",
    "Ra",
    "Ac",
    "Th",
    "Pa",
    "U",
    "Np",
    "Pu",
    "Am",
    "Cm",
    "Bk",
    "Cf",
    "Es",
    "Fm",
    "Md",
    "No",
    "Lr",
    "Rf",
    "Db",
    "Sg",
    "Bh",
    "Hs",
    "Mt",
    "Ds",
    "Rg",
    "Cn",
    "Nh",
    "Fl",
    "Mc",
    "Lv",
    "Ts",
  ],
  ["Og"],
];

const ST_NAMES = [
  null,
  [
    ["", "U", "D", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No"],
    ["", "Dc", "Vg", "Tg", "Qag", "Qtg", "Sxg", "Spg", "Ocg", "Nog"],
    ["", "Ce", "De", "Te", "Qae", "Qte", "Sxe", "Spe", "Oce", "Noe"],
  ],
  [
    ["", "Mi", "Mc", "Na", "Pc", "Fm", "At", "Zp", "Yc", "Xn"],
    ["", "Me", "Du", "Tr", "Te", "Pe", "He", "Hp", "Ot", "En"],
    ["", "c", "Ic", "TCn", "TeC", "PCn", "HCn", "HpC", "OCn", "ECn"],
    ["", "Hc", "DHe", "THt", "TeH", "PHc", "HHe", "HpH", "OHt", "EHc"],
  ],
];

const INFINITY_NUM = Decimal.dNumberMax;
const SUBSCRIPT_NUMBERS = "₀₁₂₃₄₅₆₇₈₉";

function toSubscript(value) {
  return value
    .toFixed(0)
    .split("")
    .map((x) => (x === "-" ? "₋" : SUBSCRIPT_NUMBERS[parseInt(x, 10)]))
    .join("");
}

const FORMATS = {
  omega: {
    format(value) {
      const step = Decimal.floor(value.div(1000));
      const omegaAmount = Decimal.floor(step.div(GREEK.length));
      let lastLetter =
        GREEK[step.toNumber() % GREEK.length] +
        toSubscript(value.toNumber() % 1000);
      const beyondGreekArrayBounds =
        GREEK[step.toNumber() % GREEK.length] === undefined;
      if (beyondGreekArrayBounds || step.toNumber() > Number.MAX_SAFE_INTEGER) {
        lastLetter = "ω";
      }
      const omegaOrder = Decimal.log(value, 8000);
      if (omegaAmount.equals(0)) {
        return lastLetter;
      } else if (omegaAmount.gt(0) && omegaAmount.lte(3)) {
        const omegas = [];
        for (let i = 0; i < omegaAmount.toNumber(); i++) {
          omegas.push("ω");
        }
        return `${omegas.join("^")}^${lastLetter}`;
      } else if (omegaAmount.gt(3) && omegaAmount.lt(10)) {
        return `ω(${omegaAmount.toFixed(0)})^${lastLetter}`;
      } else if (omegaOrder.lt(3)) {
        return `ω(${this.format(omegaAmount)})^${lastLetter}`;
      } else if (omegaOrder.lt(6)) {
        return `ω(${this.format(omegaAmount)})`;
      }
      let val = Decimal.pow(8000, omegaOrder.toNumber() % 1);
      if (omegaOrder.gte(1e20)) val = Decimal.dOne;
      const orderStr = omegaOrder.lt(100)
        ? Math.floor(omegaOrder.toNumber()).toFixed(0)
        : this.format(Decimal.floor(omegaOrder));
      return `ω[${orderStr}](${this.format(val)})`;
    },
  },
  omega_short: {
    format(value) {
      const step = Decimal.floor(value.div(1000));
      const omegaAmount = Decimal.floor(step.div(GREEK.length));
      let lastLetter =
        GREEK[step.toNumber() % GREEK.length] +
        toSubscript(value.toNumber() % 1000);
      const beyondGreekArrayBounds =
        GREEK[step.toNumber() % GREEK.length] === undefined;
      if (beyondGreekArrayBounds || step.toNumber() > Number.MAX_SAFE_INTEGER) {
        lastLetter = "ω";
      }
      const omegaOrder = Decimal.log(value, 8000);
      if (omegaAmount.equals(0)) {
        return lastLetter;
      } else if (omegaAmount.gt(0) && omegaAmount.lte(2)) {
        const omegas = [];
        for (let i = 0; i < omegaAmount.toNumber(); i++) {
          omegas.push("ω");
        }
        return `${omegas.join("^")}^${lastLetter}`;
      } else if (omegaAmount.gt(2) && omegaAmount.lt(10)) {
        return `ω(${omegaAmount.toFixed(0)})^${lastLetter}`;
      }
      let val = Decimal.pow(8000, omegaOrder.toNumber() % 1);
      if (omegaOrder.gte(1e20)) val = Decimal.dOne;
      const orderStr = omegaOrder.lt(100)
        ? Math.floor(omegaOrder).toFixed(0)
        : this.format(Decimal.floor(omegaOrder));
      return `ω[${orderStr}](${this.format(val)})`;
    },
  },
  elemental: {
    getOffset(group) {
      if (group === 1) return 1;
      const n = Math.floor(group / 2);
      let r = (2 * n * (n + 1) * (2 * n + 1)) / 3 - 2;
      if (group % 2 === 1) r += 2 * Math.pow(n + 1, 2);
      return r;
    },
    getAbbreviation(group, progress) {
      const length = this.abbreviationLength(group);
      const elemRel = Math.floor(length * progress);

      const elem = elemRel + this.getOffset(group);

      return elem > 118
        ? this.beyondOg(elem)
        : ELEMENT_LIST[group - 1][elemRel];
    },
    beyondOg(x) {
      const log = Math.floor(Math.log10(x));
      const list = ["n", "u", "b", "t", "q", "p", "h", "s", "o", "e"];
      let r = "";
      for (var i = log; i >= 0; i--) {
        const n = Math.floor(x / Math.pow(10, i)) % 10;
        if (r === "") r = list[n].toUpperCase();
        else r += list[n];
      }
      return r;
    },
    abbreviationLength(group) {
      return group === 1 ? 1 : Math.pow(Math.floor(group / 2) + 1, 2) * 2;
    },
    getAbbreviationAndValue(x) {
      const abbreviationListUnfloored = x.log(118).toNumber();
      const abbreviationListIndex = Math.floor(abbreviationListUnfloored) + 1;
      const abbreviationLength = this.abbreviationLength(abbreviationListIndex);
      const abbreviationProgress =
        abbreviationListUnfloored - abbreviationListIndex + 1;
      const abbreviationIndex = Math.floor(
        abbreviationProgress * abbreviationLength,
      );
      const abbreviation = this.getAbbreviation(
        abbreviationListIndex,
        abbreviationProgress,
      );
      const value = Decimal.pow(
        118,
        abbreviationListIndex + abbreviationIndex / abbreviationLength - 1,
      );
      return [abbreviation, value];
    },
    formatElementalPart(abbreviation, n) {
      if (n.eq(1)) {
        return abbreviation;
      }
      return `${n} ${abbreviation}`;
    },
    format(value, acc) {
      if (value.gt(Decimal.pow(118, 4).pow_base(118).pow_base(118)))
        return "e" + this.format(value.log10(), acc);

      let log = value.log(118);
      const slog = log.log(118);
      const sslog = slog.log(118).toNumber();
      const max = Math.max(4 - sslog * 2, 1);
      const parts = [];
      while (log.gte(1) && parts.length < max) {
        const [abbreviation, value] = this.getAbbreviationAndValue(log);
        const n = log.div(value).floor();
        log = log.sub(n.mul(value));
        parts.unshift([abbreviation, n]);
      }
      if (parts.length >= max) {
        return parts
          .map((x) => this.formatElementalPart(x[0], x[1]))
          .join(" + ");
      }
      const formattedMantissa = Decimal.pow(118, log).toFixed(
        parts.length === 1 ? 3 : acc,
      );
      if (parts.length === 0) {
        return formattedMantissa;
      }
      if (parts.length === 1) {
        return `${formattedMantissa} × ${this.formatElementalPart(
          parts[0][0],
          parts[0][1],
        )}`;
      }
      return `${formattedMantissa} × (${parts
        .map((x) => this.formatElementalPart(x[0], x[1]))
        .join(" + ")})`;
    },
  },
  old_sc: {
    format(ex, acc) {
      const e = ex.log10().floor();
      if (e.lt(9)) {
        if (e.lt(3)) {
          return ex.toFixed(acc);
        }
        return ex
          .floor()
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      } else {
        if (ex.gte("eeee10")) {
          const slog = ex.slog();
          return (
            (slog.gte(1e9)
              ? ""
              : Decimal.pow10(slog.sub(slog.floor())).toFixed(4)) +
            "F" +
            this.format(slog.floor(), 0)
          );
        }
        const m = ex.div(Decimal.pow10(e));
        return (e.log10().gte(9) ? "" : m.toFixed(4)) + "e" + this.format(e, 0);
      }
    },
  },
  eng: {
    format(ex, acc) {
      const e = ex.log10().floor();
      if (e.lt(9)) {
        if (e.lt(3)) {
          return ex.toFixed(acc);
        }
        return ex
          .floor()
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      } else {
        if (ex.gte("eeee10")) {
          const slog = ex.slog();
          return (
            (slog.gte(1e9)
              ? ""
              : Decimal.pow10(slog.sub(slog.floor())).toFixed(4)) +
            "F" +
            this.format(slog.floor(), 0)
          );
        }
        const m = ex.div(Decimal.pow(1000, e.div(3).floor()));
        return (
          (e.log10().gte(9)
            ? ""
            : m.toFixed(Decimal.sub(4, e.sub(e.div(3).floor().mul(3))))) +
          "e" +
          this.format(e.div(3).floor().mul(3), 0)
        );
      }
    },
  },
  mixed_sc: {
    format(ex, acc, max) {
      const e = ex.log10().floor();
      if (e.lt(63) && e.gte(max)) return format(ex, acc, max, "st");
      else {
        const m = ex.div(Decimal.pow10(e));
        return e.gte(1e3)
          ? (e.gte(1e9) ? "" : m.toFixed(4)) + "e" + this.format(e, 0, max)
          : format(ex, acc, max, "sc");
      }
    },
  },
  sc: {
    format(ex, acc, max) {
      const neg = ex.lt(0) ? "-" : "";
      const e = ex.log10().floor();
      if (ex.log10().lt(Math.min(-acc, 0)) && acc > 1) {
        const e = ex.log10().ceil();
        const m = ex.div(e.eq(-1) ? new Decimal(0.1) : Decimal.pow10(e));
        const be = e.mul(-1).max(1).log10().gte(9);
        return neg + (be ? "" : m.toFixed(4)) + "e" + format(e, 0, max, "sc");
      } else if (e.lt(max)) {
        const a = Math.max(Math.min(acc - e.toNumber(), acc), 0);
        return (
          neg +
          (a > 0
            ? ex.toFixed(a)
            : ex
                .toFixed(a)
                .toString()
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"))
        );
      } else {
        if (ex.gte("eeee10")) {
          const slog = ex.slog();
          return (
            (slog.gte(1e9)
              ? ""
              : Decimal.pow10(slog.sub(slog.floor())).toFixed(4)) +
            "F" +
            format(slog.floor(), 0)
          );
        }
        const m = ex.div(Decimal.pow10(e));
        const be = e.log10().gte(9);
        return neg + (be ? "" : m.toFixed(4)) + "e" + format(e, 0, max, "sc");
      }
    },
  },
  layer: {
    layers: [
      "INFINITY_NUMinity",
      "eternity",
      "reality",
      "equality",
      "affinity",
      "celerity",
      "identity",
      "vitality",
      "immunity",
      "atrocity",
    ],
    format(ex, acc, max) {
      const layer = ex.max(1).log10().max(1).log(INFINITY_NUM.log10()).floor();
      if (layer.lte(0)) return format(ex, acc, max, "sc");
      ex = Decimal.pow10(
        ex
          .max(1)
          .log10()
          .div(INFINITY_NUM.log10().pow(layer))
          .sub(layer.gte(1) ? 1 : 0),
      );
      const meta = layer.div(10).floor();
      const layer_id = (layer.toNumber() % 10) - 1;
      return (
        format(ex, Math.max(4, acc), max, "sc") +
        " " +
        (meta.gte(1)
          ? "meta" + (meta.gte(2) ? "^" + format(meta, 0, max, "sc") : "") + "-"
          : "") +
        (isNaN(layer_id) ? "nanity" : this.layers[layer_id])
      );
    },
  },
  st: {
    tier1(x) {
      return (
        ST_NAMES[1][0][x % 10] +
        ST_NAMES[1][1][Math.floor(x / 10) % 10] +
        ST_NAMES[1][2][Math.floor(x / 100)]
      );
    },
    tier2(x) {
      const o = x % 10;
      const t = Math.floor(x / 10) % 10;
      const h = Math.floor(x / 100) % 10;

      let r = "";
      if (x < 10) return ST_NAMES[2][0][x];
      if (t === 1 && o === 0) r += "Vec";
      else r += ST_NAMES[2][1][o] + ST_NAMES[2][2][t];
      r += ST_NAMES[2][3][h];

      return r;
    },
    format(ex, acc, max) {
      let e3 = ex.log(1e3).floor();
      const neg = ex.lt(0) ? "-" : "";
      const e = ex.log10().floor();
      if (e3.lt(1)) {
        return neg + ex.toFixed(Math.max(Math.min(acc - e.toNumber(), acc), 0));
      } else {
        const e3_mul = e3.mul(3);
        const ee = e3.log10().floor();
        if (ee.gte(3000)) return "e" + format(e, acc, max, "st");

        let final = "";
        if (e3.lt(4)) final = ["", "K", "M", "B"][Math.round(e3.toNumber())];
        else {
          let ee3 = Math.floor(e3.log(1e3).toNumber());
          if (ee3 < 100) ee3 = Math.max(ee3 - 1, 0);
          e3 = e3.sub(1).div(Decimal.pow10(ee3 * 3));
          while (e3.gt(0)) {
            const div1000 = e3.div(1e3).floor();
            const mod1000 = e3.sub(div1000.mul(1e3)).floor().toNumber();
            if (mod1000 > 0) {
              if (mod1000 === 1 && !ee3) final = "U";
              if (ee3) final = this.tier2(ee3) + (final ? "-" + final : "");
              if (mod1000 > 1) final = this.tier1(mod1000) + final;
            }
            e3 = div1000;
            ee3++;
          }
        }

        const m = ex.div(Decimal.pow10(e3_mul));
        return (
          neg +
          (ee.gte(10)
            ? ""
            : m.toFixed(
                Decimal.sub(3, e.sub(e3_mul))
                  .add(acc === 0 ? 0 : 1)
                  .toNumber(),
              ) + " ") +
          final
        );
      }
    },
  },
  inf: {
    format(ex, acc, max) {
      let meta = 0;
      const symbols = ["", "∞", "Ω", "Ψ", "ʊ"];
      const symbols2 = ["", "", "m", "mm", "mmm"];
      while (ex.gte(INFINITY_NUM)) {
        ex = ex.log(INFINITY_NUM);
        meta++;
      }

      if (meta === 0) return format(ex, acc, max, "sc");
      if (ex.gte(3))
        return (
          symbols2[meta] +
          symbols[meta] +
          "ω^" +
          format(ex.sub(1), acc, max, "sc")
        );
      if (ex.gte(2))
        return (
          symbols2[meta] +
          "ω" +
          symbols[meta] +
          "-" +
          format(INFINITY_NUM.pow(ex.sub(2)), acc, max, "sc")
        );
      return (
        symbols2[meta] +
        symbols[meta] +
        "-" +
        format(INFINITY_NUM.pow(ex.sub(1)), acc, max, "sc")
      );
    },
  },
};

export function format(n, acc = 4, max = 12, type = player.options.notation) {
  let num = new Decimal(n);
  const neg = num.lt(0) ? "-" : "";
  if (!Decimal.isFinite(num)) return neg + " Infinite";
  if (Decimal.isNaN(num)) return neg + "NaN";
  if (num.lt(0)) num = num.mul(-1);
  if (num.eq(0)) return num.toFixed(acc);

  return neg + FORMATS[type].format(num, acc, max);
}

export function formatInteger(n) {
  return format(n, 0);
}

export function formatMass(e) {
  const md = player.options.massDis;
  const ex = new Decimal(e);
  if (md === 1) return format(ex) + " g";
  else if (md === 2)
    return format(ex.div(1.5e56).max(1).log10().div(1e9)) + " mlt";
  else if (md === 3) {
    return ex.gte("ee14979")
      ? formatARV(ex)
      : ex.gte(mlt(1))
        ? format(ex.div(1.5e56).max(1).log10().div(1e9)) + " mlt"
        : format(ex) + " g";
  }

  if (ex.gte(mlt(1))) return formatARV(ex);
  if (ex.gte(1.5e56)) return format(ex.div(1.5e56)) + " uni";
  if (ex.gte(2.9835e45)) return format(ex.div(2.9835e45)) + " MMWG";
  if (ex.gte(1.989e33)) return format(ex.div(1.989e33)) + " M☉";
  if (ex.gte(5.972e27)) return format(ex.div(5.972e27)) + " M⊕";
  if (ex.gte(1.619e20)) return format(ex.div(1.619e20)) + " MME";
  if (ex.gte(1e6)) return format(ex.div(1e6)) + " tonne";
  if (ex.gte(1e3)) return format(ex.div(1e3)) + " kg";
  return format(ex) + " g";
}

function getMltValue(m) {
  const mass = new Decimal(m);
  if (mass.lte(1e50)) {
    return mass.div(1.5e56).mul(Decimal.log10(Math.E)).div(1e9);
  } else {
    return mass.div(1.5e56).add(1).log10().div(1e9);
  }
}

const ARV = ["mlt", "mgv", "giv", "tev", "pev", "exv", "zev", "yov"];

function formatARV(ex, gain = false) {
  let mlt = getMltValue(ex);
  if (gain) mlt = ex;
  let arv = mlt.log10().div(15).floor();
  if (
    player.options.massDis === 2 ||
    (player.options.massDis === 3 && arv.lt(1002))
  )
    arv = Decimal.dZero;
  if (arv.add(2).gte(1000)) return format(mlt.log10().div(15).add(2)) + " arvs";
  return (
    format(mlt.div(Decimal.pow(1e15, arv))) +
    " " +
    (arv.gte(8) ? "arv^" + format(arv.add(2), 0) : ARV[arv.toNumber()])
  );
}

export function formatGain(amt, gain, isMass = false) {
  const md = player.options.massDis;
  const f = isMass ? formatMass : format;
  const next = amt.add(gain);
  let rate;
  let ooms = next.max(1).log10().div(amt.max(1).log10());
  if (
    ((ooms.gte(10) && amt.gte("ee100")) ||
      (ooms.gte(10 ** (1 / TPS.value)) && amt.gte("ee1000"))) &&
    (!isMass || md === 1 || md === 2)
  ) {
    ooms = ooms.log10().mul(TPS.value);
    rate = "(+" + format(ooms) + " OoMs^2/sec)";
  } else {
    ooms = next.div(amt);
    if ((ooms.gte(10) && amt.gte(1e100)) || (isMass && md === 2)) {
      ooms = ooms.log10().mul(TPS.value);
      if (isMass && amt.gte(mlt(1)) && ooms.gte(1e6) && md !== 1) {
        const mlt_amt = getMltValue(amt);
        const mlt_next = getMltValue(amt.add(gain.div(TPS.value)));
        rate =
          "(+" +
          formatARV(mlt_next.sub(mlt_amt).mul(TPS.value), true) +
          "/sec)";
      } else rate = "(+" + format(ooms) + " OoMs/sec)";
      if ((md === 0 || md === 3) && isMass) {
        const arv_amt = getMltValue(amt).log10().div(15);
        const arv_next = getMltValue(amt.add(gain.div(TPS.value)))
          .log10()
          .div(15);
        if (
          getMltValue(gain).log10().div(15).gte(1000) ||
          arv_next.sub(arv_amt).gte(10)
        )
          rate =
            "(+" + format(arv_next.sub(arv_amt).mul(TPS.value)) + " arvs/sec)";
      }
    } else rate = "(+" + f(gain) + "/sec)";
  }
  return rate;
}

export function formatTime(e, acc = 2, type = "s") {
  const ex = new Decimal(e);
  if (ex.gte(86400))
    return (
      format(ex.div(86400).floor(), 0, 12, "sc") +
      ":" +
      formatTime(ex.mod(86400), acc, "d")
    );
  if (ex.gte(3600) || type === "d")
    return (
      (ex.div(3600).gte(10) || type !== "d" ? "" : "0") +
      format(ex.div(3600).floor(), 0, 12, "sc") +
      ":" +
      formatTime(ex.mod(3600), acc, "h")
    );
  if (ex.gte(60) || type === "h")
    return (
      (ex.div(60).gte(10) || type !== "h" ? "" : "0") +
      format(ex.div(60).floor(), 0, 12, "sc") +
      ":" +
      formatTime(ex.mod(60), acc, "m")
    );
  return (ex.gte(10) || type !== "m" ? "" : "0") + format(ex, acc, 12, "sc");
}

export function formatReduction(ex) {
  const e = new Decimal(ex)
  if (e.lte(0.1)) return "/" + format(e.recip())
  return "-" + format(e.neg().add(1).mul(100)) + "%";
}

export function formatPercent(ex, acc = 4) {
  return format(Decimal.mul(ex, 100), acc) + "%";
}

export function formatMult(ex, acc = 4) {
  return Decimal.gte(ex, 1) || Decimal.eq(ex, 0)
    ? "×" + format(ex, acc)
    : "/" + format(ex.pow(-1), acc);
}
