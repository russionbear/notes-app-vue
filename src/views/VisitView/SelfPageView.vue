<template>
  <div class="container" :style="{width: isPhone?'100%':'50%'}">
    <storage-info-vue @enter="handle_to_notelist" v-for="item in storages" :storage-info="item" ></storage-info-vue>

  </div>
  <my-link-to-vue :text="'WATCH'+(has_watch?'ED':'')" link-type="event" :bottom="220" @click="handle_watch"></my-link-to-vue>
</template>

<script lang="ts" setup>
import StorageInfoVue from '@/components/information/StorageInfo.vue';
import { StorageInfo, UserInfo, Watch } from '@/interfaceApi/backend';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { isPhone } from '@/config/generalConfig';
import { UserInfoController, StorageInfoController, WatchInfoController } from '@/utils/localAxios';
import MyLinkToVue from '@/components/MyLinkTo.vue';
import { useUserInfoStore } from '@/stores/userinfo';

const router = useRouter();

const ownerInfo = ref(new UserInfo());
const userInfo = useUserInfoStore();

const has_watch = ref(false);

const storages = reactive([...Array(0).keys()].map(item=>{
  const tmpInfo = new StorageInfo();
  tmpInfo.bookname = " bookname";
  tmpInfo.userid = "userid";
  return tmpInfo;
}))

onMounted(()=>{
  let q_index = router.currentRoute.value.fullPath.indexOf('?');
  if(q_index===-1){
    return;
  }
  let params = router.currentRoute.value.fullPath.substring(q_index+2).split('/');
  if(params.length==0||params[0]=='undefined'){
    return
  }

  UserInfoController.getOneByName(params[0]).then(response=>{
    if(response.data!=null){
      ownerInfo.value = response.data;
      StorageInfoController.getAllByName(ownerInfo.value.username as string).then(res=>{
        console.log(res.data);
        storages.splice(0, storages.length);
        storages.push(...res.data);
      })
      WatchInfoController.getOne(userInfo.userid, ownerInfo.value.userid as string).then(res=>{
        if(res.data=="1"){
          has_watch.value = true;
        }
      })
    }
  })
})

const handle_to_notelist = (storageInfo: StorageInfo) =>{
  
  router.push(`/visit/noteList?/${storageInfo.username}/${storageInfo.bookname}`)
}

const handle_watch = () => {
  if(has_watch.value){
    WatchInfoController.deleteOne(userInfo.userid, ownerInfo.value.userid as string).then(response=>{
      if(response.data=="1"){
        has_watch.value = false;
      }
    })
  }else{
    const tmpWatch = new Watch();
    tmpWatch.userid = userInfo.userid;
    tmpWatch.targetid = ownerInfo.value.userid as string;
    WatchInfoController.insertOne(tmpWatch).then(response=>{
      if(response.data=="1"){
        has_watch.value = true;
      }
    })
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
  