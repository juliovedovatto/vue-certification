<script setup>
import CountdownHeader from "@/components/CountdownHeader.vue";
import CountdownSegment from "@/components/CountdownSegment.vue";
import { onMounted, reactive, ref, onBeforeUnmount, onBeforeMount } from "vue";

const TICK = 1000;
const NEWYEARSDATE = new Date("January 01, 2024 00:00:00").getTime();

const now = ref(Date.now());
const timer = ref(null);
const date = reactive({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

const handleTime = () => {
  console.log("handleTime");
  const difference = NEWYEARSDATE - now.value;

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  Object.assign(date, {
    days,
    hours,
    minutes,
    seconds,
  });

  now.value += TICK;
};

onBeforeMount(() => handleTime());

onMounted(() => {
  clearTimeout(timer.value);
  if (NEWYEARSDATE - now.value <= 0) {
    return;
  }

  handleTime();
  timer.value = setInterval(() => requestAnimationFrame(handleTime), TICK);
});

onBeforeUnmount(() => {
  clearTimeout(timer.value);
});
</script>
<template>
  <div class="app-wrapper">
    <div class="countdown-box">
      <CountdownHeader />
      <main class="flex justify-center">
        <CountdownSegment data-test="days" label="days" :number="date.days" />
        <CountdownSegment
          data-test="hours"
          label="hours"
          :number="date.hours"
        />
        <CountdownSegment
          data-test="minutes"
          label="minutes"
          :number="date.minutes"
        />
        <CountdownSegment
          data-test="seconds"
          label="seconds"
          :number="date.seconds"
        />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-wrapper {
  @apply flex items-center justify-center w-full h-full p-10;
}
.countdown-box {
  @apply shadow-md relative bg-white p-5 rounded-lg border-gray-100 border-[1px];
}
body {
  @apply bg-gray-100;
}
</style>
