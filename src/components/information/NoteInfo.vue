<script setup lang="ts">
import { isPhone } from '@/config/generalConfig'
import type { NoteInfo } from "@/interfaceApi/backend";

import dayjs from "dayjs";
const props = withDefaults(defineProps<{
  noteInfo: NoteInfo;
  canEdit: boolean;
}>(), {canEdit: false});

const emit = defineEmits<{
  (e: "delete", data: NoteInfo): void;
  (e: "visit", data: NoteInfo): void;
  (e: "edit", data: NoteInfo): void;
}>();

</script>

<template>
  <el-card class="box-card" shadow="hover">
    <div class="card-container">
      <span>{{ noteInfo.notename }}</span>
      <span class="card-msg" text>{{ noteInfo.content?.substring(0, 32) }}</span>
      <time>{{ dayjs(noteInfo.updateTime as number *1000).format('MM/DD HH:mm') }}</time>
      <el-dropdown trigger="click" v-if="isPhone">
        <span class="el-dropdown-link">
          opera
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item><el-button type="primary" size="small" @click="emit('visit', noteInfo)">visit</el-button></el-dropdown-item>
            <el-dropdown-item><el-button v-if="canEdit" type="primary" size="small" @click="emit('edit', noteInfo)">edit</el-button></el-dropdown-item>
            <el-dropdown-item><el-button v-if="canEdit" size="small" @click="emit('delete', noteInfo)">delete</el-button></el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <template v-if="!isPhone">
        <el-button type="primary" size="small" @click="emit('visit', noteInfo)">visit</el-button>
        <el-button v-if="canEdit" type="primary" size="small" @click="emit('edit', noteInfo)">edit</el-button>
        <el-button v-if="canEdit" size="small" @click="emit('delete', noteInfo)">delete</el-button>
      </template>
    </div>
  </el-card>
</template>

<style scoped>
.card-msg {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

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
