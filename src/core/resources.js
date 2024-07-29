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
import { MASS_DILATION } from "../atom/md";
import { STARS } from "../atom/stars";
import { supernovaGain, supernovaRequirement } from "../supernova/supernova";

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
      () => `Your Black Hole is at <b>${formatMass(player.dm.mass)}</b>.`,
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
      hasElement(23)
        ? formatGain(player.atom.atom, atomGain.value)
        : `(+${formatInteger(atomGain.value)})`,
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
  md: {
    name: "Mass Dilation",
    tooltip: computed(() => {
      const dilationText = player.md.active
        ? `Reach <b>${formatMass(MASS_DILATION.rpNextAt.value)}</b> to gain more Relativistic Particles, or cancel Mass Dilation.<br /><br />`
        : "";
      return `You have <b>${formatMass(player.md.mass)} ${formatGain(player.md.mass, MASS_DILATION.dilatedMassGain.value, true)}</b> Dilated Mass.<br class="line" /><i>${dilationText}${MASS_DILATION.rpText.value}<br /></i>`;
    }),
    class: "green",
    show: computed(() => hasElement(20)),
    desc: computed(() => [
      formatInteger(player.md.particle),
      player.md.active
        ? `(+${formatInteger(MASS_DILATION.rpGain.value)})`
        : "(inactive)",
    ]),
    click() {
      MASS_DILATION.run();
    },
  },
  supernova: {
    name: "Supernova",
    tooltip: computed(
      () =>
        `You have gone Supernova <b>${formatInteger(player.supernova.count)}</b> times. <br class="line" />You have <b>${formatInteger(player.stars.collapsed)}</b> ${formatGain(player.stars.collapsed, STARS.gain.value)} Collapsed Star.<br /><br class="line" /><i>Reach over <b>${format(supernovaRequirement.value)}</b> Collapsed Star to go Supernova.</i>`,
    ),
    class: "magenta",
    show: computed(() => player.supernova.unlocked),
    desc: computed(() => [
      formatInteger(player.supernova.count),
      `(+${formatInteger(supernovaGain.value)})`,
    ]),
  },
};
