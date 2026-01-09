import { createWebHistory, createRouter } from "vue-router";
import LogInView from "../views/LogIn.vue";
import UserProfileView from "../views/UserProfile.vue";
import useAuthUserStore from "@/stores/AuthUserStore";

const routes = [
  { path: "/", component: UserProfileView, meta: { requiresAuth: true } },
  { path: "/login", component: LogInView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const { user } = useAuthUserStore();

  if (to.meta.requiresAuth && !user) {
    return "/login";
  }
});
