import { computed } from "vue";
import { player } from "./save";
import { format, formatGain, formatInteger, formatMass } from "./format";
import { massGain } from "../main/mass";
import { manualRageReset, ragePowerGain } from "../main/rage";
import { bhGain, darkMatterGain, manualDMReset } from "../main/dm";
import { hasUpgrade } from "../main/upgrades";
import { uni } from "./utils";
import { atomGain, manualAtomReset, quarkGain } from "../atom/atom";
import { elementEffect, hasElement } from "../atom/elements";

export default {
  mass: {
    name: "Mass",
    tooltip: computed(
      () => `You have pushed <b>${formatMass(player.mass)}</b>.`,
    ),
    show: computed(() => true),
    desc: computed(() => [
      formatMass(player.mass),
      formatGain(player.mass, massGain.value, true),
    ]),
  },
  rage: {
    name: "Rage Power",
    tooltip: computed(
      () => `<i>Reach <b>${formatMass(1e16)}</b> Mass to gain Rage Powers.</i>`,
    ),
    class: "red",
    show: computed(() => true),
    desc: computed(() => [
      formatInteger(player.rage.power),
      hasUpgrade("dm", 5)
        ? formatGain(player.rage.power, ragePowerGain.value)
        : `(+${formatInteger(ragePowerGain.value)})`,
    ]),
    click() {
      manualRageReset();
    },
  },
  dm: {
    name: "Dark Matter",
    tooltip: computed(
      () =>
        `<i>Reach <b>${format(1e22, 0)}</b> Rage Power to gain Dark Matter.</i>`,
    ),
    class: "yellow",
    show: computed(() => player.rage.unlocked),
    desc: computed(() => [
      formatInteger(player.dm.darkMatter),
      hasUpgrade("atom", 5)
        ? formatGain(player.dm.darkMatter, darkMatterGain.value)
        : `(+${formatInteger(darkMatterGain.value)})`,
    ]),
    click() {
      manualDMReset();
    },
  },
  bh: {
    name: "Black Hole",
    tooltip: computed(
      () => `Your Black Hole is at ${formatMass(player.dm.mass)}.`,
    ),
    class: "yellow",
    show: computed(() => player.dm.unlocked),
    desc: computed(() => [
      formatMass(player.dm.mass),
      formatGain(player.dm.mass, bhGain.value, true),
    ]),
  },
  atom: {
    name: "Atom",
    tooltip: computed(
      () =>
        `<i>Reach <b>${formatMass(uni(1e90))}</b> of Black Hole to gain Atoms & Quarks.</i>`,
    ),
    show: computed(() => player.dm.unlocked),
    desc: computed(() => [
      formatInteger(player.atom.atom),
      `(+${formatInteger(atomGain.value)})`,
    ]),
    click() {
      manualAtomReset();
    },
  },
  quark: {
    name: "Quark",
    tooltip: computed(
      () => `You have <b>${formatInteger(player.atom.quark)}</b> Quark.`,
    ),
    class: "quark-color",
    show: computed(() => player.atom.unlocked),
    desc: computed(() => [
      formatInteger(player.atom.quark),
      hasElement(13) 
        ? formatGain(player.atom.quark, quarkGain.value.mul(elementEffect(13))) 
        : `(+${formatInteger(quarkGain.value)})`,
    ]),
  },
};
