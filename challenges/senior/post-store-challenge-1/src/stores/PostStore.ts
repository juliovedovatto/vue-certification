import { defineStore, acceptHMRUpdate } from "pinia";
import { ref } from "vue";
import type { Post, PostFields } from "@/types";
import { useCachedFetch } from "@/composables/useCachedFetch";

export const usePostStore = defineStore("PostStore", () => {
  const posts = ref<Post[]>();
  const post = ref<Post>();

  const { loading: loadingList, doFetch } = useCachedFetch({
    data: posts,
    fetchStrategy: "stale-refresh-bg",
  });

  const { loading: loadingSingle, doFetch: doFetchSingle } = useCachedFetch({ data: post, fetchStrategy: 'from-cache-refresh-bg' });

  async function fetchPostList(fields: PostFields = []) {
    const url = new URL('api/posts', window.location.origin)
    const urlParams: string[][] = []
    const filteredFields = Array.from(new Set(fields))

    if (filteredFields.length) {
      urlParams.push(['fields', filteredFields.join(',')])
    }

    url.search = (new URLSearchParams(urlParams)).toString();

    return doFetch(url.toString());
  }


  async function fetchPostSingle(options: {
    id: number,
    fields?: PostFields
  }) {
    const { id, fields } = options;
    const url = new URL(`api/posts/${id}`, window.location.origin)
    const urlParams: string[][] = []
    const filteredFields = Array.from(new Set(fields))

    if (filteredFields.length) {
      urlParams.push(['fields', filteredFields.join(',')])
    }

    url.search = (new URLSearchParams(urlParams)).toString();

    return doFetchSingle(url.toString());
  }

  return {
    // list of posts
    loadingList,
    posts,
    fetchPostList,

    // single post
    fetchPostSingle,
    loadingSingle,
    post,
  };
});

// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept(acceptHMRUpdate(usePostStore, import.meta.hot));
}
