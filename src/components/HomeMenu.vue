<template>
  <Disclosure as="nav">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div
          class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"
        ></div>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <button
            type="button"
            class="p-1 rounded-full text-gray-300 hover:text-white focus:outline-none"
          >
            <span class="sr-only">View notifications</span>
            <BellIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </Disclosure>
</template>

<script setup>
import {
  Disclosure,
} from "@headlessui/vue";
import { BellIcon } from "@heroicons/vue/outline";
import Search from "./Search.vue";
</script>
