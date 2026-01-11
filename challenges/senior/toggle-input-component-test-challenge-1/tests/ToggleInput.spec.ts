import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ToggleInput from "../src/components/ToggleInput.vue";
import { ref } from "vue";

describe("the toggle input component", () => {
  it(
    "toggles the v-model value between true and false when clicked",
    async () => {
      const wrapper = mount(ToggleInput, {
        props: {
          modelValue: false,
        },
        attachTo: document.body,
      });

      const input = wrapper.find("input");

      await input.trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([true]);

      await input.trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[1]).toEqual([false]);

      wrapper.unmount();
    },
  );
  it("supports a binary v-model modifier", async () => {
    const wrapper = mount(ToggleInput, {
      props: {
        modelValue: ref(0),
        modelModifiers: { binary: true },
      },
      attachTo: document.body
    })

    const input = wrapper.find("input");

    await input.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([1]);

    await input.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[1]).toEqual([0]);

    wrapper.unmount();
  });
});
