import { computed, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from "vue";

export interface UseRefHistoryData {
  value: string
  timestamp: number
}

export const useRefHistory = (source: Ref<string>, capacity: MaybeRefOrGetter<number>) => {
  const history = ref<UseRefHistoryData[]>([{ value: toValue(source), timestamp: Date.now() }]);
  const previousStack = ref<string[]>([]);
  const cap = computed(() => toValue(capacity));

  watch(source, (v) => {
    if (!v || v === history.value.at(-1)?.value) {
      return
    }

    history.value.push({ value: v, timestamp: Date.now() });
    previousStack.value = [];

    if (history.value.length > cap.value) {
      history.value = history.value.slice(-cap.value);
    }
  })

  return {
    undo: () => {
      if (history.value.length <= 1) {
        return
      }

      const current = history.value.pop()!;
      previousStack.value.push(current.value);

      const value = history.value.at(-1);
      if (!value) {
        return
      }

      source.value = value.value;
    },
    redo: () => {
      if (!previousStack.value.length) {
        return
      }

      const value = previousStack.value.pop()
      if (!value) {
        return
      }

      history.value.push({ value: value, timestamp: Date.now() });
      source.value = value;
    },
    history: computed(() => history.value)
  };
};
