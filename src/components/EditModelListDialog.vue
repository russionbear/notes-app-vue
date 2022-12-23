<template>
  <el-dialog v-model="visible" :show-close="false" width="60%">
    <template #header>
      <el-input v-model="input_value" placeholder="search for edit model" clearable @change="handle_enter">
      </el-input>
    </template>
    <el-scrollbar height="500px">
      <div class="container">
        <edit-model-info-vue v-for="item in data_list" :edit-model="item" :can-edit="false"></edit-model-info-vue>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>
  
<script setup lang="ts">
import { EditModel } from '@/interfaceApi/backend';
import { ref, reactive } from 'vue';
// import { useRouter } from 'vue-router';
import EditModelInfoVue from './information/EditModelInfo.vue';
import { EditModelController } from "@/utils/localAxios"

const isSearching = ref(false);

const input_value = ref("");
const visible = ref(false);
const data_list = reactive([...Array(0).keys()].map(item => {
  const tmpInfo = new EditModel();
  tmpInfo.dsc = 'dsc';
  tmpInfo.username = 'username';
  tmpInfo.name = 'name';

  return tmpInfo;
}))

// const props = withDefaults(defineProps<{
//   userid: string
// }>(), { userid: undefined })


defineExpose({
  visible
});


const handle_enter = () => {
  if (input_value.value.replaceAll(" ", "").length == 0) {
    handle_clear();
    return;
  }

  if (isSearching.value) {
    return;
  }
  isSearching.value = true;
  data_list.splice(0, data_list.length);

  EditModelController.search(input_value.value, 0).then(response=>{
    data_list.splice(0, data_list.length, ...response.data);
  }).finally(()=>{
    isSearching.value = false;
  })
}

const handle_clear = () => {
  data_list.splice(0, data_list.length);
}

</script>
  
<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>
  