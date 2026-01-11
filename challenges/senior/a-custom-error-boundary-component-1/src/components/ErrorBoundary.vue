<script setup lang="ts">
import { onErrorCaptured, ref } from "vue";

const key = ref(crypto.randomUUID());
const error = ref<Error | null>(null);

function clearError() {
  error.value = null;
  key.value = crypto.randomUUID();
}

onErrorCaptured((e) => {
  error.value = e;

  return false;
});
</script>
<template>
  <div v-show="!error" :key="key">
    <slot />
  </div>

  <template v-if="error">
    <slot name="error" :error="error" :clearError="clearError">
      <p>
        ⚠️ Something went wrong: <strong>{{ error.message }}</strong>
      </p>
      <button class="mt-2" @click="clearError">Try again</button>
    </slot>
  </template>
</template>
