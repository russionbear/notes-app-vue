<template>
  <div class="container">
    <v-md-editor @save="handle_save"  v-model="edit_note.content" :height="(windowResize.height - 60) + 'px'"></v-md-editor>
  </div>
  <my-link-to-vue text="catalog" link-type="event" @click="handle_open_catalog"></my-link-to-vue>
  <my-link-to-vue v-if="userInfo.current_notename.length!=0" text="resource" link-type="event" :bottom="160" @click="handle_open_resource"></my-link-to-vue>
  <my-link-to-vue text="EditModel" link-type="event" :bottom="220" @click="handle_open_edit_model"></my-link-to-vue>

  <note-list-dialog-vue ref="catalog_dialog_ref"></note-list-dialog-vue>
  <resource-manager-draw-vue ref="resource_dialog_ref" ></resource-manager-draw-vue>
  <edit-model-list-dialog-vue ref="edit_model_dialog_ref"></edit-model-list-dialog-vue>
</template>
  
<script setup lang="ts">import { NoteInfo } from '@/interfaceApi/backend';
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useWindowResizeStore } from "@/stores/windowResize"
import MyLinkToVue from '@/components/MyLinkTo.vue';
import NoteListDialogVue from '@/components/NoteListDialog.vue';
import ResourceManagerDrawVue from '@/components/ResourceManagerDraw.vue';
import EditModelListDialogVue from '@/components/EditModelListDialog.vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/userinfo';
import { NoteInfoController, ResourceInfoController } from '@/utils/localAxios';
// import 

const router = useRouter();
const userInfo = useUserInfoStore();
const windowResize = useWindowResizeStore();
const edit_note = reactive(new NoteInfo());
const resource_list = reactive([])
// const prim_note = reactive(new NoteInfo());


const catalog_dialog_ref = ref(null);
const resource_dialog_ref = ref(null);
const edit_model_dialog_ref = ref(null);
const handle_open_resource = () => {
  if (resource_dialog_ref.value != null) {
    
    //@ts-ignore
    resource_dialog_ref.value.visible = true;
  }
}

const handle_open_catalog = () => {
  if (catalog_dialog_ref.value != null) {
    //@ts-ignore
    catalog_dialog_ref.value.visible = true;
  }
}

const handle_open_edit_model = () => {
  if (edit_model_dialog_ref.value != null) {
    //@ts-ignore
    edit_model_dialog_ref.value.visible = true;
  }
}


let subscribe: Function;
const old_bookname = ref("");
const old_notename = ref("");

onMounted(() => {
  subscribe = userInfo.$subscribe((mutation, state) => {
    if (old_bookname.value != state.current_storage || old_notename.value != state.current_notename) {
      old_bookname.value = state.current_storage;
      old_notename.value = state.current_notename;
      if (state.current_storage == "" || state.current_notename == "") {
        for (let i in edit_note) {
          //@ts-ignore
          edit_note[i] = undefined;
        }
        edit_note.content = "";
        resource_list.splice(0, resource_list.length);
      } else {
        NoteInfoController.getOneByFull(state.username, state.current_storage, state.current_notename).then(response => {
          if (response.data != null) {
            for (let i in response.data) {
              //@ts-ignore
              edit_note[i] = response.data[i];
            }
            //@ts-ignore
            resource_dialog_ref.value.refresh((response.data as NoteInfo).noteid as string);

            ResourceInfoController.findTextByFullName(state.username, state.current_storage, state.current_notename, '__content__').then(res => {
              edit_note.content = res.data;
            })
            console.log(edit_note);
            // ResourceInfoController.getAllInfo((response.data as NoteInfo).noteid as string).then(res=>{
            //   resource_list.
            // })
          }
        })
      }
      
      //@ts-ignore
      resource_dialog_ref.value.refresh(userInfo.current_notename==""||userInfo.current_notename==undefined?"":edit_note.noteid);
    }
    console.log("modify", state.current_storage, state.current_notename);
  })

  if (userInfo.token == null) {
    router.push("/visit/login");
    return;
  }
  // ElMessage({ type: "info", message: "loading..." })
})

onUnmounted(() => {
  subscribe();
})


const handle_save = () => {
  if (userInfo.current_storage == "" || userInfo.current_notename == "") {
    ElMessage({ type: "info", message: "invalid article" });
    return;
  }
  // console.log(edit_note.content);
  ResourceInfoController.updateOne(edit_note.noteid as string, "__content__", new Blob([edit_note.content as string], {
    type: 'text/plain'
  })).then(response=>{
    if(response.data=="1"){
      ElMessage({ type: "info", message: "saved"});
    }
  })
}

// watch(userInfo.current_notename, ( old_v, new_v)=>{

// })


</script>

<style scoped>
.container {

  display: flex;
}

/* .container>*{
  height: 100%;
} */
</style>
  