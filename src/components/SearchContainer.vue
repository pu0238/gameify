<template>
  <div
    class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <img
          class="mx-auto h-22 w-auto"
          src="../assets/gameify-logo-indigo-500-mark-white-text.svg"
          alt="Workflow"
        />
      </div>
      <Search />
    </div>
  </div>
</template>

<script setup>
import Search from "./Search.vue";
import { onMounted } from "vue";

onMounted(async () => {
  //const route = useRoute();
  const params = new URLSearchParams(window.location.search)
  console.log(params.get('item'));
});
</script>
