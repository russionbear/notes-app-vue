<template>
  <div class="container" :style="{ width: isPhone ? '100%' : '50%' }">
    <el-input v-model="new_name" clearable placeholder="create new one(name and dsc are split by fisrt ';')"
      @change="handle_new_one"></el-input>
    <edit-model-info-vue @delete="handle_delete" @edit="handle_edit" v-for="item in data_list" :edit-model="item"
      :can-edit="true"></edit-model-info-vue>
    <el-dialog v-model="dialog_visible" :width="isPhone ? '100%' : '60%'" :show-close="false">
      <template #header>
        {{ current_data.name }}
      </template>
      <div class="edit-area">
        <v-md-editor @save="handle_save" v-model="current_data.value" height="500px"></v-md-editor>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { isPhone } from '@/config/generalConfig';
import { useUserInfoStore } from '@/stores/userinfo';
import EditModelInfoVue from '@/components/information/EditModelInfo.vue';
import { EditModel } from '@/interfaceApi/backend';
import { EditModelController } from '@/utils/localAxios';
import { ElMessage } from 'element-plus';
const router = useRouter();
const userInfo = useUserInfoStore();
const current_data = reactive(new EditModel());


const data_list = reactive([...Array(0).keys()].map(item => {
  const tmpInfo = new EditModel();
  tmpInfo.dsc = 'dsc';
  tmpInfo.username = 'username';
  tmpInfo.name = 'name';

  return tmpInfo;
}))

onMounted(() => {
  if (userInfo.token == null) {
    router.push("/visit/login");
    return;
  }

  EditModelController.getAll(userInfo.userid, 0).then(response => {
    data_list.splice(0, data_list.length, ...response.data);
  })

})


const dialog_visible = ref(false);
const new_name = ref("");

const handle_new_one = () => {
  if (new_name.value.replaceAll(" ", "").length == 0) {
    return;
  }
  let name = "";
  let dsc = "";
  let split_index = new_name.value.indexOf(";");
  if (split_index == -1) {
    name = new_name.value;
  } else {
    name = new_name.value.substring(0, split_index);
    dsc = new_name.value.substring(split_index + 1);
  }

  for (let item of data_list) {
    if (item.name == name) {
      ElMessage({ type: "info", message: "repeat name" });
      return;
    }
  }

  let tmpInfo = new EditModel();
  tmpInfo.name = name;
  tmpInfo.dsc = dsc;
  tmpInfo.userid = userInfo.userid;
  tmpInfo.username = userInfo.username;
  tmpInfo.value = "<a href=>empty</a>";
  EditModelController.insertOne(tmpInfo).then(response => {
    if (response.data == "1") {
      data_list.splice(0, 0, tmpInfo);
      ElMessage({ type: "success" })
    }
  });
}

const handle_delete = (edit_model: EditModel) => {
  EditModelController.deleteOne(userInfo.userid, edit_model.name as string).then(response => {
    if (response.data == "1") {
      for (let i = 0; i < data_list.length; i++) {
        if (data_list[i].name = edit_model.name) {
          data_list.splice(i, 1);
          break;
        }
      }
    }
  })
}

const handle_edit = (edit_model: EditModel) => {
  for(let i in current_data){
    // @ts-ignore
    current_data[i] = edit_model[i];
  }
  dialog_visible.value = true;
}

const handle_save = () => {
  if(current_data.userid==undefined||current_data.name ==undefined){
    return;
  }
  EditModelController.updateOne(current_data).then(response=>{
    if(response.data == "1"){
      for(let item of data_list){
        if(item.name == current_data.name){
          item.value = current_data.value;
          break;
        }
      }
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
}

.container>* {
  width: 100%;
}
</style>
  