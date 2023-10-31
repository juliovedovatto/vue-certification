<script setup>
import { ref, computed, nextTick, onBeforeMount, onMounted } from "vue";
import fitty from "fitty";
import { onKeyStroke } from "@vueuse/core";

const OPERATIONS = ["+", "-", "*", "/"];
const CONSTANT = 1000;
const INITIAL_SCREEN_FONT_SIZE = 60;
const CALCULATOR_KEYBOARD_KEYS = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  "=",
  "+",
  "Esc",
  "Enter",
];

const arr = ref([]);
const previousAction = ref(null);
const resultScreen = ref(null);
const resizeObserver = ref(null);

const isEmpty = computed(() => !arr.value.length);
const lastItem = computed(() =>
  arr.value.length ? arr.value[arr.value.length - 1] : "0"
);
const isLasItemOperation = computed(() =>
  arr.value.length ? OPERATIONS.includes(lastItem.value) : false
);
const lastNumeric = computed(() => {
  return isLasItemOperation.value
    ? arr.value[arr.value.length - 2]
    : lastItem.value;
});
const hasDecimalPoint = computed(() => {
  if (isLasItemOperation.value) {
    return false;
  }

  return !!lastItem.value?.includes(".");
});
const availableScreenSize = computed(() => {
  if (!resultScreen.value) {
    return 0;
  }

  const screenElement = resultScreen.value.parentElement;
  const { clientWidth } = screenElement;
  const { paddingLeft, paddingRight } = getComputedStyle(screenElement);

  return clientWidth - (parseFloat(paddingLeft) + parseFloat(paddingRight));
});

const setLastItem = (v) => {
  arr.value[arr.value.length - 1] = v;
};

const addItem = (v) => {
  arr.value.push(v);
};

const appendItem = (v) => {
  if (isEmpty.value) {
    return;
  }

  arr.value[arr.value.length - 1] += v;
};

const doMath = () => {
  const result = eval(arr.value.join(""));
  const normalized = result && result !== Infinity ? result : 0;

  return result ? Math.round(normalized * CONSTANT) / CONSTANT : 0;
};

const doAction = async (action, value = null) => {
  const normalizedValue = value?.toString() || null;

  switch (action) {
    case "push":
      if (!/[0-9]/.test(normalizedValue)) {
        return;
      }

      if (previousAction.value === "execute") {
        await doAction("clear");
        await nextTick();
      }

      if (isEmpty.value || isLasItemOperation.value) {
        addItem(normalizedValue);
      } else {
        if (lastItem.value === "0") {
          setLastItem(normalizedValue);
        } else {
          appendItem(normalizedValue);
        }
      }
      break;
    case "add":
      if (isEmpty.value) {
        return;
      }

      if (isLasItemOperation.value) {
        setLastItem("+");
      } else {
        addItem("+");
      }
      break;
    case "subtract":
      if (isEmpty.value) {
        return;
      }

      if (isLasItemOperation.value) {
        setLastItem("-");
      } else {
        addItem("-");
      }
      break;
    case "multiply":
      if (isEmpty.value) {
        return;
      }

      if (isLasItemOperation.value) {
        setLastItem("*");
      } else {
        addItem("*");
      }
      break;
    case "division":
      if (isEmpty.value) {
        return;
      }

      if (isLasItemOperation.value) {
        setLastItem("/");
      } else {
        addItem("/");
      }
      break;
    case "clear":
      if (isEmpty.value) {
        return;
      }

      if (previousAction !== "clear") {
        arr.value.pop();
      } else {
        arr.value = [];
      }
      break;
    case "decimal":
      if (previousAction.value === "execute") {
        await doAction("clear");
        await nextTick();
      }

      if (hasDecimalPoint.value) {
        return;
      }

      if (isEmpty.value || isLasItemOperation.value) {
        addItem("0.");
      } else {
        appendItem(".");
      }
      break;
    case "execute":
      // TODO: add a way to remember the previous operation and execute case user execute again
      if (isLasItemOperation.value) {
        await doAction("push", arr.value[arr.value.length - 2]);
        await nextTick();
      }

      try {
        const result = doMath();
        arr.value = [result.toString()];
      } catch (err) {
        console.error(err);
        arr.value = [];
      }

      break;
    default:
  }

  previousAction.value = action;
};

const handleKeyboardStroke = ({ key }) => {
  switch (key) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      doAction("push", key);
      break;
    case "+":
      doAction("add");
      break;
    case "-":
      doAction("subtract");
      break;
    case "*":
      doAction("multiply");
      break;
    case "/":
      doAction("division");
      break;
    case "Esc":
      doAction("clear");
      break;
    case ".":
      doAction("decimal");
      break;
    case "=":
    case "Enter":
      doAction("execute");
      break;
    // Handle other keys as needed
    default:
      // Handle unrecognized keys or do nothing
      break;
  }
};

onKeyStroke(CALCULATOR_KEYBOARD_KEYS, handleKeyboardStroke, {
  dedupe: false,
});

onMounted(() => {
  fitty(resultScreen.value, { minSize: 12, maxSize: 60 });
});
</script>

<template>
  <div
    class="min-w-screen min-h-screen bg-gray-100 flex items-center justify-center px-5 py-5"
  >
    <div
      class="w-full mx-auto rounded-xl bg-gray-100 shadow-xl text-gray-800 relative overflow-hidden"
      style="max-width: 300px"
    >
      <div
        class="w-full h-40 bg-gradient-to-b from-gray-800 to-gray-700 flex items-end"
      >
        <div class="w-full py-5 px-6 text-6xl text-white font-thin text-right">
          <div class="w-full">
            <span ref="resultScreen" class="inline-block">{{
              lastNumeric
            }}</span>
          </div>
        </div>
      </div>
      <div class="w-full bg-gradient-to-b from-gray-400 to-gray-500">
        <div class="flex w-full">
          <div class="w-1/4 border-r border-b border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none hover:bg-gray-700 hover:bg-opacity-20 text-white text-opacity-50 text-xl font-light"
              @click="doAction('clear')"
            >
              C
            </button>
          </div>
          <!-- <div class="w-1/4 border-r border-b border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none hover:bg-gray-700 hover:bg-opacity-20 text-white text-opacity-50 text-xl font-light"
            >
              +/-
            </button>
          </div>
          <div class="w-1/4 border-r border-b border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none hover:bg-gray-700 hover:bg-opacity-20 text-white text-opacity-50 text-xl font-light"
            >
              %
            </button>
          </div> -->
          <div class="w-1/4 border-r border-b border-gray-400 ml-auto">
            <button
              class="w-full h-16 outline-none focus:outline-none bg-gray-700 bg-opacity-10 hover:bg-opacity-20 text-white text-2xl font-light"
              @click="doAction('division')"
            >
              ÷
            </button>
          </div>
        </div>
        <div class="flex w-full">
          <div class="w-1/4 border-r border-b border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none hover:bg-gray-700 hover:bg-opacity-20 text-white text-xl font-light"
              @click="doAction('push', 7)"
            >
              7
            </button>
          </div>
          <div class="w-1/4 border-r border-y border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none hover:bg-gray-700 hover:bg-opacity-20 text-white text-xl font-light"
              @click="doAction('push', 8)"
            >
              8
            </button>
          </div>
          <div class="w-1/4 border-r border-y border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none hover:bg-gray-700 hover:bg-opacity-20 text-white text-xl font-light"
              @click="doAction('push', 9)"
            >
              9
            </button>
          </div>
          <div class="w-1/4 border-r border-b border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none bg-gray-700 bg-opacity-10 hover:bg-opacity-20 text-white text-xl font-light"
              @click="doAction('multiply')"
            >
              ⨉
            </button>
          </div>
        </div>
        <div class="flex w-full">
          <div class="w-1/4 border-r border-b border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none hover:bg-gray-700 hover:bg-opacity-20 text-white text-xl font-light"
              @click="doAction('push', 4)"
            >
              4
            </button>
          </div>
          <div class="w-1/4 border-r border-b border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none hover:bg-gray-700 hover:bg-opacity-20 text-white text-xl font-light"
              @click="doAction('push', 5)"
            >
              5
            </button>
          </div>
          <div class="w-1/4 border-r border-b border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none hover:bg-gray-700 hover:bg-opacity-20 text-white text-xl font-light"
              @click="doAction('push', 6)"
            >
              6
            </button>
          </div>
          <div class="w-1/4 border-r border-b border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none bg-gray-700 bg-opacity-10 hover:bg-opacity-20 text-white text-xl font-light"
              @click="doAction('subtract')"
            >
              -
            </button>
          </div>
        </div>
        <div class="flex w-full">
          <div class="w-1/4 border-r border-b border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none hover:bg-gray-700 hover:bg-opacity-20 text-white text-xl font-light"
              @click="doAction('push', 1)"
            >
              1
            </button>
          </div>
          <div class="w-1/4 border-r border-b border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none hover:bg-gray-700 hover:bg-opacity-20 text-white text-xl font-light"
              @click="doAction('push', 2)"
            >
              2
            </button>
          </div>
          <div class="w-1/4 border-r border-b border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none hover:bg-gray-700 hover:bg-opacity-20 text-white text-xl font-light"
              @click="doAction('push', 3)"
            >
              3
            </button>
          </div>
          <div class="w-1/4 border-r border-b border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none bg-gray-700 bg-opacity-10 hover:bg-opacity-20 text-white text-xl font-light"
              @click="doAction('add')"
            >
              +
            </button>
          </div>
        </div>
        <div class="flex w-full">
          <div class="w-1/4 border-r border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none hover:bg-gray-700 hover:bg-opacity-20 text-white text-xl font-light"
              @click="doAction('push', 0)"
            >
              0
            </button>
          </div>
          <div class="w-1/4 border-r border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none hover:bg-gray-700 hover:bg-opacity-20 text-white text-xl font-light"
              @click="doAction('decimal')"
            >
              .
            </button>
          </div>
          <div class="w-2/4 border-r border-gray-400">
            <button
              class="w-full h-16 outline-none focus:outline-none bg-gray-700 bg-opacity-30 hover:bg-opacity-40 text-white text-xl font-light"
              @click="doAction('execute')"
            >
              =
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
