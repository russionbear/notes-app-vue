<template>
  <div class="container" :style="{width: isPhone?'100%':'50%'}">
    <note-info-vue @visit="handle_to_note" v-for="item in notelist" :note-info="item" ></note-info-vue>
  </div>
</template>

<script lang="ts" setup>
import NoteInfoVue from '@/components/information/NoteInfo.vue';
import { NoteInfo } from '@/interfaceApi/backend';
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { isPhone } from '@/config/generalConfig';
import { NoteInfoController } from '@/utils/localAxios';
const router = useRouter();

const notelist = reactive([...Array(0).keys()].map(item=>{
  const tmpInfo = new NoteInfo();
  tmpInfo.bookname = " bookname";
  tmpInfo.userid = "userid";
  tmpInfo.notename = "sdfs;dfsd;f";
  return tmpInfo;
}))

onMounted(()=>{
  let q_index = router.currentRoute.value.fullPath.indexOf('?');
  if(q_index===-1){
    return;
  }
  let params = router.currentRoute.value.fullPath.substring(q_index+2).split('/');
  if(params.length==0){
    return
  }

  NoteInfoController.getAll(params[0], params[1]).then(response=>{
    notelist.splice(0, notelist.length);
    notelist.push(...response.data);
  })

})

const handle_to_note = (noteInfo: NoteInfo) =>{
  router.push(`/visit/article?/${noteInfo.username}/${noteInfo.bookname}/${noteInfo.notename}`)
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
  