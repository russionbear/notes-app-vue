<template>
  <el-dialog v-model="visible" :show-close="false" width="60%">
    <template #header>
      {{article_name }}
    </template>
    <template #footer>
      <el-input v-model="input_value" placeholder="discuss" clearable @change="handle_enter">
      </el-input>
    </template>
    <el-scrollbar height="480px">
      <div class="container">
        <discuss-info-vue v-for="item in messages" :discuss="item"></discuss-info-vue>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script setup lang="ts">
import { Discuss } from '@/interfaceApi/backend';
import { ref, reactive } from 'vue';
import DiscussInfoVue from './information/DiscussInfo.vue';
import { DiscussController } from "@/utils/localAxios"
import { useUserInfoStore } from '@/stores/userinfo';

const userInfo = useUserInfoStore();

const isLoading = ref(false);

const article_name = ref("");
const article_id = ref("");

const input_value =ref("");
const visible = ref(false);
const messages = reactive([...Array(0).keys()].map(item=>{
  const tmpInfo = new Discuss();
  tmpInfo.username = "username";
  tmpInfo.createTime = new Date().getDate();
  tmpInfo.value = "content";
  return tmpInfo;
}))

const props = withDefaults(defineProps<{
  userid: string
}>(), {userid: undefined})

const refresh = (notename: string, noteid: string) => {
  article_name.value = notename;  
  article_id.value = noteid ;
  DiscussController.getAll(noteid).then(response=>{
    // console.log(response.data);
    messages.splice(0, messages.length);
    messages.push(...response.data);
  })
}

defineExpose({
  visible,
  refresh
});


const handle_enter = () => {
  if(userInfo.token == null){
    return;
  }
  if(input_value.value.length == 0){
    return;
  }

  if(isLoading.value){
    return;
  }


  const msg = new Discuss();
  msg.value = input_value.value;
  msg.createTime = new Date().getDate();
  msg.userid = userInfo.userid;
  msg.noteid = article_id.value;
  msg.username = userInfo.username;

  input_value.value ="";
  
  DiscussController.insertOne(msg).then(response=>{
    // console.log(response);
    if(response.data!="0"){
      messages.push(msg);
    }
  }).finally(()=>{isLoading.value = false});
}

</script>

<style scoped>

.container{
  display: flex;
  flex-direction: column;
}

</style>
