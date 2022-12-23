<template>
  <el-scrollbar >
    <div class="container">
      <div
        class="header"
      >
      
        <el-menu
          class="el-menu-demo nav_menu"
          background-color="#545c64"
          mode="horizontal"
          :router="true"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
        <!-- <div class="flex-grow" /> -->
          <el-menu-item
            v-for="item in edit_router"
            :index="item.path"
            :key="item.path"
            >{{ item.title }}
          </el-menu-item>
          <el-menu-item
            :index="VISIT_ROUTERS[0].path"
            :key="VISIT_ROUTERS[0].path"
            >toVisit
          </el-menu-item>
        </el-menu>
        <el-button
      type="primary"
      text
      @click="handle_to_search"
      >search</el-button>
      </div>
      <div class="body">
        <!-- <router-view  v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" :key="$route.name" />
          </keep-alive>
          <component :is="Component" :key="$route.name"  v-if="!$route.meta||!$route.meta.keepAlive" />
        </router-view> -->
        <router-view />
      </div>
    </div>
    <el-backtop :bottom="100" target=".el-scrollbar__wrap" />
  </el-scrollbar>

<search-dialog-vue ref="search_dialog_ref"></search-dialog-vue>
</template>

<script setup lang="ts">
import {VISIT_ROUTERS, EDIT_ROUTERS} from "@/router/index"
import { computed, onMounted, onUnmounted, ref } from "vue";
import SearchDialogVue from "@/components/SearchDialog.vue";
import { NoteInfoController, StorageInfoController } from "@/utils/localAxios";
import { useUserInfoStore } from "@/stores/userinfo";
import { useRouter } from "vue-router";

const router = useRouter();
const userInfo = useUserInfoStore();
const edit_router = computed(()=>EDIT_ROUTERS.filter(item=>item["title"]!=undefined));
const search_dialog_ref = ref(null);

const handle_to_search = () => {
  if(search_dialog_ref.value!=null) {
    //@ts-ignore
    search_dialog_ref.value.visible = true;
  }
}

onMounted(()=>{
  if(userInfo.token==null){
    router.push("/visit/login");
    return;
  }

  StorageInfoController.getAllByName(userInfo.userid).then(response=>{
    userInfo.storages.splice(0, userInfo.storages.length, ...response.data);
    if(response.data.length!=0){
      userInfo.current_storage = response.data[0].bookname as string;
      NoteInfoController.getAll(userInfo.username, userInfo.storages[0].bookname as string).then(res=>{
        userInfo.notelist.splice(0, userInfo.notelist.length, ...res.data);
        if(response.data.length!=0){
          userInfo.current_notename = response.data[0].notename;
        }
      })
    }
  })

})

</script>

<style scoped>
.container,
.body {
  display: flex;
  height: fit-content;
  flex-direction: column;
  height: 100%;
}

.body {
  padding-top: 58px;
}

.header {
  width: 100%;
  position: fixed;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: #545c64;
  z-index: 100;
}

.nav_menu {
  width: 60%;
}

</style>
