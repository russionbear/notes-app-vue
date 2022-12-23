<template>
  <div class="container" :style="{width: isPhone?'100%':'50%'}">
    <chat-info-vue @enter="handle_open_dialog" v-for="item in notelist" :chat-info="item" ></chat-info-vue>
    <chat-dialog-vue :userid="userInfo.userid" ref="chat_dialog_ref"></chat-dialog-vue>
  </div>
</template>

<script lang="ts" setup>
import ChatInfoVue from '@/components/information/ChatInfo.vue';
import { ChatInfo } from '@/interfaceApi/backend';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { isPhone } from '@/config/generalConfig';
import ChatDialogVue from '@/components/ChatDialog.vue';
import { useUserInfoStore } from '@/stores/userinfo';
import { ChatInfoController } from '@/utils/localAxios';
import dayjs from 'dayjs';
const router = useRouter();
const userInfo = useUserInfoStore();

/////////////////////////////SOLVTION ONE///////////////////////////////////
// const notelist = computed(()=>{
//   let rlt = [...notelist_rev, ...notelist_send].sort((a, b)=>(a.createTime as number- (b.createTime as number)))
//   .map(item=>{
//     let rlt = item;
//     if(rlt.sourceid==userInfo.userid){
//       rlt.sourcename = userInfo.username;
//     }else{
//       rlt.targetname = userInfo.username;
//     }
//     return item;
//   })

//   let should_delete: Set<number> = new Set([]);
//   let tmp_length = rlt.length;
//   for(let i = 0; i < tmp_length; i++){
//     if(should_delete.has(i)){
//       continue;
//     }
//     for(let j = i+1; j < tmp_length; j++){
//       if(rlt[j].sourceid==rlt[i].sourceid&&rlt[j].targetid==rlt[i].targetid&&rlt[j].createTime==rlt[i].createTime){
//         should_delete.add(j);
//       }
//     }
//   }

//   let tmp_array = Array.from(should_delete);
//   for(let i of tmp_array.sort().reverse()){
//     rlt.splice(i, 1);
//   }
// })

// const notelist_rev = reactive([...Array(0).keys()].map(item=>{
//   const tmpInfo = new ChatInfo();
//   tmpInfo.createTime = new Date().getDate();
//   tmpInfo.sourcename = "sourcename";
//   tmpInfo.targetname = "targetname";
//   tmpInfo.msg = "msg";
//   return tmpInfo;
// }))

// const notelist_send = reactive([...Array(0).keys()].map(item=>{
//   const tmpInfo = new ChatInfo();
//   tmpInfo.createTime = new Date().getDate();
//   tmpInfo.sourcename = "sourcename";
//   tmpInfo.targetname = "targetname";
//   tmpInfo.msg = "msg";
//   return tmpInfo;
// }))


const notelist = reactive([...Array(0).keys()].map(item=>{
  const tmpInfo = new ChatInfo();
  tmpInfo.createTime = new Date().getDate();
  tmpInfo.sourcename = "sourcename";
  tmpInfo.targetname = "targetname";
  tmpInfo.msg = "msg";
  return tmpInfo;
}))

onMounted(()=>{
  if(userInfo.token==null){
    router.push("/visit/login");
    return;
  }

  ///////////////////////////////////// SOLVTION ONE///////////////////////////////////
  // ChatInfoController.getRecentRevMsg(userInfo.userid, dayjs().add(-6, 'month').unix(), 0).then(response=>{
  //   console.log(response.data,dayjs().add(-6, 'month').unix());
  //   notelist_rev.splice(0, notelist_rev.length, ...response.data);
  // })
  // ChatInfoController.getRecentSendMsg(userInfo.userid, dayjs().add(-6, 'month').unix(), 0).then(response=>{
  //   console.log(response.data);
  //   notelist_rev.splice(0, notelist_send.length, ...response.data);
  // })

  ChatInfoController.getRecentRevMsg(userInfo.userid, dayjs().add(-6, 'month').unix(), 0).then(respnose=>{
    // console.log(respnose.data);
    notelist.splice(0, notelist.length, ...respnose.data.sort((a: ChatInfo, b: ChatInfo)=>a.createTime as number-(b.createTime as number)).map((item: ChatInfo)=>{
      let rlt = item;
      if(rlt.sourceid==userInfo.userid) {
        rlt.sourcename = userInfo.username;
        rlt.targetname = rlt.username;
      }else{
        rlt.targetname  = userInfo.username;
        rlt.sourcename = rlt.username;
      }
      return rlt;
    }));
  })
})

// const handle_to_note = (noteInfo: ChatInfo) =>{
//   router.push(`/visit/article?/${noteInfo.username}/${noteInfo.bookname}/${noteInfo.notename}`)
// }

const chat_dialog_ref = ref(null);
const handle_open_dialog = (chatInfo: ChatInfo) => {
  console.log("hi");
  if(chat_dialog_ref.value!=null){
    //@ts-ignore
    chat_dialog_ref.value.visible = true;
    console.log(chatInfo);
    //@ts-ignore
    chat_dialog_ref.value.refresh(
      chatInfo.sourceid==userInfo.userid?chatInfo.targetname:chatInfo.sourcename,
      chatInfo.sourceid==userInfo.userid?chatInfo.targetid:chatInfo.sourceid,
    );
    console.log("hi", chatInfo.sourceid==userInfo.userid);
  }
}
</script>

<style scoped>
.container{
  display: flex;
  align-items: center;
  align-self:center;
  margin: 10px;
  gap: 10px;
}

.container > *{
  width: 100%;
}
</style>
  