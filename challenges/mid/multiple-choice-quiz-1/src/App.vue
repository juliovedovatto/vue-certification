<script setup>
import { computed, ref } from "vue";

import questions from "@/data/questions";

import Question from "@/components/Question.vue";

const current = ref(0);

const answers = ref([]);
const correctAnswers = computed(() =>
  questions.map(({ correctAnswer }) => correctAnswer)
);
const totalQuestions = computed(() => questions.length);
const currentQuestion = computed(() => questions[current.value]);
const hasNext = computed(() => current.value < totalQuestions.value);
const total = computed(() =>
  answers.value.length ? checkAnswers(answers.value) : 0
);

const checkAnswers = (selectedAnswers) => {
  let correctCount = 0;
  if (!selectedAnswers.length) {
    return;
  }

  correctAnswers.value.forEach((correctAnswer, index) => {
    const selectedAnswer = selectedAnswers[index];

    if (
      correctAnswer.includes(selectedAnswer) ||
      correctAnswer === selectedAnswer
    ) {
      correctCount++;
    }
  });

  return correctCount;
};

const handleSubmit = (answer) => {
  answers.value.push(answer);
};

const handleNext = () => {
  if (!hasNext.value) {
    return;
  }

  current.value++;
};
</script>

<template>
  <div class="container mx-auto h-screen flex items-center justify-center">
    <template v-if="hasNext">
      <question
        :key="`question-${current}`"
        :title="currentQuestion.title"
        :answers="currentQuestion.answers"
        :correct-answer="currentQuestion.correctAnswer"
        @submit="handleSubmit"
        @next="handleNext"
      />
    </template>
    <template v-else>
      <div class="p-4">
        <h3 class="text-2xl">
          Your final score: {{ total }} out of {{ totalQuestions }}
        </h3>
      </div>
    </template>
  </div>
</template>
