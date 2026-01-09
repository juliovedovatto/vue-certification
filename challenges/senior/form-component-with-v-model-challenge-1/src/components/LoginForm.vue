<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { UserLogin } from "@/model/user";

const modelValue = defineModel<UserLogin>({
  default: { username: "", password: "" },
});

const state = reactive<UserLogin>({
  username: "",
  password: "",
});

watch(modelValue, () => {
  Object.assign(state, modelValue.value);
});

function onSubmit(e: SubmitEvent) {
  modelValue.value = { ...state };
}
</script>
<template>
  <form @submit.prevent="onSubmit">
    <h1>Login</h1>
    <label>
      <span>Username</span>
      <input v-model="state.username" type="text" />
    </label>

    <label>
      <span>Password</span>
      <input v-model="state.password" type="password" />
    </label>

    <button>Login</button>
  </form>
</template>
