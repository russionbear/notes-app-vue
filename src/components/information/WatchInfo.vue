<script setup lang="ts">

import type { Watch} from "@/interfaceApi/backend";

defineProps<{
  watch: Watch;
}>();

const emit = defineEmits<{
  (e: "delete", data: Watch): void;
  (e: "chat", data: Watch): void;
  (e: "visit", data: Watch): void;
}>();

</script>

<template>
  <el-card class="box-card" shadow="hover">
    <div class="card-container">
        <span>{{watch.targetname}}</span>
        <!-- <time>{{watch.username}}</time> -->
        <el-space>
          <el-button type="primary" size="small" @click="emit('visit', watch)">visit</el-button>
          <el-button type="primary" size="small" @click="emit('chat', watch)">chat</el-button>
          <el-button size="small" @click="emit('delete', watch)">delete</el-button>
        </el-space>
      </div>
  </el-card>
</template>

<style scoped>


.box-card{
  border: none;
}

.card-container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
}

.card-container > span{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.card-container > time{
  font-size: smaller;
  white-space: nowrap;
}
</style>
