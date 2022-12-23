<template>
  <el-dialog v-model="visible" :show-close="false" width="60%">
    <template #header>
      {{target_user_name }}
    </template>
    <template #footer>
      <el-input v-model="input_value" placeholder="search for article" clearable @change="handle_enter">
      </el-input>
    </template>
    <el-scrollbar height="480px">
      <div class="container">
        <chat-info-vue :hide-button="true" v-for="item in messages" :chat-info="item"></chat-info-vue>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script setup lang="ts">
import { ChatInfo } from '@/interfaceApi/backend';
import { ref, reactive } from 'vue';
import ChatInfoVue from './information/ChatInfo.vue';
import { ChatInfoController } from "@/utils/localAxios"
import dayjs from 'dayjs';
import { useUserInfoStore } from '@/stores/userinfo';

const isLoading = ref(false);

const userInfo = useUserInfoStore();
const target_user_name = ref("");
const target_user_id = ref("");

const input_value =ref("");
const visible = ref(false);
const messages = reactive([...Array(10).keys()].map(item=>{
  const tmpInfo = new ChatInfo();
  tmpInfo.targetname = "notename";
  tmpInfo.createTime = new Date().getDate();
  tmpInfo.msg = "content";
  return tmpInfo;
}))

// const props = withDefaults(defineProps<{
//   userid: string
// }>(), {userid: undefined})

const refresh = (target_user: string, target_id: string) => {
  console.log(target_user, target_id)
  target_user_name.value = target_user;  
  target_user_id.value = target_id; ;

  ChatInfoController.getDialogMsg(userInfo.userid, target_id, dayjs().add(-6, 'month').unix(), 0).then(respnse=>{
    messages.splice(0, messages.length, ...respnse.data.map((item: ChatInfo)=>({...item, 
      targetname: item.targetid==userInfo.userid?userInfo.username:target_user_name.value,
      sourcename: item.sourceid==userInfo.userid?userInfo.username:target_user_name.value
    })));
    console.log('message', messages);
  });
}

defineExpose({
  visible,
  refresh
});


const handle_enter = () => {
  if(input_value.value.length == 0){
    return;
  }

  if(isLoading.value){
    return;
  }

  const msg = new ChatInfo();
  msg.sourceid = userInfo.userid;
  msg.targetid = target_user_id.value;
  msg.sourcename = userInfo.username;
  msg.targetname = target_user_name.value;

  msg.msg = input_value.value;
  msg.createTime = dayjs().unix();
  // console.log(dayjs().unix(), dayjs().valueOf());

  ChatInfoController.send(msg).then(response=>{
    console.log(response);
    if(response.data!="0"){
      msg.targetname = target_user_name.value;
      messages.push(msg);
      input_value.value = "";
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
