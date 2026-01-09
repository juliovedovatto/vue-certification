<script setup>
import CurrentUser from "@/CurrentUser.vue";
import ProfileForm from "@/ProfileForm.vue";
import { ref } from "vue";

let user = ref({
  firstName: "James",
  lastName: "Sullivan",
  about:
    "James Sullivan is a renowned scarer at Monsters, Inc. where he works alongside his partner and best friend Mike Wazowski. Sulley's world gets turned upside down when he becomes the accidental guardian of a human child. In working to return Boo to the human world, Sulley manages to uncover a company conspiracy while also solving an energy crisis that plagued the city of Monstropolis.",
  email: "sulley@monstersinc.com",
  image: "/sully.webp",
});

const updateUserData = (data) => {
  user.value = data;
};
</script>
<template>
  <div class="wrapper">
    <CurrentUser :user="user" />
    <ProfileForm :user="user" @update="updateUserData" />
  </div>
</template>
