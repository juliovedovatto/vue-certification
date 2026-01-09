<script setup>
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { reactive, ref } from "vue";

// reactive is recommended for Objects most part of the time
// but it will work w/ Arrays, since it is an "Object" too
// but you won't be able to reassign values, just mutating object
// let tasks = reactive([
//   { id: 1, name: "Task 1" },
//   { id: 2, name: "Task 2" },
//   { id: 3, name: "Task 3" },
// ]);

// Normal way to address the bug it is to change from reactive to ref
let tasks = ref([
  { id: 1, name: "Task 1" },
  { id: 2, name: "Task 2" },
  { id: 3, name: "Task 3" },
]);
const addTask = () => {
  // fix using tasks as reactive
  // reactive variables will lost reacvitity case a value is assigned to variable
  // in order to avoid that, it will be necessary to be creative and use methods to mutate the object.
  // Array.push method will mutate the object, adding a new item to the array
  // const newTask = { id: Math.random(), name: `Task ${tasks.length + 1}` };
  // tasks.push(newTask);

  // Fix using tasks as a ref
  const newTask = { id: Math.random(), name: `Task ${tasks.value.length + 1}` };
  tasks.value.push(newTask);
};
const removeTask = (id) => {
  // this way will work case tasks are a reactive
  // reactive variables will lost reacvitity case a value is assigned to variable
  // in order to avoid that, it will be necessary to be creative and use methods to mutate the object.
  // Array.splice is an effective way to remove a item, mutating the object
  // const index = tasks.findIndex((task) => task.id === id);
  // tasks.splice(index, 1);

  // Normal wat to remove
  tasks.value = tasks.value.filter((task) => task.id !== id);
};
</script>
<template>
  <div class="wrapper">
    <h1>Task List</h1>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <input type="text" v-model="task.name" />
        <button @click="removeTask(task.id)" data-test="button-remove">
          <XMarkIcon class="w-full h-full" />
        </button>
      </li>
    </ul>
    <button @click="addTask" data-test="button-add">Add Task</button>
  </div>
</template>
