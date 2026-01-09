import { computed, ref } from "vue";
import { defineStore } from "pinia";

// NOTE: It's preferable to have a composable to handle login and logout
// that interacts with this store rather than using the store to perform
// these actions directly, since stores should not interact directly with
// the services layer. If the exercise intent is to move all login/logout
// actions to the store, this practice should be discouraged as it violates
// separation of concerns and makes the store tightly coupled to external services.

const useAuthUserStore = defineStore("AuthUserStore", () => {
  const currentUser = ref(null);

  function setUser(user) {
    currentUser.value = user;
  }

  function reset() {
    currentUser.value = null;
  }

  return {
    user: computed(() => currentUser.value),
    setUser,
    reset,
  };
});

export default useAuthUserStore;
