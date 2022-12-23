<script setup lang="ts">

import type {ChatInfo} from "@/interfaceApi/backend";

import dayjs from "dayjs";
const props = withDefaults(defineProps<{
  chatInfo: ChatInfo;
  hideButton: boolean
}>(), {hideButton: false});

 
const emit = defineEmits<{
  (e: "enter", data: ChatInfo): void;
  // (e: "delete", data: ChatInfo): void;
}>();

</script>

<template>
  <el-card class="box-card" shadow="hover">
    <div class="card-container">
        <span>{{chatInfo.sourcename}}</span>
        <span class="card-msg" text>{{chatInfo.msg}}</span>
        <time>{{dayjs(chatInfo.createTime as number *1000).format('MM/DD HH:mm')}}</time>
        <el-button v-if="!hideButton" type="primary" @click="emit('enter', chatInfo)">enter</el-button>
        <!-- <el-button  @click="emit('delete', chatInfo)">delete</el-button> -->
      </div>
  </el-card>
</template>

<style scoped>

 .card-msg{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.box-card{
  border: none;
}

.card-container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items:flex-start;
  gap: 5px;

}

.card-container > time{
  font-size: smaller;
  white-space: nowrap;;
}

</style>
