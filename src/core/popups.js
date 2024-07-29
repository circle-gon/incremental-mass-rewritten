import { reactive, ref } from "vue";
import Quote from "../popups/Quote.vue";
import Help from "../popups/Help.vue";
import Fonts from "../popups/Fonts.vue";
import Notations from "../popups/Notations.vue";
import { curryComponent, textComponent } from "./utils";
import { hardReset, load, player } from "./save";
import { rageReset } from "../main/rage";
import { DMReset } from "../main/dm";
import { atomReset } from "../atom/atom";
import { supernovaReset } from "../supernova/supernova";

export const activePopups = reactive([]);

const activeNotify = [];
export const activeNotif = ref("");

const QUOTES = [
  {
    title: "The First Lift",
    desc: "Your potential of gaining weight starts here. How much mass can you gain?",
  },
  {
    title: "Rage Power",
    desc: "You feel outrageous and want to be energy-efficient. You are stronger with less effort needed.",
  },
  {
    title: "The Black Hole",
    desc: "You pull up a hidden mystery of the cosmos. The force is so strong, it forms a black hole!",
  },
  {
    title: "The Atom",
    desc: "You discovered a Atom! You decompose it to find a physical miracle: Gravity. This helps you to go further!",
  },
  {
    title: "Supernova Created",
    desc: "A new age of stars rises, while the stars collapsed.  Neutron stars felt elder...",
  },
];

export const POPUPS = {
  hardReset: {
    type: "confirm",
    comp: textComponent("Do you want to hard reset?"),
    result: (x) => {
      if (x) hardReset();
    },
  },
  import: {
    type: "input",
    comp: textComponent(
      "Paste in your save. WARNING: this will overwrite your current save!",
    ),
    result: load,
  },
  help: {
    type: "popup",
    comp: Help,
  },
  fonts: {
    type: "popup",
    comp: Fonts,
  },
  notations: {
    type: "popup",
    comp: Notations,
  },
  rp: {
    type: "confirm",
    comp: textComponent("Do you want to rage reset?"),
    result: (x) => {
      if (x) rageReset();
    },
  },
  dm: {
    type: "confirm",
    comp: textComponent("Do you want to dark matter reset?"),
    result: (x) => {
      if (x) DMReset();
    },
  },
  atom: {
    type: "confirm",
    comp: textComponent("Do you want to atom reset?"),
    result: (x) => {
      if (x) atomReset();
    },
  },
  supernova: {
    type: "confirm",
    comp: textComponent("Do you want to supernova reset?"),
    result: (x) => {
      if (x) supernovaReset();
    },
  },
  ...Object.fromEntries(
    QUOTES.map((i, x) => [
      "quote" + x,
      {
        type: "popup",
        comp: curryComponent(Quote, {
          num: x,
          ...i,
        }),
        text: "Let's go!",
      },
    ]),
  ),
};

export function showPopup(id) {
  activePopups.push(id);
}

export function showQuote(num) {
  if (player.quotes.includes(num)) return;

  player.quotes.push(num);
  showPopup("quote" + num);
}

export function removePopup(id) {
  activePopups.splice(activePopups.indexOf(id), 1);
}

export function notify(text, duration = 3) {
  activeNotify.push({
    text,
    duration,
  });

  if (activeNotif.value === "") updateNotify();
}

function updateNotify() {
  const now = activeNotify.shift();
  activeNotif.value = now.text;

  setTimeout(() => {
    activeNotif.value = "";

    setTimeout(() => {
      if (activeNotify.length > 0) updateNotify();
    }, 750);
  }, now.duration * 1000);
}
