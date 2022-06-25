<template>
  <HomeMenu />
  <SearchContainer @updated-params="updatedParams()"/>
  <Proposed @updated-params="updatedParams()" />
  <ProductsCart
    :product-name="currentProduct"
    :open="open"
    @close="closedProductsCart()"
  />
</template>

<script setup>
import HomeMenu from "./components/HomeMenu.vue";
import SearchContainer from "./components/SearchContainer.vue";
import Proposed from "./components/Proposed.vue";
import ProductsCart from "./components/ProductsCart.vue";

import { ref, onMounted } from "vue";

const currentProduct = ref(null);
const open = ref(false);

const params = new URLSearchParams(window.location.search);
currentProduct.value = params.get("item");

if (currentProduct.value) open.value = true;

function updatedParams() {
  const params = new URLSearchParams(window.location.search);
  currentProduct.value = params.get("item");
  if (currentProduct.value) open.value = true;
}

function closedProductsCart() {
  const params = new URLSearchParams(window.location.search);
  params.delete("item", name);
  window.history.replaceState(
    {},
    "",
    `${location.pathname}?${params.toString()}`
  );
  open.value = false;
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
