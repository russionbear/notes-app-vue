<template>
  <el-dialog v-model="visible" :show-close="false">
    
    <template #footer>
        <el-input v-model="new_name" placeholder="create storage" clearable @change="handle_create_stroage">
        </el-input>
      </template>
    <el-scrollbar height="500px">

      <div class="container">
        <storage-info-vue @enter="handle_to_notelist" @delete="handle_delete" @edit="handle_open_rename"
          v-for="item in userInfo.storages" :storage-info="item" :can-edit="true"></storage-info-vue>
      </div>
    </el-scrollbar>
    <el-dialog v-model="rename_visible" align-center>
      <el-space wrap>
        <span>rename</span>
        <el-input v-model="rename_input_value" @change="handle_rename" />
      </el-space>
    </el-dialog>
  </el-dialog>

</template>

<script lang="ts" setup>
import StorageInfoVue from '@/components/information/StorageInfo.vue';
import { StorageInfo } from '@/interfaceApi/backend';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { StorageInfoController } from '@/utils/localAxios';
import { useUserInfoStore } from '@/stores/userinfo';
import { ElMessage } from 'element-plus';

// const props = defineProps<{
//   userid: string,
// }>()


const userInfo = useUserInfoStore();
const visible = ref(false);
const router = useRouter();

const rename_visible = ref(false);
const rename_input_value = ref("");
const rename_old_name = ref("");

// const storages = reactive([...Array(0).keys()].map(item => {
//   const tmpInfo = new StorageInfo();
//   tmpInfo.bookname = " bookname";
//   tmpInfo.userid = "userid";
//   return tmpInfo;
// }))

// const refresh = (userid: string) => {
//   StorageInfoController.getAllById(userid).then(response=>{
//     storages.splice(0, storages.length, ...response.data);
//   })
// }

defineExpose({
  visible,
  // refresh
})

onMounted(() => {
  // refresh(props.userid);
})

const handle_to_notelist = (storageInfo: StorageInfo) => {
  router.push(`/visit/noteList?/${storageInfo.username}/${storageInfo.bookname}`)
}
const handle_delete = (bookInfo: StorageInfo) => {
  StorageInfoController.deleteOne(bookInfo.userid as string, bookInfo.bookname as string).then(response=>{
    if(response.data=='1'){
      for(let i =0;i<userInfo.storages.length;i++){
        if(userInfo.storages[i].bookname == bookInfo.bookname){
          userInfo.storages.splice(i, 1);
          if(userInfo.current_storage==bookInfo.bookname){
            userInfo.current_storage = "";
          }
          break;
        }
      }
    }
  });
}
const handle_open_rename = (bookInfo: StorageInfo) => {
  rename_visible.value = true;
  rename_old_name.value = bookInfo.bookname as string;
  rename_input_value.value = bookInfo.bookname as string;
}

const handle_rename = () => {
  if(rename_input_value.value.replaceAll(" ", "").length==0||rename_input_value.value==rename_old_name.value){
    return;
  }

  for(let item of userInfo.storages){
    if(item.bookname==rename_input_value.value){
      ElMessage({type: "info", message:" name repeat"});
      return;
    }
  }
  StorageInfoController.rename(userInfo.userid, rename_old_name.value, rename_input_value.value).then(response=>{
    if(response.data=="1"){
      for(let item of userInfo.storages){
        if(item.bookname==rename_old_name.value){
          item.bookname = rename_input_value.value;
          if(userInfo.current_storage==rename_old_name.value){
            userInfo.current_storage = rename_input_value.value;
          }
          break;
        }
      }
      rename_visible.value = false;
      ElMessage({type: "success"})
    }
  })
}


const new_name = ref("");
const handle_create_stroage = () => {
  if(new_name.value.replaceAll(" ","").length==0||userInfo.storages.findIndex(item=>item.bookname==new_name.value)!=-1){
    return;
  }
  let tmpInfo = new StorageInfo();
  tmpInfo.userid = userInfo.userid;
  tmpInfo.username = userInfo.username;
  tmpInfo.bookname = new_name.value;
  StorageInfoController.insertOne(tmpInfo).then(response=>{
    if(response.data=="1"){
      userInfo.storages.splice(0, 0, tmpInfo);
    }
  })
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  align-self: center;
  margin: 10px;
  gap: 10px;
  flex-direction: column;
  justify-items: center;
}

.container>* {
  width: 100%;
}
</style>
  