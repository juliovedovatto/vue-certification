<script setup>
import { computed, ref } from "vue";

// TODO: implement question with multiple answers

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  answers: {
    type: Array,
    required: true,
  },
  correctAnswer: {
    type: [Number, Array],
    required: true,
  },
});

const emit = defineEmits(["submit", "next"]);

const selectedAnswer = ref(null);
const hasSubmitted = ref(false);

const hasSelectedAnswer = computed(() => selectedAnswer.value !== null);
const isMultipleChoice = computed(() => {
  return props.correctAnswer.length > 1;
});
const inputType = computed(() =>
  isMultipleChoice.value ? "checkbox" : "radio"
);
const isCorrectAnswer = computed(() => {
  return Array.isArray(props.correctAnswer)
    ? props.correctAnswer.includes(selectedAnswer.value)
    : selectedAnswer.value === props.correctAnswer;
});
const resultClasses = computed(() => {
  const classes = ["p-2"];

  if (isCorrectAnswer.value) {
    classes.push("bg-green-500 border-green-700");
  } else {
    classes.push("bg-red-500 border-red-700");
  }

  return classes;
});

const handleSubmit = () => {
  if (!hasSelectedAnswer.value) {
    return;
  }

  hasSubmitted.value = true;
  emit("submit", selectedAnswer.value);
};

const handleNext = () => {
  emit("next");
};
</script>

<template>
  <div class="question">
    <form @submit.prevent="handleSubmit">
      <h2
        class="text-2xl font-medium mb-4 border-b border-solid border-black dark:border-white pb-2 px-3"
      >
        {{ title }}
      </h2>

      <div class="question__answers mb-6">
        <template :key="`answer-${i}`" v-for="(answer, i) in answers">
          <div class="question__answers__answer flex items-center mb-3">
            <label :for="`answer-${i}`" class="cursor-pointer">
              <input
                v-model="selectedAnswer"
                :id="`answer-${i}`"
                :type="inputType"
                :disabled="hasSubmitted"
                :value="answer.value"
                name="answer"
                class="mr-2"
                required
              />
              {{ answer.label }}
            </label>
          </div>
        </template>
      </div>

      <div class="w-full grid grid-cols-[1fr,100px] gap-4 flex items-center">
        <div class="result">
          <template v-if="hasSubmitted">
            <div
              role="alert"
              :class="resultClasses"
              class="p-2 text-sm rounded-lg border border-solid text-white"
            >
              <template v-if="isCorrectAnswer">Correct!</template>
              <template v-else>Incorrect!</template>
            </div>
          </template>
        </div>

        <template v-if="!hasSubmitted">
          <button
            type="submit"
            :disabled="!hasSelectedAnswer"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full enabled:hover:bg-blue-700 enabled:cursor-pointer disabled:opacity-50"
          >
            Submit
          </button>
        </template>
        <template v-else>
          <button
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full enabled:hover:bg-blue-700 enabled:cursor-pointer disabled:opacity-50"
            @click="handleNext"
          >
            Next
          </button>
        </template>
      </div>
    </form>
  </div>
</template>

<style scoped>
.question {
  position: relative;
}
</style>
