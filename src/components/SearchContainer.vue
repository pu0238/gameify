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
      <Search @updated-params='$emit("updatedParams")'/>
    </div>
  </div>
</template>

<script setup>
import Search from "./Search.vue";
</script>
