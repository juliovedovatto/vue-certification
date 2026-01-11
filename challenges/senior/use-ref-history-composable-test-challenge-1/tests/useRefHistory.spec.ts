import { describe, it, expect, beforeEach } from "vitest";
import { useRefHistory } from "../src/composables/useRefHistory";
import { ref, nextTick, MaybeRefOrGetter } from "vue";

interface SetupOptions {
  inititalTheme?: string,
  capacity?: MaybeRefOrGetter<number>
}

async function setup({ inititalTheme = 'light', capacity = 5 }: SetupOptions = {}) {
  const theme = ref(inititalTheme);

  const refHistory = useRefHistory(theme, capacity);

  await nextTick();

  return {
    currentTheme: theme,
    refHistory
  }
}

describe("useRefHistory", () => {
  it("stores the history of the source value", async () => {
    const inititalTheme = 'light';
    const { refHistory, currentTheme } = await setup({ inititalTheme });

    const { history } = refHistory;

    expect(history.value).toHaveLength(0);

    currentTheme.value = 'coffee';

    await nextTick();

    expect(history.value).toHaveLength(1);
    expect(history.value).toContainEqual(expect.objectContaining({ value: inititalTheme }));
  });

  it("does NOT include the current value in history", async () => {
    const inititalTheme = 'light';
    const { refHistory, currentTheme } = await setup({ inititalTheme });

    const { history } = refHistory;

    expect(history.value).toHaveLength(0);

    currentTheme.value = 'coffee';
    await nextTick();

    expect(history.value).toHaveLength(1);
    expect(history.value).not.toContainEqual(expect.objectContaining({ value: currentTheme.value }));
  });

  it("stores the history ordered from newest to oldest", async () => {
    const themes = ['light', 'dark', 'coffee', 'chocolate'];
    const { refHistory, currentTheme } = await setup({ inititalTheme: themes[0] });

    const { history } = refHistory;

    currentTheme.value = themes[1];
    await nextTick();

    currentTheme.value = themes[2];
    await nextTick();

    currentTheme.value = themes[3];
    await nextTick();


    const values = history.value.map(({ value }) => value);

    expect(values).toEqual([themes[2], themes[1], themes[0]])
  });

  it(
    "removes the oldest record(s) when the history reaches the capacity",
    async () => {
      const themes = ['light', 'dark', 'coffee', 'chocolate'];
      const { refHistory, currentTheme } = await setup({ inititalTheme: themes[0], capacity: 3 });

      const { history } = refHistory;

      currentTheme.value = themes[1];
      await nextTick();

      currentTheme.value = themes[2];
      await nextTick();

      currentTheme.value = themes[3];
      await nextTick();

      currentTheme.value = themes[2];
      await nextTick();

      const values = history.value.map(({ value }) => value);

      expect(values).not.toContain(themes[0])
    },
  );

  it(
    "allows capacity as a getter (callback function) and dynamically update history when capacity changes",
    async () => {
      const themes = ['light', 'dark', 'coffee', 'chocolate'];
      const capacity = ref(3)

      const { refHistory, currentTheme } = await setup({
        inititalTheme: themes[0],
        capacity: () => capacity.value
      });

      const { history } = refHistory;

      currentTheme.value = themes[1];
      await nextTick();

      currentTheme.value = themes[2];
      await nextTick();

      currentTheme.value = themes[3];
      await nextTick();

      currentTheme.value = themes[2];
      await nextTick();

      expect(history.value).toHaveLength(3);

      capacity.value = 5;
      currentTheme.value = themes[1];
      await nextTick();

      expect(history.value).toHaveLength(4);
    },
  );

  it(
    "allows capacity as a ref and dynamically update history when capacity changes",
    async () => {
      const themes = ['light', 'dark', 'coffee', 'chocolate'];
      const capacity = ref(3)

      const { refHistory, currentTheme } = await setup({
        inititalTheme: themes[0],
        capacity,
      });

      const { history } = refHistory;

      currentTheme.value = themes[1];
      await nextTick();

      currentTheme.value = themes[2];
      await nextTick();

      currentTheme.value = themes[3];
      await nextTick();

      currentTheme.value = themes[2];
      await nextTick();

      expect(history.value).toHaveLength(3);

      capacity.value = 5;
      currentTheme.value = themes[1];
      await nextTick();

      expect(history.value).toHaveLength(4);
    },
  );

  it(
    "sets the data source back to the previous value on undo",
    async () => {
      const themes = ['light', 'dark', 'coffee', 'chocolate'];
      const capacity = ref(3)

      const { refHistory, currentTheme } = await setup({
        inititalTheme: themes[0],
        capacity,
      });

      const { history, undo } = refHistory;

      currentTheme.value = themes[1];
      await nextTick();

      currentTheme.value = themes[2];
      await nextTick();

      expect(history.value.map(({ value }) => value)).toEqual([themes[1], themes[0]])
      expect(currentTheme.value).toBe(themes[2]);

      undo();
      await nextTick();

      expect(currentTheme.value).toBe(themes[1]);
      expect(history.value).toHaveLength(1)
    },
  );

  it(
    "sets the data source to one record forward in history on redo",
    async () => {
      const themes = ['light', 'dark', 'coffee', 'chocolate'];
      const capacity = ref(3)

      const { refHistory, currentTheme } = await setup({
        inititalTheme: themes[0],
        capacity,
      });

      const { history, undo, redo } = refHistory;

      currentTheme.value = themes[1];
      await nextTick();

      currentTheme.value = themes[2];
      await nextTick();

      expect(history.value.map(({ value }) => value)).toEqual([themes[1], themes[0]])
      expect(currentTheme.value).toBe(themes[2]);

      undo();
      await nextTick();

      expect(currentTheme.value).toBe(themes[1]);
      expect(history.value).toHaveLength(1)

      redo();
      await nextTick();

      expect(currentTheme.value).toBe(themes[2]);
      expect(history.value).toHaveLength(2)
    },
  );
});
