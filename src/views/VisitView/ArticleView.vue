<script setup lang="ts">
import { Collection, Good, NoteInfo } from '@/interfaceApi/backend';
import { onMounted, reactive, ref } from 'vue';
import MyLinkTo from "@/components/MyLinkTo.vue";
import DiscussDialogVue from '@/components/DiscussDialog.vue';
import { useRouter } from 'vue-router';
import { NoteInfoController, ResourceInfoController, GoodController, CollectionController } from '@/utils/localAxios';
import { useUserInfoStore } from '@/stores/userinfo';


const userInfo = useUserInfoStore();
const router = useRouter();
const note_info = reactive(new NoteInfo)

const has_good = ref(false);
const has_collected = ref(false);
const discuss_dialog_ref = ref(null);


const handle_good = () =>{
  if(userInfo.token == null){
      return;
    }

    if(has_good.value===false){
      let tmpGood = new Good();
      tmpGood.noteid = note_info.noteid;
      tmpGood.userid = userInfo.userid;
      GoodController.insertOne(tmpGood).then(response=>{
        if(response.data == "1"){
          (note_info.goods as number)++;
          has_good.value = true;
        }
      });
    }else{
      GoodController.deleteOne(note_info.noteid as string, userInfo.userid).then(response=>{
        if(response.data == "1"){
          (note_info.goods as number)--;
          has_good.value = false;
        }
      });
    }
}

const handle_collecti = () => {
  if(userInfo.token == null){
      return;
    }
    
    if(has_collected.value==false){
      let tmpCollection = new Collection();
      tmpCollection.noteid = note_info.noteid;
      tmpCollection.userid = userInfo.userid;
      console.log("insert");
      CollectionController.insertOne(tmpCollection).then(response=>{
        console.log(response);
        if(response.data == "1"){
          (note_info.collections as number)++;
          has_collected.value = true;
        }
      });
    }else{
      CollectionController.deleteOne(note_info.noteid as string, userInfo.userid).then(response=>{
        if(response.data == "1"){
          (note_info.collections as number)--;
          has_collected.value = false;
        }
      });
    }
}

const handle_gossip = () => {
  if(discuss_dialog_ref.value != null){
    // //@ts-ignore
    // discuss_dialog_ref.value.refresh(note_info.notename, note_info.noteid);
    //@ts-ignore
    discuss_dialog_ref.value.visible = true;
  }
}

const handle_page = () => {
  router.push(`/visit/selfPage?/${note_info.username}`);
}

onMounted(()=>{
  note_info.content = `> some thing may error`;
  note_info.goods = 0;
  note_info.collections = 0;
  let q_index = router.currentRoute.value.fullPath.indexOf('?');
  if(q_index===-1){
    return;
  }
  

  let params = router.currentRoute.value.fullPath.substring(q_index+2).split('/');
  NoteInfoController.getOneByFull(params[0], params[1], params[2]).then(response=>{


    for(let item in note_info){
      //@ts-ignore
      note_info[item] = response.data[item];
    }
    ResourceInfoController.findTextByFullName(params[0], params[1], params[2], '__content__').then(res=>{
      note_info.content = res.data;
    });
    //@ts-ignore
    discuss_dialog_ref.value.refresh(note_info.notename, note_info.noteid);
    
    if(userInfo.token == null){
      return;
    }

    GoodController.getOne(note_info.noteid as string, userInfo.userid).then(rlt=>{
      console.log(rlt.data);
      if(rlt.data == "1"){
        has_good.value = true;
      }
    })

    CollectionController.getOne(userInfo.userid, note_info.noteid as string).then(rlt=>{
      console.log(rlt);
      if(rlt.data == "1"){
        has_collected.value = true;
      }
    })

    // CollectionController.deleteOne(note_info.noteid, userInfo.userid);
  });

})

</script>

<template>
  <div class="container">
    <v-md-preview :text="note_info.content"></v-md-preview>
  </div>
  
  <discuss-dialog-vue ref="discuss_dialog_ref"></discuss-dialog-vue>
  <my-link-to text="PAGE" link-type="event" :bottom="380" @click="handle_page"></my-link-to>
  <my-link-to text="GOSSIP" link-type="event" :bottom="320" @click="handle_gossip"></my-link-to>
  <my-link-to :text="`GOOD ${note_info.goods}`" link-type="event" :bottom="260" @click="handle_good"></my-link-to>
  <my-link-to :text="'STAR '+note_info.collections" link-type="event" :bottom="200" @click="handle_collecti"></my-link-to>
</template>

<style scoped>
.container, .container>*{
  height: 100%;
}

</style>
