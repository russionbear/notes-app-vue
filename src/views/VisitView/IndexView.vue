<template>
    <div class="recent_title">
      <v-md-preview :text="index_mk_value"></v-md-preview>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {ResourceInfoController} from "@/utils/localAxios"

const index_mk_value = ref("something error");
// const recen/t

onMounted(() => {
  ResourceInfoController.findTextByFullName("public", "public", "index", "__content__")
  .then((response) => {
    console.log(response);
    index_mk_value.value = response.data;
  });
});
</script>

<style scoped>
.header {
  background-color: unset;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

@media screen and (orientation: portrait) {

  .recent-col {
    columns: 1;
  }
  .carousel{
     height:200px
  }
}
/*定义横屏 css*/
@media screen and (orientation: landscape) {

  .carousel{
     height:300px
  }
  .padding {
    padding-left: 100px;
    padding-right: 100px;
  }
  .recent-col {
    columns: 2;
  }

  .recent,
  .recent_title {
    margin-left: 60px;
    margin-right: 60px;
  }
}

.recent {
  height: 300px;
  /* width: 50%; */
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  border: 10px solid #cdd0d6;
  padding: 30px;
}

.recent > *:first-child {
  width: 60%;
}

.item {
  padding-right: 30px;
  margin-bottom: 15px;
}

.item:first {
  margin-top: 10px;
}
</style>
