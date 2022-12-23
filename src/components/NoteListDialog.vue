<template>
  <el-dialog v-model="visible" :show-close="false" width="60%">
    <template #header>
      <el-space>
        <el-dropdown @command="handle_book_change">
          <el-button type="primary">
            {{ userInfo.current_storage }}
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in userInfo.storages.map(item => item.bookname)" :command="item">{{ item
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button type="primary" @click="handle_show_book_manager">manage</el-button>
      </el-space>


    </template>
    <template #footer>
      <el-input v-model="input_value" placeholder="create article" clearable @change="handle_create_article">
      </el-input>
    </template>
    <el-dialog v-model="rename_visible" align-center>
      <el-space wrap>
        <span>rename</span>
        <el-input v-model="rename_input_value" @change="handle_rename" />
      </el-space>
    </el-dialog>
    <storage-list-dialog-vue ref="storage_dialog_ref"></storage-list-dialog-vue>
    <el-scrollbar height="480px">
      <div class="container">
        <note-info-vue @delete="handle_delete" @edit="handle_rename_open" @visit="handle_switch" v-for="item in userInfo.notelist" :note-info="item" :can-edit="true"></note-info-vue>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>
  
<script setup lang="ts">
import { NoteInfo } from '@/interfaceApi/backend';
import { ref, reactive } from 'vue';
import NoteInfoVue from './information/NoteInfo.vue';
import { NoteInfoController } from "@/utils/localAxios";
import StorageListDialogVue from './StorageListDialog.vue';
import { useUserInfoStore } from '@/stores/userinfo';
import { ElMessage } from 'element-plus';

const isLoading = ref(false);
const userInfo = useUserInfoStore();

const input_value = ref("");
const visible = ref(false);


const storage_dialog_ref = ref(null);
const handle_book_change = (command: string) => {
  userInfo.current_storage = command;
  userInfo.notelist.splice(0, userInfo.notelist.length);
  NoteInfoController.getAll(userInfo.username, command).then(response=>{
    userInfo.notelist.splice(0, userInfo.notelist.length, ...response.data);
  })
}

const handle_show_book_manager = () => {
  if (storage_dialog_ref.value != null) {
    //@ts-ignore
    storage_dialog_ref.value.visible = true;
  }
}



defineExpose({
  visible,
  // refresh
});


const handle_create_article = () => {
  if (userInfo.current_storage.length==0||input_value.value.length == 0||userInfo.notelist.findIndex(item=>item.notename==input_value.value)!=-1) {
    return;
  }

  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  const tmpInfo = new NoteInfo();
  //@ts-ignore
  tmpInfo.isPublic = 1;
  tmpInfo.userid = userInfo.userid;
  tmpInfo.notename = input_value.value;
  tmpInfo.bookname = userInfo.current_storage;
  tmpInfo.username = userInfo.username;
  tmpInfo.collections = 0;
  tmpInfo.goods = 0;
  tmpInfo.content = "";

  NoteInfoController.insertOne(tmpInfo).then(response=>{
    if(response.data!=null){
      userInfo.notelist.splice(0, 0, response.data);
      input_value.value = '';
      ElMessage({type: "success"});
    }
  }).finally(()=>{
    isLoading.value = false;
  })
}

const rename_visible = ref(false);
const rename_old_value = ref("");
const rename_input_value = ref("");
const handle_rename_open = (note_info: NoteInfo) => {
  rename_input_value.value = note_info.notename as string;
  rename_old_value.value = note_info.notename as string;
  rename_visible.value = true;
}
const handle_rename = () => {
  if(rename_input_value.value.replaceAll(" ", "").length==0||rename_input_value.value==rename_old_value.value){
    return;
  }

  for(let item of userInfo.notelist){
    if(item.notename==rename_input_value.value){
      ElMessage({type: "info", message:" name repeat"});
      return;
    }
  }

  let rename_old_id = userInfo.notelist.find(item=>item.notename=rename_old_value.value)?.noteid;

  NoteInfoController.rename(rename_input_value.value, rename_old_id as string).then(response=>{
    if(response.data=="1"){
      for(let item of userInfo.notelist){
        if(item.notename==rename_old_value.value){
          item.notename = rename_input_value.value;
          if(userInfo.current_notename==rename_old_value.value){
            userInfo.current_notename = rename_input_value.value;
          }
          break;
        }
      }
      rename_visible.value = false;
      ElMessage({type: "success"})
    }
  })
}

const handle_delete = (note_info: NoteInfo) => {
  NoteInfoController.deleteOne(note_info.noteid as string).then(response=>{
    if(response.data=="1"){
      userInfo.notelist.splice(userInfo.notelist.findIndex(item=>item.noteid==note_info.noteid), 1)
      if(note_info.notename == userInfo.current_notename){
        userInfo.current_notename = "";
      }
    }
  })
}

const handle_switch = (note_info: NoteInfo) => {
  userInfo.current_notename = note_info.notename as string;
  visible.value = false;
}
</script>
  
<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>
  