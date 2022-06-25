<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto py-2 lg:pt-4 lg:pb-32 lg:max-w-none">
        <div v-if="topSellers.length != 0">
          <h2 class="text-2xl font-extrabold text-white">
            Proponowane produkty
          </h2>
          <div
            class="mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-6"
          >
            <div v-for="item in topSellers">
              <ProposedItem
                :item-name="item.name"
                :item-url="item.large_capsule_image"
                @click="openItem(item.name)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProposedItem from "./ProposedItem.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

const topSellers = ref([]);
const steamData = ref({});
const emit = defineEmits(["updatedParams"]);

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function openItem(name) {
  const params = new URLSearchParams(window.location.search);
  params.set("item", name);
  window.history.replaceState(
    {},
    "",
    `${location.pathname}?${params.toString()}`
  );
  emit("updatedParams");
}

onMounted(async () => {
  axios
    .get(`${window.location.origin}/api/featuredcategories/?cc=pl&l=pl`)
    .then((res) => {
      if (res.data) steamData.value = res.data.top_sellers;
      if (steamData.value)
        topSellers.value = [
          ...new Map(
            steamData.value.items.map((item) => [item["name"], item])
          ).values(),
        ];
    })
    .catch((err) => {});
});
</script>
