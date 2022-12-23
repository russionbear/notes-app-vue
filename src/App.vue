<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { RouterView } from "vue-router";
import {useWindowResizeStore} from "@/stores/windowResize";
import { useUserInfoStore } from "./stores/userinfo";

const userInfo = useUserInfoStore();
const windowResize = useWindowResizeStore();

onMounted(()=>{

  userInfo.userid =  localStorage.getItem("userid") as string;
  userInfo.username = localStorage.getItem("username") as string;
  userInfo.password = localStorage.getItem("password") as string;
  userInfo.email = localStorage.getItem("email") as string;
  userInfo.token = localStorage.getItem("token") as string;

  window.onresize = handle_window_resize;
  handle_window_resize();
  // console.log("hello",import.meta.env);
})

onUnmounted(()=>{
  window.onresize = handle_window_resize;
})

const handle_window_resize = () => {
  windowResize.width = document.body.clientWidth;
  windowResize.height = document.body.clientHeight;
}
</script>

<template>
        <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->
  <!-- <RouterView /> -->
  <router-view  v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.name" />
    </keep-alive>
    <!-- <component :is="Component" :key="$route.name"  v-if="!$route.meta||!$route.meta.keepAlive" /> -->
  </router-view>
  <!-- <router-view/> -->
</template>

<style>
/* html, #app, body{
  height: 100%;
  margin: 0;
}
main {
  height: 100%;
} */
.el-scrollbar__view{
  height: 100%;
}

/* .el-card__body{
  min-height: 50px;
} */
</style>
