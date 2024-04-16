<template>
  <div class="popup">
    <div>
      <component :is="popup.comp" />
    </div>
    <br />
    <button
      v-if="popup.type === 'popup'"
      class="btn"
      @click="removePopup(popupName)"
    >
      {{ popup.text ?? "Ok" }}
    </button>
    <template v-else-if="popup.type === 'confirm'">
      <button
        class="btn"
        @click="
          popup.result(true);
          removePopup(popupName);
        "
      >
        Yes
      </button>
      <button
        class="btn"
        @click="
          popup.result(false);
          removePopup(popupName);
        "
      >
        No
      </button>
    </template>
    <template v-else>
      <input v-model="input" />
      <br />
      <button
        class="btn"
        @click="
          popup.result(input);
          removePopup(popupName);
        "
      >
        Ok
      </button>
    </template>
  </div>
</template>
<script setup>
import { POPUPS, removePopup } from "./popups";
import { ref, computed } from "vue";

const input = ref("");

const props = defineProps({
  popupName: {
    type: String,
    required: true,
  },
});

const popup = computed(() => POPUPS[props.popupName]);
</script>
<style scoped>
.popup {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  border: solid 2px white;
  background-color: #171717;
  padding: 7px 25px;
  pointer-events: auto;
  max-width: 600px;
  max-height: 400px;
}

.popup > input {
  width: 300px;
  margin-bottom: 10px;
}
</style>
