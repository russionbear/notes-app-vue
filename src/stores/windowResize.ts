import { ref } from "vue";
import { defineStore } from "pinia";

export const useWindowResizeStore = defineStore("windowresize", () => {
  const width = ref(0);
  const height = ref(0);

  return { width, height };
});
