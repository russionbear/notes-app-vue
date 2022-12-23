<template>
  <div class="container" :style="{width: isPhone?'100%':'50%'}">
    <watch-info-vue @chat="handle_to_chat" @delete="handle_delete" @visit="handle_to_visit" 
    v-for="item in watchlist" :watch="item" ></watch-info-vue>
    <chat-dialog-vue :userid="userInfo.userid" ref="chat_dialog_ref"></chat-dialog-vue>
  </div>
</template>

<script lang="ts" setup>
import WatchInfoVue from '@/components/information/WatchInfo.vue';
import { Watch } from '@/interfaceApi/backend';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { isPhone } from '@/config/generalConfig';
import { useUserInfoStore } from '@/stores/userinfo';
import ChatDialogVue from '@/components/ChatDialog.vue';
import { WatchInfoController } from '@/utils/localAxios';

const router = useRouter();
const userInfo = useUserInfoStore();

const watchlist = reactive([...Array(0).keys()].map(item=>{
  const tmpInfo = new Watch();
  tmpInfo.userid = "userid";
  tmpInfo.targetname = "sdfsdf";
  return tmpInfo;
}))

onMounted(()=>{
  if(userInfo.token==null){
    router.push("/visit/login");
  }

  WatchInfoController.getWatched(userInfo.userid, 0).then(response=>{
    console.log(response.data);
    watchlist.splice(0, watchlist.length, ...response.data);
  })
})

const handle_to_visit = (watch: Watch) =>{
  router.push(`/visit/selfPage?/${watch.targetname}`);
}

const handle_delete = (watch: Watch) => {
  WatchInfoController.deleteOne(userInfo.userid, watch.targetid as string).then(response=>{
    if(response.data == "1"){
      for(let i =0;i<watchlist.length;i++){
        if(watchlist[i].targetid = watch.targetid){
          watchlist.splice(i, 1);
          break;
        }
      }
    }
  });
}

const chat_dialog_ref = ref(null);

const handle_to_chat = (watch: Watch) => {
  // console.log("hjisdf");
  if(chat_dialog_ref.value!=null) {
    //@ts-ignore
    chat_dialog_ref.value.visible = true;
    // console.log("hjisdf");
    //@ts-ignore
    chat_dialog_ref.value.refresh(watch.targetname, watch.targetid);
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
  