<script setup lang="ts">
import { isPhone } from '@/config/generalConfig'
import type { StorageInfo } from "@/interfaceApi/backend";


const props = withDefaults(defineProps<{
  storageInfo: StorageInfo;
  canEdit: boolean;
}>(), {canEdit: false});


const emit = defineEmits<{
  (e: "delete", data: StorageInfo): void;
  (e: "enter", data: StorageInfo): void;
  (e: "edit", data: StorageInfo): void;
}>();

</script>

<template>
  <el-card class="box-card" shadow="hover">
    <div class="card-container">
      <span>{{ storageInfo.bookname }}</span>
      <el-dropdown trigger="click" v-if="isPhone&&canEdit">
        <span class="el-dropdown-link">
          opera
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item><el-button type="primary" size="small" @click="emit('enter', storageInfo)">enter</el-button></el-dropdown-item>
            <el-dropdown-item><el-button v-if="canEdit" type="primary" size="small" @click="emit('edit', storageInfo)">edit</el-button></el-dropdown-item>
            <el-dropdown-item><el-button v-if="canEdit" size="small" @click="emit('delete', storageInfo)">delete</el-button></el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
        <el-space v-else>
        <el-button type="primary" size="small" @click="emit('enter', storageInfo)">enter</el-button>
        <el-button v-if="canEdit" type="primary" size="small" @click="emit('edit', storageInfo)">edit</el-button>
        <el-button v-if="canEdit" size="small" @click="emit('delete', storageInfo)">delete</el-button>
        </el-space>
    </div>
  </el-card>
</template>

<style scoped>

.box-card {
  border: none;
}

.card-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 5px;

}

.card-container>time {
  font-size: smaller;
  white-space: nowrap;
  ;
}
</style>
