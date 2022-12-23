<script setup lang="ts">

import type {Collection} from "@/interfaceApi/backend";

defineProps<{
  collection: Collection;
}>();

const emit = defineEmits<{
  (e: "delete", data: Collection): void;
  (e: "enter", data: Collection): void;
}>();

</script>

<template>
  <el-card class="box-card" shadow="hover">
    <div class="card-container">
        <span>{{collection.notename}}</span>
        <time>{{collection.username}}</time>
        <el-button type="primary" size="small" @click="emit('enter', collection)">enter</el-button>
        <el-button size="small" @click="emit('delete', collection)">delete</el-button>
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
