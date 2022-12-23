<template>
  <el-dialog v-model="visible" :show-close="false" width="60%">
    <template #header>
      <!-- <el-space> -->
      <el-input v-model="input_value" placeholder="search for article" clearable @change="handle_enter">
      </el-input>
      
        <!-- <el-button @click="handle_clear">clear</el-button>
        <el-button type="primary" @click="handle_enter">search</el-button>
      </el-space> -->
    </template>
    <el-scrollbar height="500px">
      <div class="container">
        <note-info-vue @visit="handle_go" v-for="item in searched" :note-info="item" :can-edit="false"></note-info-vue>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script setup lang="ts">
import { NoteInfo } from '@/interfaceApi/backend';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import NoteInfoVue from './information/NoteInfo.vue';
import { NoteInfoController } from "@/utils/localAxios"

const isSearching = ref(false);

const router = useRouter();
const input_value =ref("");
const visible = ref(false);
const searched = reactive([...Array(0).keys()].map(item=>{
  const tmpInfo = new NoteInfo();
  tmpInfo.notename = "notename";
  tmpInfo.updateTime = new Date().getDate();
  tmpInfo.content = "content";
  return tmpInfo;
}))

const props = withDefaults(defineProps<{
  userid: string
}>(), {userid: undefined})


defineExpose({
  visible
});


const handle_enter = () => {
  if(input_value.value.replaceAll(" ", "").length == 0){
    handle_clear();
  }

  if(isSearching.value){
    return;
  }
  NoteInfoController.search(input_value.value).then(response=>{
    console.log(response);
    searched.splice(0, searched.length);
    searched.push(...response.data);
  }).finally(()=>{isSearching.value = false});
}

const handle_clear = () => {
  searched.splice(0, searched.length);
}

const handle_go = (data: NoteInfo) => {
  visible.value = false;
  router.push(`/visit/article?/${data.username}/${data.bookname}/${data.notename}`);
}
</script>

<style scoped>

.container{
  display: flex;
  flex-direction: column;
}

</style>
