import { computed } from "vue"
import { player } from "../core/save"
import Decimal from "break_eternity.js"
import { MASS_DILATION } from "./md"

const REQUIREMENTS = [1e300, Infinity, Infinity, Infinity, Infinity]

const nextAt = computed(() => {
    const unl = player.stars.unlocked
    if (unl >= REQUIREMENTS.length) return Infinity
    return REQUIREMENTS[unl]
})
function unlock() {
    if (player.atom.quark.lt(nextAt.value)) return
    player.atom.quark = player.atom.quark.sub(nextAt.value)
    player.stars.unlocked++
}

function starGain(i) {
    let gain = Decimal.dOne.add(i).pow(1.5);
    if (player.md.upgrades[8].gte(1)) gain = gain.mul(MASS_DILATION.effect(8))
    return gain
}

const gain = computed(() => {
    let gain = player.stars.stars[0]
    if (player.md.upgrades[8].gte(1)) gain = gain.mul(MASS_DILATION.effect(8))
    return gain
})

const effect = computed(() => {
    const star = player.stars.collapsed.add(1).log10().add(1).pow(2.25)
    const rank = player.ranks[0].add(1).log10().add(1).pow(1.75)
    const tier = player.ranks[1].add(1).log10().mul(2).add(1).pow(2)
    const tetr = player.ranks[2].add(1).log10().add(1).log10().add(1).pow(1.25)
    return star.pow(rank.mul(tier).pow(tetr))
})

export const STARS = {
    count: REQUIREMENTS.length,
    nextAt,
    unlock,
    starGain,
    gain,
    effect
}