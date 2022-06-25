<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-0" @close="emit('close')">
        <TransitionChild
          as="template"
          enter="ease-in-out duration-500"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in-out duration-500"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-opacity"
          />
        </TransitionChild>

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div
              class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10"
            >
              <TransitionChild
                as="template"
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enter-from="translate-x-full"
                enter-to="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leave-from="translate-x-0"
                leave-to="translate-x-full"
              >
                <DialogPanel class="pointer-events-auto w-screen max-w-md">
                  <div
                    class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl background-black"
                  >
                    <div class="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div class="flex items-start justify-between">
                        <DialogTitle class="text-lg font-medium text-white">
                          Znalezione produkty
                        </DialogTitle>
                        <div class="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            class="-m-2 p-2 text-gray-300 hover:text-white"
                            @click="open = false"
                          >
                            <span class="sr-only">Close panel</span>
                            <XIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div class="mt-8">
                        <div class="flow-root">
                          <ul
                            role="list"
                            class="-my-6 divide-y divide-gray-500"
                          >
                            <li
                              v-for="product in products"
                              :key="product.id"
                              class="flex py-6"
                            >
                              <div
                                class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-500"
                              >
                                <img
                                  :src="product.imageSrc"
                                  :alt="product.imageAlt"
                                  class="h-full w-full object-cover object-center"
                                />
                              </div>

                              <div class="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div
                                    class="flex justify-between text-base font-medium text-gray-200"
                                  >
                                    <h3>
                                      <a :href="product.href">
                                        {{ product.name }}
                                      </a>
                                    </h3>
                                    <p class="ml-4">
                                      {{ product.price / 100 }}zł
                                    </p>
                                  </div>
                                  <p class="mt-1 text-sm text-gray-400">
                                    {{ product.websiteName }}
                                  </p>
                                </div>
                                <div
                                  class="flex flex-1 items-end justify-between text-sm"
                                >
                                  <p class="text-gray-500"></p>

                                  <div class="flex">
                                    <button
                                      type="button"
                                      class="font-medium text-mint"
                                    >
                                      Przejdź do sklepu
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div class="border-t border-gray-500 py-6 px-4 sm:px-6">
                      <div
                        class="flex justify-between text-base font-medium text-white"
                      >
                        <p>Najnirzsza cena:</p>
                        <p>{{ cheapest.price / 100 }}zł</p>
                      </div>
                      <p class="mt-0.5 text-sm text-gray-300">
                        Szukany przedmiot kupisz najtaniej na
                        {{ cheapest.websiteName }}
                      </p>
                      <div class="mt-6">
                        <a
                          href="#"
                          class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                          >Przejdz do najtańszego</a
                        >
                      </div>
                      <div
                        class="mt-6 flex justify-center text-center text-sm text-gray-300"
                      >
                        <p>
                          or
                          <button
                            type="button"
                            class="font-medium text-mint"
                            @click="open = false"
                          >
                            Wróć Do Proponowanych<span aria-hidden="true">
                              &rarr;</span
                            >
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs, watch, computed } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/outline";
import axios from "axios";

const currentProduct = ref(null);

const products = ref([]);
const cheapest = ref({});
const dataFromBackend = ref({});
const emit = defineEmits(["close"]);
const props = defineProps({
  productName: String,
  open: Boolean,
});

function getItemFromPlatform(platformName, data) {
  const lowerName = platformName.toLowerCase();
  if (!data[lowerName]) return undefined;
  return {
    name: data[lowerName].appTitle,
    href: data[lowerName].linkToStore,
    websiteName: platformName,
    price: data[lowerName].pricePLN,
    imageSrc: data[lowerName].appImg,
    imageAlt: data[lowerName].appTitle,
  };
}

function getItemPrices() {
  axios
    .get(
      `http://localhost:3000/api/product?item=${encodeURI(productName.value)}`
    )
    .then((res) => {
      if (res.data) dataFromBackend.value = res.data.site;
      let steamItem;
      let kinguinItem;
      let enebaItem;
      let g2aItem;

      kinguinItem = getItemFromPlatform("Kinguin", res.data.site);
      steamItem = getItemFromPlatform("Steam", res.data.site);
      enebaItem = getItemFromPlatform("Eneba", res.data.site);
      g2aItem = getItemFromPlatform("G2A", res.data.site);

      products.value = [steamItem, kinguinItem, enebaItem, g2aItem].filter(
        (el) => el != undefined
      );
      products.value.forEach((el, index) => {
        if (index == 0) cheapest.value = el;
        else if (el.price < cheapest.value.price) cheapest.value = el;
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
}

const productName = computed(() => props.productName);

const params = new URLSearchParams(window.location.search);
currentProduct.value = params.get("item");
if (currentProduct.value) getItemPrices();
watch(
  () => props.open,
  (open) => {
    if (open == false) {
      products.value = [];
      cheapest.value = {};
      dataFromBackend.value = {};
    }
    getItemPrices();
  }
);
</script>
