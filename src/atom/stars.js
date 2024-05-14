import { computed } from "vue"
import { player } from "../core/save"
import Decimal from "break_eternity.js"
import { MASS_DILATION } from "./md"

const REQUIREMENTS = [Infinity]

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
    let gain = Decimal.dOne.add(i);
    if (player.md.upgrades[8].gte(1)) gain = gain.mul(MASS_DILATION.effect(8))
    return gain
}

const gain = computed(() => {
    return player.stars.stars[0]
})

const effect = computed(() => {
    return 1
})

export const STARS = {
    count: REQUIREMENTS.length,
    nextAt,
    unlock,
    starGain,
    gain,
    effect
}