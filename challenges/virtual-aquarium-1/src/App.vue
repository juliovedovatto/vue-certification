<script setup>
import { ref } from "vue";

import FishForm from "./FishForm.vue";
import Aquarium from "./Aquarium.vue";

const shoal = ref([]);

const handleSubmit = (fish) => {
  shoal.value.push(fish);
};
</script>

<template>
  <div class="h-screen flex items-center justify-center">
    <div class="grid grid-cols-[300px,1fr] bg-indigo-800">
      <div class="menu h-full">
        <FishForm @submit="handleSubmit" />
      </div>

      <div class="h-full">
        <Aquarium :shoal="shoal" />
      </div>
    </div>
  </div>
</template>
