<script setup>
import { provide, ref } from "vue";
import Fish from "./Fish.vue";

const props = defineProps({
  shoal: {
    type: Array,
    default: [],
  },
});

const aquariumContainer = ref(null);

provide("container", aquariumContainer);
</script>

<template>
  <div class="relative">
    <div class="aquarium relative z-0">
      <img src="/bg.jpg" class="object-cover object-center w-full h-full" />
    </div>
    <div
      ref="aquariumContainer"
      class="absolute z-10 top-0 left-0 w-full h-full overflow-hidden"
    >
      <template :key="`fish-${i}`" v-for="(fish, i) in props.shoal">
        <fish :type="fish.type" :name="fish.name" animated />
      </template>
    </div>
  </div>
</template>

<style scoped></style>
