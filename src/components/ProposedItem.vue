<template>
  <div class="group relative mb-8">
    <div
      class="relative w-full h-80 bg-white rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1"
    >
      <img
        :src="itemUrl"
        :alt="`${itemName} available on steam.`"
        class="w-full h-full object-center object-cover"
      />
    </div>
    <h3 class="mt-4 text-sm text-gray-300">
      <a class="cursor-pointer">
        <span class="absolute inset-0"></span>
        Available on steam.
        <!-- Przypisek -->
      </a>
    </h3>
    <p
      class="text-base font-semibold text-indigo-600 text-mint"
    >
      {{ itemName }}
      <!-- Nazwa -->
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  itemName: String,
  itemUrl: String,
});
</script>
