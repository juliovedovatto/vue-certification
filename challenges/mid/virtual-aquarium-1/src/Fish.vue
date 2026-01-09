<script setup>
import { computed, inject, nextTick, onMounted, ref, watch } from "vue";

const HUNGRY_FACTOR = [8, 16];
const VELOCITY_FACTOR = [0.1, 3];

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: null,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  animated: {
    type: Boolean,
    default: false,
  },
});

const container = inject("container");

const element = ref(null);
const hungry = ref(0);
const hungryTime = ref(0);
const hungryTimer = ref(null);
const hasDied = ref(false);
const hasDiedAnimationDone = ref(false);

const posX = ref(0);
const posY = ref(0);
const movingDirection = ref("");

const fishClass = computed(() => {
  const classes = [];

  if (props.animated) {
    classes.push("fish--animated");
  }
  if (hasDied.value) {
    classes.push("fish--died");
  }
  if (isHungry.value) {
    classes.push("fish--hungry");
  }

  return classes;
});
const computedPosition = computed(() => {
  return {
    left: `${posX.value}px`,
    top: `${posY.value}px`,
  };
});
const isHungry = computed(() => {
  return !hasDied.value && feedBar.value <= 40;
});

const feedBar = computed(() => {
  const clampedHungry = Math.max(0, Math.min(1, hungry.value));
  const percentage = (1 - clampedHungry) * 100;

  return percentage;
});
const feedBarColor = computed(() => {
  return {
    "bg-green-400": feedBar.value >= 70,
    "bg-orange-400": feedBar.value < 70 && feedBar.value >= 30,
    "bg-red-600": feedBar.value < 30,
  };
});

const asset = computed(() => {
  if (hasDied.value) {
    return "/dead.png";
  }

  if (!props.type) {
    return "";
  }

  const img = `${props.type}.png`;

  return `/${img}`;
});

watch(hasDied, () => {
  startDeadAnimation();
});

const setInitialPosition = () => {
  do {
    posX.value =
      Math.random() * (container.value.clientWidth - element.value.clientWidth);
    posY.value =
      Math.random() *
      (container.value.clientHeight - element.value.clientHeight);
  } while (
    checkCollisionWalls(posX.value, "x") ||
    checkCollisionWalls(posY.value, "y")
  );
};

const checkCollisionWalls = (pos, axis) => {
  if (!["x", "y"].includes(axis)) {
    return;
  }

  const property = axis == "x" ? "clientWidth" : "clientHeight";

  return pos + element.value[property] > container.value[property] || pos < 0;
};

const startAnimation = () => {
  if (hasDied.value) {
    return;
  }

  if (!container?.value) {
    console.error("No container was provided to start animation");
    return;
  }

  let vx = getRandomVelocity();
  let vy = getRandomVelocity();

  movingDirection.value = vx >= 0 ? "left" : "right";

  const updatePosition = () => {
    if (hasDied.value) {
      return;
    }

    let currentX = parseFloat(posX.value);
    let currentY = parseFloat(posY.value);

    currentX += vx;
    currentY += vy;

    // Check for collisions with container walls
    if (checkCollisionWalls(currentX, "x")) {
      vx = -vx; // reverse velocity on collision with horizontal walls
      movingDirection.value = vx >= 0 ? "left" : "right";
    }

    if (checkCollisionWalls(currentY, "y")) {
      vy = -vy; // reverse velocity on collision with vertical walls
    }

    // Update object position
    posX.value = currentX;
    posY.value = currentY;

    requestAnimationFrame(updatePosition);
  };

  updatePosition();
};

const startDeadAnimation = () => {
  let vy = 1.5;

  const updatePosition = () => {
    let currentY = parseFloat(posY.value);
    currentY += vy;

    if (checkCollisionWalls(currentY, "y")) {
      hasDiedAnimationDone.value = true;
      return;
    }

    posY.value = currentY;
    requestAnimationFrame(updatePosition);
  };

  updatePosition();
};

const startCountdown = () => {
  const interval = 1000;
  let time = hungryTime.value;
  const proportion = 100 / time / 100;

  hungryTimer.value = setInterval(() => {
    if (time > 0 && hungry.value < 1) {
      hungry.value += proportion;
      time -= interval / 1000;
    } else {
      hasDied.value = true;
      clearInterval(hungryTimer.value);
    }
  }, interval);
};

const getHungryTimer = () => {
  const [min, max] = HUNGRY_FACTOR;

  return Math.random() * (max - min) + min;
};

const getVelocityFactor = () => {
  const [min, max] = VELOCITY_FACTOR;

  return Math.random() * (max - min) + min;
};

const getRandomVelocity = () => {
  return (Math.random() - 0.5) * getVelocityFactor();
};

const feedFish = () => {
  clearInterval(hungryTimer.value);
  hungry.value = 0;
  setTimeout(() => startCountdown(), 2000);
};

const handleClick = () => {
  if (!props.animated || hasDied.value) {
    return;
  }

  feedFish();
};

onMounted(async () => {
  if (props.animated) {
    hungryTime.value = getHungryTimer();

    setInitialPosition();

    await nextTick();
    startAnimation();
    startCountdown();
  }
});
</script>

<template>
  <div ref="element" :class="fishClass" class="fish">
    <div
      :class="{
        'fish--died__animation': hasDied && !hasDiedAnimationDone,
      }"
      @click="handleClick"
    >
      <img
        :src="asset"
        :class="{
          selected: props.selected,
          '-scale-x-100': movingDirection === 'right',
        }"
      />
    </div>

    <template v-if="props.name">
      <div
        class="relative bg-slate-800 opacity-80 text-white text-center pb-2 rounded-lg"
      >
        <div class="text-sm">
          {{ props.name }}
          <template v-if="hasDied">💀</template>
        </div>

        <div class="w-full h-1 absolute bottom-0 left-0">
          <div
            class="h-full transition-all"
            :class="feedBarColor"
            :style="{ width: `${feedBar}%` }"
          />
        </div>
      </div>
    </template>

    <template v-if="isHungry">
      <div class="fish__feed-warning bg-white">
        feed me!
        <div
          class="absolute left-1/2 bottom-0 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 transform border-r border-b border-gray-100 bg-white"
        ></div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.selected {
  filter: drop-shadow(3px 0 0 white) drop-shadow(0 3px 0 white)
    drop-shadow(-3px 0 0 white) drop-shadow(0 -3px 0 white);
}

.fish {
}
.fish.fish--animated {
  @apply w-24 absolute transform-gpu will-change-[top,left];
  top: v-bind("computedPosition.top");
  left: v-bind("computedPosition.left");
}
.fish.fish--died {
  @apply -scale-y-100;
}
.fish.fish--died .fish--died__animation {
  @apply will-change-transform transform-gpu;
  animation: dead 10s ease-in-out infinite;
}
.fish .fish__feed-warning {
  @apply bg-white rounded-lg inline-block p-2 text-xs absolute left-1/2 -translate-x-1/2 whitespace-nowrap -top-1/2;
}

@keyframes dead {
  0%,
  100% {
    transform: translateX(0%);
    transform-origin: 50% 50%;
  }
  15% {
    transform: translateX(-70px) rotate(6deg);
  }
  30% {
    transform: translateX(55px) rotate(-6deg);
  }
  45% {
    transform: translateX(-15px) rotate(3.6deg);
  }
  60% {
    transform: translateX(9px) rotate(-2.4deg);
  }
  75% {
    transform: translateX(-6px) rotate(1.2deg);
  }
}
</style>
