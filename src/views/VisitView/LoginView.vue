<template>
  <div class="bg">
    <span>{{ userInfo.token != null ? "logined" : "" }}</span>
    <div class="container">
      <el-image class="image" :src="url" fit="cover" />

      <el-tabs v-model="activeNavName">
        <el-tab-pane label="username" name="username">
          <el-form status-icon label-width="120px" class="demo-ruleForm">
            <el-form-item label="username">
              <el-input v-model="user_info.username" placeholder="username" :minlength="1" />
            </el-form-item>
            <el-form-item label="password">
              <el-input v-model="user_info.password" type="password" autocomplete="off" :maxlength="32" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handle_login_by_username">Submit</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="email" name="email">
          <el-form status-icon label-width="120px" class="demo-ruleForm">
            <el-form-item label="email">
              <el-input v-model="user_info.username" placeholder="email" :minlength="1" />
            </el-form-item>
            <el-form-item label="password">
              <el-input v-model="user_info.password" type="password" autocomplete="off" :maxlength="32" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handle_login_by_email">Submit</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="register" name="register">
          <el-form status-icon label-width="120px" class="demo-ruleForm">
            <el-form-item label="email">
              <el-input v-model="user_info.username" placeholder="email" :minlength="1" />
            </el-form-item>
            <el-form-item label="username">
              <el-input v-model="user_info.username" placeholder="username" :minlength="1" />
            </el-form-item>
            <el-form-item label="password">
              <el-input v-model="user_info.password" type="password" autocomplete="off" :maxlength="32" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handle_register">Submit</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { ILEGAL_CHARS } from "@/utils/dataFormat";
import { UserInfoController } from "@/utils/localAxios";
import { UserInfo } from "@/interfaceApi/backend";
import { useUserInfoStore } from "@/stores/userinfo";
import { useRouter } from "vue-router";

const activeNavName = ref("username");

const router = useRouter();
const userInfo = useUserInfoStore();
const user_info = reactive({
  username: "",
  email: "",
  password: "",
})

const url = "/static/public/public/login/cover.png";


const handle_login_by_username = () => {
  for (let item of user_info.username) {
    if (ILEGAL_CHARS.indexOf(item) != -1) {
      ElMessage({ type: "info", message: "非法字符+/? %#$=空格" });
      return;
    }
  }

  UserInfoController.check(user_info.username, user_info.password, null).then(response => {
    if (response.data != null && response.data != undefined) {

      userInfo.userid = response.data.userid;
      userInfo.username = response.data.username;
      userInfo.password = user_info.password;
      userInfo.email = user_info.email;
      userInfo.token = "token";
      localStorage.setItem("userid", response.data.userid);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("password", user_info.password);
      localStorage.setItem("email", user_info.email);
      localStorage.setItem("token", "token");
      router.push("/visit");
    }
  });
}

const handle_login_by_email = () => {
  UserInfoController.check(null, user_info.password, user_info.email).then(response => {
    if (response.data != null && response.data != undefined) {

      userInfo.userid = response.data.userid;
      userInfo.username = response.data.username;
      userInfo.password = user_info.password;
      userInfo.email = user_info.email;
      userInfo.token = "token";
      localStorage.setIterm("userid", response.data.userid);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("password", user_info.password);
      localStorage.setItem("email", user_info.email);
      localStorage.setItem("token", "token");
      router.push("/visit");
    }
  });
}

const handle_register = () => {
  for (let item of user_info.username) {
    if (ILEGAL_CHARS.indexOf(item) != -1) {
      ElMessage({ type: "info", message: "非法字符+/? %#$=空格" });
      return;
    }
  }
  const tmpInfo = new UserInfo();
  tmpInfo.email = user_info.email;
  tmpInfo.password = user_info.password;
  tmpInfo.username = user_info.username;
  tmpInfo.role = "";
  UserInfoController.registerUser(tmpInfo).then(response => {
    if (response.data == "1") {
      ElMessage({ type: "success", message: "success" });
    }
  })
}
</script>
  
<style scoped>
.bg {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image {
  width: 50%;
  width: 400px;
  height: 500px;
  background-color: red;
}

.container {
  display: flex;
  flex-direction: row;
  width: 800px;
  height: 500px;
  justify-content: space-around;
  align-items: center;
  padding-bottom: 100px;
}
</style>