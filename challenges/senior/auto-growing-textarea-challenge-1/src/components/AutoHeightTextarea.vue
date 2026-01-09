<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
const modelValue = defineModel<string>({ default: "" });
const el = ref<HTMLTextAreaElement>();

watch(modelValue, () => {
  updateHeight();
});

async function updateHeight() {
  if (!el.value) {
    return;
  }

  await nextTick();

  el.value.style.height = "auto";
  el.value.style.height = el.value.scrollHeight + "px";
}
</script>
<template>
  <textarea v-model="modelValue" ref="el" rows="1"></textarea>
</template>
