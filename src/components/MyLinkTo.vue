<template>
  <el-button
    class="button"
    type="primary"
    round
    :style="{ bottom: bottom + 'px' }"
    @click="handle_link"
  >
      {{ btnText }}
  </el-button>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = withDefaults(
  defineProps<{
    text: string;
    bottom: number;
    linkType: "index" | "page" |"event" | string;
  }>(),
  {
    text: "INDEX",
    linkType: "index",
    bottom: 100,
  }
);

const btnText = computed(()=>props.text)

const emit = defineEmits<{
  (e: "click"): void
}>()

const link_target = ref(props.linkType);

switch (props.linkType) {
  case "index":
    link_target.value = "/visit";
    break;

  case "page":
    link_target.value = '/edit';
    break;

  default:
    break;
}

const handle_link = () => {
  if(props.linkType==="event"){
    emit("click")
  }else{
    router.push({path: link_target.value})
  }
}
</script>

<style scoped>
.button {
  position: fixed;
  right: 30px;
  z-index: 100;
}
</style>
