<template>
  <div class="mt-8 space-y-6">
    <div class="rounded-md shadow-sm -space-y-px">
      <div class="w-full relative">
        <Combobox v-model="selected">
          <div class="mt-1 flex rounded-md shadow-sm">
            <span
              class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-white text-gray-600 text-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            >
              <div class="flex">
                <span class="sr-only">Search</span>
                <svg
                  class="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </span>
            <div class="relative w-full">
              <ComboboxInput
                type="text"
                @keyup.enter="onCustomData"
                @keyup="keyupEvent"
                @keydown="keydownEvent($event)"
                name="game-searcher"
                id="game-searcher"
                class="border border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base text-gray-600"
                placeholder="Szukaj gry"
                :displayValue="(app) => app.name"
                @change="query = $event.target.value"
              />
            </div>
          </div>
          <TransitionRoot
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            @after-leave="query = ''"
          >
            <ComboboxOptions
              v-if="filteredApps.length >= 0 && query !== ''"
              class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10"
            >
              <div
                v-if="errorTryingToGetHints"
                class="relative cursor-default select-none py-2 px-4 text-gray-700"
              >
                Nie pobrano podpowiedzi
              </div>
              <!--
              <div
                v-else-if="
                  filteredApps.length === 0 && query !== '' 
                "
                class="relative cursor-default select-none py-2 px-4 text-gray-700"
              >
                Nie znaleziono nic podobnego
              </div>-->

              <ComboboxOption
                v-for="app in filteredApps"
                as="template"
                :key="app.appid"
                :value="app"
                v-slot="{ active }"
              >
                <li
                  class="relative cursor-default select-none py-2 pl-10 pr-4"
                  :class="{
                    'bg-indigo-600 text-white': active,
                    'text-gray-900': !active,
                  }"
                >
                  <span
                    class="block truncate font-normal"
              
                    @click="choosedFromList(app.name)"
                  >
                    {{ app.name }}
                  </span>
                  <!--
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3"
                    :class="{
                      'text-white': active,
                      'text-teal-600': !active,
                    }"
                  > 
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>-->
                </li>
              </ComboboxOption>
            </ComboboxOptions>
          </TransitionRoot>
        </Combobox>
      </div>
    </div>

    <div>
      <button
        @click="onCustomData"
        type="submit"
        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
          <img
            class="block h-6 w-auto"
            src="../assets/gameify-mark-white-500.svg"
            alt="Gameify"
          />
        </span>
        Szukaj w Gameify
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from "@headlessui/vue";
import { CheckIcon, SelectorIcon } from "@heroicons/vue/solid";
import axios from "axios";
import { ref, computed } from "vue";

const query = ref("");
const errorTryingToGetHints = ref(false);
const apps = ref([]);
const selected = ref({});
const emit = defineEmits(["updatedParams"]);
const textInInput = ref("");

async function getHintsFromSteam() {
  axios
    .get(`${window.location.origin}/ISteamApps/GetAppList/v2/`)
    .then((res) => {
      if (res.data)
        if (res.data.applist)
          apps.value = res.data.applist.apps.filter((el) => el.name != "");
    })
    .catch((err) => {
      errorTryingToGetHints.value = true;
    });
}
getHintsFromSteam();

function choosedFromList(el) {
  const params = new URLSearchParams(window.location.search);
  params.set("item", el);
  window.history.replaceState(
    {},
    "",
    `${location.pathname}?${params.toString()}`
  );
  emit("updatedParams");
}

function submit() {
  const params = new URLSearchParams(window.location.search);

  if (selected.value) params.set("item", selected.value.name);
  if (query.value) params.set("item", query.value);

  window.history.replaceState(
    {},
    "",
    `${location.pathname}?${params.toString()}`
  );
  emit("updatedParams");
}

function onCustomData() {
  query.value = textInInput.value;
  selected.value = {
    appid: "custom",
    name: textInInput.value,
  };
  submit();
}

const filteredApps = ref([]);

let typingTimer;
const doneTypingInterval = 500;
function keyupEvent() {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
}

function keydownEvent($event) {
  textInInput.value = $event.target.value;
  clearTimeout(typingTimer);
}

function doneTyping() {
  filteredApps.value =
    query.value.length < 3
      ? []
      : [
          ...new Map(
            apps.value
              .filter((app) =>
                app.name
                  .toLowerCase()
                  .replace(/\s+/g, "")
                  .includes(query.value.toLowerCase().replace(/\s+/g, ""))
              )
              .map((item) => [item["appid"], item])
          ).values(),
        ];
}
</script>
