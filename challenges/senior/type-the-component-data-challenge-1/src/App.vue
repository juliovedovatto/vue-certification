<script setup lang="ts">
import { ref, computed } from "vue";

interface Post {
  id: number;
  title: string;
  body: string;
  published: boolean;
  author: {
    name: string;
    bio: string;
  };
}

const posts = ref<Post[]>([]);

// NOTE: type this computed is not necessary, it will infer from the return type
const numberOfPosts = computed(() => posts.value.length);

async function loadPosts() {
  const res = await fetch("/api.json");
  posts.value = await res.json();
}

loadPosts();
</script>
<template>
  <div class="page">
    <div>
      <h1>Posts ({{ numberOfPosts }})</h1>
      <ul>
        <li v-for="post in posts" :key="post.id">
          {{ post.title }}
        </li>
      </ul>
    </div>
  </div>
</template>
