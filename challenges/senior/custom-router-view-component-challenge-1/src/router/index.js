import { defineComponent, h, ref, computed, inject } from "vue";
const RouteKey = Symbol("RouteKey");

// parse the path and query params utility (e.g. /about?name=John&age=30 => { path: '/about', query: { name: 'John', age: 30 } })
function parsePath(url) {
  const [pre, _query] = url.split("?");
  const path = pre.replace(
    `${window.location.protocol}//${window.location.host}`,
    "",
  );
  const queryParams = new URLSearchParams(_query);
  const query = {};

  queryParams.forEach((value, key) => {
    query[key] = isNaN(value) ? value : Number(value);
  });

  return { path, query };
}

export function createRouter(options) {
  const { routes } = options; // 👈 you'll need this
  const { pathname, search } = window.location;
  const parsed = parsePath(`${pathname}${search}`);
  const route = ref(parsed);
  const routePath = computed(() => route.value.path); // 👈 you'll need this
  const origin = window.location.origin; // http://localhost:5173 // 👈 you'll need this

  return {
    // 👇 CODE HERE! 👇
    // You will code within the install method to complete the challenge 👇
    install(app) {
      app.provide(RouteKey, route);

      // create a RouterView component, which will render the current route component
      // along with some extra HTML to mimic a browser
      // just like with Vue Router all the RouteRecords are set via options.routes (see main.js)
      const RouterView = defineComponent((props, ctx) => {
        const router = useRouter();

        const inputRoute = ref();

        const onInput = (event) => {
          const value = event.target.value;
          const computedValue = `/${value}`;

          const currentRoute = routes.find((r) => r.path === computedValue);
          if (currentRoute) {
            inputRoute.value = value;
            router.push(currentRoute.path);
          }
        };

        return () => {
          const current = routes.find((r) => r.path === routePath.value);

          inputRoute.value = current.path.replace(/^\//, "");

          return h("div", { class: "mockup-browser-wrapper" }, [
            h("div", { class: "mockup-browser-content" }, [
              h("div", { class: "mockup-browser-toolbar" }, [
                h("div", { class: "mockup-browser-url" }, [
                  h("span", `${origin}/`),
                  h("input", {
                    value: inputRoute.value,
                    onInput: debounce(onInput),
                  }),
                ]),
              ]),
              h("div", { class: "mockup-browser-content" }, [
                current ? h(current.component) : undefined,
              ]),
            ]),
          ]);
        };
      });

      app.component("RouterView", RouterView);
    },
  };
}

function debounce(fn, delay = 300) {
  let timeoutId;

  if (typeof fn !== "function") {
    throw new Error("Invalid function to debounce");
  }

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

//👇  you'll need this
function getRouter(route) {
  return {
    push(_path) {
      const { path, query } = parsePath(_path);
      route.value.path = path;
      route.value.query = query;
      history.pushState(null, null, _path);
    },
  };
}

export function useRouter() {
  const route = inject(RouteKey);
  return getRouter(route);
}

export function useRoute() {
  const route = inject(RouteKey);

  return route.value;
}
