import { computed } from "vue";
import { useRouter } from "vue-router";
import useAuthUserStore from "@/stores/AuthUserStore";

// NOTE: It's preferable to have a composable to handle login and logout
// that interacts with this store rather than using the store to perform
// these actions directly, since stores should not interact directly with
// the services layer. If the exercise intent is to move all login/logout
// actions to the store, this practice should be discouraged as it violates
// separation of concerns and makes the store tightly coupled to external services.

export const useAuthUser = () => {
  const authStore = useAuthUserStore();
  const router = useRouter();

  // This login function is a mock function that checks if the username and password are valid
  // In a real-world application, you would send a request to the server to validate the user
  async function login({ username, password }) {
    authStore.reset();

    const res = await fetch("/api/users.json");
    const users = await res.json();

    const user = users.find(
      (user) => user.username === username && user.password === password,
    );

    if (!user) {
      throw new Error("Invalid username or password");
    }

    authStore.setUser(user);
  }

  // Logs out the user and redirects to the login page
  function logout() {
    authStore.reset();
    router.push("/login");
  }

  return {
    user: computed(() => authStore.user),
    login, // a function to login the user
    logout, // a function to logout the user
  };
};
