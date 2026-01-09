// @ts-nocheck
// remove the line above if you want to use TS
// if you prefer plain JS, leave as is

import { ref, watch } from "vue";
export const useTheme = (initialTheme = 'light') => {
  const theme = ref(initialTheme);

  watch(theme, () => {
    document.documentElement.dataset.theme = theme.value;
  }, { immediate: true });

  return theme;
};
