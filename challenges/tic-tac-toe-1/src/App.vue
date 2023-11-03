<script setup>
import { ref, computed, watch } from "vue";

const currentTurn = ref("X");
const board = ref(new Array(9).fill(""));

const turn = computed(() => `Player ${currentTurn.value}'s turn`);
const isFinished = computed(() => board.value.every(Boolean));
const winner = computed(() => checkWinner());

const getMarker = (index) => board.value[index];

const markerClass = (marker) => {
  if (!marker) {
    return;
  }

  return marker === "X" ? "text-emerald-600" : "text-red-600";
};

const getMarkerClass = (index) => markerClass(getMarker(index));

const checkLine = (start) => {
  return board.value[start] &&
    board.value
      .slice(start * 3, start * 3 + 3)
      .every((v) => v === board.value[start])
    ? board.value[start]
    : null;
};

const checkColumn = (start) => {
  const col = [];
  for (let i = start; i < 9; i += 3) {
    col.push(i);
  }

  return board.value[col[0]] &&
    col.every((v) => board.value[v] === board.value[col[0]])
    ? board.value[col[0]]
    : null;
};

const checkDiagonals = (d) => {
  if (![1, 2].includes(d)) {
    return;
  }

  const getDiagonalIndexes = () => {
    const size = 3;
    const step = d === 1 ? size + 1 : size - 1;
    const start = d === 1 ? 0 : size - 1;

    return Array.from({ length: size }, (_, i) => start + i * step);
  };

  const indexes = getDiagonalIndexes();

  return board.value[indexes[0]] &&
    indexes.every((i) => board.value[i] === board.value[indexes[0]])
    ? board.value[indexes[0]]
    : null;
};

const checkWinner = () => {
  let winner;

  for (let i = 0; i < 3; i++) {
    winner = checkLine(i) || checkColumn(i);
    if (winner) {
      break;
    }
  }

  return winner || checkDiagonals(1) || checkDiagonals(2) || null;
};

const toggleTurn = () => {
  currentTurn.value = currentTurn.value === "X" ? "O" : "X";
};

const handleMarker = (index) => {
  if (winner.value || isFinished.value || board.value[index]) {
    return;
  }

  board.value[index] = currentTurn.value === "X" ? "X" : "0";
  toggleTurn();
};

const handleNewGame = () => {
  board.value = Array(9).fill("");
  currentTurn.value = "X";
};
</script>

<template>
  <div class="container mx-auto pt-60 text-center" style="max-width: 600px">
    <h1 class="text-2xl mb-6">Tic-Tac-Toe</h1>

    <template v-if="winner || isFinished">
      <template v-if="winner">
        <h2 class="text-xl font-semibold mb-3">
          Player <span class="text-2xl font-extrabold">{{ winner }}</span> wins!
        </h2>
      </template>
      <template v-else>
        <h2 class="text-xl font-semibold mb-3">It is a tie! No one won</h2>
      </template>

      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
        @click="handleNewGame"
      >
        New Game
      </button>
    </template>
    <template v-else>
      <div class="mb-10">{{ turn }}</div>
    </template>

    <div class="grid grid-cols-3 gap-4 mx-auto">
      <template v-for="(item, i) in board" :key="`slot-${i}`">
        <div
          class="cell flex justify-center items-center h-36 border border-gray-400 rounded-lg border-dashed"
          @click="handleMarker(i)"
        >
          <span class="text-[60px]" :class="getMarkerClass(i)">{{ item }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
