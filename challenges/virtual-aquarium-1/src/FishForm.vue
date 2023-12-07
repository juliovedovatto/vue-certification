<script setup>
import { computed, reactive, ref } from "vue";
import Fish from "./Fish.vue";

const FISH_TYPES = [
  "golden-purple-fish",
  "goldfish",
  "guppie",
  "tropical-fish",
  "tuna",
];
const defaultState = {
  type: null,
  name: null,
};

const emit = defineEmits(["submit"]);

const state = reactive({ ...defaultState });
const isValidForm = computed(() => !!state.type && !!state.name?.trim());

const toggleSelection = (type) => {
  state.type = state.type !== type ? type : "";

  if (!state.type) {
    state.name = null;
  }
};

const resetState = () => Object.assign(state, { ...defaultState });

const handleAddFish = () => {
  emit("submit", { ...state });

  resetState();
};
</script>

<template>
  <div class="fish-list p-4">
    <form @submit.prevent="handleAddFish">
      <label class="text-white font-bold block mb-4">Fish type</label>
      <ul class="grid gap-3 grid-cols-2">
        <template v-for="(type, i) in FISH_TYPES" :key="`fish-${i}`">
          <li class="mb-3">
            <Fish
              :type="type"
              :selected="state.type === type"
              class="hover:cursor-pointer"
              @click="toggleSelection(type)"
            />
            <input
              v-model="state.type"
              :value="type"
              type="radio"
              name="type"
              class="hidden"
              required
            />
          </li>
        </template>
      </ul>

      <template v-if="state.type">
        <div class="my-2">
          <label class="text-white font-bold block">Name</label>
          <input
            v-model="state.name"
            name="name"
            type="text"
            class="w-full p-3 rounded-lg"
            required
          />
        </div>

        <div class="my-2">
          <button
            :disabled="!isValidForm"
            class="bg-red-500 text-white font-bold py-2 px-4 rounded w-full enabled:hover:bg-red-700 enabled:cursor-pointer disabled:opacity-50"
          >
            Add Fish
          </button>
        </div>
      </template>
    </form>
  </div>
</template>

<style scoped></style>
