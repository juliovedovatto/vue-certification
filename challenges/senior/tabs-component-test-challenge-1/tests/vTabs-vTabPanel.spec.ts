import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import vTabs from "../src/components/vTabs.vue";
import vTabPanel from "../src/components/vTabPanel.vue";
import { defineComponent, nextTick } from 'vue'

const mockComponent = defineComponent({
  components: { VTabs: vTabs, VTabPanel: vTabPanel },
  template: `
    <VTabs>
      <VTabPanel title="Vue.js">
        <p>An approachable, performant and versatile framework for building web user interfaces.</p>
      </VTabPanel>
      <VTabPanel title="React">
        <p>The library for web and native user interfaces</p>
      </VTabPanel>
      <VTabPanel title="Svelte">
        <p>Cybernetically enhanced web apps</p>
      </VTabPanel>
    </VTabs>
  `
});

async function setup() {
  const wrapper = mount(mockComponent, {
    attachTo: document.body
  })

  await flushPromises();
  await nextTick();

  return {
    wrapper
  }
}

describe("the use of vTabsPanel with vTabs", () => {
  it("renders the tab titles", async () => {
    const { wrapper } = await setup();

    const tabs = wrapper.findAll('[data-test="tab-title"]');
    expect(tabs).toHaveLength(3);
    expect(tabs[0].text()).toBe('Vue.js')
    expect(tabs[1].text()).toBe('React')
    expect(tabs[2].text()).toBe('Svelte')
  });

  it("renders the tab panel content", async () => {
    const { wrapper } = await setup();

    const contentWrapper = wrapper.find('.tab-content-wrapper');

    expect(contentWrapper.exists()).toBe(true)
    const content = wrapper.findAll('[data-test="tab-content"]');

    expect(content).toHaveLength(3);
  });

  it("only shows the content for the active panel", async () => {
    const { wrapper } = await setup();

    const content = wrapper.findAll('[data-test="tab-content"]');

    expect(content).toHaveLength(3);

    expect(content[0].isVisible()).toBe(true)
    expect(content[1].isVisible()).toBe(false)
    expect(content[2].isVisible()).toBe(false)
  });

  it("switches the content based on the tab clicked", async () => {
    const { wrapper } = await setup();

    const tabs = wrapper.findAll('[data-test="tab-title"]');
    expect(tabs).toHaveLength(3);

    const content = wrapper.findAll('[data-test="tab-content"]');

    expect(content).toHaveLength(3);

    expect(content[0].isVisible()).toBe(true)
    expect(content[1].isVisible()).toBe(false)
    expect(content[2].isVisible()).toBe(false)


    await tabs[1].trigger('click');

    expect(content[0].isVisible()).toBe(false)
    expect(content[1].isVisible()).toBe(true)
    expect(content[2].isVisible()).toBe(false)

    await tabs[2].trigger('click');

    expect(content[0].isVisible()).toBe(false)
    expect(content[1].isVisible()).toBe(false)
    expect(content[2].isVisible()).toBe(true)
  });
});
