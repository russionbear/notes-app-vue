<template>
  <div class="container" :style="{width: isPhone?'100%':'50%'}">
    <collection-info-vue @delete="handle_delete" @enter="handle_to_note" v-for="item in collections" :collection="item" ></collection-info-vue>
  </div>
</template>

<script lang="ts" setup>
import CollectionInfoVue from '@/components/information/CollectionInfo.vue';
import { Collection } from '@/interfaceApi/backend';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { isPhone } from '@/config/generalConfig';
import { useUserInfoStore } from '@/stores/userinfo';
import { CollectionController } from '@/utils/localAxios';

const router = useRouter();
const userInfo = useUserInfoStore();
const is_loading = ref(false);

const collections = reactive([...Array(0).keys()].map(item=>{
  const tmpInfo = new Collection();
  tmpInfo.userid = "userid";
  tmpInfo.notename = "sdfs;dfsd;f";
  tmpInfo.username = "username";
  return tmpInfo;
}))

onMounted(()=>{
  if(userInfo.token==null){
    router.push("/visit/login");
    return;
  }
  if(is_loading.value){
    return;
  }
  is_loading.value = true;

  CollectionController.getCollection(userInfo.userid, 0).then(response=>{
    console.log(response.data);
    collections.splice(0, collections.length, ...response.data);
  })
})

const handle_to_note = (collection: Collection) =>{
  router.push(`/visit/article?/${collection.username}/${collection.bookname}/${collection.notename}`)
}

const handle_delete = (collection: Collection) => {
  CollectionController.deleteOne(collection.noteid as string, userInfo.userid).then(response=>{
    if(response.data=='1'){
      let tmp_index = collections.findIndex(item=>item.noteid==collection.noteid);
      if(tmp_index!==-1){
        collections.splice(tmp_index, 1);
      }
    }
  });
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
  